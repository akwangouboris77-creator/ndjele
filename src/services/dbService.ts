import { ref, set, get, update, push, remove, onValue, off } from "firebase/database";
import { db } from "../lib/firebase";

export const dbService = {
  // Create or Overwrite data at a specific path
  async setData(path: string, data: any) {
    try {
      await set(ref(db, path), data);
      return { success: true };
    } catch (error) {
      console.error("Firebase Set Error:", error);
      throw error;
    }
  },

  // Read data once from a specific path
  async getData(path: string) {
    try {
      const snapshot = await get(ref(db, path));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error("Firebase Get Error:", error);
      throw error;
    }
  },

  // Update specific fields at a path
  async updateData(path: string, data: object) {
    try {
      await update(ref(db, path), data);
      return { success: true };
    } catch (error) {
      console.error("Firebase Update Error:", error);
      throw error;
    }
  },

  // Push data to a list (generates a unique ID)
  async pushData(path: string, data: any) {
    try {
      const newRef = push(ref(db, path));
      await set(newRef, data);
      return { success: true, id: newRef.key };
    } catch (error) {
      console.error("Firebase Push Error:", error);
      throw error;
    }
  },

  // Remove data at a path
  async deleteData(path: string) {
    try {
      await remove(ref(db, path));
      return { success: true };
    } catch (error) {
      console.error("Firebase Delete Error:", error);
      throw error;
    }
  },

  // Real-time listener
  subscribe(path: string, callback: (data: any) => void) {
    const dbRef = ref(db, path);
    onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });
    return () => off(dbRef);
  }
};
