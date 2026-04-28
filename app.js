/* ===== PURGE STORE — APP.JS ===== */
/* Play Store 2026 × Purge Tech */

'use strict';

// ── STATE ──────────────────────────────────────────────
const STORAGE_KEY = 'purge_store_v3';
let apps = [];
let selectedEmoji = '🚀';
let selectedColor = '#8b5cf6';
let currentTab = 'pour-vous';
let rankFilter = 'all';
let carouselIndex = 0;
let carouselTimer = null;

// ── CONSTANTS ──────────────────────────────────────────
const EMOJIS = [
  '🚀','🎮','🌐','🔧','📱','🎬','💬','⚡',
  '🎯','🔥','💎','🛡️','⚔️','👾','🤖','🧠',
  '🎵','📸','🗂️','🔐','🌍','🧩','💡','🎲',
  '💻','📝','🎨','🔑','⚙️','🌙','🦾','🕹️',
];

const COLORS = [
  '#8b5cf6','#a78bfa','#f43f5e','#10b981',
  '#3b82f6','#f59e0b','#ec4899','#06b6d4',
  '#84cc16','#f97316','#6366f1','#14b8a6',
  '#e11d48','#0ea5e9','#d946ef','#22d3ee',
];

const CAT_META = {
  outils: { label:'Outils',    emoji:'🔧', color:'#3b82f6',  bg:'#172554' },
  jeux:   { label:'Jeux',      emoji:'🎮', color:'#a78bfa',  bg:'#1e1b4b' },
  media:  { label:'Média',     emoji:'🎬', color:'#f43f5e',  bg:'#4c0519' },
  social: { label:'Social',    emoji:'💬', color:'#10b981',  bg:'#052e16' },
  prod:   { label:'Productiv.', emoji:'⚡', color:'#f59e0b', bg:'#451a03' },
  autre:  { label:'Autre',     emoji:'✨', color:'#ec4899',  bg:'#500724' },
};

const SAMPLE_APPS = [
  { id:'s1', name:'YouTube', desc:'Streaming vidéo mondial', url:'https://youtube.com', type:'web', cat:'media', icon:'🎬', color:'#f43f5e', rating:4.8, installs:'5M+', featured:true },
  { id:'s2', name:'GitHub', desc:'Code & collaboration dev', url:'https://github.com', type:'web', cat:'outils', icon:'💻', color:'#8b5cf6', rating:4.9, installs:'2M+' },
  { id:'s3', name:'Discord', desc:'Tchat communautés gamers', url:'https://discord.com', type:'web', cat:'social', icon:'💬', color:'#5865f2', rating:4.7, installs:'3M+' },
  { id:'s4', name:'Minecraft PE', desc:'Survie & créativité monde ouvert', url:'#', type:'apk', cat:'jeux', icon:'⛏️', color:'#22c55e', rating:4.6, installs:'10M+' },
  { id:'s5', name:'Notion', desc:'Notes, bases de données, prod', url:'https://notion.so', type:'web', cat:'prod', icon:'📝', color:'#f59e0b', rating:4.5, installs:'1M+' },
  { id:'s6', name:'VS Code Web', desc:'Éditeur de code dans le navigateur', url:'https://vscode.dev', type:'web', cat:'outils', icon:'🔧', color:'#3b82f6', rating:4.8, installs:'800K+' },
  { id:'s7', name:'Spotify', desc:'Musique & podcasts en streaming', url:'https://spotify.com', type:'web', cat:'media', icon:'🎵', color:'#1ed760', rating:4.7, installs:'4M+' },
  { id:'s8', name:'PPSSPP', desc:'Émulateur PSP haute qualité', url:'#', type:'apk', cat:'jeux', icon:'🕹️', color:'#f97316', rating:4.4, installs:'500K+' },
];

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  buildEmojiPicker();
  buildColorPicker();
  updateClock();
  setInterval(updateClock, 1000);
  renderAll();
  startCarouselTimer();
});

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    apps = saved ? JSON.parse(saved) : [...SAMPLE_APPS];
  } catch { apps = [...SAMPLE_APPS]; }
}

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); } catch {}
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const el = document.getElementById('statusTime');
  if (el) el.textContent = `${h}:${m}`;
}

// ── RENDER ALL ─────────────────────────────────────────
function renderAll() {
  renderHeroCarousel();
  renderRecommendList();
  renderRecentGrid();
  renderTopList();
  renderRankList();
  renderNewGrid();
  renderCatGrid();
}

// ── HERO CAROUSEL ──────────────────────────────────────
function renderHeroCarousel() {
  const el = document.getElementById('heroCarousel');
  const dotsEl = document.getElementById('carouselDots');
  if (!el || !dotsEl) return;

  const featured = apps.filter(a => a.featured || a.rating >= 4.7).slice(0, 5);
  if (!featured.length) featured.push(...apps.slice(0, 3));

  el.innerHTML = featured.map((a, i) => `
    <div class="hero-card animate-in" style="animation-delay:${i*0.08}s" onclick="openDetail('${a.id}')">
      <div class="hero-card-bg" style="background:linear-gradient(135deg,${a.color}33,${a.color}66)">
        <div class="hero-badge">${i === 0 ? 'À la une' : 'Recommandé'}</div>
        <span style="filter:drop-shadow(0 0 20px ${a.color}99)">${a.icon}</span>
      </div>
      <div class="hero-card-body">
        <div class="hero-app-icon" style="background:linear-gradient(135deg,${a.color}33,${a.color}55)">${a.icon}</div>
        <div class="hero-app-info">
          <div class="hero-app-name">${a.name}</div>
          <div class="hero-app-sub">${a.desc || ''}</div>
          <div class="hero-app-meta">
            <span class="rating-stars">★ ${a.rating || '—'}</span>
            <span class="age-badge">16</span>
            <span class="ads-label">${a.type === 'apk' ? 'Fichier APK' : 'Site web'}</span>
          </div>
        </div>
        <button class="hero-install-btn" onclick="event.stopPropagation(); openLink('${a.url}')">
          ${a.type === 'apk' ? 'Installer' : 'Ouvrir'}
        </button>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = featured.map((_, i) =>
    `<div class="dot${i === 0 ? ' active' : ''}" id="dot_${i}"></div>`
  ).join('');

  el.addEventListener('scroll', () => {
    const w = el.offsetWidth;
    const idx = Math.round(el.scrollLeft / w);
    if (idx !== carouselIndex) {
      carouselIndex = idx;
      updateDots(featured.length);
    }
  }, { passive: true });
}

function updateDots(total) {
  for (let i = 0; i < total; i++) {
    const d = document.getElementById(`dot_${i}`);
    if (d) d.classList.toggle('active', i === carouselIndex);
  }
}

function startCarouselTimer() {
  carouselTimer = setInterval(() => {
    const el = document.getElementById('heroCarousel');
    if (!el) return;
    const total = el.children.length;
    if (!total) return;
    const next = (carouselIndex + 1) % total;
    el.scrollTo({ left: next * el.offsetWidth, behavior: 'smooth' });
  }, 4000);
}

// ── RECOMMEND LIST ─────────────────────────────────────
function renderRecommendList() {
  const el = document.getElementById('recommendList');
  if (!el) return;
  const list = [...apps].sort(() => Math.random() - 0.5).slice(0, 8);
  el.innerHTML = list.map(a => `
    <div class="hlist-item" onclick="openDetail('${a.id}')">
      <div class="hlist-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">
        ${a.icon}
        <span class="type-dot ${a.type}">${a.type === 'apk' ? 'APK' : 'WEB'}</span>
      </div>
      <div class="hlist-name">${a.name}</div>
      <div class="hlist-rating">★ ${a.rating || '—'}</div>
    </div>
  `).join('');
}

// ── RECENT GRID ────────────────────────────────────────
function renderRecentGrid() {
  const el = document.getElementById('recentGrid');
  if (!el) return;
  const list = [...apps].reverse().slice(0, 6);
  if (!list.length) { el.innerHTML = '<div style="padding:20px;color:var(--text3);text-align:center;grid-column:1/-1;font-size:13px;">Aucune app récente</div>'; return; }
  el.innerHTML = list.map(a => `
    <div class="gs-item" onclick="openDetail('${a.id}')">
      <div class="gs-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
      <div class="gs-name">${a.name}</div>
      <div class="gs-rating">★ ${a.rating || '—'}</div>
    </div>
  `).join('');
}

// ── TOP LIST ────────────────────────────────────────────
function renderTopList() {
  const el = document.getElementById('topList');
  if (!el) return;
  const list = [...apps].sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0, 6);
  el.innerHTML = list.map((a, i) => {
    const numClass = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    return `
      <div class="tl-item" onclick="openDetail('${a.id}')">
        <div class="tl-num ${numClass}">${i+1}</div>
        <div class="tl-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
        <div class="tl-info">
          <div class="tl-name">${a.name}</div>
          <div class="tl-sub">
            <span class="tl-badge ${a.type}">${a.type==='apk'?'APK':'WEB'}</span>
            ★ ${a.rating||'—'} · ${a.installs||'—'}
          </div>
        </div>
        <button class="tl-action" onclick="event.stopPropagation(); openLink('${a.url}')">
          ${a.type==='apk'?'Installer':'Ouvrir'}
        </button>
      </div>
    `;
  }).join('');
}

// ── RANK LIST ──────────────────────────────────────────
function renderRankList() {
  const el = document.getElementById('rankList');
  if (!el) return;
  let list = [...apps].sort((a,b) => (b.rating||0)-(a.rating||0));
  if (rankFilter !== 'all') list = list.filter(a => a.type === rankFilter);
  if (!list.length) { el.innerHTML = '<div style="padding:40px;color:var(--text3);text-align:center;font-size:14px;">Aucune app ici.</div>'; return; }
  el.innerHTML = list.map((a, i) => {
    const numClass = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    return `
      <div class="tl-item" onclick="openDetail('${a.id}')">
        <div class="tl-num ${numClass}">${i+1}</div>
        <div class="tl-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
        <div class="tl-info">
          <div class="tl-name">${a.name}</div>
          <div class="tl-sub">
            <span class="tl-badge ${a.type}">${a.type==='apk'?'APK':'WEB'}</span>
            ★ ${a.rating||'—'} · ${a.installs||'—'}
          </div>
        </div>
        <button class="tl-action" onclick="event.stopPropagation(); openLink('${a.url}')">
          ${a.type==='apk'?'↓ Installer':'→ Ouvrir'}
        </button>
      </div>
    `;
  }).join('');
}

// ── NEW GRID FULL ──────────────────────────────────────
function renderNewGrid() {
  const el = document.getElementById('newGrid');
  if (!el) return;
  const list = [...apps].reverse();
  if (!list.length) { el.innerHTML = '<div style="padding:40px;color:var(--text3);text-align:center;grid-column:1/-1;">Ajoute ta première app !</div>'; return; }
  el.innerHTML = list.map(a => `
    <div class="gf-card animate-in" onclick="openDetail('${a.id}')">
      <span class="gf-type-badge ${a.type}">${a.type.toUpperCase()}</span>
      <div class="gf-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
      <div class="gf-name">${a.name}</div>
      <div class="gf-cat">${catLabel(a.cat)}</div>
      <div class="gf-footer">
        <span class="gf-rating">★ ${a.rating||'—'}</span>
        <button class="gf-btn" onclick="event.stopPropagation(); openLink('${a.url}')">
          ${a.type==='apk'?'Installer':'Ouvrir'}
        </button>
      </div>
    </div>
  `).join('');
}

// ── CAT GRID ───────────────────────────────────────────
function renderCatGrid() {
  const el = document.getElementById('catGrid');
  if (!el) return;
  el.innerHTML = Object.entries(CAT_META).map(([key, m]) => {
    const count = apps.filter(a => a.cat === key).length;
    return `
      <div class="cat-card animate-in" style="background:linear-gradient(135deg,${m.bg},${m.bg}88);border-color:${m.color}30"
           onclick="filterCatPage('${key}')">
        <span class="cat-card-emoji">${m.emoji}</span>
        <div class="cat-card-name" style="color:${m.color}">${m.label}</div>
        <div class="cat-card-count">${count} app${count!==1?'s':''}</div>
      </div>
    `;
  }).join('');
}

// ── TABS ───────────────────────────────────────────────
function setTab(el) {
  const tab = el.dataset.tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${tab}`);
  if (page) page.classList.add('active');

  currentTab = tab;
  updateTabIndicator(el);
}

function setTabByName(name) {
  const el = document.querySelector(`.tab[data-tab="${name}"]`);
  if (el) setTab(el);
}

function updateTabIndicator(activeTab) {
  const ind = document.getElementById('tabIndicator');
  if (!ind) return;
  const rect = activeTab.getBoundingClientRect();
  const parentRect = activeTab.parentElement.getBoundingClientRect();
  ind.style.left = (rect.left - parentRect.left + activeTab.parentElement.scrollLeft) + 'px';
  ind.style.width = rect.width + 'px';
}

// Run once on load
setTimeout(() => {
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) updateTabIndicator(activeTab);
}, 100);

// ── SEARCH ─────────────────────────────────────────────
function toggleSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  setTimeout(() => document.getElementById('searchInput')?.focus(), 300);
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

function onSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const el = document.getElementById('searchResults');
  if (!q) { el.innerHTML = ''; return; }
  const results = apps.filter(a =>
    a.name.toLowerCase().includes(q) ||
    (a.desc||'').toLowerCase().includes(q) ||
    (a.cat||'').toLowerCase().includes(q)
  );
  if (!results.length) {
    el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3);font-size:14px;">Aucun résultat pour "' + q + '"</div>';
    return;
  }
  el.innerHTML = results.map(a => `
    <div class="search-result-item" onclick="closeSearch(); openDetail('${a.id}')">
      <div class="sri-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
      <div class="sri-info">
        <div class="sri-name">${highlight(a.name, q)}</div>
        <div class="sri-sub">${catLabel(a.cat)} · ★ ${a.rating||'—'}</div>
      </div>
      <span class="sri-action">${a.type==='apk'?'APK':'WEB'}</span>
    </div>
  `).join('');
}

function highlight(text, q) {
  const idx = text.toLowerCase().indexOf(q);
  if (idx < 0) return text;
  return text.slice(0,idx) + `<span style="color:var(--p2);font-weight:700">${text.slice(idx,idx+q.length)}</span>` + text.slice(idx+q.length);
}

// ── RANK FILTER ────────────────────────────────────────
function filterRank(el, type) {
  rankFilter = type;
  document.querySelectorAll('#rankFilterChips .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderRankList();
}

// ── CAT FILTER from category page ─────────────────────
function filterCatPage(cat) {
  setTabByName('nouveautes');
  const el = document.getElementById('newGrid');
  if (!el) return;
  const list = apps.filter(a => a.cat === cat);
  const meta = CAT_META[cat];
  el.innerHTML = list.length
    ? list.map(a => `
        <div class="gf-card animate-in" onclick="openDetail('${a.id}')">
          <span class="gf-type-badge ${a.type}">${a.type.toUpperCase()}</span>
          <div class="gf-icon" style="background:linear-gradient(135deg,${a.color}44,${a.color}22)">${a.icon}</div>
          <div class="gf-name">${a.name}</div>
          <div class="gf-cat">${catLabel(a.cat)}</div>
          <div class="gf-footer">
            <span class="gf-rating">★ ${a.rating||'—'}</span>
            <button class="gf-btn" onclick="event.stopPropagation(); openLink('${a.url}')">
              ${a.type==='apk'?'Installer':'Ouvrir'}
            </button>
          </div>
        </div>
      `).join('')
    : `<div style="padding:40px;color:var(--text3);text-align:center;grid-column:1/-1;">Aucune app dans ${meta?.label||cat}</div>`;
}

// ── DETAIL MODAL ───────────────────────────────────────
function openDetail(id) {
  const app = apps.find(a => a.id === id);
  if (!app) return;
  const content = document.getElementById('detailContent');
  if (!content) return;

  content.innerHTML = `
    <div class="detail-hero" style="background:linear-gradient(135deg,${app.color}44,${app.color}22)">
      <span style="font-size:80px;filter:drop-shadow(0 0 20px ${app.color}88)">${app.icon}</span>
    </div>
    <div class="detail-app-row">
      <div class="detail-icon" style="background:linear-gradient(135deg,${app.color}44,${app.color}22)">${app.icon}</div>
      <div>
        <div class="detail-name">${app.name}</div>
        <div class="detail-cat">${catLabel(app.cat)} · ${app.type === 'apk' ? '📱 APK' : '🌐 Site web'}</div>
      </div>
    </div>
    <div class="detail-stats">
      <div class="dstat"><span class="dstat-val">${app.rating || '—'}</span><div class="dstat-key">★ Note</div></div>
      <div class="dstat"><span class="dstat-val">${app.installs || '—'}</span><div class="dstat-key">Installs</div></div>
      <div class="dstat"><span class="dstat-val">${app.type.toUpperCase()}</span><div class="dstat-key">Type</div></div>
    </div>
    <p class="detail-desc">${app.desc || 'Aucune description fournie.'}</p>
    <a class="detail-open-btn" href="${app.url}" target="_blank" rel="noopener"
       onclick="${app.url==='#'?`event.preventDefault();showToast('❌ Lien non défini')`:``}">
      ${app.type === 'apk' ? '⬇ Télécharger APK' : '→ Ouvrir le site'}
    </a>
    <button class="detail-delete" onclick="deleteApp('${app.id}')">🗑 Supprimer du store</button>
  `;

  document.getElementById('detailModal').classList.add('open');
}

function deleteApp(id) {
  apps = apps.filter(a => a.id !== id);
  saveData();
  closeAllModals();
  renderAll();
  showToast('🗑 App supprimée');
}

// ── ADD MODAL ──────────────────────────────────────────
function openAddModal() {
  document.getElementById('fName').value = '';
  document.getElementById('fDesc').value = '';
  document.getElementById('fUrl').value = '';
  document.getElementById('fType').value = 'web';
  document.getElementById('fCat').value = 'outils';
  selectedEmoji = '🚀';
  selectedColor = '#8b5cf6';
  buildEmojiPicker();
  buildColorPicker();
  document.getElementById('addModal').classList.add('open');
}

function closeModal() {
  closeAllModals();
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

// Close on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeAllModals();
});

function submitApp() {
  const name = document.getElementById('fName').value.trim();
  const desc = document.getElementById('fDesc').value.trim();
  const url  = document.getElementById('fUrl').value.trim();
  const type = document.getElementById('fType').value;
  const cat  = document.getElementById('fCat').value;

  if (!name) { showToast('⚠️ Donne un nom à ton app'); return; }
  if (!url)  { showToast('⚠️ Entre un lien valide');  return; }

  const newApp = {
    id: 'u' + Date.now(),
    name, desc, url, type, cat,
    icon: selectedEmoji,
    color: selectedColor,
    rating: parseFloat((4 + Math.random()).toFixed(1)),
    installs: Math.floor(Math.random() * 900 + 100) + '+',
  };

  apps.unshift(newApp);
  saveData();
  closeAllModals();
  renderAll();
  showToast(`✅ "${name}" ajouté au Purge Store !`);
  // Update notif badge
  const badge = document.getElementById('notifBadge');
  if (badge) {
    const current = parseInt(badge.textContent || '0');
    badge.textContent = current + 1;
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => badge.style.transform = '', 300);
  }
}

// ── EMOJI PICKER ───────────────────────────────────────
function buildEmojiPicker() {
  const el = document.getElementById('emojiPicker');
  if (!el) return;
  el.innerHTML = EMOJIS.map(e => `
    <button class="epick${e === selectedEmoji ? ' sel' : ''}" onclick="selectEmoji(this,'${e}')">${e}</button>
  `).join('');
}

function selectEmoji(btn, emoji) {
  selectedEmoji = emoji;
  document.querySelectorAll('.epick').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// ── COLOR PICKER ───────────────────────────────────────
function buildColorPicker() {
  const el = document.getElementById('colorPicker');
  if (!el) return;
  el.innerHTML = COLORS.map(c => `
    <button class="cpick${c === selectedColor ? ' sel' : ''}"
            style="background:${c}"
            onclick="selectColor(this,'${c}')"></button>
  `).join('');
}

function selectColor(btn, color) {
  selectedColor = color;
  document.querySelectorAll('.cpick').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// ── HELPERS ────────────────────────────────────────────
function catLabel(cat) {
  const meta = CAT_META[cat];
  return meta ? `${meta.emoji} ${meta.label}` : '✨ Autre';
}

function openLink(url) {
  if (!url || url === '#') { showToast('❌ Lien non disponible'); return; }
  window.open(url, '_blank', 'noopener');
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
