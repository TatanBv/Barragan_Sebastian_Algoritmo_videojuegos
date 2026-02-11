// =====================
// 1) Videojuegos a comparar
// =====================

const marcas = [
  "Minecraft",
  "Fortnite",
  "GTA V",
  "The Legend of Zelda: Breath of the Wild",
  "FIFA",
  "Call of Duty",
  "Among Us",
  "League of Legends",
  "God of War",
  "Red Dead Redemption 2"
];

// Segmentos (quién opina)
const segmentos = {
  "J": "Jugadores jóvenes",
  "A": "Jugadores adultos",
  "C": "Jugadores casuales",
  "H": "Jugadores hardcore"
};

// Contextos (qué significa “mejor”)
const contextos = {
  "P": "¿Qué videojuego es más POPULAR?",
  "D": "¿Qué videojuego es más DIVERTIDO?",
  "C": "¿Qué videojuego es más COMPETITIVO?",
  "I": "¿Qué videojuego tuvo más IMPACTO cultural?"
};

// =====================
// 2) Parámetros Elo
// =====================

const RATING_INICIAL = 1000;
const K = 32;

// =====================
// 3) Estado
// =====================

const STORAGE_KEY = "gamemash_state_v1";

function defaultState() {
  const buckets = {};
  for (const s of Object.keys(segmentos)) {
    for (const c of Object.keys(contextos)) {
      const key = `${s}__${c}`;
      buckets[key] = {};
      marcas.forEach(m => buckets[key][m] = RATING_INICIAL);
    }
  }
  return { buckets, votes: [] };
}

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// =====================
// 4) Elo
// =====================

function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function updateElo(bucket, a, b, winner) {
  const ra = bucket[a];
  const rb = bucket[b];

  const ea = expectedScore(ra, rb);
  const eb = expectedScore(rb, ra);

  bucket[a] = ra + K * ((winner === "A" ? 1 : 0) - ea);
  bucket[b] = rb + K * ((winner === "B" ? 1 : 0) - eb);
}

// =====================
// 5) Utilidades
// =====================

function randomPair() {
  const a = marcas[Math.floor(Math.random() * marcas.length)];
  let b = a;
  while (b === a) {
    b = marcas[Math.floor(Math.random() * marcas.length)];
  }
  return [a, b];
}

function bucketKey(s, c) {
  return `${s}__${c}`;
}

function topN(bucket, n = 10) {
  return Object.entries(bucket)
    .map(([marca, rating]) => ({ marca, rating }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, n);
}

// =====================
// 6) UI
// =====================

const segmentSelect = document.getElementById("segmentSelect");
const contextSelect = document.getElementById("contextSelect");
const questionEl = document.getElementById("question");
const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");
const topBox = document.getElementById("topBox");

let currentA, currentB;

function fillSelect(el, obj) {
  el.innerHTML = "";
  for (const k in obj) {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = obj[k];
    el.appendChild(opt);
  }
}

fillSelect(segmentSelect, segmentos);
fillSelect(contextSelect, contextos);

function newDuel() {
  [currentA, currentB] = randomPair();
  labelA.textContent = currentA;
  labelB.textContent = currentB;
  questionEl.textContent = contextos[contextSelect.value];
}

function vote(winner) {
  const key = bucketKey(segmentSelect.value, contextSelect.value);
  updateElo(state.buckets[key], currentA, currentB, winner);
  saveState();
  renderTop();
  newDuel();
}

function renderTop() {
  const key = bucketKey(segmentSelect.value, contextSelect.value);
  const rows = topN(state.buckets[key]);
  topBox.innerHTML = rows.map((r, i) => `
    <div class="toprow">
      <div><b>${i + 1}.</b> ${r.marca}</div>
      <div>${r.rating.toFixed(1)}</div>
    </div>
  `).join("");
}

document.getElementById("btnA").onclick = () => vote("A");
document.getElementById("btnB").onclick = () => vote("B");
document.getElementById("btnNewPair").onclick = newDuel;
document.getElementById("btnShowTop").onclick = renderTop;

newDuel();
renderTop();
