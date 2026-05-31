import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

const LOCAL_DB_PREFIX = 'maraude_local_db_';
const LOCAL_COLL_PREFIX = 'maraude_local_coll_';

function triggerLocalUpdate() {
  window.dispatchEvent(new Event('maraude_local_db_update'));
}

function getLocalData(path: string, id: string) {
  try {
    const raw = localStorage.getItem(`${LOCAL_DB_PREFIX}${path}/${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setLocalData(path: string, id: string, data: any) {
  try {
    const key = `${LOCAL_DB_PREFIX}${path}/${id}`;
    localStorage.setItem(key, JSON.stringify(data));
    
    // update collection index list
    const collKey = `${LOCAL_COLL_PREFIX}${path}`;
    const list = JSON.parse(localStorage.getItem(collKey) || '[]');
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(collKey, JSON.stringify(list));
    }
    triggerLocalUpdate();
  } catch (e) {
    console.warn("Failed to set local fallback data", e);
  }
}

function updateLocalData(path: string, id: string, data: any) {
  try {
    const current = getLocalData(path, id) || {};
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    setLocalData(path, id, updated);
  } catch (e) {
    console.warn("Failed to update local fallback data", e);
  }
}

function deleteLocalData(path: string, id: string) {
  try {
    localStorage.removeItem(`${LOCAL_DB_PREFIX}${path}/${id}`);
    const collKey = `${LOCAL_COLL_PREFIX}${path}`;
    let list = JSON.parse(localStorage.getItem(collKey) || '[]');
    list = list.filter((item: string) => item !== id);
    localStorage.setItem(collKey, JSON.stringify(list));
    triggerLocalUpdate();
  } catch (e) {
    console.warn("Failed to delete local fallback data", e);
  }
}

function getLocalCollection(path: string) {
  try {
    const collKey = `${LOCAL_COLL_PREFIX}${path}`;
    const list = JSON.parse(localStorage.getItem(collKey) || '[]');
    const result: any[] = [];
    for (const id of list) {
      const data = getLocalData(path, id);
      if (data) {
        result.push({ id, ...data });
      }
    }
    return result;
  } catch (e) {
    return [];
  }
}

export const dbService = {
  // Connection tester
  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.warn("Please check your Firebase configuration or network status.");
      }
    }
  },

  // Create or Overwrite data at a specific path
  async setData(path: string, id: string, data: any) {
    const enrichedData = {
      ...data,
      userId: auth.currentUser?.uid || data.userId || 'local_user',
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString()
    };
    
    // Always sync locally first
    setLocalData(path, id, enrichedData);

    try {
      await setDoc(doc(db, path, id), enrichedData);
      return { success: true };
    } catch (error) {
      console.warn(`Firestore setData exception at ${path}/${id} - running in robust local fallback mode:`, error);
      return { success: true, localFallback: true };
    }
  },

  // Read data once from a specific path
  async getData(path: string, id: string) {
    try {
      const docRef = doc(db, path, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        setLocalData(path, id, remoteData);
        return remoteData;
      }
    } catch (error) {
      console.warn(`Firestore getData exception at ${path}/${id} - reading from fallback:`, error);
    }
    return getLocalData(path, id);
  },

  // Update specific fields at a path
  async updateData(path: string, id: string, data: object) {
    const enrichedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    updateLocalData(path, id, enrichedData);

    try {
      await updateDoc(doc(db, path, id), enrichedData);
      return { success: true };
    } catch (error) {
      console.warn(`Firestore updateData exception at ${path}/${id} - running in robust local fallback mode:`, error);
      return { success: true, localFallback: true };
    }
  },

  // Push data to a collection (generates a unique ID)
  async pushData(path: string, data: any) {
    const id = 'local_' + Math.random().toString(36).substr(2, 9);
    const enrichedData = {
      ...data,
      userId: auth.currentUser?.uid || data.userId || 'local_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setLocalData(path, id, enrichedData);

    try {
      const docRef = await addDoc(collection(db, path), enrichedData);
      const firebaseId = docRef.id;
      deleteLocalData(path, id);
      setLocalData(path, firebaseId, enrichedData);
      return { success: true, id: firebaseId };
    } catch (error) {
      console.warn(`Firestore pushData exception at ${path} - running in robust local fallback mode with ID ${id}:`, error);
      return { success: true, id, localFallback: true };
    }
  },

  // Remove data at a path
  async deleteData(path: string, id: string) {
    deleteLocalData(path, id);
    try {
      await deleteDoc(doc(db, path, id));
      return { success: true };
    } catch (error) {
      console.warn(`Firestore deleteData exception at ${path}/${id} - running in robust local fallback mode:`, error);
      return { success: true, localFallback: true };
    }
  },

  // Real-time listener
  subscribe(path: string, callback: (data: any) => void) {
    let active = true;
    let unsubDocs: any = null;

    // Immediately push whatever local collection we have in cache
    callback(getLocalCollection(path));

    const handleLocalUpdate = () => {
      if (!active) return;
      callback(getLocalCollection(path));
    };

    window.addEventListener('maraude_local_db_update', handleLocalUpdate);

    try {
      unsubDocs = onSnapshot(collection(db, path), (snapshot) => {
        if (!active) return;
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          setLocalData(path, doc.id, docData);
          return { id: doc.id, ...docData };
        });
        callback(data);
      }, (error) => {
         console.warn(`Firestore snapshot subscription warning for collection ${path}: auth restriction active. Monitoring offline/local changes.`, error);
      });
    } catch (error) {
      console.warn(`Firestore snapshot subscription failed for collection ${path}: auth restriction active. Monitoring offline/local changes.`, error);
    }

    return () => {
      active = false;
      window.removeEventListener('maraude_local_db_update', handleLocalUpdate);
      if (unsubDocs) {
        try {
          unsubDocs();
        } catch (e) {}
      }
    };
  },

  // Subscribe to a single document
  subscribeDoc(path: string, id: string, callback: (data: any) => void) {
    let active = true;
    let unsubDoc: any = null;

    callback(getLocalData(path, id));

    const handleLocalUpdate = () => {
      if (!active) return;
      callback(getLocalData(path, id));
    };

    window.addEventListener('maraude_local_db_update', handleLocalUpdate);

    try {
      unsubDoc = onSnapshot(doc(db, path, id), (snapshot) => {
        if (!active) return;
        if (snapshot.exists()) {
          const docData = snapshot.data();
          setLocalData(path, id, docData);
          callback({ id: snapshot.id, ...docData });
        } else {
          callback(null);
        }
      }, (error) => {
        console.warn(`Firestore snapshot subscription warning for document ${path}/${id}: auth restriction active. Monitoring offline/local changes.`, error);
      });
    } catch (error) {
      console.warn(`Firestore snapshot subscription failed for document ${path}/${id}: auth restriction active. Monitoring offline/local changes.`, error);
    }

    return () => {
      active = false;
      window.removeEventListener('maraude_local_db_update', handleLocalUpdate);
      if (unsubDoc) {
        try {
          unsubDoc();
        } catch (e) {}
      }
    };
  }
};
