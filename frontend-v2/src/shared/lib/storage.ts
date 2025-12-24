import { STORAGE_KEYS } from '../constant';

export const LocalStorageEventTarget = new EventTarget();
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Error saving to localStorage:', error);
    }
  },
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clearToken: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    LocalStorageEventTarget.dispatchEvent(new Event('tokenCleared'));
  },
};
