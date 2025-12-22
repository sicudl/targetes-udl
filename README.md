# 📇 Targeta de Visita UdL  
### PWA de targeta digital amb QR vCard (offline-first)

Aplicació web progressiva (PWA) per a la **generació i compartició de dades de contacte mitjançant QR en format vCard**, dissenyada amb criteris **institucionals**, **offline-first** i amb **compatibilitat màxima amb lectors de QR** (incloent Google Lens).

El projecte està pensat per a ús en entorns universitaris i corporatius, amb especial atenció a la privacitat, la robustesa i la mantenibilitat.

---

## ✨ Funcionalitats principals

- Generació de **QR vCard 3.0**
- Compatible amb:
  - Google Lens
  - Càmera nativa d’Android
  - iOS
  - Lectors de QR de tercers
- **Multillengua**: Català (CA), Castellà (ES) i Anglès (EN)
- **Entrada inicial única**:
  - La primera vegada, les dades s’emmagatzemen automàticament als 3 idiomes
  - Edicions posteriors afecten només l’idioma actiu
- **Funcionament 100% offline**
- **Wake Lock** per evitar el bloqueig de pantalla en mode presentació
- QR amb **estil corporatiu** (color institucional, cantons arrodonits, logo)
- Targeta de contacte amb **iconografia plana**
- Sense backend
- Sense tracking
- Sense enviament de dades
- Dades emmagatzemades exclusivament en local (`localStorage`)

---

## 🧱 Arquitectura tècnica

### Tecnologies utilitzades
- HTML5
- CSS3
- JavaScript (vanilla)
- PWA (Service Worker + Web App Manifest)
- vCard 3.0
- QR Code Styling (llibreria local)
- Material Icons (font local)

### Principis de disseny
- **Offline-first**
- Autosuficiència (cap dependència externa en execució)
- Compatibilitat abans que complexitat
- Privacitat per defecte
- Adequat per a entorns institucionals i IT


---

## ⚖️ Llicència

Aquest projecte es distribueix sota la llicència **MIT License**, una llicència permissiva i compatible amb entorns institucionals i universitaris.

Aquesta llicència permet:
- ús intern i extern
- modificació i adaptació
- redistribució del codi
- reutilització en altres projectes

Sempre que es mantingui l’avís de copyright i la llicència original.

---

### QR Code Styling

- Nom del projecte: **QR Code Styling**
- Autor: Denys Kozak
- Repositori: https://github.com/kozakdenys/qr-code-styling
- Ús en aquest projecte:
  - Generació de codis QR amb estil personalitzat (formes, colors, logotip)
- Forma d’ús:
  - La llibreria s’inclou **en local** dins del projecte
- Llicència: **MIT License**

### Material Icons (Google)

- Nom del recurs: **Material Icons**
- Proveïdor: Google LLC
- Tipus: Font tipogràfica d’icones
- Ús en aquest projecte:
  - Iconografia plana i institucional a la targeta de contacte
- Forma d’ús:
  - Font inclosa **en local** (`.ttf`)
  - Cachejada pel Service Worker
- Llicència: **Apache License 2.0**

Text complet de la llicència:
- https://www.apache.org/licenses/LICENSE-2.0


## 📱 Instal·lació del PWA

L’aplicació està preparada per ser instal·lada com a **Progressive Web App (PWA)** en navegadors compatibles.

### Requisits
- Google Chrome (Android o Desktop)
- Microsoft Edge (Desktop)
- Navegadors basats en Chromium

> ⚠️ Safari permet l’ús com a PWA en iOS, però amb limitacions pròpies del sistema.

---

### Instal·lació en Android

1. Obre l’aplicació amb **Google Chrome**
2. Apareixerà el missatge *“Instal·la l’aplicació”*  
   o bé:
   - menú ⋮ → **Instal·la aplicació**
3. Confirma la instal·lació

L’aplicació quedarà:
- instal·lada com una app nativa
- accessible des de la pantalla d’inici
- funcional sense connexió

---

### Instal·lació en Desktop (Windows / Linux / macOS)

1. Obre l’aplicació amb **Chrome o Edge**
2. A la barra d’adreces, prem la icona **Instal·lar**
3. Confirma la instal·lació

L’aplicació s’obrirà:
- en una finestra independent
- sense barra d’adreces
- amb accés directe des del sistema

---

## 🔄 Actualitzacions de l’aplicació

- Les actualitzacions del codi es gestionen mitjançant el **Service Worker**
- Quan hi ha una nova versió:
  - els fitxers nous es descarreguen automàticament
  - s’apliquen en la següent recàrrega
- Les dades de l’usuari **no es perden**, ja que:
  - s’emmagatzemen en `localStorage`
  - són independents de la cache de l’aplicació

---

## 📴 Ús sense connexió

Un cop instal·lada o visitada almenys una vegada:

- l’aplicació funciona **sense connexió a Internet**
- el QR es genera correctament
- la targeta de contacte es mostra i es pot editar
- les dades continuen disponibles

Això fa l’aplicació adequada per a:
- presentacions
- esdeveniments
- entorns amb cobertura limitada

---



