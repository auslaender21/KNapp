// Kajak-geeignete Flüsse in Deutschland, Niederlanden und Belgien
export const RIVERS = [
  {
    id: 'rhein',
    name: 'Rhein',
    countries: ['DE', 'NL'],
    difficulty: 'easy',
    length_km: 865,
    description: 'Der längste und meistbefahrene Fluss Deutschlands',
    km_reference: 'Rhein-km (deutsche Kilometrierung)',
    center: [50.5, 7.5],
    zoom: 7,
    color: '#06b6d4'
  },
  {
    id: 'mosel',
    name: 'Mosel',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 544,
    description: 'Malerische Weinlandschaft mit ruhigem Strömung',
    km_reference: 'Mosel-km mit Mündung in Koblenz = 0',
    center: [50.0, 7.0],
    zoom: 8,
    color: '#8b5cf6'
  },
  {
    id: 'elbe',
    name: 'Elbe',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 727,
    description: 'Breiter Strom durch Mitteldeutschland',
    center: [51.5, 12.5],
    zoom: 7,
    color: '#10b981'
  },
  {
    id: 'weser',
    name: 'Weser',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 452,
    description: 'Idyllischer Fluss durch das Weserbergland',
    center: [52.2, 9.2],
    zoom: 8,
    color: '#f59e0b'
  },
  {
    id: 'main',
    name: 'Main',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 527,
    description: 'Fränkischer Fluss durch Bayern und Hessen',
    center: [49.9, 9.5],
    zoom: 8,
    color: '#f97316'
  },
  {
    id: 'neckar',
    name: 'Neckar',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 367,
    description: 'Romantischer Fluss durchs Württemberger Hügelland',
    center: [49.0, 9.0],
    zoom: 8,
    color: '#ec4899'
  },
  {
    id: 'donau',
    name: 'Donau',
    countries: ['DE'],
    difficulty: 'medium',
    length_km: 678,
    description: 'Europas zweitlängster Strom – Oberlauf in Bayern',
    center: [48.5, 11.0],
    zoom: 8,
    color: '#3b82f6'
  },
  {
    id: 'lahn',
    name: 'Lahn',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 245,
    description: 'Einer der schönsten Kajakflüsse Deutschlands',
    center: [50.5, 8.2],
    zoom: 9,
    color: '#22d3ee'
  },
  {
    id: 'saar',
    name: 'Saar',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 235,
    description: 'Ruhiger Fluss im Saarland mit schöner Landschaft',
    center: [49.4, 6.8],
    zoom: 9,
    color: '#a3e635'
  },
  {
    id: 'rur',
    name: 'Rur / Roer',
    countries: ['DE', 'NL'],
    difficulty: 'easy',
    length_km: 164,
    description: 'Kleiner aber feiner Kajakfluss im Dreiländereck',
    center: [50.9, 6.4],
    zoom: 9,
    color: '#fb923c'
  },
  {
    id: 'maas',
    name: 'Maas / Meuse',
    countries: ['NL', 'BE'],
    difficulty: 'easy',
    length_km: 874,
    description: 'Grenzfluss zwischen Niederlanden und Belgien',
    center: [51.0, 5.5],
    zoom: 8,
    color: '#34d399'
  },
  {
    id: 'ijssel',
    name: 'IJssel',
    countries: ['NL'],
    difficulty: 'easy',
    length_km: 125,
    description: 'Ruhiger Rheinarm durch die Niederlande',
    center: [52.2, 6.1],
    zoom: 9,
    color: '#60a5fa'
  },
  {
    id: 'saale',
    name: 'Saale',
    countries: ['DE'],
    difficulty: 'easy',
    length_km: 413,
    description: 'Schöner Mittelgebirgsfluss in Thüringen und Sachsen-Anhalt',
    center: [51.5, 11.9],
    zoom: 8,
    color: '#c084fc'
  },
  {
    id: 'waal',
    name: 'Waal',
    countries: ['NL'],
    difficulty: 'medium',
    length_km: 84,
    description: 'Hauptarm des Rheins in den Niederlanden',
    center: [51.8, 5.5],
    zoom: 9,
    color: '#2dd4bf'
  }
];

export function getRiver(id) {
  return RIVERS.find(r => r.id === id);
}

export function getRiversByCountry(country) {
  return RIVERS.filter(r => r.countries.includes(country));
}
