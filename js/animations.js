// ==========================================================
// VERV — ANIMATIONS
// Scroll-reveal + subtle hero parallax.
// Everything here respects prefers-reduced-motion and bails
// out entirely rather than running a "reduced" version.
// ==========================================================

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll reveal ----------------------------------------------------
  let revealObserver;
  function observeReveals() {
    if (reduced) return; // CSS already forces opacity:1 in this case
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealObserver.unobserve(en.target);
          }
        });
      }, { threshold: 0.15 });
    }
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
  }
  window.VERV_observeReveals = observeReveals;

  document.addEventListener('DOMContentLoaded', observeReveals);

  if (reduced) return; // skip all parallax wiring below

  // ---- Hero parallax: desktop mouse move ---------------------------------
  const hero = document.querySelector('.hero');
  if (hero) {
    const layers = [
      { el: hero.querySelector('.archway'), strength: 10 },
      { el: hero.querySelector('.lightwall'), strength: -6 },
      { el: hero.querySelector('.hero-photo'), strength: 4 },
    ].filter((l) => l.el);

    let raf = null;
    let targetX = 0, targetY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!raf) raf = requestAnimationFrame(applyParallax);
    });
    hero.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
      if (!raf) raf = requestAnimationFrame(applyParallax);
    });

    function applyParallax() {
      layers.forEach(({ el, strength }) => {
        el.style.transform = `translate3d(${targetX * strength}px, ${targetY * strength * 0.6}px, 0)`;
      });
      raf = null;
    }

    // ---- Mobile: subtle scroll-based movement instead of mouse ----------
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        layers.forEach(({ el, strength }) => {
          el.style.transform = `translate3d(0, ${y * strength * 0.02}px, 0)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();

// ---- Hero sketch cycle --------------------------------------------------
(function setupSketchCycle(){
  const items = [...document.querySelectorAll('.sketch-item')];
  const number = document.querySelector('.sketch-number strong');
  if (!items.length) return;
  let index = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(next){
    items[index].classList.remove('is-active');
    index = next % items.length;
    items[index].classList.add('is-active');
    if (number) number.textContent = String(index + 1).padStart(2,'0');
    items[index].querySelectorAll('.sketch-lines,.sketch-accent').forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }
  if (reduced) return;
  let timer = setInterval(() => show(index + 1), 3600);
  const stage = document.querySelector('.sketch-stage');
  stage?.addEventListener('pointerenter', () => clearInterval(timer));
  stage?.addEventListener('pointerleave', () => { timer = setInterval(() => show(index + 1), 3600); });
})();

// ---- Campaign card 3D tilt ----------------------------------------------
(function setupCampaignTilt(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cshot').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (window.innerWidth <= 760) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        const base = card.classList.contains('cshot--2') ? -18 : 8;
        card.style.transform = `perspective(1000px) translate3d(0,${base - Math.abs(x)*5}px,28px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*7).toFixed(2)}deg) scale(1.035)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  });
})();


// ==========================================================
// VERV — SKETCH CARD 3D INTERACTION
// Smooth cursor-following depth + moving light, with touch-safe fallback.
// ==========================================================
(function setupSketchCardMotion(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduced || !finePointer) return;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sketch-product-card').forEach((card) => {
      let raf = null;
      let tx = 0, ty = 0, x = 0, y = 0;
      const render = () => {
        x += (tx - x) * 0.085;
        y += (ty - y) * 0.085;
        card.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
        card.style.setProperty('--light-x', `${50 + x * 42}%`);
        card.style.setProperty('--light-y', `${50 + y * 42}%`);
        if (Math.abs(tx-x) > .001 || Math.abs(ty-y) > .001) raf = requestAnimationFrame(render);
        else raf = null;
      };
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        tx = ((e.clientX-r.left)/r.width-.5)*2;
        ty = ((e.clientY-r.top)/r.height-.5)*2;
        if (!raf) raf = requestAnimationFrame(render);
      });
      card.addEventListener('pointerleave', () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(render);
      });
    });
  });
})();

// Slow breathing motion for the shop: the product cards feel alive without
// becoming distracting, and the effect respects reduced-motion preferences.
(function setupShopBreathing(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.shop .card').forEach((card, i) => {
      card.style.setProperty('--breath-delay', `${i * -1.2}s`);
    });
  });
})();
