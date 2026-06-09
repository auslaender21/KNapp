/**
 * KanuApp – Fahrtenbuch (Logbook) Module
 * CRUD für Fahrten + UI-Rendering
 */

import { db } from './db.js';
import { getRiver } from './data/rivers.js?v=3';
import { formatDuration } from './route.js';
// gps.js – GPSTracker not needed here

function parseLatLng(raw) {
  if (!raw) return null;
  let parts = raw.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length !== 2) {
    parts = raw.split(/[;\s]+/).map(p => p.trim()).filter(Boolean);
  }
  if (parts.length !== 2) return null;

  const lat = Number.parseFloat(parts[0].replace(',', '.'));
  const lng = Number.parseFloat(parts[1].replace(',', '.'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function normalizeLatLng(raw) {
  const coord = parseLatLng(raw);
  return coord ? `${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}` : '';
}

function buildTrackFromCoordinates(startRaw, endRaw) {
  const start = parseLatLng(startRaw);
  const end = parseLatLng(endRaw);
  if (!start || !end) return null;

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [start.lng, start.lat],
        [end.lng, end.lat]
      ]
    },
    properties: {
      source: 'manual-coordinates'
    }
  };
}

/** Leeres Fahrten-Objekt */
function createTrip(data = {}) {
  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString().split('T')[0],
    river: '',
    startSpotName: '',
    endSpotName: '',
    startCoords: '',
    endCoords: '',
    distanceKm: 0,
    durationMin: 0,
    avgSpeedKmh: 0,
    weather: '',
    waterLevel: '',
    notes: '',
    track: null,       // GeoJSON oder null
    isGpsTracked: false,
    ...data
  };
}

/** Fahrt speichern */
export async function saveTrip(tripData) {
  const trip = createTrip(tripData);
  await db.saveTrip(trip);
  return trip;
}

/** Alle Fahrten laden */
export async function loadTrips() {
  return db.getTrips();
}

/** Einzelne Fahrt laden */
export async function loadTrip(id) {
  return db.getTrip(id);
}

/** Fahrt löschen */
export async function deleteTrip(id) {
  return db.deleteTrip(id);
}

// ── UI Rendering ─────────────────────────────────

function getLiveTripStatus() {
  const start = document.getElementById('trip-start-name')?.textContent?.trim() || '—';
  const end = document.getElementById('trip-end-name')?.textContent?.trim() || '—';
  const statusEl = document.getElementById('gps-status');
  const statusText = statusEl?.textContent?.trim() || 'GPS bereit';
  const statusClass = statusEl?.className || '';

  let progressClass = 'paused';
  if (statusClass.includes('active')) progressClass = 'active';
  else if (statusClass.includes('error')) progressClass = 'error';
  else if (statusText.includes('gesucht') || statusText.includes('schwach')) progressClass = 'searching';

  return { start, end, statusText, progressClass };
}

/** Fahrtenliste rendern */
export async function renderLogbook(container) {
  const trips = await loadTrips();
  container.innerHTML = '';

  if (trips.length === 0) {
    const live = getLiveTripStatus();
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧭</div>
        <h3>Aktuelle Fahrt-Information</h3>
        <div class="trip-progress ${live.progressClass}">
          <span class="progress-spinner" aria-hidden="true"></span>
          <div class="trip-progress-text">
            <div id="book-live-route">Route: ${live.start} → ${live.end}</div>
            <div id="book-live-state">${live.statusText}</div>
          </div>
        </div>
        <p class="empty-live-note">Die Route und der GPS-Status werden hier angezeigt, auch wenn noch keine Fahrt gespeichert ist.</p>
      </div>`;
    return;
  }

  trips.forEach(trip => {
    const card = createTripCard(trip);
    container.appendChild(card);
  });
}

/** Trip-Karte erstellen */
function createTripCard(trip) {
  const river = trip.river ? getRiver(trip.river) : null;
  const card = document.createElement('article');
  card.className = 'trip-card';
  card.dataset.tripId = trip.id;

  const dateStr = formatDate(trip.date);
  const distStr = trip.distanceKm ? `${trip.distanceKm.toFixed(1)} km` : '—';
  const durStr = trip.durationMin ? formatDuration(trip.durationMin) : '—';
  const speedStr = trip.avgSpeedKmh ? `${trip.avgSpeedKmh.toFixed(1)} km/h` : '—';

  card.innerHTML = `
    <div class="trip-card-header">
      <div class="trip-date">${dateStr}</div>
      ${trip.isGpsTracked ? '<span class="gps-badge">📍 GPS</span>' : ''}
    </div>
    <div class="trip-route">
      <span class="trip-river" style="color:${river?.color || '#06b6d4'}">
        ${river?.name || trip.river || 'Fluss'}
      </span>
      ${trip.startSpotName ? `
        <span class="trip-spots">
          ${trip.startSpotName} → ${trip.endSpotName || '?'}
        </span>
      ` : (trip.startCoords ? `
        <span class="trip-spots">
          ${trip.startCoords} → ${trip.endCoords || '?'}
        </span>
      ` : '')}
    </div>
    <div class="trip-stats-row">
      <div class="trip-stat">
        <span class="stat-val">${distStr}</span>
        <span class="stat-lbl">Distanz</span>
      </div>
      <div class="trip-stat">
        <span class="stat-val">${durStr}</span>
        <span class="stat-lbl">Dauer</span>
      </div>
      <div class="trip-stat">
        <span class="stat-val">${speedStr}</span>
        <span class="stat-lbl">Ø Tempo</span>
      </div>
    </div>
    ${trip.notes ? `<div class="trip-notes">${trip.notes}</div>` : ''}
  `;

  card.addEventListener('click', () => showTripDetail(trip));
  return card;
}

/** Detailansicht einer Fahrt */
function showTripDetail(trip) {
  const river = trip.river ? getRiver(trip.river) : null;
  const modal = document.getElementById('trip-detail-modal');
  const content = document.getElementById('trip-detail-content');

  const dateStr = formatDate(trip.date);
  const distStr = trip.distanceKm ? `${trip.distanceKm.toFixed(1)} km` : '—';
  const durStr = trip.durationMin ? formatDuration(trip.durationMin) : '—';
  const speedStr = trip.avgSpeedKmh ? `${trip.avgSpeedKmh.toFixed(1)} km/h` : '—';

  content.innerHTML = `
    <div class="detail-header">
      <h2>${dateStr}</h2>
      <div class="detail-river" style="color:${river?.color || '#06b6d4'}">
        🏞️ ${river?.name || trip.river || 'Unbekannter Fluss'}
      </div>
    </div>

    ${(trip.startSpotName || trip.endSpotName) ? `
      <div class="detail-route">
        <div class="detail-point start-point">
          <span class="point-label">A</span>
          <span>${trip.startSpotName || '—'}</span>
        </div>
        <div class="route-arrow">↓</div>
        <div class="detail-point end-point">
          <span class="point-label">B</span>
          <span>${trip.endSpotName || '—'}</span>
        </div>
      </div>
    ` : ''}

    ${(trip.startCoords || trip.endCoords) ? `
      <div class="detail-row"><span class="detail-lbl">🧭 Koordinaten A</span><span>${trip.startCoords || '—'}</span></div>
      <div class="detail-row"><span class="detail-lbl">🧭 Koordinaten B</span><span>${trip.endCoords || '—'}</span></div>
    ` : ''}

    <div class="detail-stats-grid">
      <div class="detail-stat">
        <div class="detail-stat-val">${distStr}</div>
        <div class="detail-stat-lbl">Distanz</div>
      </div>
      <div class="detail-stat">
        <div class="detail-stat-val">${durStr}</div>
        <div class="detail-stat-lbl">Dauer</div>
      </div>
      <div class="detail-stat">
        <div class="detail-stat-val">${speedStr}</div>
        <div class="detail-stat-lbl">Ø Tempo</div>
      </div>
      <div class="detail-stat">
        <div class="detail-stat-val">${trip.isGpsTracked ? '📍 GPS' : '✏️ Manuell'}</div>
        <div class="detail-stat-lbl">Erfassung</div>
      </div>
    </div>

    ${trip.weather ? `
      <div class="detail-row"><span class="detail-lbl">🌤️ Wetter</span><span>${trip.weather}</span></div>
    ` : ''}
    ${trip.waterLevel ? `
      <div class="detail-row"><span class="detail-lbl">💧 Pegelstand</span><span>${trip.waterLevel}</span></div>
    ` : ''}
    ${trip.notes ? `
      <div class="detail-notes"><span class="detail-lbl">📝 Notizen</span><p>${trip.notes}</p></div>
    ` : ''}

    <div class="detail-actions">
      <button id="btn-show-on-map" class="btn-secondary" ${trip.track ? '' : 'hidden'}>🗺️ Auf Karte</button>
      <button id="btn-edit-trip" class="btn-secondary">✏️ Bearbeiten</button>
      <button id="btn-delete-trip" class="btn-danger" data-id="${trip.id}">🗑️ Löschen</button>
      ${trip.track ? `<button id="btn-export-gpx" class="btn-secondary">📤 GPX</button>` : ''}
    </div>
  `;

  // "Auf Karte zeigen" handler – via Custom Event (app.js hört zu)
  content.querySelector('#btn-show-on-map')?.addEventListener('click', () => {
    if (!trip.track) return;
    closeModal();
    document.dispatchEvent(new CustomEvent('kapp:showTrackOnMap', { detail: { track: trip.track } }));
  });

  // Edit handler
  content.querySelector('#btn-edit-trip')?.addEventListener('click', () => {
    closeModal();
    openTripForEditing(trip);
  });

  // Delete handler
  content.querySelector('#btn-delete-trip')?.addEventListener('click', async (e) => {
    if (!confirm('Fahrt wirklich löschen?')) return;
    await deleteTrip(trip.id);
    closeModal();
    // Logbook neu rendern
    const logContainer = document.getElementById('logbook-list');
    if (logContainer) renderLogbook(logContainer);
  });

  // GPX Export
  content.querySelector('#btn-export-gpx')?.addEventListener('click', () => {
    if (trip.track) exportGPX(trip);
  });

  modal.classList.add('open');
}

/** Modal schließen */
export function closeModal() {
  document.getElementById('trip-detail-modal')?.classList.remove('open');
}

/** Fahrt im manuellen Formular bearbeiten */
function openTripForEditing(trip) {
  const manualTab = document.querySelector('.buch-tab[data-buch-tab="manual"]');
  const listTab = document.querySelector('.buch-tab[data-buch-tab="liste"]');
  const listPanel = document.getElementById('buch-liste');
  const manualPanel = document.getElementById('buch-manual');
  const manualContainer = document.getElementById('manual-form-container');

  if (!manualContainer || !manualPanel || !listPanel || !manualTab || !listTab) return;

  // Tab/Panel-Zustand auf "manuell" setzen
  document.querySelectorAll('.buch-tab').forEach(t => t.classList.remove('active'));
  manualTab.classList.add('active');
  listPanel.classList.remove('active');
  manualPanel.classList.add('active');

  renderTripForm(manualContainer, trip, async () => {
    alert('✅ Eintrag aktualisiert!');
    const logContainer = document.getElementById('logbook-list');
    if (logContainer) await renderLogbook(logContainer);

    document.querySelectorAll('.buch-tab').forEach(t => t.classList.remove('active'));
    listTab.classList.add('active');
    manualPanel.classList.remove('active');
    listPanel.classList.add('active');
  }, () => {
    document.querySelectorAll('.buch-tab').forEach(t => t.classList.remove('active'));
    listTab.classList.add('active');
    manualPanel.classList.remove('active');
    listPanel.classList.add('active');
  });
}

/** GPX Export */
function exportGPX(trip) {
  if (!trip.track?.geometry?.coordinates) return;
  const coords = trip.track.geometry.coordinates;
  const trkpts = coords.map(([lng, lat]) =>
    `    <trkpt lat="${lat}" lon="${lng}"></trkpt>`
  ).join('\n');

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="KanuApp">
  <trk>
    <name>${trip.date} – ${trip.river || 'Kajaktour'}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  const blob = new Blob([gpx], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kanu-${trip.date}.gpx`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Datum formatieren */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

/** Formular für manuelle Fahrterfassung */
export function renderTripForm(container, prefill = {}, onSave, onCancel) {
  import('./data/rivers.js').then(({ RIVERS }) => {
    const riverOptions = RIVERS.map(r =>
      `<option value="${r.id}" ${prefill.river === r.id ? 'selected' : ''}>${r.name}</option>`
    ).join('');

    const weatherOptions = [
      '',
      '☀️ Sonnig',
      '⛅ Bewölkt',
      '🌧️ Regen',
      '💨 Windig',
      '⛈️ Gewitter'
    ].map(v => {
      const label = v || '—';
      return `<option value="${v}" ${prefill.weather === v ? 'selected' : ''}>${label}</option>`;
    }).join('');

    const waterOptions = [
      '',
      'Niedrig',
      'Normal',
      'Hoch',
      'Hochwasser ⚠️'
    ].map(v => {
      const label = v || '—';
      return `<option value="${v}" ${prefill.waterLevel === v ? 'selected' : ''}>${label}</option>`;
    }).join('');

    container.innerHTML = `
      <form id="trip-form" class="trip-form">
        <div class="form-group">
          <label for="tf-date">Datum</label>
          <input type="date" id="tf-date" value="${prefill.date || new Date().toISOString().split('T')[0]}" required>
        </div>
        <div class="form-group">
          <label for="tf-river">Fluss</label>
          <select id="tf-river" required>
            <option value="">— Fluss wählen —</option>
            ${riverOptions}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="tf-start">Startpunkt</label>
            <input type="text" id="tf-start" placeholder="z.B. Kanuclub Trier" value="${prefill.startSpotName || ''}">
          </div>
          <div class="form-group">
            <label for="tf-end">Endpunkt</label>
            <input type="text" id="tf-end" placeholder="z.B. Cochem" value="${prefill.endSpotName || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="tf-start-coord">Start GPS (Lat,Lng)</label>
            <input type="text" id="tf-start-coord" placeholder="49.749000, 6.637100" value="${prefill.startCoords || ''}">
          </div>
          <div class="form-group">
            <label for="tf-end-coord">Ziel GPS (Lat,Lng)</label>
            <input type="text" id="tf-end-coord" placeholder="50.146100, 7.167100" value="${prefill.endCoords || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="tf-dist">Distanz (km)</label>
            <input type="number" id="tf-dist" step="0.1" min="0" placeholder="0.0" value="${prefill.distanceKm || ''}">
          </div>
          <div class="form-group">
            <label for="tf-dur">Dauer (min)</label>
            <input type="number" id="tf-dur" min="0" placeholder="0" value="${prefill.durationMin || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="tf-weather">Wetter</label>
            <select id="tf-weather">
              ${weatherOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="tf-water">Pegelstand</label>
            <select id="tf-water">
              ${waterOptions}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="tf-notes">Notizen</label>
          <textarea id="tf-notes" rows="3" placeholder="Besonderheiten, Erlebnisse...">${prefill.notes || ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="tf-cancel" class="round-action-btn btn-cancel" title="Abbrechen" aria-label="Abbrechen">✕</button>
          <button type="submit" class="round-action-btn btn-save" title="Speichern" aria-label="Speichern">💾</button>
        </div>
      </form>
    `;

    const form = container.querySelector('#trip-form');

    // Enter in Feldern nicht als sofortiges Speichern interpretieren.
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    });

    form.querySelector('#tf-cancel')?.addEventListener('click', () => {
      onCancel?.();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isEdit = Boolean(prefill.id);
      const ask = isEdit
        ? 'Änderungen an dieser Fahrt speichern?'
        : 'Diesen Eintrag wirklich speichern?';
      if (!confirm(ask)) return;

      const distVal = parseFloat(document.getElementById('tf-dist').value) || 0;
      const durVal = parseInt(document.getElementById('tf-dur').value) || 0;
      const startCoordsRaw = document.getElementById('tf-start-coord').value.trim();
      const endCoordsRaw = document.getElementById('tf-end-coord').value.trim();
      const startCoords = normalizeLatLng(startCoordsRaw);
      const endCoords = normalizeLatLng(endCoordsRaw);

      if (startCoordsRaw && !startCoords) {
        alert('Start GPS ist ungültig. Bitte Format "Breitengrad, Längengrad" verwenden.');
        return;
      }
      if (endCoordsRaw && !endCoords) {
        alert('Ziel GPS ist ungültig. Bitte Format "Breitengrad, Längengrad" verwenden.');
        return;
      }

      const manualTrack = (startCoords && endCoords)
        ? buildTrackFromCoordinates(startCoords, endCoords)
        : (prefill.track || null);

      const tripData = {
        ...prefill,
        date: document.getElementById('tf-date').value,
        river: document.getElementById('tf-river').value,
        startSpotName: document.getElementById('tf-start').value,
        endSpotName: document.getElementById('tf-end').value,
        startCoords,
        endCoords,
        distanceKm: distVal,
        durationMin: durVal,
        avgSpeedKmh: (durVal > 0 && distVal > 0) ? (distVal / (durVal / 60)) : 0,
        weather: document.getElementById('tf-weather').value,
        waterLevel: document.getElementById('tf-water').value,
        notes: document.getElementById('tf-notes').value,
        track: manualTrack,
        isGpsTracked: prefill.isGpsTracked ?? false
      };
      const saved = await saveTrip(tripData);
      onSave?.(saved);
    });
  });
}
