/* 眾智科技 CrowdMind — 互動效果 */
(() => {
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 年份 ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 導覽列 ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.getElementById('nav-links');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    const en = document.documentElement.lang === 'en';
    toggle.setAttribute('aria-label', open ? (en ? 'Close menu' : '關閉選單') : (en ? 'Open menu' : '開啟選單'));
    links.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- 捲動淡入 ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // 同一群組內的元素依序出現
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- PixelTrend 像素趨勢圖 ---------- */
  const trend = document.querySelector('.pixels--trend');
  if (trend) {
    const heights = [2, 3, 3, 4, 3, 5, 6, 5, 7, 8, 7, 9];
    const rows = 9;
    const frag = document.createDocumentFragment();
    for (let r = rows - 1; r >= 0; r--) {
      for (let c = 0; c < heights.length; c++) {
        const i = document.createElement('i');
        if (r < heights[c]) {
          i.className = r === heights[c] - 1 ? 'on' : 'on alt';
          i.style.animationDelay = `${(c * 0.15 + r * 0.05).toFixed(2)}s`;
        }
        frag.appendChild(i);
      }
    }
    trend.appendChild(frag);
  }

  /* ---------- Hero：千萬像素匯聚成「CrowdMind」 ---------- */
  const hero = document.querySelector('.hero');
  const canvas = document.querySelector('.hero__canvas');
  if (!hero || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const COLORS = ['255,255,255', '255,255,255', '255,255,255', '255,107,74', '47,196,178'];
  let W = 0, H = 0, dpr = 1, gap = 8, size = 4, baseAlpha = 0.5;
  let particles = [];
  const mouse = { x: -9999, y: -9999 };
  let running = true;
  let rafId = 0;

  function buildTargets() {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const o = off.getContext('2d');
    const wide = W > 900;
    const text = 'CrowdMind';
    o.fillStyle = '#fff';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    // 依目標寬度換算字級，讓文字低調地待在畫面一角
    const font = (px) => `700 ${px}px "Space Grotesk", system-ui, sans-serif`;
    o.font = font(100);
    const targetWidth = wide ? Math.min(W * 0.3, 520) : W * 0.62;
    const fontSize = (100 * targetWidth) / o.measureText(text).width;
    o.font = font(fontSize);
    const cx = wide ? W * 0.75 : W * 0.5;
    const cy = wide ? H * 0.56 : H - 120;
    o.fillText(text, cx, cy);

    const data = o.getImageData(0, 0, W, H).data;
    const targets = [];
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        if (data[(y * W + x) * 4 + 3] > 128) targets.push({ x, y });
      }
    }
    return targets;
  }

  function setup() {
    const rect = hero.getBoundingClientRect();
    W = Math.floor(rect.width);
    H = Math.floor(rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gap = W > 900 ? 5 : 4;
    size = Math.max(2, Math.round(gap * 0.6));
    baseAlpha = W > 900 ? 0.5 : 0.3;

    const targets = buildTargets();
    // 額外漂浮的像素，象徵尚未匯聚的「眾人」
    const floaters = Math.round((W * H) / 26000);
    const next = [];
    for (let i = 0; i < targets.length + floaters; i++) {
      const prev = particles[i];
      const t = targets[i];
      next.push({
        x: prev ? prev.x : Math.random() * W,
        y: prev ? prev.y : Math.random() * H,
        vx: 0, vy: 0,
        tx: t ? t.x : null,
        ty: t ? t.y : null,
        drift: Math.random() * Math.PI * 2,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        a: t ? baseAlpha * (0.55 + Math.random() * 0.45) : 0.12 + Math.random() * 0.2,
      });
    }
    particles = next;
  }

  function step(time) {
    ctx.clearRect(0, 0, W, H);
    const t = time * 0.001;
    for (const p of particles) {
      if (p.tx !== null) {
        // 彈簧拉回目標位置
        p.vx += (p.tx - p.x) * 0.03;
        p.vy += (p.ty - p.y) * 0.03;
      } else {
        // 漂浮像素緩慢游移
        p.vx += Math.cos(t * 0.4 + p.drift) * 0.02;
        p.vy += Math.sin(t * 0.3 + p.drift) * 0.02;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      // 滑鼠推開像素
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 12000) {
        const f = (12000 - d2) / 12000;
        const d = Math.sqrt(d2) || 1;
        p.vx += (dx / d) * f * 2.4;
        p.vy += (dy / d) * f * 2.4;
      }
      p.vx *= 0.86; p.vy *= 0.86;
      p.x += p.vx; p.y += p.vy;

      ctx.fillStyle = `rgba(${p.color},${p.a})`;
      ctx.fillRect(p.x, p.y, size, size);
    }
    if (running) rafId = requestAnimationFrame(step);
  }

  function drawStatic() {
    // 減少動態模式：直接畫出最終樣貌
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.fillStyle = `rgba(${p.color},${p.a})`;
      ctx.fillRect(p.tx ?? p.x, p.ty ?? p.y, size, size);
    }
  }

  function start() {
    setup();
    if (reduceMotion) { drawStatic(); return; }

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

    // 離開畫面時暫停動畫以節省效能
    new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && !running) { running = true; rafId = requestAnimationFrame(step); }
      if (!visible) { running = false; cancelAnimationFrame(rafId); }
    }).observe(hero);

    rafId = requestAnimationFrame(step);
  }

  let resizeTimer;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    // 行動裝置捲動時網址列伸縮只改變高度，忽略以避免重建
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { setup(); if (reduceMotion) drawStatic(); }, 200);
  });

  const fontReady = document.fonts && document.fonts.load
    ? Promise.race([
        document.fonts.load('700 100px "Space Grotesk"', 'CrowdMind'),
        new Promise((r) => setTimeout(r, 1500)),
      ])
    : Promise.resolve();
  fontReady.then(start, start);
})();
