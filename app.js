/* =========================================================
   CONFIG
========================================================= */

const STORAGE_KEY = "contactData";
let currentLang = "ca";
let wakeLock = null;

/* =========================================================
   DOM
========================================================= */

const formView = document.getElementById("form-view");
const mainView = document.getElementById("main-view");
const form = document.getElementById("contact-form");
const card = document.getElementById("contact-card");
const qrContainer = document.getElementById("qr-container");
const langButtons = document.querySelectorAll(".lang-tabs button");

/* =========================================================
   INIT
========================================================= */

init();

function init() {
  const stored = getStoredData();

  if (!stored.ca && !stored.es && !stored.en) {
    showForm();
  } else {
    showMain();
    renderAll();
  }
}

/* =========================================================
   STORAGE
========================================================= */

function getStoredData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/* =========================================================
   WAKE LOCK
========================================================= */

async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch {}
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

/* =========================================================
   LANGUAGE TABS
========================================================= */

langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    langButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderAll();
  });
});

/* =========================================================
   FORM
========================================================= */

form.addEventListener("submit", e => {
  e.preventDefault();

  const raw = Object.fromEntries(new FormData(form));

  const data = {
    nom: sanitizeText(raw.nom),
    cognoms: sanitizeText(raw.cognoms),
    carrec: sanitizeText(raw.carrec),
    organitzacio: sanitizeText(raw.organitzacio),
    telefonFix: normalizePhone(raw.telefonFix),
    telefonMobil: normalizePhone(raw.telefonMobil),
    email: normalizeEmail(raw.email),
    web: normalizeWeb(raw.web),
    carrer: sanitizeText(raw.carrer),
    cp: sanitizeText(raw.cp),
    ciutat: sanitizeText(raw.ciutat),
    pais: sanitizeText(raw.pais)
  };

  const all = getStoredData();
  const isFirstTime = !all.ca && !all.es && !all.en;

  if (isFirstTime) {
    all.ca = { ...data };
    all.es = { ...data };
    all.en = { ...data };
  } else {
    all[currentLang] = data;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  showMain();
  renderAll();
});

document.getElementById("edit-btn").onclick = showForm;
document.getElementById("cancel-btn").onclick = showMain;

function showForm() {
  releaseWakeLock();

  const all = getStoredData();
  const data = all[currentLang] || {};

  Object.keys(form.elements).forEach(key => {
    if (form.elements[key]) {
      form.elements[key].value = data[key] || "";
    }
  });

  mainView.classList.add("hidden");
  formView.classList.remove("hidden");
}

function showMain() {
  formView.classList.add("hidden");
  mainView.classList.remove("hidden");
  requestWakeLock();
}

/* =========================================================
   RENDER
========================================================= */

function renderAll() {
  const all = getStoredData();
  const data = all[currentLang] || {};
  renderQR(data);
  renderCard(data);
}

function renderQR(data) {
  qrContainer.innerHTML = "";
  qrContainer.classList.add("qr-animated");

  const vcard = buildVCard(data);

  const qr = new QRCodeStyling({
   data: vcard,
    width: 300,
    height: 300,
    image: "assets/img/logo-192.png",
    qrOptions: {
      errorCorrectionLevel: "L",
      mode: "Byte"
   },
    imageOptions: {
        saveAsBlob:true, 
        hideBackgroundDots:true,
        imageSize: 0.6,
        margin: 5},
    dotsOptions:{
        type: "extra-rounded",
        color:"#830051",
        roundSize:true
    },
    cornersSquareOptions:{
        type:"extra-rounded",
        color:"#000000"
    }
  });

  qr.append(qrContainer);
}

function renderCard(d) {
  card.innerHTML = "";

  if (d.nom || d.cognoms)
    card.innerHTML += `
      <p class="item name">
        ${escapeHtml(d.nom)} ${escapeHtml(d.cognoms)}
      </p>
    `;

  if (d.carrec)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">badge</span>
        ${escapeHtml(d.carrec)}
      </p>
    `;

  if (d.organitzacio)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">apartment</span>
        ${escapeHtml(d.organitzacio)}
      </p>
    `;

  if (d.telefonFix)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">call</span>
        ${d.telefonFix}
      </p>
    `;

  if (d.telefonMobil)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">smartphone</span>
        ${d.telefonMobil}
      </p>
    `;

  if (d.email)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">mail</span>
        ${d.email}
      </p>
    `;

  if (d.web)
    card.innerHTML += `
      <p class="item">
        <span class="material-icons">language</span>
        ${d.web}
      </p>
    `;
}


/* =========================================================
   VCARD (GOOGLE LENS SAFE)
========================================================= */

function buildVCard(d) {
  return toByteDataString([
    "BEGIN:VCARD",
    "VERSION:3.0",

    `N;CHARSET=UTF-8:${d.cognoms};${d.nom};;;`,
    d.organitzacio
      ? `ORG;CHARSET=UTF-8:${d.organitzacio}`
      : "",

    d.carrec
      ? `TITLE;CHARSET=UTF-8:${d.carrec}`
      : "",

    d.telefonFix
      ? `TEL;TYPE=WORK,VOICE:${d.telefonFix}`
      : "",

    d.telefonMobil
      ? `TEL;TYPE=CELL:${d.telefonMobil}`
      : "",

    d.email
      ? `EMAIL;TYPE=WORK:${d.email}`
      : "",

    d.web
      ? `URL;TYPE=WORK:${d.web}`
      : "",

    (d.carrer || d.ciutat || d.cp || d.pais)
      ? `ADR;CHARSET=UTF-8;TYPE=WORK:;;${d.carrer};${d.ciutat};;${d.cp};${d.pais}`
      : "",

    "END:VCARD"
  ]
    .filter(Boolean)
    .join("\n"));
}

function toByteDataString(str) {
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(str);
    let binaryStr = "";
    for (let i = 0; i < byteArray.length; i++) {
        binaryStr += String.fromCharCode(byteArray[i]);
    }
    return binaryStr;
}

/* =========================================================
   SANITIZATION & NORMALIZATION
========================================================= */

function sanitizeText(v = "") {
  return v
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePhone(v = "") {
  return v.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

function normalizeEmail(v = "") {
  const e = v.replace(/\s+/g, "").toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : "";
}

function normalizeWeb(v = "") {
  let url = v.trim();
  if (!url || /^javascript:/i.test(url)) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    new URL(url);
    return url;
  } catch {
    return "";
  }
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

