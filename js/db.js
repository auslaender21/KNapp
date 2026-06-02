/**
 * KanuApp – IndexedDB Wrapper
 * Stores: 'trips' (Fahrtenbuch), 'spotCache' (Overpass API Cache)
 */

const DB_NAME = 'KanuAppDB';
const DB_VERSION = 1;

class KanuDB {
  constructor() {
    this._db = null;
  }

  async open() {
    if (this._db) return this._db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Trips store
        if (!db.objectStoreNames.contains('trips')) {
          const ts = db.createObjectStore('trips', { keyPath: 'id' });
          ts.createIndex('date', 'date', { unique: false });
          ts.createIndex('river', 'river', { unique: false });
        }
        // Spot cache (Overpass API results)
        if (!db.objectStoreNames.contains('spotCache')) {
          db.createObjectStore('spotCache', { keyPath: 'key' });
        }
      };
      req.onsuccess = (e) => {
        this._db = e.target.result;
        resolve(this._db);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async _tx(store, mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const s = tx.objectStore(store);
      const req = fn(s);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // ── Trips ───────────────────────────────────────
  async saveTrip(trip) {
    return this._tx('trips', 'readwrite', s => s.put(trip));
  }

  async getTrips() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('trips', 'readonly');
      const req = tx.objectStore('trips').index('date').getAll();
      req.onsuccess = () => resolve((req.result || []).reverse());
      req.onerror = () => reject(req.error);
    });
  }

  async getTrip(id) {
    return this._tx('trips', 'readonly', s => s.get(id));
  }

  async deleteTrip(id) {
    return this._tx('trips', 'readwrite', s => s.delete(id));
  }

  // ── Spot Cache ───────────────────────────────────
  async saveSpotCache(key, spots) {
    return this._tx('spotCache', 'readwrite', s => s.put({
      key,
      spots,
      timestamp: Date.now()
    }));
  }

  async getSpotCache(key, maxAgeMs = 86400000) { // 24h default
    const entry = await this._tx('spotCache', 'readonly', s => s.get(key));
    if (!entry) return null;
    if (Date.now() - entry.timestamp > maxAgeMs) return null;
    return entry.spots;
  }
}

export const db = new KanuDB();
