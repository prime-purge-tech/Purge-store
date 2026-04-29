/* ══════════════════════════════════════════════
   PURGE STORE — app.js
   Firebase Firestore + Émojis (tous les émojis Unicode)
   ══════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════
// FIREBASE CONFIG
// ══════════════════════════════════════════════
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCo5JSf4eCLdj6Vrp6v9NZSowbPZjlAhlM",
  authDomain:        "purge-store.firebaseapp.com",
  databaseURL:       "https://purge-store-default-rtdb.firebaseio.com",
  projectId:         "purge-store",
  storageBucket:     "purge-store.firebasestorage.app",
  messagingSenderId: "984329022364",
  appId:             "1:984329022364:web:bf9740b48c593b1f9af659",
  measurementId:     "G-96E08MVQSP"
};

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let db        = null;
let apps      = [];
let topFilter = 'all';
let reelIndex = 0;
let reelTimer = null;
let selEmoji  = '🚀';
let selColor  = '#8b5cf6';

// ══════════════════════════════════════════════
// TOUS LES ÉMOJIS (plus de 180 émojis)
// ══════════════════════════════════════════════
const ALL_EMOJIS = [
  // Smileys & Émotions
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾',
  // Animaux & Nature
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🐙','🦑','🦐','🦞','🐠','🐟','🐡','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🐈','🐓','🦃','🕊️','🐇','🐁','🐀','🐿️','🦔',
  // Nourriture & Boissons
  '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','☕','🍵','🧃','🥤','🧋','🧃','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾',
  // Activités & Sports
  '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','🤺','⛹️','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🎭','🎨','🎬','🎤','🎧','🎷','🎺','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🎰',
  // Voyages & Lieux
  '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','🛢️','⛽','🚨','🚥','🚦','🛑','🚧','⚓','⛵','🚤','🛶','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🚂','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚃','🚎','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🚚','🚛','🚜','🏎️','🏍️','🛵','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','🛢️','⛽','🚨','🚥','🚦','🛑','🚧','⚓','⛵','🚤','🛶','🚢',
  // Objets & Symboles
  '💋','💌','💘','💝','💖','💗','💓','💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💯','💢','💥','💫','💦','💨','🕳️','💣','💬','🗯️','💭','💤','💮','♨️','💈','🛗','🪦','💀','☠️','🕸️','🕷️','🦂','🦟','🦗','🦠','💐','🌸','💮','🏵️','🌹','🥀','🌺','🌻','🌼','🌷','⚘','🌱','🌲','🌳','🌴','🌵','🌾','🌿','☘️','🍀','🍁','🍂','🍃'
];

// ══════════════════════════════════════════════
// COLORS
// ══════════════════════════════════════════════
const COLORS = [
  '#8b5cf6','#a78bfa','#f43f5e','#10b981',
  '#3b82f6','#f59e0b','#ec4899','#06b6d4',
  '#84cc16','#f97316','#6366f1','#14b8a6',
  '#e11d48','#0ea5e9','#d946ef','#fbbf24'
];

// ══════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════
const CATS = {
  outils: { label:'Outils',        emoji:'🔧', color:'#3b82f6', bg:'#172554' },
  jeux:   { label:'Jeux',          emoji:'🎮', color:'#a78bfa', bg:'#1e1b4b' },
  media:  { label:'Média',         emoji:'🎬', color:'#f43f5e', bg:'#4c0519' },
  social: { label:'Social',        emoji:'💬', color:'#10b981', bg:'#052e16' },
  prod:   { label:'Productivité',  emoji:'⚡', color:'#f59e0b', bg:'#451a03' },
  autre:  { label:'Autre',         emoji:'✨', color:'#ec4899', bg:'#500724' },
};

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  startLoader();
  updateClock();
  setInterval(updateClock, 1000);
  buildColorGrid();
  buildEmojiGrid();
  initFirebase();
  setupModalClose();
});

function startLoader() {
  const fill = document.getElementById('loaderFill');
  if (!fill) return;
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 15, 80);
    fill.style.width = p + '%';
    if (p >= 80) clearInterval(iv);
  }, 120);
}

function finishLoader() {
  const fill = document.getElementById('loaderFill');
  if (fill) fill.style.width = '100%';
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
    const app = document.getElementById('app');
    app.style.display = 'flex';
    app.style.flexDirection = 'column';
    app.style.height = '100%';
    setTimeout(() => {
      const active = document.querySelector('.tab.active');
      if (active) moveCursor(active);
    }, 80);
  }, 350);
}

function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const n = new Date();
  el.textContent = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
}

// ══════════════════════════════════════════════
// FIREBASE
// ══════════════════════════════════════════════
function initFirebase() {
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    listenApps();
    setLive(true);
  } catch (e) {
    console.error('Firebase error:', e);
    toast('❌ Erreur Firebase : ' + e.message);
    setLive(false);
    finishLoader();
  }
}

function listenApps() {
  db.collection('apps')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => {
      apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAll();
      finishLoader();
    }, err => {
      console.error(err);
      setLive(false);
      toast('⚠️ Connexion perdue');
      finishLoader();
    });
}

function setLive(on) {
  const el = document.getElementById('liveDot');
  if (el) on ? el.classList.remove('off') : el.classList.add('off');
}

// ══════════════════════════════════════════════
// RENDER ALL
// ══════════════════════════════════════════════
function renderAll() {
  renderReel();
  renderHScroll();
  renderHomeTop();
  renderTopList();
  renderAllGrid();
  renderCatGrid();
}

// ══════════════════════════════════════════════
// REEL
// ══════════════════════════════════════════════
function renderReel() {
  const el     = document.getElementById('reel');
  const dotsEl = document.getElementById('reelDots');
  if (!el || !dotsEl) return;

  const newest = apps.slice(0, 6);

  if (!newest.length) {
    el.innerHTML = `<div class="empty" style="min-width:100%;padding:30px 20px">
      <div class="empty-ico">🆕</div>
      <div class="empty-t">Aucune app encore</div>
      <div class="empty-s">Sois le premier à publier !</div>
    </div>`;
    dotsEl.innerHTML = '';
    return;
  }

  el.innerHTML = newest.map((a, i) => `
    <div class="reel-card au" style="animation-delay:${i*.06}s" onclick="openDetail('${a.id}')">
      <div class="reel-bg" style="background:linear-gradient(135deg,${a.color||'#8b5cf6'}55,${a.color||'#8b5cf6'}22)">
        <span class="reel-badge">🆕 Nouveauté</span>
        <span class="reel-new-badge">Nouveau</span>
        <div class="reel-bg-icon" style="background:${a.color||'#8b5cf6'}44">
          <div class="reel-bg-icon-emoji">${a.icon||'🚀'}</div>
        </div>
      </div>
      <div class="reel-body">
        <div class="reel-ico" style="background:${a.color||'#8b5cf6'}33">${a.icon||'🚀'}</div>
        <div class="reel-info">
          <div class="reel-name">${a.name}</div>
          <div class="reel-sub">${a.desc||''}</div>
          <div class="reel-meta">
            <span class="stars">${starStr(a.rating)} ${a.rating>0?Number(a.rating).toFixed(1):'Nouveau'}</span>
            ${a.author?`<span style="font-size:10px;color:var(--t3)">· ${a.author}</span>`:''}
          </div>
        </div>
        <button class="reel-btn" onclick="event.stopPropagation();window.open('${a.url}','_blank','noopener')">Ouvrir</button>
      </div>
    </div>`).join('');

  dotsEl.innerHTML = newest.map((_, i) =>
    `<div class="rdot${i === 0 ? ' on' : ''}" id="rdot_${i}"></div>`
  ).join('');

  el.onscroll = () => {
    const idx = Math.round(el.scrollLeft / (el.offsetWidth || 1));
    if (idx !== reelIndex) {
      reelIndex = idx;
      newest.forEach((_, i) => {
        const d = document.getElementById(`rdot_${i}`);
        if (d) d.classList.toggle('on', i === idx);
      });
    }
  };

  if (reelTimer) clearInterval(reelTimer);
  reelTimer = setInterval(() => {
    const total = el.children.length;
    if (!total) return;
    const next = (reelIndex + 1) % total;
    el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
  }, 4000);
}

// ══════════════════════════════════════════════
// HSCROLL
// ══════════════════════════════════════════════
function renderHScroll() {
  const el = document.getElementById('hscroll');
  if (!el) return;
  if (!apps.length) { el.innerHTML = ''; return; }
  const list = [...apps].sort(() => Math.random() - .5).slice(0, 10);
  el.innerHTML = list.map(a => `
    <div class="hs-item" onclick="openDetail('${a.id}')">
      <div class="hs-ico" style="background:${a.color || '#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div class="hs-name">${a.name}</div>
      <div class="hs-stars">★ ${a.rating > 0 ? Number(a.rating).toFixed(1) : '—'}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// HOME TOP
// ══════════════════════════════════════════════
function renderHomeTop() {
  const el = document.getElementById('homeTop');
  if (!el) return;
  const sorted = [...apps].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  renderVList(el, sorted, true);
}

// ══════════════════════════════════════════════
// TOP LIST
// ══════════════════════════════════════════════
function renderTopList() {
  const el = document.getElementById('topList');
  if (!el) return;
  let list = [...apps].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (topFilter !== 'all') list = list.filter(a => a.cat === topFilter);
  if (!list.length) { el.innerHTML = emptyHTML('Aucune app ici'); return; }
  renderVList(el, list, true);
}

window.setTopF = function(btn, f) {
  topFilter = f;
  document.querySelectorAll('#topChips .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderTopList();
};

function renderVList(el, list, numbered) {
  el.innerHTML = list.map((a, i) => {
    const nc = numbered ? (i===0?'g':i===1?'s':i===2?'b':'') : '';
    return `
    <div class="vi au" style="animation-delay:${i*.05}s" onclick="openDetail('${a.id}')">
      ${numbered ? `<div class="vi-num ${nc}">${i+1}</div>` : ''}
      <div class="vi-ico" style="background:${a.color||'#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div class="vi-info">
        <div class="vi-name">${a.name}</div>
        <div class="vi-sub">
          <span class="pill p-web">WEB</span>
          ★ ${a.rating > 0 ? Number(a.rating).toFixed(1) : '—'} · ${a.votes||0} votes
        </div>
      </div>
      <button class="vi-act" onclick="event.stopPropagation();window.open('${a.url}','_blank','noopener')">Ouvrir</button>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════
// ALL GRID
// ══════════════════════════════════════════════
function renderAllGrid() {
  const el = document.getElementById('allGrid');
  if (!el) return;
  if (!apps.length) { el.innerHTML = emptyHTML('Aucune app publiée', 'Ajoute la première !'); return; }
  el.innerHTML = apps.map((a, i) => `
    <div class="ac au" style="animation-delay:${i*.04}s" onclick="openDetail('${a.id}')">
      <span class="ac-badge">WEB</span>
      <div class="ac-ico" style="background:${a.color||'#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div class="ac-name">${a.name}</div>
      <div class="ac-cat">${catLabel(a.cat)}</div>
      <div class="ac-foot">
        <span class="ac-stars">★ ${a.rating>0?Number(a.rating).toFixed(1):'—'}</span>
        <button class="ac-open" onclick="event.stopPropagation();window.open('${a.url}','_blank','noopener')">Ouvrir</button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// CAT GRID
// ══════════════════════════════════════════════
function renderCatGrid() {
  const el = document.getElementById('catGrid');
  if (!el) return;
  el.innerHTML = Object.entries(CATS).map(([k, m]) => {
    const count = apps.filter(a => a.cat === k).length;
    return `
    <div class="cc au" style="background:linear-gradient(135deg,${m.bg},${m.bg}88);border-color:${m.color}28"
         onclick="filterCat('${k}')">
      <span class="cc-emoji">${m.emoji}</span>
      <div class="cc-name" style="color:${m.color}">${m.label}</div>
      <div class="cc-count">${count} app${count!==1?'s':''}</div>
    </div>`;
  }).join('');
}

window.filterCat = function(cat) {
  goTabName('all');
  const el = document.getElementById('allGrid');
  if (!el) return;
  const list = apps.filter(a => a.cat === cat);
  if (!list.length) { el.innerHTML = emptyHTML('Aucune app dans cette catégorie'); return; }
  el.innerHTML = list.map((a, i) => `
    <div class="ac au" style="animation-delay:${i*.04}s" onclick="openDetail('${a.id}')">
      <span class="ac-badge">WEB</span>
      <div class="ac-ico" style="background:${a.color||'#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div class="ac-name">${a.name}</div>
      <div class="ac-cat">${catLabel(a.cat)}</div>
      <div class="ac-foot">
        <span class="ac-stars">★ ${a.rating>0?Number(a.rating).toFixed(1):'—'}</span>
        <button class="ac-open" onclick="event.stopPropagation();window.open('${a.url}','_blank','noopener')">Ouvrir</button>
      </div>
    </div>`).join('');
};

// ══════════════════════════════════════════════
// TABS
// ══════════════════════════════════════════════
window.goTab = function(el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + el.dataset.pg);
  if (pg) pg.classList.add('active');
  moveCursor(el);
};

window.goTabName = function(name) {
  const el = document.querySelector(`.tab[data-pg="${name}"]`);
  if (el) goTab(el);
};

function moveCursor(activeEl) {
  const cur = document.getElementById('tabCur');
  if (!cur) return;
  const parent = activeEl.parentElement;
  const pR = parent.getBoundingClientRect();
  const eR = activeEl.getBoundingClientRect();
  cur.style.left  = (eR.left - pR.left + parent.scrollLeft) + 'px';
  cur.style.width = eR.width + 'px';
}

// ══════════════════════════════════════════════
// SEARCH
// ══════════════════════════════════════════════
window.openSearch = function() {
  document.getElementById('searchOv').classList.add('open');
  setTimeout(() => document.getElementById('searchIn')?.focus(), 300);
};
window.closeSearch = function() {
  document.getElementById('searchOv').classList.remove('open');
  document.getElementById('searchIn').value = '';
  document.getElementById('searchRes').innerHTML = '';
};
window.doSearch = function() {
  const q  = document.getElementById('searchIn').value.toLowerCase().trim();
  const el = document.getElementById('searchRes');
  if (!q) { el.innerHTML = ''; return; }
  const res = apps.filter(a =>
    (a.name||'').toLowerCase().includes(q) ||
    (a.desc||'').toLowerCase().includes(q) ||
    (a.cat||'').toLowerCase().includes(q)
  );
  if (!res.length) {
    el.innerHTML = `<div class="empty"><div class="empty-ico">🔍</div><div class="empty-t">Aucun résultat</div><div class="empty-s">pour "${q}"</div></div>`;
    return;
  }
  el.innerHTML = res.map(a => `
    <div class="sr" onclick="closeSearch();openDetail('${a.id}')">
      <div class="sr-ico" style="background:${a.color||'#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div class="sr-info">
        <div class="sr-name">${hl(a.name, q)}</div>
        <div class="sr-sub">${catLabel(a.cat)} · ★ ${a.rating>0?Number(a.rating).toFixed(1):'—'}</div>
      </div>
      <span class="sr-chip">WEB</span>
    </div>`).join('');
};

function hl(text, q) {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return text.slice(0,i) + `<span style="color:var(--p2);font-weight:700">${text.slice(i,i+q.length)}</span>` + text.slice(i+q.length);
}

// ══════════════════════════════════════════════
// ADD MODAL
// ══════════════════════════════════════════════
window.openAdd = function() {
  document.getElementById('fName').value   = '';
  document.getElementById('fDesc').value   = '';
  document.getElementById('fUrl').value    = '';
  document.getElementById('fCat').value    = 'outils';
  document.getElementById('fAuthor').value = localStorage.getItem('purge_pseudo') || '';
  document.getElementById('emojiSearch').value = '';
  selEmoji = '🚀';
  selColor = '#8b5cf6';
  buildEmojiGrid();
  buildColorGrid();
  document.getElementById('addModal').classList.add('open');
};

window.closeAdd = function() {
  document.getElementById('addModal').classList.remove('open');
};

// ══════════════════════════════════════════════
// EMOJI GRID (TOUS LES EMOJIS)
// ══════════════════════════════════════════════
function buildEmojiGrid() {
  const el = document.getElementById('emojiGrid');
  if (!el) return;
  const searchTerm = document.getElementById('emojiSearch')?.value.toLowerCase() || '';
  
  let filteredEmojis = ALL_EMOJIS;
  if (searchTerm) {
    filteredEmojis = ALL_EMOJIS.filter(emoji => {
      const emojiName = getEmojiName(emoji);
      return emojiName.includes(searchTerm);
    });
  }
  
  el.innerHTML = filteredEmojis.map(e =>
    `<button class="em${e===selEmoji?' on':''}" onclick="pickEmoji(this,'${e}')">${e}</button>`
  ).join('');
}

window.filterEmojis = function() {
  buildEmojiGrid();
};

window.pickEmoji = function(btn, e) {
  selEmoji = e;
  document.querySelectorAll('.em').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
};

function getEmojiName(emoji) {
  const names = {
    '🚀': 'rocket fusee', '😀': 'sourire', '❤️': 'coeur heart', '🔥': 'feu fire',
    '💀': 'skull mort', '🎮': 'jeux game', '🎬': 'film cinema', '💬': 'chat message',
    '🔧': 'outils tools', '⚡': 'eclair lightning', '✨': 'etoile star', '🎵': 'musique music',
    '📱': 'telephone phone', '💻': 'ordinateur computer', '🌍': 'monde world',
    '⭐': 'star etoile', '💎': 'diamant', '🎨': 'art peinture', '🏆': 'trophee'
  };
  return names[emoji] || emoji;
}

// ══════════════════════════════════════════════
// PUBLISH APP
// ══════════════════════════════════════════════
window.publishApp = async function() {
  const name   = document.getElementById('fName').value.trim();
  const desc   = document.getElementById('fDesc').value.trim();
  const url    = document.getElementById('fUrl').value.trim();
  const cat    = document.getElementById('fCat').value;
  const author = document.getElementById('fAuthor').value.trim() || 'Anonyme';

  if (!name) { toast('⚠️ Donne un nom à l\'app'); return; }
  if (!url)  { toast('⚠️ Entre un lien valide'); return; }
  if (!url.startsWith('http')) { toast('⚠️ Le lien doit commencer par https://'); return; }

  const btn = document.getElementById('pubBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Publication…';

  try {
    const newApp = {
      name, desc, url, cat, author,
      icon:      selEmoji,
      color:     selColor,
      rating:    0,
      ratingSum: 0,
      votes:     0,
      comments:  [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('apps').add(newApp);
    localStorage.setItem('purge_pseudo', author);
    closeAdd();
    toast(`✅ "${name}" publié pour tout le monde !`);
  } catch (err) {
    console.error(err);
    toast('❌ Erreur : ' + err.message);
  } finally {
    btn.disabled    = false;
    btn.textContent = '🚀 Publier';
  }
};

// ══════════════════════════════════════════════
// DETAIL MODAL
// ══════════════════════════════════════════════
window.openDetail = function(id) {
  const a = apps.find(x => x.id === id);
  if (!a) return;

  const comments = a.comments || [];
  const userStar = getUserRating(id);

  document.getElementById('detailBody').innerHTML = `
    <div class="d-hero" style="background:${a.color||'#8b5cf6'}22">
      <div class="d-hero-blur" style="background:${a.color||'#8b5cf6'}44"></div>
      <div class="d-hero-icon" style="background:${a.color||'#8b5cf6'}44">
        ${a.icon||'🚀'}
      </div>
    </div>

    <div class="d-top">
      <div class="d-ico" style="background:${a.color||'#8b5cf6'}33">
        ${a.icon||'🚀'}
      </div>
      <div>
        <div class="d-name">${a.name}</div>
        <div class="d-meta">${catLabel(a.cat)} · 🌐 Site web</div>
      </div>
    </div>

    <div class="d-stats">
      <div class="ds"><span class="ds-v">${a.rating>0?Number(a.rating).toFixed(1):'—'}</span><div class="ds-k">Note</div></div>
      <div class="ds"><span class="ds-v">${a.votes||0}</span><div class="ds-k">Votes</div></div>
      <div class="ds"><span class="ds-v">${comments.length}</span><div class="ds-k">Avis</div></div>
    </div>

    <p class="d-desc">${a.desc || 'Aucune description.'}</p>
    <p class="d-author">👤 <strong>${a.author||'Anonyme'}</strong></p>

    <div class="rate-lbl">⭐ Note cette app</div>
    <div class="star-row">
      ${[1,2,3,4,5].map(n =>
        `<button class="star-btn${userStar>=n?' lit':''}" id="star_${n}" onclick="rateApp('${id}',${n})">★</button>`
      ).join('')}
    </div>

    <div class="cmts-lbl">💬 Avis (${comments.length})</div>
    <div id="cmtList">
      ${comments.length
        ? comments.map(c => cmtHTML(c)).join('')
        : `<div class="empty" style="padding:16px"><div class="empty-ico" style="font-size:26px">💭</div><div class="empty-s">Aucun avis. Sois le premier !</div></div>`}
    </div>
    <div class="cmt-add">
      <input id="cmtInput" placeholder="Écrire un avis…" onkeydown="if(event.key==='Enter')postComment('${id}')">
      <button onclick="postComment('${id}')">Envoyer</button>
    </div>

    <a class="d-open" href="${a.url}" target="_blank" rel="noopener">→ Ouvrir le site</a>
    <button class="d-del" onclick="deleteApp('${id}')">🗑 Supprimer</button>
  `;

  document.getElementById('detailModal').classList.add('open');
};

function cmtHTML(c) {
  return `<div class="cmt">
    <div class="cmt-top">
      <span class="cmt-author">${c.author||'Anonyme'}</span>
      <span class="cmt-stars">${'★'.repeat(c.stars||0)}${'☆'.repeat(5-(c.stars||0))}</span>
    </div>
    <div class="cmt-txt">${c.text||''}</div>
  </div>`;
}

// STAR RATING
function getUserRating(appId) {
  try { return JSON.parse(localStorage.getItem('purge_ratings')||'{}')[appId] || 0; }
  catch { return 0; }
}

window.rateApp = async function(id, stars) {
  for (let i=1;i<=5;i++) {
    const s = document.getElementById(`star_${i}`);
    if (s) s.classList.toggle('lit', i<=stars);
  }
  const prev   = getUserRating(id);
  const ratings = JSON.parse(localStorage.getItem('purge_ratings')||'{}');
  ratings[id]  = stars;
  localStorage.setItem('purge_ratings', JSON.stringify(ratings));

  try {
    const a        = apps.find(x => x.id === id);
    const prevSum  = a.ratingSum || 0;
    const prevVotes= a.votes     || 0;
    const newSum   = prevSum - (prev||0) + stars;
    const newVotes = prev ? prevVotes : prevVotes + 1;
    const newRating= newVotes > 0 ? Math.round(newSum/newVotes*10)/10 : 0;

    await db.collection('apps').doc(id).update({
      ratingSum: newSum,
      votes:     newVotes,
      rating:    newRating,
    });
    toast(`⭐ Note ${stars}/5 enregistrée !`);
  } catch(e) { toast('❌ Erreur note : '+e.message); }
};

// COMMENTS
window.postComment = async function(id) {
  const input = document.getElementById('cmtInput');
  const text  = input?.value.trim();
  if (!text) return;
  const pseudo = localStorage.getItem('purge_pseudo') || 'Anonyme';
  const stars  = getUserRating(id);
  const cmt    = { author: pseudo, text, stars, date: new Date().toLocaleDateString('fr') };

  try {
    await db.collection('apps').doc(id).update({
      comments: firebase.firestore.FieldValue.arrayUnion(cmt),
    });
    if (input) input.value = '';
    toast('💬 Avis publié !');
    const a = apps.find(x => x.id === id);
    if (a) {
      a.comments = [...(a.comments||[]), cmt];
      const list = document.getElementById('cmtList');
      if (list) list.innerHTML = a.comments.map(c => cmtHTML(c)).join('');
    }
  } catch(e) { toast('❌ Erreur : '+e.message); }
};

// DELETE
window.deleteApp = async function(id) {
  if (!confirm('Supprimer cette app ?')) return;
  try {
    await db.collection('apps').doc(id).delete();
    document.getElementById('detailModal').classList.remove('open');
    toast('🗑 App supprimée');
  } catch(e) { toast('❌ '+e.message); }
};

// ══════════════════════════════════════════════
// COLOR GRID
// ══════════════════════════════════════════════
function buildColorGrid() {
  const el = document.getElementById('colorGrid');
  if (!el) return;
  el.innerHTML = COLORS.map(c =>
    `<button class="cp${c===selColor?' on':''}" style="background:${c}" onclick="pickColor(this,'${c}')"></button>`
  ).join('');
}
window.pickColor = function(btn, c) {
  selColor = c;
  document.querySelectorAll('.cp').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
};

// ══════════════════════════════════════════════
// MODAL CLOSE
// ══════════════════════════════════════════════
function setupModalClose() {
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });
}

// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════
function catLabel(cat) {
  return CATS[cat] ? `${CATS[cat].emoji} ${CATS[cat].label}` : '✨ Autre';
}
function starStr(r) {
  if (!r || r === 0) return '☆☆☆☆☆';
  const f = Math.round(r);
  return '★'.repeat(f) + '☆'.repeat(5-f);
}
function emptyHTML(t, s='Ajoute la première !') {
  return `<div class="empty" style="grid-column:1/-1"><div class="empty-ico">💀</div><div class="empty-t">${t}</div><div class="empty-s">${s}</div></div>`;
}

let toastTm = null;
window.toast = function(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTm);
  toastTm = setTimeout(() => el.classList.remove('on'), 2800);
};