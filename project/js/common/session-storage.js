export class SessionStorage {
  static get(key, defaultValue = null) {
    try {
      const value = sessionStorage.getItem(key);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } catch (e) {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  static remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
}
