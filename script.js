// =========================================================
// SPORE / MOTE PARTICLES (canvas)
// =========================================================
(function spores(){
  const canvas = document.getElementById('spores');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles(){
    const count = Math.min(70, Math.floor((w * h) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.25 + 0.05,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function tick(){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#8fe0f2';
    for(const p of particles){
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += Math.sin(p.y * 0.01) * p.drift * 0.1;
      if(p.y < -10){
        p.y = h + 10;
        p.x = Math.random() * w;
      }
    }
    ctx.globalAlpha = 1;
    if(!prefersReduced) requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if(prefersReduced){
    tick(); // draw one static frame only
  } else {
    requestAnimationFrame(tick);
  }
})();

// =========================================================
// NAV: scrolled state + mobile toggle
// =========================================================
(function nav(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  function onScroll(){
    if(window.scrollY > 40){
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// =========================================================
// HP MASK PROGRESS (lights up as you scroll through the page)
// =========================================================
(function hpMasks(){
  const masks = document.querySelectorAll('.hp-track .mask-icon');
  if(!masks.length) return;

  function update(){
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    const lit = Math.min(masks.length, Math.ceil(progress * masks.length));
    masks.forEach((m, i) => m.classList.toggle('lit', i < lit));
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// =========================================================
// CONTACT FORM (front-end only demo submission)
// =========================================================
(function bench(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.rest-btn span');
    const original = btn.textContent;
    btn.textContent = 'resting...';

    // Placeholder behaviour — wire this up to your own backend/email service.
    setTimeout(() => {
      btn.textContent = original;
      status.textContent = 'Message received. I\u2019ll answer the call soon.';
      form.reset();
    }, 700);
  });
})();