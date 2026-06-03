# KanuApp – Kajak Routenplaner & Fahrtenbuch

Eine **Progressive Web App (PWA)** für Kajak-Enthusiasten.  
Routenplanung auf der Karte, GPS-Tracking während der Fahrt und ein digitales Fahrtenbuch – alles offline-fähig auf dem Smartphone.

🌐 **Live-App:** [https://auslaender21.github.io/KNapp/](https://auslaender21.github.io/KNapp/)

---

## Funktionsübersicht

| Tab | Funktion |
|-----|----------|
| 🗺️ Karte | Flüsse und Spots anzeigen, Route planen |
| 🚣 Fahrt | GPS-Tracking, Strecke & Zeit messen |
| 📖 Buch | Fahrten speichern, ansehen, manuell erfassen |

---

## Installation auf dem Smartphone

1. **Chrome** (Android) oder **Safari** (iOS) öffnen
2. [https://auslaender21.github.io/KNapp/](https://auslaender21.github.io/KNapp/) aufrufen
3. Menü → **„Zum Startbildschirm hinzufügen"**
4. App startet danach wie eine native App – auch **offline**

> Nach einem App-Update: App deinstallieren und neu installieren, damit der Service Worker die neuen Dateien lädt.

---

## Bedienungsanleitung

### 🗺️ Tab: Karte

**Route planen:**

1. Im unteren Panel einen **Fluss auswählen** (z. B. „Maas")
2. **Start (A)** und **Ziel (B)** über eines der drei Methoden setzen:
   - Dropdown „Start" / „Ziel" → Spot aus der Liste wählen
   - Km-Felder → genaue Fluss-km eingeben
   - Karte lang drücken → Kontextmenü → „Als Start setzen" / „Als Ziel setzen"
3. Die berechnete Route wird als Linie auf der Karte angezeigt
4. Im Panel erscheinen **Distanz (km)** und **Fahrzeit** (basierend auf gewähltem Paddeltempo)

**Paddeltempo:**
- 🐢 Gemächlich (~4 km/h)
- 🚣 Normal (~6 km/h)  
- ⚡ Sportlich (~8 km/h)

**GPS-Position:**
- Button 📍 rechts auf der Karte → zentriert die Karte auf deinen aktuellen Standort

---

### 🚣 Tab: Fahrt (GPS-Tracking)

**Fahrt starten:**

1. Optional: Route vorher auf der Karte planen → Start/Ziel werden automatisch übernommen
2. Auf **„▶ Starten"** tippen
3. GPS-Berechtigung erteilen (beim ersten Mal)
4. App zeigt:
   - **Strecke (km)** – zurückgelegte Distanz
   - **Zeit** – Fahrtdauer als Stoppuhr
   - **Aktuell (km/h)** – aktuelle Geschwindigkeit
   - **Ø (km/h)** – Durchschnittsgeschwindigkeit

**Fahrt beenden & speichern:**

1. **„⏹ Stoppen"** tippen → Tracking pausiert
2. **„💾 Fahrt speichern"** → Daten werden ins Fahrtenbuch übernommen
3. Alternativ: **„↺ Zurücksetzen"** → alle Daten verwerfen

> Nach dem Speichern oder Zurücksetzen wird die Route automatisch geleert.

**Hinweise:**
- GPS läuft im Hintergrund weiter, solange die App geöffnet ist
- Der orangefarbene Track auf der Karte zeigt die zurückgelegte Strecke
- Der Debug-Button **„D"** oben rechts zeigt GPS-Rohdaten (Genauigkeit, Koordinaten)

---

### 📖 Tab: Buch (Fahrtenbuch)

**Gespeicherte Fahrten ansehen:**
- Liste aller Fahrten mit Datum, Strecke, Zeit und Route
- Eintrag antippen → Detailansicht mit vollständigen Statistiken

**Fahrt manuell erfassen** (ohne GPS):
1. Tab „Neue Fahrt" wählen
2. Felder ausfüllen: Datum, Fluss, Start, Ziel, Distanz, Dauer, Notizen
3. Speichern

**Eintrag löschen:**
- In der Detailansicht → **„🗑 Löschen"**

---

## Datenspeicherung

Alle Fahrten werden **lokal auf dem Gerät** in der **IndexedDB** gespeichert.  
Es gibt keine Cloud-Synchronisation. Die Daten bleiben beim Deinstallieren der App erhalten, werden aber beim **Löschen der Browser-Daten** ebenfalls gelöscht.

> **Tipp:** Wichtige Fahrten regelmäßig notieren oder exportieren.

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Typ | Progressive Web App (PWA) |
| Technologie | Vanilla HTML/CSS/JavaScript (ES Modules) |
| Karte | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap |
| GPS | `navigator.geolocation.watchPosition` |
| Speicher | IndexedDB (lokal, offline) |
| Offline | Service Worker (Cache-First) |
| Hosting | GitHub Pages |
| Unterstützte Gebiete | Deutschland, Niederlande, Belgien |

---

## Flüsse & Spots

Die App enthält vordefinierte Gewässer und Einsetz-/Ausstiegsstellen.  
Daten befinden sich in:
- `js/data/rivers.js` – Flussdefinitionen
- `js/data/spots.js` – Spots (Einsetzstellen, Ausstieg, Rast, Wildwasser etc.)

---

## Entwicklung & lokaler Start

```bash
# Abhängigkeiten (nur Vite als Dev-Server)
npm install

# Lokaler Dev-Server
npx vite

# Preview-Build
npx vite preview
```

App läuft dann unter `http://localhost:5173` (dev) bzw. `http://localhost:4173` (preview).

---

## Lizenz

Privates Projekt – kein öffentliches Lizenzmodell.
