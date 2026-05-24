import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer,
  query
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

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dbService = {
  // Connection tester
  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  },

  // Create or Overwrite data at a specific path
  async setData(path: string, id: string, data: any) {
    try {
      const enrichedData = {
        ...data,
        userId: auth.currentUser?.uid || data.userId,
        updatedAt: new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString()
      };
      await setDoc(doc(db, path, id), enrichedData);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
    }
  },

  // Read data once from a specific path
  async getData(path: string, id: string) {
    try {
      const docRef = doc(db, path, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
    }
  },

  // Update specific fields at a path
  async updateData(path: string, id: string, data: object) {
    try {
      const enrichedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, path, id), enrichedData);
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  },

  // Push data to a collection (generates a unique ID)
  async pushData(path: string, data: any) {
    try {
      const enrichedData = {
        ...data,
        userId: auth.currentUser?.uid || data.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, path), enrichedData);
      return { success: true, id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Remove data at a path
  async deleteData(path: string, id: string) {
    try {
      await deleteDoc(doc(db, path, id));
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    }
  },

  // Real-time listener
  subscribe(path: string, callback: (data: any) => void) {
    const unsub = onSnapshot(collection(db, path), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return unsub;
  },

  // Subscribe to a single document
  subscribeDoc(path: string, id: string, callback: (data: any) => void) {
    const unsub = onSnapshot(doc(db, path, id), (snapshot) => {
      callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
    });
    return unsub;
  }
};
