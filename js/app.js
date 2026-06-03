/**
 * KanuApp – Main Application Controller
 * Tab-Navigation, State-Management, App-Init
 */

import { initMap, showAllSpots, showRiverSpots, showRoute, clearRoute,
         updatePosition, updateTrack, clearTrack, centerOnUser, getNearestSpots } from './map.js?v=4';
import { gpsTracker, GPSTracker } from './gps.js?v=2';
import { planRoute, planRouteFromKilometers, SPEED_PRESETS, formatDuration } from './route.js?v=4';
import { renderLogbook, saveTrip, renderTripForm, closeModal } from './logbook.js?v=3';
import { RIVERS, getRiver } from './data/rivers.js?v=4';
import { getSpotsByRiver, SPOT_TYPE_LABELS } from './data/spots.js?v=4';

// ── App State ────────────────────────────────────
const state = {
  activeView: 'karte',
  selectedRiver: null,
  selectedSpeed: 'normal',
  startSpot: null,
  endSpot: null,
  currentRoute: null,
  contextMenuLatLng: null,
  activeTrip: null,    // Laufende GPS-Fahrt
  timerInterval: null
};

function formatRiverKm(km) {
  return Number.isFinite(km) ? km.toFixed(1).replace('.', ',') : '—';
}

function parseKmInput(id) {
  const raw = document.getElementById(id)?.value?.trim();
  if (!raw) return null;
  const parsed = Number.parseFloat(raw.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCoord(value) {
  return Number.isFinite(value) ? value.toFixed(6) : '—';
}

function parseCoordInput(id) {
  const raw = document.getElementById(id)?.value?.trim();
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

function clearCoordInputs() {
  const startInput = document.getElementById('coord-start');
  const endInput = document.getElementById('coord-end');
  if (startInput) startInput.value = '';
  if (endInput) endInput.value = '';
}

function clearSpotSelectionUI() {
  const startSel = document.getElementById('spot-start');
  const endSel = document.getElementById('spot-end');
  if (startSel) startSel.value = '';
  if (endSel) endSel.value = '';
  state.startSpot = null;
  state.endSpot = null;
}

function getSpotsSortedByKmDesc(spots) {
  return [...spots].sort((a, b) => {
    const aHasKm = Number.isFinite(a.km);
    const bHasKm = Number.isFinite(b.km);
    if (aHasKm && bHasKm) {
      if (a.km === b.km) return a.name.localeCompare(b.name, 'de');
      return b.km - a.km;
    }
    if (aHasKm) return -1;
    if (bHasKm) return 1;
    return a.name.localeCompare(b.name, 'de');
  });
}

function setMapPickHint(text) {
  const status = document.getElementById('map-pick-status');
  if (status) status.textContent = text;
}

function hideMapContextMenu() {
  const menu = document.getElementById('map-context-menu');
  if (!menu) return;
  menu.hidden = true;
}

function showMapContextMenu(screenX, screenY, latlng) {
  const menu = document.getElementById('map-context-menu');
  if (!menu) return;

  state.contextMenuLatLng = latlng;
  menu.style.left = `${screenX}px`;
  menu.style.top = `${screenY}px`;
  menu.hidden = false;
}

function applyMapPointToField(target) {
  if (!state.contextMenuLatLng) return;
  const fieldId = target === 'start' ? 'coord-start' : 'coord-end';
  const field = document.getElementById(fieldId);
  if (!field) return;

  const { lat, lng } = state.contextMenuLatLng;
  field.value = `${formatCoord(lat)}, ${formatCoord(lng)}`;
  clearSpotSelectionUI();
  setMapPickHint(`Koordinate gesetzt für ${target === 'start' ? 'Start (A)' : 'Ziel (B)'}`);
  updateStartEndUI();
  updateRoute();
  hideMapContextMenu();
}

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initKarteView();
  initFahrtView();
  initBuchView();
  initModal();
  registerSW();

  // URL-Parameter für Direktnavigation
  const params = new URLSearchParams(location.search);
  const initView = params.get('view');
  if (initView && ['karte', 'fahrt', 'buch'].includes(initView)) {
    switchView(initView);
  }
});

// ── Navigation ───────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(viewId) {
  if (state.activeView === viewId) return;
  state.activeView = viewId;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`view-${viewId}`)?.classList.add('active');
  document.querySelector(`.nav-btn[data-view="${viewId}"]`)?.classList.add('active');

  // Karte beim Wechsel neu rendern (Leaflet braucht invalidateSize)
  if (viewId === 'karte') {
    setTimeout(() => {
      const map = window._kanuMap;
      if (map) map.invalidateSize();
    }, 50);
  }

  // Fahrtenbuch beim Öffnen neu laden
  if (viewId === 'buch') {
    const logContainer = document.getElementById('logbook-list');
    if (logContainer) renderLogbook(logContainer);
  }
}

// ── Karte & Routenplanung ────────────────────────
function initKarteView() {
  const map = initMap('map');
  window._kanuMap = map;

  const mapMenu = document.getElementById('map-context-menu');
  mapMenu?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-map-target]');
    if (!btn) return;
    applyMapPointToField(btn.dataset.mapTarget);
  });

  map.on('contextmenu', e => {
    if (e?.originalEvent?.preventDefault) e.originalEvent.preventDefault();
    showMapContextMenu(e.originalEvent.clientX, e.originalEvent.clientY, e.latlng);
  });
  map.on('click', hideMapContextMenu);
  document.addEventListener('click', e => {
    if (!e.target.closest('#map-context-menu')) hideMapContextMenu();
  });

  // River Selector
  const riverSelect = document.getElementById('river-select');
  RIVERS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `${r.name} (${r.countries.join('/')})`;
    riverSelect.appendChild(opt);
  });

  riverSelect.addEventListener('change', () => {
    const riverId = riverSelect.value;
    state.selectedRiver = riverId;
    state.startSpot = null;
    state.endSpot = null;
    state.currentRoute = null;
    clearRoute();
    updateStartEndUI();
    clearRouteInfo();

    if (!riverId) {
      showAllSpots(onSpotClick);
      return;
    }
    showRiverSpots(riverId, onSpotClick);
    updateSpotSelectors(riverId);
    document.getElementById('route-panel').classList.add('expanded');
  });

  // Start/End Selektoren
  document.getElementById('spot-start').addEventListener('change', onStartEndChange);
  document.getElementById('spot-end').addEventListener('change', onStartEndChange);

  // Freie km-Eingabe
  document.getElementById('km-start').addEventListener('input', onManualKmChange);
  document.getElementById('km-end').addEventListener('input', onManualKmChange);

  // Freie GPS-Koordinaten
  document.getElementById('coord-start').addEventListener('input', onCoordinateChange);
  document.getElementById('coord-end').addEventListener('input', onCoordinateChange);

  // Geschwindigkeit
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedSpeed = btn.dataset.speed;
      const startKm = parseKmInput('km-start');
      const endKm = parseKmInput('km-end');
      if ((state.startSpot && state.endSpot) || (startKm !== null && endKm !== null && state.selectedRiver)) updateRoute();
    });
  });

  // Panel Toggle
  document.getElementById('panel-toggle').addEventListener('click', () => {
    document.getElementById('route-panel').classList.toggle('expanded');
    setTimeout(() => map.invalidateSize(), 300);
  });

  // GPS-Zentrierung
  document.getElementById('btn-center-gps').addEventListener('click', async () => {
    try {
      await centerOnUser();
    } catch {
      alert('GPS-Position nicht verfügbar.');
    }
  });

  // Initial: alle Spots zeigen
  showAllSpots(onSpotClick);
  setMapPickHint('Rechtsklick auf Karte: Als A (Start) oder B (Ziel) setzen');
}

function onSpotClick(spot) {
  clearCoordInputs();
  if (!state.selectedRiver) {
    // Fluss-Filter setzen
    const riverSelect = document.getElementById('river-select');
    riverSelect.value = spot.river;
    riverSelect.dispatchEvent(new Event('change'));
  }
  // Als Start oder End setzen
  if (!state.startSpot) {
    state.startSpot = spot;
    document.getElementById('spot-start').value = spot.id;
  } else if (!state.endSpot && spot.id !== state.startSpot.id) {
    state.endSpot = spot;
    document.getElementById('spot-end').value = spot.id;
    updateRoute();
  }
  updateStartEndUI();
}

function onStartEndChange() {
  const startId = document.getElementById('spot-start').value;
  const endId = document.getElementById('spot-end').value;
  const spots = state.selectedRiver ? getSpotsByRiver(state.selectedRiver) : [];
  state.startSpot = spots.find(s => s.id === startId) || null;
  state.endSpot = spots.find(s => s.id === endId) || null;
  if (startId || endId) clearCoordInputs();
  updateStartEndUI();
  updateRoute();
}

function onManualKmChange() {
  updateStartEndUI();
  updateRoute();
}

function onCoordinateChange() {
  const hasStartCoord = !!parseCoordInput('coord-start');
  const hasEndCoord = !!parseCoordInput('coord-end');
  if (hasStartCoord || hasEndCoord) {
    clearSpotSelectionUI();
  }
  updateStartEndUI();
  updateRoute();
}

function updateSpotSelectors(riverId) {
  const spots = getSpotsSortedByKmDesc(getSpotsByRiver(riverId));
  const startSel = document.getElementById('spot-start');
  const endSel = document.getElementById('spot-end');
  const currentStartId = state.startSpot?.id || startSel.value;
  const currentEndId = state.endSpot?.id || endSel.value;

  [startSel, endSel].forEach(sel => {
    sel.innerHTML = '<option value="">— Anlegestelle wählen —</option>';
    spots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      const kmLabel = Number.isFinite(s.km) ? `, km ${formatRiverKm(s.km)}` : '';
      opt.textContent = `${s.name} (${SPOT_TYPE_LABELS[s.type] || s.type}${kmLabel})`;
      sel.appendChild(opt);
    });
  });

  if (currentStartId) startSel.value = currentStartId;
  if (currentEndId) endSel.value = currentEndId;
}

function updateStartEndUI() {
  const coordStart = parseCoordInput('coord-start');
  const coordEnd = parseCoordInput('coord-end');
  if (coordStart && coordEnd) {
    document.getElementById('start-label').textContent = `GPS ${formatCoord(coordStart.lat)}, ${formatCoord(coordStart.lng)}`;
    document.getElementById('end-label').textContent = `GPS ${formatCoord(coordEnd.lat)}, ${formatCoord(coordEnd.lng)}`;
    return;
  }

  const manualStartKm = parseKmInput('km-start');
  const manualEndKm = parseKmInput('km-end');
  if (manualStartKm !== null && manualEndKm !== null) {
    document.getElementById('start-label').textContent = `km ${formatRiverKm(manualStartKm)}`;
    document.getElementById('end-label').textContent = `km ${formatRiverKm(manualEndKm)}`;
    return;
  }

  document.getElementById('start-label').textContent =
    state.startSpot
      ? `${state.startSpot.name}${Number.isFinite(state.startSpot.km) ? ` (km ${formatRiverKm(state.startSpot.km)})` : ''}`
      : '—';
  document.getElementById('end-label').textContent =
    state.endSpot
      ? `${state.endSpot.name}${Number.isFinite(state.endSpot.km) ? ` (km ${formatRiverKm(state.endSpot.km)})` : ''}`
      : '—';
}

function updateRoute() {
  const coordStart = parseCoordInput('coord-start');
  const coordEnd = parseCoordInput('coord-end');
  const manualStartKm = parseKmInput('km-start');
  const manualEndKm = parseKmInput('km-end');

  let route = null;
  if (coordStart && coordEnd) {
    const riverId = state.selectedRiver || 'gps';
    const startGeoSpot = {
      id: 'geo-start',
      name: `GPS Start (${formatCoord(coordStart.lat)}, ${formatCoord(coordStart.lng)})`,
      river: riverId,
      lat: coordStart.lat,
      lng: coordStart.lng
    };
    const endGeoSpot = {
      id: 'geo-end',
      name: `GPS Ziel (${formatCoord(coordEnd.lat)}, ${formatCoord(coordEnd.lng)})`,
      river: riverId,
      lat: coordEnd.lat,
      lng: coordEnd.lng
    };
    route = planRoute(startGeoSpot, endGeoSpot, state.selectedSpeed);
    if (route) {
      // For free GPS points we only want a direct A->B line,
      // not inferred intermediate spots from the selected river.
      route.waypoints = [];
    }
  } else if (state.selectedRiver && manualStartKm !== null && manualEndKm !== null) {
    route = planRouteFromKilometers(
      state.selectedRiver,
      manualStartKm,
      manualEndKm,
      state.selectedSpeed,
      state.startSpot,
      state.endSpot
    );
  } else if (state.startSpot && state.endSpot) {
    route = planRoute(state.startSpot, state.endSpot, state.selectedSpeed);
  }

  if (!route) {
    state.currentRoute = null;
    clearRoute();
    clearRouteInfo();
    return;
  }

  state.currentRoute = route;
  if (route.startSpot && route.endSpot) {
    showRoute(route.startSpot, route.endSpot, route.waypoints);
  } else {
    clearRoute();
  }
  renderRouteInfo(route);
}

function renderRouteInfo(route) {
  const info = document.getElementById('route-info');
  const usesRiverKm = route.distanceSource === 'river-km' || route.distanceSource === 'manual-river-km';
  const rangeStart = Number.isFinite(route.startKm) ? route.startKm : route.startSpot?.km;
  const rangeEnd = Number.isFinite(route.endKm) ? route.endKm : route.endSpot?.km;
  const kmRange = usesRiverKm && Number.isFinite(rangeStart) && Number.isFinite(rangeEnd)
    ? ` (km ${formatRiverKm(rangeStart)} → ${formatRiverKm(rangeEnd)})`
    : '';
  const kmReference = usesRiverKm && route.kmReference
    ? ` · ${route.kmReference}`
    : '';
  info.classList.add('visible');
  info.innerHTML = `
    <div class="route-info-grid">
      <div class="route-info-item">
        <span class="ri-val">${formatRiverKm(route.riverKm)} km</span>
        <span class="ri-lbl">Strecke*</span>
      </div>
      <div class="route-info-item">
        <span class="ri-val">${formatDuration(route.durationMin)}</span>
        <span class="ri-lbl">ca. Zeit</span>
      </div>
    </div>
    <p class="route-note">* ${usesRiverKm ? `Fluss-km Differenz${kmRange}${kmReference}` : 'Flussstrecke (GPS-Luftlinie × 1.35 Mäanderfaktor)'}</p>
    ${!route.sameRiver ? '<p class="route-warn">⚠️ Verschiedene Flüsse gewählt</p>' : ''}
    <button id="btn-start-from-route" class="btn-primary btn-full">🛶 Fahrt beginnen</button>
  `;
  // Re-attach listener
  info.querySelector('#btn-start-from-route')?.addEventListener('click', () => {
    switchView('fahrt');
    prefillTripFromRoute(route);
    if (!gpsTracker.tracking) {
      startTrip();
    }
  });
}

function clearRouteInfo() {
  const info = document.getElementById('route-info');
  info.classList.remove('visible');
  info.innerHTML = '';
}

// ── Aktive Fahrt (GPS) ──────────────────────────
function initFahrtView() {
  document.getElementById('btn-trip-toggle').addEventListener('click', toggleTrip);
  document.getElementById('btn-save-trip').addEventListener('click', saveCurrentTrip);
  document.getElementById('btn-reset-trip').addEventListener('click', resetTrip);
}

function prefillTripFromRoute(route) {
  if (state.activeTrip) return; // Schon eine aktive Fahrt
  document.getElementById('trip-river-name').textContent =
    route.river?.name || '—';
  document.getElementById('trip-start-name').textContent =
    route.startSpot?.name || (Number.isFinite(route.startKm) ? `km ${formatRiverKm(route.startKm)}` : '—');
  document.getElementById('trip-end-name').textContent =
    route.endSpot?.name || (Number.isFinite(route.endKm) ? `km ${formatRiverKm(route.endKm)}` : '—');
  state.activeTrip = {
    river: route.startSpot?.river || route.river?.id,
    startSpotName: route.startSpot?.name || (Number.isFinite(route.startKm) ? `km ${formatRiverKm(route.startKm)}` : ''),
    endSpotName: route.endSpot?.name || (Number.isFinite(route.endKm) ? `km ${formatRiverKm(route.endKm)}` : ''),
    plannedDistKm: route.riverKm
  };
}

function toggleTrip() {
  if (gpsTracker.tracking) {
    stopTrip();
  } else {
    startTrip();
  }
}

function startTrip() {
  const isNewTrip = !state.activeTrip;
  if (isNewTrip) state.activeTrip = {};

  gpsTracker.onUpdate = (stats, pos) => {
    updateTripDisplay(stats);
    updatePosition(pos.lat, pos.lng, false);
    updateTrack(gpsTracker.track);
    document.getElementById('gps-status').textContent = '📍 GPS aktiv';
    document.getElementById('gps-status').className = 'gps-status active';
  };
  gpsTracker.onError = (msg) => {
    document.getElementById('gps-status').textContent = msg;
    document.getElementById('gps-status').className = 'gps-status error';
  };

  gpsTracker.start(isNewTrip);

  document.getElementById('btn-trip-toggle').textContent = '⏹ Stoppen';
  document.getElementById('btn-trip-toggle').classList.add('active');
  document.getElementById('gps-status').textContent = '🔎 GPS-Signal wird gesucht...';
  document.getElementById('gps-status').className = 'gps-status active';
  document.getElementById('btn-save-trip').hidden = true;

  // Timer
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const stats = gpsTracker.getStats();
    document.getElementById('stat-time').textContent =
      GPSTracker.formatDuration(stats.elapsed);
  }, 1000);
}

function stopTrip() {
  gpsTracker.stop();
  clearInterval(state.timerInterval);

  document.getElementById('btn-trip-toggle').textContent = '▶ Weiterfahren';
  document.getElementById('btn-trip-toggle').classList.remove('active');
  document.getElementById('gps-status').textContent = '⏸ Pausiert';
  document.getElementById('gps-status').className = 'gps-status paused';
  document.getElementById('btn-save-trip').hidden = false;
}

function updateTripDisplay(stats) {
  document.getElementById('stat-dist').textContent = stats.distance.toFixed(2);
  document.getElementById('stat-speed').textContent = stats.currentSpeed.toFixed(1);
  document.getElementById('stat-avg').textContent = stats.avgSpeed.toFixed(1);
}

async function saveCurrentTrip() {
  if (!confirm('Möchtest du diese erfasste Fahrt speichern?')) return;

  const stats = gpsTracker.getStats();
  const tripData = {
    ...(state.activeTrip || {}),
    distanceKm: Math.round(stats.distance * 100) / 100,
    durationMin: Math.round(stats.elapsed / 60000),
    avgSpeedKmh: Math.round(stats.avgSpeed * 10) / 10,
    track: gpsTracker.getGeoJSON(),
    isGpsTracked: true
  };

  const saved = await saveTrip(tripData);
  alert(`✅ Fahrt gespeichert!\n${saved.distanceKm.toFixed(1)} km in ${formatDuration(saved.durationMin)}`);

  resetTrip();
  switchView('buch');
}

function resetTrip() {
  stopTrip();
  gpsTracker.reset();
  state.activeTrip = null;
  clearTrack();

  document.getElementById('stat-dist').textContent = '0.00';
  document.getElementById('stat-speed').textContent = '0.0';
  document.getElementById('stat-avg').textContent = '0.0';
  document.getElementById('stat-time').textContent = '00:00:00';
  document.getElementById('btn-trip-toggle').textContent = '▶ Starten';
  document.getElementById('btn-save-trip').hidden = true;
  document.getElementById('gps-status').textContent = '⬤ Bereit';
  document.getElementById('gps-status').className = 'gps-status';
  document.getElementById('trip-river-name').textContent = '—';
  document.getElementById('trip-start-name').textContent = '—';
  document.getElementById('trip-end-name').textContent = '—';
}

// ── Fahrtenbuch ──────────────────────────────────
function initBuchView() {
  // Tab: Liste / Neue Fahrt
  document.querySelectorAll('.buch-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.buch-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.buchTab;
      document.querySelectorAll('.buch-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`buch-${target}`).classList.add('active');

      if (target === 'manual') {
        renderTripForm(document.getElementById('manual-form-container'), {}, async (saved) => {
          alert(`✅ Eintrag gespeichert!`);
          const logContainer = document.getElementById('logbook-list');
          if (logContainer) await renderLogbook(logContainer);
          // Zur Liste wechseln
          document.querySelector('.buch-tab[data-buch-tab="liste"]').click();
        }, () => {
          document.querySelector('.buch-tab[data-buch-tab="liste"]').click();
        });
      }
    });
  });
}

// ── Modal ─────────────────────────────────────────
function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('trip-detail-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
}

// ── Service Worker ────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ Service Worker registriert'))
      .catch(e => console.warn('SW Fehler:', e));
  }
}
