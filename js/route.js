/**
 * KanuApp – Route Planning Module
 * Routenplanung mit Distanzberechnung und Zeitschätzung
 */

import { SPOTS, getSpotsByRiver } from './data/spots.js?v=4';
import { getRiver } from './data/rivers.js?v=4';
import { haversine } from './gps.js';

// Mäander-Faktor: Flusskm ≈ Luftlinie × 1.35
const MEANDER_FACTOR = 1.35;

// Paddelgeschwindigkeit Optionen (km/h)
export const SPEED_PRESETS = [
  { id: 'slow',   label: 'Gemächlich',  speed: 3.0, icon: '🐢' },
  { id: 'normal', label: 'Normal',      speed: 5.0, icon: '🛶' },
  { id: 'fast',   label: 'Sportlich',   speed: 7.5, icon: '⚡' }
];

/**
 * Route zwischen zwei Spots planen
 * @returns {Object} Routeninformationen
 */
export function planRoute(startSpot, endSpot, speedPreset = 'normal') {
  if (!startSpot || !endSpot) return null;

  const preset = SPEED_PRESETS.find(p => p.id === speedPreset) || SPEED_PRESETS[1];
  const straightKm = haversine(startSpot.lat, startSpot.lng, endSpot.lat, endSpot.lng);
  const hasRiverKm = (
    startSpot.river === endSpot.river &&
    Number.isFinite(startSpot.km) &&
    Number.isFinite(endSpot.km)
  );
  const riverKm = hasRiverKm
    ? Math.abs(endSpot.km - startSpot.km)
    : (straightKm * MEANDER_FACTOR);
  const durationH = riverKm / preset.speed;
  const durationMin = Math.round(durationH * 60);

  // Zwischenstellen ermitteln (Spots auf gleichem Fluss, zwischen Start und End)
  const waypoints = getWaypoints(startSpot, endSpot);

  return {
    startSpot,
    endSpot,
    startKm: hasRiverKm ? startSpot.km : null,
    endKm: hasRiverKm ? endSpot.km : null,
    waypoints,
    straightKm: Math.round(straightKm * 10) / 10,
    riverKm: Math.round(riverKm * 10) / 10,
    distanceSource: hasRiverKm ? 'river-km' : 'geo-estimate',
    durationMin,
    speed: preset,
    river: getRiver(startSpot.river),
    kmReference: getRiver(startSpot.river)?.km_reference || null,
    sameRiver: startSpot.river === endSpot.river
  };
}

/**
 * Route direkt aus Fluss-km planen (ohne exakten Spot nötig)
 */
export function planRouteFromKilometers(riverId, startKm, endKm, speedPreset = 'normal', startSpot = null, endSpot = null) {
  if (!riverId || !Number.isFinite(startKm) || !Number.isFinite(endKm)) return null;

  const preset = SPEED_PRESETS.find(p => p.id === speedPreset) || SPEED_PRESETS[1];
  const riverKm = Math.abs(endKm - startKm);
  const durationH = riverKm / preset.speed;
  const durationMin = Math.round(durationH * 60);

  const riverSpots = getSpotsByRiver(riverId)
    .filter(s => Number.isFinite(s.km));

  const resolvedStartSpot = startSpot || riverSpots.reduce((best, s) => {
    if (!best) return s;
    return Math.abs(s.km - startKm) < Math.abs(best.km - startKm) ? s : best;
  }, null);

  const resolvedEndSpot = endSpot || riverSpots.reduce((best, s) => {
    if (!best) return s;
    return Math.abs(s.km - endKm) < Math.abs(best.km - endKm) ? s : best;
  }, null);

  const waypoints = (resolvedStartSpot && resolvedEndSpot)
    ? getWaypoints(resolvedStartSpot, resolvedEndSpot)
    : [];

  return {
    startSpot: resolvedStartSpot,
    endSpot: resolvedEndSpot,
    startKm,
    endKm,
    waypoints,
    straightKm: null,
    riverKm: Math.round(riverKm * 10) / 10,
    distanceSource: 'manual-river-km',
    durationMin,
    speed: preset,
    river: getRiver(riverId),
    kmReference: getRiver(riverId)?.km_reference || null,
    sameRiver: true
  };
}

/**
 * Zwischenstellen entlang der Route ermitteln
 */
function getWaypoints(startSpot, endSpot) {
  if (startSpot.river !== endSpot.river) return [];
  const spots = getSpotsByRiver(startSpot.river);

  // Einfache Approximation: Spots die "zwischen" Start und End liegen (nach km-Angabe)
  if (startSpot.km !== undefined && endSpot.km !== undefined) {
    const [fromKm, toKm] = startSpot.km < endSpot.km
      ? [startSpot.km, endSpot.km]
      : [endSpot.km, startSpot.km];

    return spots.filter(s =>
      s.id !== startSpot.id &&
      s.id !== endSpot.id &&
      s.km !== undefined &&
      s.km > fromKm &&
      s.km < toKm
    );
  }

  // Fallback: Spots die geographisch zwischen den beiden liegen
  const latMin = Math.min(startSpot.lat, endSpot.lat);
  const latMax = Math.max(startSpot.lat, endSpot.lat);
  const lngMin = Math.min(startSpot.lng, endSpot.lng);
  const lngMax = Math.max(startSpot.lng, endSpot.lng);

  const margin = 0.1; // ~10km Puffer
  return spots.filter(s =>
    s.id !== startSpot.id &&
    s.id !== endSpot.id &&
    s.lat >= latMin - margin && s.lat <= latMax + margin &&
    s.lng >= lngMin - margin && s.lng <= lngMax + margin
  );
}

/**
 * Formatierte Dauer (z.B. "2h 30min")
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Tagestouren-Empfehlung (max 40km)
 */
export function getDayTripSuggestions(riverId) {
  const spots = getSpotsByRiver(riverId);
  if (spots.length < 2) return [];

  const suggestions = [];
  for (let i = 0; i < spots.length - 1; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      const dist = haversine(
        spots[i].lat, spots[i].lng,
        spots[j].lat, spots[j].lng
      ) * MEANDER_FACTOR;
      if (dist >= 8 && dist <= 35) {
        suggestions.push({
          start: spots[i],
          end: spots[j],
          riverKm: Math.round(dist * 10) / 10
        });
      }
    }
  }
  return suggestions.sort((a, b) => a.riverKm - b.riverKm);
}

/**
 * Spots nach Fluss gruppiert und alphabetisch sortiert
 */
export function groupSpotsByRiver() {
  const grouped = {};
  SPOTS.forEach(spot => {
    if (!grouped[spot.river]) grouped[spot.river] = [];
    grouped[spot.river].push(spot);
  });
  return grouped;
}
