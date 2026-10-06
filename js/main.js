// ========================================================
// VERV — UI INTERACTIONS
// Mobile navigation + smooth 3D campaign/product motion.
// ========================================================
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // ---------- Mobile navigation -----------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.navlinks .links');

  if (navToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-menu-open');
    };

    navToggle.addEventListener('click', () => {
      const open = !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-menu-open', open);
    });

    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMenu(); });
  }

  // ---------- Smooth 3D motion for the real-image study cards -----------
  if (!reduce && finePointer) {
    document.querySelectorAll('.sketch-product-card, .shop .card').forEach(card => {
      let tx = 0, ty = 0, x = 0, y = 0, raf = null;
      const image = card.querySelector('.mini-sketch img, .card-slide.is-active');

      const render = () => {
        x += (tx - x) * 0.075;
        y += (ty - y) * 0.075;
        card.style.setProperty('--tilt-x', `${(-y * 5.5).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 6.5).toFixed(2)}deg`);
        card.style.setProperty('--light-x', `${50 + x * 44}%`);
        card.style.setProperty('--light-y', `${50 + y * 44}%`);
        card.style.setProperty('--image-x', `${(-x * 7).toFixed(2)}px`);
        card.style.setProperty('--image-y', `${(-y * 7).toFixed(2)}px`);
        if (Math.abs(tx - x) > .001 || Math.abs(ty - y) > .001) raf = requestAnimationFrame(render);
        else raf = null;
      };

      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - .5) * 2;
        ty = ((e.clientY - r.top) / r.height - .5) * 2;
        if (!raf) raf = requestAnimationFrame(render);
      });

      card.addEventListener('pointerleave', () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(render);
      });
    });
  }
})();
