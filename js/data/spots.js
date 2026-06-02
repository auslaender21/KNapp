// Kuratierte Kajak-Einstiegsstellen in Deutschland, Niederlanden und Belgien
// Quellen: OpenStreetMap, DKV, Ruderverbände
export const SPOTS = [
  // ═══════════════════════════════════════════════
  // RHEIN (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'rh-de-001', name: 'Kanu-Club Rheinfelden',
    river: 'rhein', country: 'DE', lat: 47.5547, lng: 7.7927,
    type: 'club', parking: true, km: 167,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Vereinsanlage, Gastpaddler willkommen'
  },
  {
    id: 'rh-de-002', name: 'Bootsanlegestelle Breisach',
    river: 'rhein', country: 'DE', lat: 48.0261, lng: 7.5798,
    type: 'public', parking: true, km: 225,
    facilities: ['parking'],
    notes: 'Öffentliche Slipanlage am Rheinufer'
  },
  {
    id: 'rh-de-003', name: 'Kanuclub Karlsruhe e.V.',
    river: 'rhein', country: 'DE', lat: 49.0269, lng: 8.3842,
    type: 'club', parking: true, km: 360,
    facilities: ['toilet', 'shower', 'storage', 'rental'],
    notes: 'Größter Kanuclub am Hoch-Rhein'
  },
  {
    id: 'rh-de-004', name: 'Slipanlage Speyer',
    river: 'rhein', country: 'DE', lat: 49.3154, lng: 8.4381,
    type: 'slipway', parking: true, km: 400,
    facilities: ['parking'],
    notes: 'Stadtnahe Slipanlage, kostenfrei'
  },
  {
    id: 'rh-de-005', name: 'Mannheimer Kanuclub',
    river: 'rhein', country: 'DE', lat: 49.4883, lng: 8.4668,
    type: 'club', parking: true, km: 424,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Nähe Neckar-Mündung'
  },
  {
    id: 'rh-de-006', name: 'Anleger Worms-Innenstadt',
    river: 'rhein', country: 'DE', lat: 49.6315, lng: 8.3570,
    type: 'public', parking: true, km: 443,
    facilities: ['parking'],
    notes: 'Zentrumsnahe Einstiegsstelle'
  },
  {
    id: 'rh-de-007', name: 'Kanu-Sport-Club Mainz e.V.',
    river: 'rhein', country: 'DE', lat: 49.9929, lng: 8.2473,
    type: 'club', parking: true, km: 498,
    facilities: ['toilet', 'shower', 'kiosk'],
    notes: 'Blick auf den Dom, gut erreichbar'
  },
  {
    id: 'rh-de-008', name: 'Rüdesheim Bootsanleger',
    river: 'rhein', country: 'DE', lat: 49.9796, lng: 7.9210,
    type: 'public', parking: true, km: 530,
    facilities: ['parking', 'restaurant'],
    notes: 'Eingang zum Mittelrheintal, UNESCO-Gebiet'
  },
  {
    id: 'rh-de-009', name: 'DKV-Stützpunkt Koblenz',
    river: 'rhein', country: 'DE', lat: 50.3569, lng: 7.5890,
    type: 'club', parking: true, km: 591,
    facilities: ['toilet', 'shower', 'storage', 'rescue'],
    notes: 'Rhein-Mosel-Zusammenfluss, DKV-Stützpunkt'
  },
  {
    id: 'rh-de-010', name: 'Ruderclub Bonn e.V.',
    river: 'rhein', country: 'DE', lat: 50.7374, lng: 7.1005,
    type: 'club', parking: true, km: 654,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Direkt am Rheinufer in Bonn'
  },
  {
    id: 'rh-de-011', name: 'Kölner Kanuclub am Rhein',
    river: 'rhein', country: 'DE', lat: 50.9275, lng: 6.9614,
    type: 'club', parking: true, km: 688,
    facilities: ['toilet', 'shower', 'storage', 'kiosk'],
    notes: 'Deutz, Blick auf den Kölner Dom'
  },
  {
    id: 'rh-de-012', name: 'Slipanlage Duisburg-Ruhrort',
    river: 'rhein', country: 'DE', lat: 51.4336, lng: 6.7623,
    type: 'slipway', parking: true, km: 779,
    facilities: ['parking'],
    notes: 'Hafen Ruhrort, Ruhr-Mündung'
  },
  {
    id: 'rh-de-013', name: 'Rudergesellschaft Wesel',
    river: 'rhein', country: 'DE', lat: 51.6619, lng: 6.6219,
    type: 'club', parking: true, km: 814,
    facilities: ['toilet', 'storage'],
    notes: 'Letzter Rhein-Club vor NL-Grenze'
  },
  {
    id: 'rh-de-014', name: 'Kanu-Club Konstanz',
    river: 'rhein', country: 'DE', lat: 47.6606, lng: 9.1758,
    type: 'club', parking: true, km: 46.3,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Bodensee-Abfluss, guter Start für Hochrhein-Etappen'
  },
  {
    id: 'rh-de-015', name: 'Slipanlage Waldshut',
    river: 'rhein', country: 'DE', lat: 47.6202, lng: 8.2175,
    type: 'slipway', parking: true, km: 145.6,
    facilities: ['parking'],
    notes: 'Öffentliche Rampe nahe Altstadt Waldshut'
  },
  {
    id: 'rh-de-016', name: 'Anleger Kehl / Straßburg',
    river: 'rhein', country: 'DE', lat: 48.5734, lng: 7.8150,
    type: 'public', parking: true, km: 295.4,
    facilities: ['parking', 'toilet'],
    notes: 'Grenzlage, guter Zugang im Stadtgebiet Kehl'
  },
  {
    id: 'rh-de-017', name: 'Anleger Bingen',
    river: 'rhein', country: 'DE', lat: 49.9660, lng: 7.8982,
    type: 'public', parking: true, km: 529.2,
    facilities: ['parking', 'restaurant'],
    notes: 'Nahe Mäuseturm, klassischer Mittelrhein-Einstieg'
  },
  {
    id: 'rh-de-018', name: 'Anleger Andernach',
    river: 'rhein', country: 'DE', lat: 50.4342, lng: 7.4045,
    type: 'public', parking: true, km: 613.7,
    facilities: ['parking'],
    notes: 'Ruhiger Einstieg bei der Uferpromenade'
  },
  {
    id: 'rh-de-019', name: 'Kanuclub Düsseldorf-Hamm',
    river: 'rhein', country: 'DE', lat: 51.2065, lng: 6.7730,
    type: 'club', parking: true, km: 735.1,
    facilities: ['toilet', 'storage'],
    notes: 'Vereinsgelände südlich Innenstadt'
  },
  {
    id: 'rh-de-020', name: 'Anleger Emmerich',
    river: 'rhein', country: 'DE', lat: 51.8382, lng: 6.2478,
    type: 'public', parking: true, km: 857.9,
    facilities: ['parking'],
    notes: 'Letzter großer Anleger vor der niederländischen Grenze'
  },
  // ── Rhein (NL) ──
  {
    id: 'rh-nl-001', name: 'Kanoclub Nijmegen',
    river: 'rhein', country: 'NL', lat: 51.8432, lng: 5.8644,
    type: 'club', parking: true, km: 884,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Waal-Ufer in Nijmegen'
  },
  {
    id: 'rh-nl-002', name: 'Kanovereniging Arnhem',
    river: 'rhein', country: 'NL', lat: 51.9847, lng: 5.9021,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'storage'],
    notes: 'Neder-Rijn, ruhig und familienfreundlich'
  },
  {
    id: 'rh-nl-003', name: 'Aanlegsteiger Utrecht-Vecht',
    river: 'rhein', country: 'NL', lat: 52.0927, lng: 5.1042,
    type: 'public', parking: true, km: 0,
    facilities: ['parking'],
    notes: 'Vecht-Ausfahrt, Stadtgebiet Utrecht'
  },
  {
    id: 'rh-nl-004', name: 'Aanlegplaats Wijk bij Duurstede',
    river: 'rhein', country: 'NL', lat: 51.9762, lng: 5.3414,
    type: 'public', parking: true, km: 946.3,
    facilities: ['parking', 'toilet'],
    notes: 'Neder-Rijn Abschnitt mit gutem Uferzugang'
  },
  {
    id: 'rh-nl-005', name: 'Kanovereniging Rotterdam',
    river: 'rhein', country: 'NL', lat: 51.9244, lng: 4.4777,
    type: 'club', parking: true, km: 1001.8,
    facilities: ['toilet', 'storage'],
    notes: 'Mündungsnahes Revier, nur bei moderaten Bedingungen'
  },
  {
    id: 'rh-nl-006', name: 'Aanlegplaats Dordrecht Biesbosch',
    river: 'rhein', country: 'NL', lat: 51.8133, lng: 4.6901,
    type: 'public', parking: true, km: 987.4,
    facilities: ['parking'],
    notes: 'Einstieg Richtung Biesbosch-Nebenarme'
  },

  // ═══════════════════════════════════════════════
  // MOSEL (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'mo-de-001', name: 'Kanuclub Trier e.V.',
    river: 'mosel', country: 'DE', lat: 49.7490, lng: 6.6371,
    type: 'club', parking: true, km: 242,
    facilities: ['toilet', 'shower', 'storage', 'rental'],
    notes: 'Start der Mosel-Kanutour, Römerstadt Trier'
  },
  {
    id: 'mo-de-002', name: 'Slipway Bernkastel-Kues',
    river: 'mosel', country: 'DE', lat: 49.9147, lng: 7.0720,
    type: 'slipway', parking: true, km: 112,
    facilities: ['parking', 'restaurant'],
    notes: 'Historisches Weinort, schönes Ambiente'
  },
  {
    id: 'mo-de-003', name: 'Anlegestelle Traben-Trarbach',
    river: 'mosel', country: 'DE', lat: 49.9497, lng: 7.1219,
    type: 'public', parking: true, km: 103,
    facilities: ['parking', 'toilet'],
    notes: 'Öffentlicher Anleger im Stadtzentrum'
  },
  {
    id: 'mo-de-004', name: 'Kanu-Rastplatz Cochem',
    river: 'mosel', country: 'DE', lat: 50.1461, lng: 7.1671,
    type: 'public', parking: true, km: 56,
    facilities: ['parking', 'toilet'],
    notes: 'Unterhalb der Reichsburg Cochem'
  },
  {
    id: 'mo-de-005', name: 'Mosel-Rhein-Übergang Koblenz',
    river: 'mosel', country: 'DE', lat: 50.3583, lng: 7.5897,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'rescue'],
    notes: 'Deutsches Eck, Mündung in den Rhein'
  },
  {
    id: 'mo-de-006', name: 'Anleger Schweich',
    river: 'mosel', country: 'DE', lat: 49.8162, lng: 6.7493,
    type: 'public', parking: true, km: 227.8,
    facilities: ['parking'],
    notes: 'Oberhalb Trier, einfacher Einstieg an der Uferstraße'
  },
  {
    id: 'mo-de-007', name: 'Anleger Mehring',
    river: 'mosel', country: 'DE', lat: 49.7932, lng: 6.8268,
    type: 'public', parking: true, km: 214.5,
    facilities: ['parking', 'toilet'],
    notes: 'Beliebter Startpunkt für Etappen Richtung Piesport'
  },
  {
    id: 'mo-de-008', name: 'Anleger Piesport',
    river: 'mosel', country: 'DE', lat: 49.8883, lng: 6.9151,
    type: 'public', parking: true, km: 184.2,
    facilities: ['parking', 'restaurant'],
    notes: 'Winzerdorf, gute Infrastruktur am Ufer'
  },
  {
    id: 'mo-de-009', name: 'Anleger Neumagen-Dhron',
    river: 'mosel', country: 'DE', lat: 49.8572, lng: 6.8977,
    type: 'public', parking: true, km: 172.9,
    facilities: ['parking', 'toilet'],
    notes: 'Römerort mit ruhiger Strömung'
  },
  {
    id: 'mo-de-010', name: 'Anleger Zell (Mosel)',
    river: 'mosel', country: 'DE', lat: 50.0258, lng: 7.1823,
    type: 'public', parking: true, km: 123.6,
    facilities: ['parking'],
    notes: 'Zentraler Einstieg in der Zeller Altstadt'
  },
  {
    id: 'mo-de-011', name: 'Anleger Treis-Karden',
    river: 'mosel', country: 'DE', lat: 50.1722, lng: 7.3022,
    type: 'public', parking: true, km: 43.7,
    facilities: ['parking', 'toilet'],
    notes: 'Geeignet für Etappen vor Cochem/Koblenz'
  },
  {
    id: 'mo-de-012', name: 'Anleger Winningen',
    river: 'mosel', country: 'DE', lat: 50.3140, lng: 7.5221,
    type: 'public', parking: true, km: 11.2,
    facilities: ['parking', 'restaurant'],
    notes: 'Letzte Mosel-Etappe vor dem Deutschen Eck'
  },
  {
    id: 'mo-de-013', name: 'Kanuabteilung Konz',
    river: 'mosel', country: 'DE', lat: 49.7006, lng: 6.5770,
    type: 'club', parking: true, km: 249.4,
    facilities: ['toilet', 'storage'],
    notes: 'Nahe Saar-Mosel-Raum, guter Einstieg oberhalb Trier'
  },
  {
    id: 'mo-de-014', name: 'WSV Trier-Pfalzel',
    river: 'mosel', country: 'DE', lat: 49.7814, lng: 6.7021,
    type: 'club', parking: true, km: 236.5,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Vereinsgelände im Norden von Trier'
  },
  {
    id: 'mo-de-015', name: 'Ruderclub Neumagen',
    river: 'mosel', country: 'DE', lat: 49.8576, lng: 6.9009,
    type: 'club', parking: true, km: 172.3,
    facilities: ['toilet', 'storage'],
    notes: 'Vereinssteg im Bereich Neumagen-Dhron'
  },
  {
    id: 'mo-de-016', name: 'KC Traben-Trarbach',
    river: 'mosel', country: 'DE', lat: 49.9510, lng: 7.1158,
    type: 'club', parking: true, km: 102.1,
    facilities: ['toilet', 'storage', 'rental'],
    notes: 'Klubsteg für Touren im mittleren Moseltal'
  },
  {
    id: 'mo-de-017', name: 'KC Zell-Bullay',
    river: 'mosel', country: 'DE', lat: 50.0451, lng: 7.1237,
    type: 'club', parking: true, km: 111.6,
    facilities: ['toilet', 'storage'],
    notes: 'Vereinsnaher Einstieg zwischen Zell und Bullay'
  },
  {
    id: 'mo-de-018', name: 'Ruderverein Cochem',
    river: 'mosel', country: 'DE', lat: 50.1498, lng: 7.1694,
    type: 'club', parking: true, km: 55.4,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Vereinssteg unterhalb der Reichsburg'
  },
  {
    id: 'mo-de-019', name: 'WSV Kobern-Gondorf',
    river: 'mosel', country: 'DE', lat: 50.3016, lng: 7.4540,
    type: 'club', parking: true, km: 18.3,
    facilities: ['toilet', 'storage'],
    notes: 'Einstieg im unteren Moselabschnitt vor Koblenz'
  },
  {
    id: 'mo-de-020', name: 'Ruderverein Koblenz-Mosel',
    river: 'mosel', country: 'DE', lat: 50.3589, lng: 7.5780,
    type: 'club', parking: true, km: 1.3,
    facilities: ['toilet', 'shower', 'storage', 'rescue'],
    notes: 'Mündungsnaher Vereinsstandort am Deutschen Eck'
  },
  {
    id: 'mo-lu-001', name: 'Canoe Club Grevenmacher',
    river: 'mosel', country: 'LU', lat: 49.6804, lng: 6.4418,
    type: 'club', parking: true, km: 259.8,
    facilities: ['toilet', 'storage'],
    notes: 'Luxemburgischer Moselabschnitt, grenznah zu DE'
  },
  {
    id: 'mo-lu-002', name: 'Canoe Club Remich',
    river: 'mosel', country: 'LU', lat: 49.5457, lng: 6.3661,
    type: 'club', parking: true, km: 275.2,
    facilities: ['toilet', 'storage'],
    notes: 'Klubzugang im südlichen Luxemburg-Moseltal'
  },

  // ═══════════════════════════════════════════════
  // ELBE (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'el-de-001', name: 'Paddlerrastplatz Bad Schandau',
    river: 'elbe', country: 'DE', lat: 50.9173, lng: 14.1503,
    type: 'public', parking: true, km: 0,
    facilities: ['parking', 'toilet'],
    notes: 'Sächsische Schweiz, Einfahrt Nationalpark'
  },
  {
    id: 'el-de-002', name: 'Pieschener Hafen Dresden',
    river: 'elbe', country: 'DE', lat: 51.0493, lng: 13.7381,
    type: 'public', parking: true, km: 60,
    facilities: ['parking', 'toilet', 'kiosk'],
    notes: 'Zentraler Anleger in Dresden, Nähe Zwinger'
  },
  {
    id: 'el-de-003', name: 'Slipanlage Meißen',
    river: 'elbe', country: 'DE', lat: 51.1665, lng: 13.4694,
    type: 'slipway', parking: true, km: 98,
    facilities: ['parking'],
    notes: 'Unterhalb des Albrechtsburg-Schlosses'
  },
  {
    id: 'el-de-004', name: 'Kanuclub Magdeburg e.V.',
    river: 'elbe', country: 'DE', lat: 52.1277, lng: 11.6292,
    type: 'club', parking: true, km: 330,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Stadtmitte, Nähe Elbe-Radweg'
  },
  {
    id: 'el-de-005', name: 'Elbe-Anleger Hamburg-Altona',
    river: 'elbe', country: 'DE', lat: 53.5488, lng: 10.0004,
    type: 'public', parking: true, km: 607,
    facilities: ['parking', 'restaurant'],
    notes: 'Tidegebiet! Nur für Erfahrene'
  },

  // ═══════════════════════════════════════════════
  // WESER (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'we-de-001', name: 'Kanutouristik Hannoversch Münden',
    river: 'weser', country: 'DE', lat: 51.4141, lng: 9.6518,
    type: 'public', parking: true, km: 0,
    facilities: ['parking', 'toilet', 'rental'],
    notes: 'Klassischer Startpunkt der Oberweser, Werra+Fulda=Weser'
  },
  {
    id: 'we-de-002', name: 'Kanuclub Hameln e.V.',
    river: 'weser', country: 'DE', lat: 52.1031, lng: 9.3572,
    type: 'club', parking: true, km: 100,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Rattenfänger-Stadt, schöne Altstadt'
  },
  {
    id: 'we-de-003', name: 'Anleger Porta Westfalica',
    river: 'weser', country: 'DE', lat: 52.2478, lng: 8.8965,
    type: 'public', parking: true, km: 152,
    facilities: ['parking'],
    notes: 'Berühmte Weserdurchbruchstelle'
  },
  {
    id: 'we-de-004', name: 'Weserstrand Bremen',
    river: 'weser', country: 'DE', lat: 53.0793, lng: 8.8017,
    type: 'public', parking: true, km: 365,
    facilities: ['parking', 'restaurant', 'toilet'],
    notes: 'Stadtbereich Bremen, Tidegebiet beachten!'
  },

  // ═══════════════════════════════════════════════
  // MAIN (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'ma-de-001', name: 'Kanuclub Bamberg 1921 e.V.',
    river: 'main', country: 'DE', lat: 49.8988, lng: 10.9028,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage', 'rental'],
    notes: 'UNESCO-Welterbe Bamberg, Regnitz-Mündung'
  },
  {
    id: 'ma-de-002', name: 'Paddleranleger Würzburg',
    river: 'main', country: 'DE', lat: 49.7944, lng: 9.9330,
    type: 'public', parking: true, km: 90,
    facilities: ['parking', 'toilet'],
    notes: 'Unterhalb der Festung Marienberg'
  },
  {
    id: 'ma-de-003', name: 'Miltenberg Bootsanleger',
    river: 'main', country: 'DE', lat: 49.7018, lng: 9.2621,
    type: 'public', parking: true, km: 184,
    facilities: ['parking', 'restaurant'],
    notes: 'Malerische Altstadt am Main-Knie'
  },
  {
    id: 'ma-de-004', name: 'Kanuclub Frankfurt-Sachsenhausen',
    river: 'main', country: 'DE', lat: 50.1028, lng: 8.6861,
    type: 'club', parking: true, km: 248,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Metropol-Skyline, Stadtmitte Frankfurt'
  },

  // ═══════════════════════════════════════════════
  // NECKAR (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'ne-de-001', name: 'Kanuclub Tübingen e.V.',
    river: 'neckar', country: 'DE', lat: 48.5216, lng: 9.0576,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage', 'rental'],
    notes: 'Universitätsstadt, Neckarursprung-Tour'
  },
  {
    id: 'ne-de-002', name: 'Slipanlage Hirschhorn',
    river: 'neckar', country: 'DE', lat: 49.4477, lng: 8.9021,
    type: 'slipway', parking: true, km: 180,
    facilities: ['parking'],
    notes: 'Burgenreicher Neckarabschnitt'
  },
  {
    id: 'ne-de-003', name: 'Kajakclub Heidelberg',
    river: 'neckar', country: 'DE', lat: 49.4093, lng: 8.6940,
    type: 'club', parking: true, km: 200,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Unterhalb des Heidelberger Schlosses'
  },
  {
    id: 'ne-de-004', name: 'Anleger Heilbronn Neckaranlage',
    river: 'neckar', country: 'DE', lat: 49.1427, lng: 9.2109,
    type: 'public', parking: true, km: 100,
    facilities: ['parking', 'toilet', 'restaurant'],
    notes: 'Stadtpark Heilbronn, gut ausgeschildert'
  },

  // ═══════════════════════════════════════════════
  // DONAU (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'do-de-001', name: 'Donau-Kajak-Club Ulm e.V.',
    river: 'donau', country: 'DE', lat: 48.3984, lng: 9.9909,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage', 'rescue'],
    notes: 'Hauptstützpunkt Obere Donau, DKV-zertifiziert'
  },
  {
    id: 'do-de-002', name: 'Slipanlage Sigmaringen',
    river: 'donau', country: 'DE', lat: 48.0851, lng: 9.2146,
    type: 'slipway', parking: true, km: 0,
    facilities: ['parking'],
    notes: 'Hohenzollern-Donau, sehr ruhiges Wasser'
  },
  {
    id: 'do-de-003', name: 'Kanuclub Regensburg e.V.',
    river: 'donau', country: 'DE', lat: 49.0188, lng: 12.0977,
    type: 'club', parking: true, km: 370,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Nähe Steinerne Brücke, UNESCO-Altstadt'
  },
  {
    id: 'do-de-004', name: 'Dreiflüsse-Anleger Passau',
    river: 'donau', country: 'DE', lat: 48.5746, lng: 13.4527,
    type: 'public', parking: true, km: 500,
    facilities: ['parking', 'toilet', 'restaurant'],
    notes: 'Inn und Ilz münden in die Donau – spektakulär!'
  },

  // ═══════════════════════════════════════════════
  // LAHN (DE) – Einer der beliebtesten Kajakflüsse!
  // ═══════════════════════════════════════════════
  {
    id: 'la-de-001', name: 'Kanuvermietung Marburg',
    river: 'lahn', country: 'DE', lat: 50.8021, lng: 8.7675,
    type: 'public', parking: true, km: 0,
    facilities: ['parking', 'toilet', 'rental'],
    notes: 'Beliebter Startpunkt der Lahn-Tour'
  },
  {
    id: 'la-de-002', name: 'Lahn-Anleger Weilburg',
    river: 'lahn', country: 'DE', lat: 50.4820, lng: 8.2590,
    type: 'public', parking: true, km: 80,
    facilities: ['parking', 'toilet'],
    notes: 'Schleuse Weilburg, historisches Städtchen'
  },
  {
    id: 'la-de-003', name: 'Paddlerrastplatz Nassau',
    river: 'lahn', country: 'DE', lat: 50.3212, lng: 7.8008,
    type: 'public', parking: true, km: 130,
    facilities: ['parking', 'toilet'],
    notes: 'Burgruine Nassau, ruhige Lahnschleife'
  },
  {
    id: 'la-de-004', name: 'Bootsanleger Bad Ems',
    river: 'lahn', country: 'DE', lat: 50.3367, lng: 7.7115,
    type: 'public', parking: true, km: 155,
    facilities: ['parking', 'restaurant'],
    notes: 'Kurstadt, kurz vor Lahn-Rhein-Mündung'
  },

  // ═══════════════════════════════════════════════
  // SAAR (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'sa-de-001', name: 'Kanuclub Saarbrücken e.V.',
    river: 'saar', country: 'DE', lat: 49.2354, lng: 6.9969,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Landeshauptstadt, DKV-Mitglied'
  },
  {
    id: 'sa-de-002', name: 'Saar-Schleife Mettlach',
    river: 'saar', country: 'DE', lat: 49.4938, lng: 6.5975,
    type: 'public', parking: true, km: 60,
    facilities: ['parking', 'toilet'],
    notes: 'Schönste Stelle der Saar, Cloef-Aussicht'
  },
  {
    id: 'sa-de-003', name: 'Slipway Merzig',
    river: 'saar', country: 'DE', lat: 49.4415, lng: 6.6396,
    type: 'slipway', parking: true, km: 45,
    facilities: ['parking'],
    notes: 'Öffentlicher Slipway, kostenlos'
  },

  // ═══════════════════════════════════════════════
  // RUR / ROER (DE/NL)
  // ═══════════════════════════════════════════════
  {
    id: 'ru-de-001', name: 'Kanuclub Düren e.V.',
    river: 'rur', country: 'DE', lat: 50.8044, lng: 6.4880,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'storage'],
    notes: 'Rur-Start für die Niederrhein-Tour'
  },
  {
    id: 'ru-de-002', name: 'Anleger Jülich',
    river: 'rur', country: 'DE', lat: 50.9212, lng: 6.3617,
    type: 'public', parking: true, km: 20,
    facilities: ['parking', 'toilet'],
    notes: 'Römerstadt Jülich, historisches Umland'
  },
  {
    id: 'ru-nl-001', name: 'Kano-Verein Roermond',
    river: 'rur', country: 'NL', lat: 51.1927, lng: 5.9882,
    type: 'club', parking: true, km: 60,
    facilities: ['toilet', 'storage'],
    notes: 'Mündung der Rur in die Maas'
  },

  // ═══════════════════════════════════════════════
  // MAAS / MEUSE (NL / BE)
  // ═══════════════════════════════════════════════
  {
    id: 'mz-be-001', name: 'Kayak-Club Namur',
    river: 'maas', country: 'BE', lat: 50.4669, lng: 4.8676,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage', 'rental'],
    notes: 'Touristenzentrum Ardennen, Sambre-Mündung'
  },
  {
    id: 'mz-be-002', name: 'Anleger Dinant',
    river: 'maas', country: 'BE', lat: 50.2617, lng: 4.9119,
    type: 'public', parking: true, km: 40,
    facilities: ['parking', 'restaurant'],
    notes: 'Felsenstadt mit Zitadelle – atemberaubend!'
  },
  {
    id: 'mz-be-003', name: 'Kanoclub Liège/Luik',
    river: 'maas', country: 'BE', lat: 50.6451, lng: 5.5720,
    type: 'club', parking: true, km: 110,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Outremeuse-Gebiet, Ourthe-Mündung'
  },
  {
    id: 'mz-nl-001', name: 'Kanoclub Maastricht',
    river: 'maas', country: 'NL', lat: 50.8514, lng: 5.6910,
    type: 'club', parking: true, km: 160,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Älteste Stadt NL, Dreiländereck'
  },
  {
    id: 'mz-nl-002', name: 'Maas-Anleger Venlo',
    river: 'maas', country: 'NL', lat: 51.3703, lng: 6.1724,
    type: 'public', parking: true, km: 220,
    facilities: ['parking', 'toilet'],
    notes: 'Hansestadt Venlo, DL-NL Grenzbereich'
  },
  {
    id: 'mz-nl-003', name: "Kanotoeristenclub 's-Hertogenbosch",
    river: 'maas', country: 'NL', lat: 51.6978, lng: 5.3037,
    type: 'club', parking: true, km: 310,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Den Bosch, Binnendieze-Kanalsystem'
  },

  // ═══════════════════════════════════════════════
  // IJSSEL (NL)
  // ═══════════════════════════════════════════════
  {
    id: 'ij-nl-001', name: 'Kanoclub Doesburg',
    river: 'ijssel', country: 'NL', lat: 52.0092, lng: 6.1353,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'storage'],
    notes: 'IJssel-Start bei Rhein-Abzweigung'
  },
  {
    id: 'ij-nl-002', name: 'Aanlegsteiger Zutphen',
    river: 'ijssel', country: 'NL', lat: 52.1437, lng: 6.1978,
    type: 'public', parking: true, km: 20,
    facilities: ['parking', 'toilet'],
    notes: 'Historische Hansestadt'
  },
  {
    id: 'ij-nl-003', name: 'Kanoclub Deventer',
    river: 'ijssel', country: 'NL', lat: 52.2570, lng: 6.1583,
    type: 'club', parking: true, km: 40,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Charme der alten Hansestadt'
  },
  {
    id: 'ij-nl-004', name: 'Aanlegsteiger Kampen',
    river: 'ijssel', country: 'NL', lat: 52.5572, lng: 5.9118,
    type: 'public', parking: true, km: 100,
    facilities: ['parking', 'restaurant'],
    notes: 'Mündungsbereich IJsselmeer, Tidegebiet!'
  },

  // ═══════════════════════════════════════════════
  // SAALE (DE)
  // ═══════════════════════════════════════════════
  {
    id: 'sl-de-001', name: 'Kanuclub Jena e.V.',
    river: 'saale', country: 'DE', lat: 50.9272, lng: 11.5887,
    type: 'club', parking: true, km: 0,
    facilities: ['toilet', 'shower', 'storage'],
    notes: 'Universitätsstadt, Saale-Radweg parallel'
  },
  {
    id: 'sl-de-002', name: 'Slipway Naumburg',
    river: 'saale', country: 'DE', lat: 51.1512, lng: 11.8134,
    type: 'slipway', parking: true, km: 90,
    facilities: ['parking'],
    notes: 'Romanischer Dom, ruhige Saaleaue'
  },
  {
    id: 'sl-de-003', name: 'Paddleranleger Halle (Saale)',
    river: 'saale', country: 'DE', lat: 51.4823, lng: 11.9700,
    type: 'public', parking: true, km: 160,
    facilities: ['parking', 'toilet'],
    notes: 'Industriekultur & schöne Altstadt'
  }
];

// Helper: alle Spots eines Flusses
export function getSpotsByRiver(riverId) {
  return SPOTS.filter(s => s.river === riverId);
}

// Helper: Spots nach Land
export function getSpotsByCountry(country) {
  return SPOTS.filter(s => s.country === country);
}

// Spot-Typen Labels
export const SPOT_TYPE_LABELS = {
  club: 'Kanuclub e.V.',
  slipway: 'Slipanlage',
  public: 'Öffentlicher Anleger'
};

// Facilities Labels & Icons
export const FACILITY_META = {
  toilet:    { label: 'WC', icon: '🚻' },
  shower:    { label: 'Dusche', icon: '🚿' },
  storage:   { label: 'Lager', icon: '🏠' },
  rental:    { label: 'Verleih', icon: '🛶' },
  kiosk:     { label: 'Kiosk', icon: '☕' },
  restaurant:{ label: 'Restaurant', icon: '🍽️' },
  rescue:    { label: 'Rettung', icon: '🚨' },
  parking:   { label: 'Parkplatz', icon: '🅿️' }
};
