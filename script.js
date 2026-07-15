/* =========================================================
   ISTANBUL GAME CLUB — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNav();
  initSmoothHops();
  renderGames();
  renderEvents();
  initReveal();
  initHeroCanvas();
  initContactForm();
});

/* ---------- footer year ---------- */
function setYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- nav scroll state + mobile burger ---------- */
function initNav(){
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('navMobile');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', () => {
    const open = mobile.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.classList.toggle('is-open', open);
  });

  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- smooth scroll for in-page hops ---------- */
function initSmoothHops(){
  document.querySelectorAll('[data-hop]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - (navHeight - 10);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- data: games ---------- */
const GAMES = [
  { name: 'Bosphorus Intrigue', glyph: '🗺️', desc: 'A trading & negotiation epic set among rival merchant houses on the strait.', diff: 3, players: '3–6 players · 90 min', tag: 'Strategy' },
  { name: 'Grand Bazaar', glyph: '🏺', desc: 'Fast-paced bidding and bluffing over rare goods and reputations.', diff: 2, players: '2–5 players · 45 min', tag: 'Family' },
  { name: 'Siege of Embers', glyph: '🏰', desc: 'Cooperative fortress defense narrated as a live, branching campaign.', diff: 4, players: '2–4 players · 120 min', tag: 'Co-op' },
  { name: 'Whispers of the Court', glyph: '👑', desc: 'Hidden-role intrigue where every accusation reshapes the story.', diff: 3, players: '5–8 players · 60 min', tag: 'Social' },
  { name: 'Cartographer\'s Oath', glyph: '🧭', desc: 'Draft, draw, and race to chart the most coveted trade routes.', diff: 2, players: '1–4 players · 40 min', tag: 'Puzzle' },
  { name: 'Ashes of Constantinople', glyph: '⚔️', desc: 'A weighty legacy war-game campaign spanning multiple sessions.', diff: 5, players: '2–4 players · 180 min', tag: 'Legacy' },
];

function renderGames(){
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;
  grid.innerHTML = GAMES.map(g => `
    <article class="game-card" tabindex="0">
      <div class="game-card__inner">
        <div class="game-card__visual">
          <span class="game-card__glyph">${g.glyph}</span>
        </div>
        <div class="game-card__top">
          <h3 class="game-card__name">${g.name}</h3>
          <span class="game-card__players">${g.players}</span>
        </div>
        <p class="game-card__desc">${g.desc}</p>
        <div class="game-card__footer">
          <div class="diff" aria-label="Difficulty ${g.diff} of 5">
            <span class="diff__label">Difficulty</span>
            <span class="diff__pips">${pipRow(g.diff)}</span>
          </div>
          <span class="tag">${g.tag}</span>
        </div>
      </div>
    </article>
  `).join('');

  // stagger card reveal
  observeAll(grid.querySelectorAll('.game-card'));
}

function pipRow(active){
  let out = '';
  for (let i = 1; i <= 5; i++){
    out += `<span class="diff__pip${i <= active ? ' is-active' : ''}"></span>`;
  }
  return out;
}

/* ---------- data: events ---------- */
const EVENTS = [
  { name: 'Bosphorus Intrigue — Night Session', date: 'Fri, Jul 24', loc: 'Beyoğlu Lounge', seats: '4 left', price: '₺650' },
  { name: 'Siege of Embers — Campaign Ep. 2', date: 'Sat, Jul 25', loc: 'Karaköy Hall', seats: '2 left', price: '₺900' },
  { name: 'Grand Bazaar — Newcomer Table', date: 'Sun, Jul 26', loc: 'Beyoğlu Lounge', seats: '7 left', price: '₺500' },
  { name: 'Whispers of the Court', date: 'Thu, Jul 30', loc: 'Cihangir Study', seats: '6 left', price: '₺550' },
  { name: 'Ashes of Constantinople — Ep. 1', date: 'Sat, Aug 1', loc: 'Karaköy Hall', seats: '3 left', price: '₺950' },
];

function renderEvents(){
  const body = document.getElementById('eventsBody');
  if (!body) return;
  body.innerHTML = EVENTS.map(e => `
    <div class="events__row" role="row">
      <span class="events__game" role="cell">${e.name}</span>
      <span class="events__date" role="cell">${e.date}</span>
      <span class="events__loc" role="cell">${e.loc}</span>
      <span class="events__seats" role="cell">${e.seats}</span>
      <span class="events__price" role="cell">${e.price}</span>
      <span class="events__col-action" role="cell">
        <a href="#contact" class="btn btn--ghost btn--small" data-hop>Reserve</a>
      </span>
    </div>
  `).join('');

  body.querySelectorAll('[data-hop]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector('#contact');
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - (navHeight - 10);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- scroll reveal ---------- */
function initReveal(){
  observeAll(document.querySelectorAll('.reveal'));
}

function observeAll(nodes){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced){
    nodes.forEach(n => n.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  nodes.forEach(n => io.observe(n));
}

/* ---------- hero canvas: floating board-game pieces ---------- */
function initHeroCanvas(){
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, pieces, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makePieces(){
    const count = w < 700 ? 16 : 28;
    pieces = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 4 + Math.random() * 10,
      shape: Math.floor(Math.random() * 3), // 0 hex, 1 dot, 2 ring
      speedY: 0.08 + Math.random() * 0.18,
      drift: (Math.random() - 0.5) * 0.25,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.004,
      alpha: 0.12 + Math.random() * 0.28,
      color: Math.random() > 0.6 ? '67,232,201' : '212,175,55',
    }));
  }

  function drawHex(p){
    ctx.beginPath();
    for (let i = 0; i < 6; i++){
      const a = p.angle + (Math.PI / 3) * i;
      const px = p.x + p.r * Math.cos(a);
      const py = p.y + p.r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    pieces.forEach(p => {
      ctx.save();
      ctx.strokeStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.5})`;
      ctx.lineWidth = 1;

      if (p.shape === 0){
        drawHex(p);
        ctx.stroke();
      } else if (p.shape === 1){
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      p.y -= p.speedY;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y < -20){ p.y = h + 20; p.x = Math.random() * w; }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
    });
    if (!prefersReduced) requestAnimationFrame(tick);
  }

  resize();
  makePieces();
  tick();

  if (!prefersReduced){
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); makePieces(); }, 200);
    });
  }
}

/* ---------- contact form (client-side only demo submit) ---------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const label = document.getElementById('submitLabel');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      note.textContent = 'Please fill in every field before sending.';
      note.style.color = '#e85d5d';
      return;
    }
    label.textContent = 'Sending…';
    note.textContent = '';
    setTimeout(() => {
      label.textContent = 'Send Message';
      note.style.color = '';
      note.textContent = 'Message received — we\'ll be in touch within a day.';
      form.reset();
    }, 900);
  });
}
