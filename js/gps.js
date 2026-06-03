/**
 * KanuApp – GPS Tracking Module
 * Akkuschonend: nur aktiv wenn Nutzer Fahrt startet
 * Track-Aufzeichnung alle 10 Sekunden
 */

const TRACK_INTERVAL_MS = 10000; // alle 10 Sekunden einen Punkt

/** Haversine-Formel: Distanz in km zwischen zwei GPS-Punkten */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180)
    * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class GPSTracker {
  constructor() {
    this.tracking = false;
    this.watchId = null;
    this.track = [];            // Array von {lat, lng, ts, speed}
    this.startTime = null;
    this.lastPos = null;
    this.totalDistance = 0;    // km
    this.currentSpeed = 0;     // km/h
    this.lastTrackPoint = 0;   // timestamp letzter gespeicherter Punkt
    this.currentPos = null;    // aktuelle Position (live)
    this.lastErrorCode = null;
    this.lastErrorMessage = null;
    this.usedLowAccuracyFallback = false;
    this.pausedAt = null;      // timestamp der letzten Pause
    this.totalPausedMs = 0;    // kumulierte Pausenzeit

    // Callbacks
    this.onUpdate = null;      // fn(stats) – Called on every position update
    this.onError = null;       // fn(err)
  }

  /** GPS-Tracking starten */
  start(reset = false) {
    if (this.tracking) return;
    if (!('geolocation' in navigator)) {
      this.onError?.('GPS nicht verfügbar auf diesem Gerät.');
      return;
    }

    const isNewTrip = reset || !this.startTime;
    if (isNewTrip) {
      this.startTime = Date.now();
      this.track = [];
      this.totalDistance = 0;
      this.currentSpeed = 0;
      this.lastPos = null;
      this.lastTrackPoint = 0;
      this.totalPausedMs = 0;
      this.pausedAt = null;
      this.usedLowAccuracyFallback = false;
    } else if (this.pausedAt) {
      this.totalPausedMs += Date.now() - this.pausedAt;
      this.pausedAt = null;
      // Avoid counting pause gap as movement when resuming.
      this.lastPos = null;
    }

    this.tracking = true;
    this.lastErrorCode = null;
    this.lastErrorMessage = null;

    this._beginWatch({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 10000
    });
  }

  _beginWatch(options) {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.watchId = navigator.geolocation.watchPosition(
      pos => this._onPosition(pos),
      err => this._onError(err),
      options
    );
  }

  /** GPS-Tracking stoppen */
  stop() {
    if (!this.tracking) return;
    this.tracking = false;
    this.pausedAt = Date.now();
    this.currentSpeed = 0;
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /** Komplette Fahrt zurücksetzen */
  reset() {
    this.stop();
    this.track = [];
    this.startTime = null;
    this.lastPos = null;
    this.totalDistance = 0;
    this.currentSpeed = 0;
    this.lastTrackPoint = 0;
    this.currentPos = null;
    this.lastErrorCode = null;
    this.lastErrorMessage = null;
    this.usedLowAccuracyFallback = false;
    this.pausedAt = null;
    this.totalPausedMs = 0;
  }

  /** Einmalige Positionsabfrage (für Karte, ohne Tracking) */
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
      );
    });
  }

  _onPosition(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const speed = pos.coords.speed ? (pos.coords.speed * 3.6) : null; // m/s → km/h
    const ts = pos.timestamp;
    this.currentPos = {
      lat,
      lng,
      ts,
      accuracy: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null
    };

    // Distanz berechnen
    if (this.lastPos) {
      const d = haversine(this.lastPos.lat, this.lastPos.lng, lat, lng);
      // Entrauschen: nur Distanz > 5m zählen
      if (d > 0.005) {
        this.totalDistance += d;
        // Geschwindigkeit aus GPS-Daten oder selbst berechnen
        if (speed !== null && speed >= 0) {
          this.currentSpeed = speed;
        } else {
          const dt = (ts - this.lastPos.ts) / 3600000; // Stunden
          this.currentSpeed = dt > 0 ? d / dt : 0;
        }
      }
    }

    this.lastPos = { lat, lng, ts };

    // Track-Punkt nur alle TRACK_INTERVAL_MS speichern
    if (ts - this.lastTrackPoint >= TRACK_INTERVAL_MS) {
      this.track.push({ lat, lng, ts, speed: this.currentSpeed });
      this.lastTrackPoint = ts;
    }

    this.onUpdate?.(this.getStats(), { lat, lng });
  }

  _onError(err) {
    const messages = {
      1: 'GPS-Zugriff verweigert. Bitte Einstellungen prüfen.',
      2: 'GPS-Position nicht verfügbar.',
      3: 'GPS-Timeout. Versuche es erneut.'
    };
    this.lastErrorCode = err.code || null;
    this.lastErrorMessage = messages[err.code] || 'GPS-Fehler.';

    // Weak GPS signal: retry with less strict settings once before hard failing.
    if (
      this.tracking &&
      (err.code === 2 || err.code === 3) &&
      !this.usedLowAccuracyFallback
    ) {
      this.usedLowAccuracyFallback = true;
      this._beginWatch({
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000
      });
      this.onError?.('GPS schwach, versuche Fallback-Modus...', err);
      return;
    }

    this.onError?.(this.lastErrorMessage, err);
  }

  /** Aktuelle Fahrt-Statistiken */
  getStats() {
    const activeNowPausedMs = this.pausedAt ? (Date.now() - this.pausedAt) : 0;
    const elapsed = this.startTime
      ? Math.max(0, Date.now() - this.startTime - this.totalPausedMs - activeNowPausedMs)
      : 0;
    const hours = elapsed / 3600000;
    const avgSpeed = hours > 0 ? this.totalDistance / hours : 0;
    return {
      distance: this.totalDistance,        // km
      elapsed,                              // ms
      currentSpeed: this.currentSpeed,      // km/h
      avgSpeed,                             // km/h
      trackPoints: this.track.length,
      isTracking: this.tracking,
      currentPos: this.currentPos,
      lastErrorCode: this.lastErrorCode,
      lastErrorMessage: this.lastErrorMessage
    };
  }

  /** GeoJSON-Track für Fahrtenbuch exportieren */
  getGeoJSON() {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.track.map(p => [p.lng, p.lat])
      },
      properties: {
        startTime: this.startTime,
        distance: this.totalDistance,
        points: this.track.length
      }
    };
  }

  /** Vergangene Zeit als formatierter String */
  static formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
}

export const gpsTracker = new GPSTracker();
export { GPSTracker, haversine };

/** Standalone formatDuration (re-export) */
export function formatDuration(ms) {
  return GPSTracker.formatDuration(ms);
}
