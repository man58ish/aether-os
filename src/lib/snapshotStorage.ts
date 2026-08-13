const DB_NAME = 'AetherOSDB';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';

export interface OSSnapshot {
  id: string;
  timestamp: number;
  memoryBuffer: ArrayBuffer;
  vfsData: string;
}

export class SnapshotEngine {
  private static async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public static async saveSnapshot(id: string, memoryBuffer: ArrayBuffer, vfsData: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const snapshot: OSSnapshot = {
        id,
        timestamp: Date.now(),
        memoryBuffer,
        vfsData,
      };

      store.put(snapshot);

      return new Promise((resolve) => {
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (err) {
      console.error('Snapshot Save Error:', err);
      return false;
    }
  }

  public static async loadSnapshot(id: string): Promise<OSSnapshot | null> {
    try {
      const db = await this.getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch (err) {
      console.error('Snapshot Load Error:', err);
      return null;
    }
  }
}