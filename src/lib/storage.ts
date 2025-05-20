/**
 * Storage utility to handle localStorage and IndexedDB operations
 * Provides a consistent API for data persistence
 */

// Constants
const DB_NAME = 'execview_db';
const DB_VERSION = 1;
const STORES = {
  FINANCIAL: 'financial_data',
  SALES: 'sales_data',
  OPERATIONS: 'operations_data',
  CUSTOMER: 'customer_data',
  EMPLOYEE: 'employee_data',
  SETTINGS: 'settings',
  USERS: 'users',
  NOTIFICATIONS: 'notifications'
};

// IndexedDB connection
let db: IDBDatabase | null = null;

/**
 * Initialize the IndexedDB database
 * @returns Promise that resolves when the database is ready
 */
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB', event);
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log('IndexedDB connection established');
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!database.objectStoreNames.contains(STORES.FINANCIAL)) {
        database.createObjectStore(STORES.FINANCIAL, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.SALES)) {
        database.createObjectStore(STORES.SALES, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.OPERATIONS)) {
        database.createObjectStore(STORES.OPERATIONS, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.CUSTOMER)) {
        database.createObjectStore(STORES.CUSTOMER, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.EMPLOYEE)) {
        database.createObjectStore(STORES.EMPLOYEE, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.USERS)) {
        database.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
        database.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Store data in IndexedDB
 * @param storeName The object store name
 * @param data The data to store
 * @returns Promise that resolves when the data is stored
 */
export const storeData = <T>(storeName: string, data: T[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Clear existing data
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        // Add all new data
        data.forEach(item => {
          store.add(item);
        });
      };
      
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Transaction error', event);
        reject(new Error('Failed to store data'));
      };
    } catch (error) {
      console.error('Error storing data', error);
      reject(error);
    }
  });
};

/**
 * Get all data from an object store
 * @param storeName The object store name
 * @returns Promise that resolves with the data
 */
export const getAllData = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result as T[]);
      };
      
      request.onerror = (event) => {
        console.error('Error getting data', event);
        reject(new Error('Failed to get data'));
      };
    } catch (error) {
      console.error('Error retrieving data', error);
      reject(error);
    }
  });
};

/**
 * Get a specific item by ID from an object store
 * @param storeName The object store name
 * @param id The item ID
 * @returns Promise that resolves with the item
 */
export const getItemById = <T>(storeName: string, id: string): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result as T || null);
      };
      
      request.onerror = (event) => {
        console.error('Error getting item', event);
        reject(new Error('Failed to get item'));
      };
    } catch (error) {
      console.error('Error retrieving item', error);
      reject(error);
    }
  });
};

/**
 * Update an item in an object store
 * @param storeName The object store name
 * @param item The item to update
 * @returns Promise that resolves when the item is updated
 */
export const updateItem = <T extends { id: string }>(storeName: string, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error updating item', event);
        reject(new Error('Failed to update item'));
      };
    } catch (error) {
      console.error('Error updating item', error);
      reject(error);
    }
  });
};

/**
 * Delete an item from an object store
 * @param storeName The object store name
 * @param id The item ID
 * @returns Promise that resolves when the item is deleted
 */
export const deleteItem = (storeName: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error deleting item', event);
        reject(new Error('Failed to delete item'));
      };
    } catch (error) {
      console.error('Error deleting item', error);
      reject(error);
    }
  });
};

/**
 * localStorage wrapper with error handling
 */
export const localStorageUtil = {
  setItem: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage item', error);
    }
  },
  
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage item', error);
      return defaultValue;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
};

// Export store names for easier access
export { STORES };