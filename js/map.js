/**
 * KanuApp – Leaflet Map Module
 * Zeigt Karte mit Anlegestellen, Route und GPS-Position
 */

import { SPOTS, getSpotsByRiver, SPOT_TYPE_LABELS, FACILITY_META } from './data/spots.js?v=4';
import { getRiver } from './data/rivers.js?v=4';
import { haversine } from './gps.js';

let map = null;
let spotLayerGroup = null;
let routeLayerGroup = null;
let posMarker = null;
let posCircle = null;
let activeSpots = [];

// Leaflet Icons
function createSpotIcon(type, selected = false) {
  const colors = {
    club: selected ? '#f0abfc' : '#c084fc',
    slipway: selected ? '#67e8f9' : '#06b6d4',
    public: selected ? '#6ee7b7' : '#10b981'
  };
  const color = colors[type] || '#94a3b8';
  const size = selected ? 14 : 10;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2px solid rgba(255,255,255,0.8);
      border-radius:50%;
      box-shadow:0 0 ${selected ? 8 : 4}px ${color};
      transition:all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function createPosIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:16px;height:16px;
      background:#06b6d4;
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 0 12px #06b6d4,0 0 24px rgba(6,182,212,0.4);
      animation:pulse 2s infinite;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

/** Karte initialisieren */
export function initMap(containerId = 'map') {
  if (map) return map;

  map = L.map(containerId, {
    center: [51.2, 9.0],
    zoom: 6,
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true // Performance
  });

  // OSM Tiles (gecacht via Service Worker)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    minZoom: 5,
    crossOrigin: true
  }).addTo(map);

  // Layer-Gruppen
  spotLayerGroup = L.layerGroup().addTo(map);
  routeLayerGroup = L.layerGroup().addTo(map);

  // Alle Spots initial anzeigen
  showAllSpots();

  return map;
}

/** Alle vorberechneten Spots anzeigen */
export function showAllSpots(onSpotClick = null) {
  if (!spotLayerGroup) return;
  spotLayerGroup.clearLayers();
  activeSpots = SPOTS;

  SPOTS.forEach(spot => {
    const marker = L.marker([spot.lat, spot.lng], {
      icon: createSpotIcon(spot.type),
      title: spot.name
    });

    marker.bindTooltip(spot.name, {
      permanent: false,
      direction: 'top',
      className: 'kanu-tooltip'
    });

    marker.on('click', () => {
      if (onSpotClick) onSpotClick(spot);
      else showSpotPopup(spot, marker);
    });

    marker.addTo(spotLayerGroup);
    marker._spotData = spot;
  });
}

/** Spots eines Flusses anzeigen */
export function showRiverSpots(riverId, onSpotClick = null) {
  if (!spotLayerGroup) return;
  spotLayerGroup.clearLayers();

  const spots = getSpotsByRiver(riverId);
  activeSpots = spots;
  const river = getRiver(riverId);

  spots.forEach(spot => {
    const marker = L.marker([spot.lat, spot.lng], {
      icon: createSpotIcon(spot.type),
      title: spot.name
    });
    marker.bindTooltip(spot.name, {
      permanent: false, direction: 'top', className: 'kanu-tooltip'
    });
    marker.on('click', () => {
      if (onSpotClick) onSpotClick(spot, marker);
    });
    marker.addTo(spotLayerGroup);
    marker._spotData = spot;
  });

  // Zoom auf den Fluss
  if (river && spots.length > 0) {
    if (spots.length === 1) {
      map.setView([spots[0].lat, spots[0].lng], 12);
    } else {
      const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }

  return spots;
}

/** Route zwischen zwei Spots anzeigen */
export function showRoute(startSpot, endSpot, intermediateSpots = []) {
  if (!routeLayerGroup) return;
  routeLayerGroup.clearLayers();

  // Alle Waypoints: start → intermediary → end
  const allPoints = [startSpot, ...intermediateSpots, endSpot];
  const latlngs = allPoints.map(s => [s.lat, s.lng]);

  // Route-Linie (gestrichelt)
  L.polyline(latlngs, {
    color: '#06b6d4',
    weight: 3,
    opacity: 0.85,
    dashArray: '8, 6',
    lineJoin: 'round'
  }).addTo(routeLayerGroup);

  // Start-Marker (grün)
  L.marker([startSpot.lat, startSpot.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div class="route-marker start-marker">A</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }).addTo(routeLayerGroup).bindTooltip(`Start: ${startSpot.name}`, { permanent: false, direction: 'top', className: 'kanu-tooltip' });

  // End-Marker (rot)
  L.marker([endSpot.lat, endSpot.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div class="route-marker end-marker">B</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }).addTo(routeLayerGroup).bindTooltip(`Ziel: ${endSpot.name}`, { permanent: false, direction: 'top', className: 'kanu-tooltip' });

  // Zoom auf Route
  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds, { padding: [60, 60] });
}

/** Route löschen */
export function clearRoute() {
  routeLayerGroup?.clearLayers();
}

/** GPS-Position auf Karte aktualisieren */
export function updatePosition(lat, lng, center = false) {
  if (!map) return;
  if (!posMarker) {
    posMarker = L.marker([lat, lng], { icon: createPosIcon(), zIndexOffset: 1000 }).addTo(map);
    posCircle = L.circle([lat, lng], { radius: 50, color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.1, weight: 1 }).addTo(map);
  } else {
    posMarker.setLatLng([lat, lng]);
    posCircle.setLatLng([lat, lng]);
  }
  if (center) map.setView([lat, lng], map.getZoom() < 14 ? 15 : map.getZoom());
}

/** GPS-Marker entfernen */
export function removePosition() {
  if (posMarker) { posMarker.remove(); posMarker = null; }
  if (posCircle) { posCircle.remove(); posCircle = null; }
}

/** Track-Linie auf Karte zeichnen (während Fahrt) */
let trackLine = null;
export function updateTrack(trackPoints) {
  if (!map || trackPoints.length < 2) return;
  const latlngs = trackPoints.map(p => [p.lat, p.lng]);
  if (!trackLine) {
    trackLine = L.polyline(latlngs, {
      color: '#f59e0b',
      weight: 3,
      opacity: 0.9
    }).addTo(map);
  } else {
    trackLine.setLatLngs(latlngs);
  }
}

export function clearTrack() {
  if (trackLine) { trackLine.remove(); trackLine = null; }
}

/** Spot Popup anzeigen */
function showSpotPopup(spot, marker) {
  const river = getRiver(spot.river);
  const facilities = (spot.facilities || []).map(f => {
    const m = FACILITY_META[f];
    return m ? `<span class="facility-tag">${m.icon} ${m.label}</span>` : '';
  }).join('');

  const popup = L.popup({ className: 'kanu-popup', maxWidth: 280 })
    .setLatLng([spot.lat, spot.lng])
    .setContent(`
      <div class="popup-content">
        <div class="popup-type">${SPOT_TYPE_LABELS[spot.type] || spot.type}</div>
        <h3 class="popup-name">${spot.name}</h3>
        <div class="popup-river">🏞️ ${river?.name || spot.river}</div>
        <div class="popup-parking">${spot.parking ? '🅿️ Parkplatz vorhanden' : '⚠️ Kein Parkplatz'}</div>
        ${spot.notes ? `<div class="popup-notes">${spot.notes}</div>` : ''}
        ${facilities ? `<div class="popup-facilities">${facilities}</div>` : ''}
      </div>
    `).openOn(map);
}

/** Karte auf aktuelle GPS-Position zentrieren */
export async function centerOnUser() {
  if (!navigator.geolocation) return;
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (map) {
          const targetZoom = Math.max(map.getZoom(), 16);
          map.setView([lat, lng], targetZoom);
        }
        resolve({ lat, lng });
      },
      err => reject(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });
}

/** Nearest spots to a position */
export function getNearestSpots(lat, lng, count = 5) {
  return SPOTS
    .map(s => ({ ...s, dist: haversine(lat, lng, s.lat, s.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, count);
}

export function getMap() { return map; }
