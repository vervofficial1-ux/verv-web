// ==========================================================
// VERV — PRODUCTS RENDERING
// Homepage product cards support a smooth Instagram-style image
// carousel with touch/swipe, arrows and dots when a product has
// more than one image. The dedicated product page keeps its
// existing gallery behaviour.
// ==========================================================

(function () {
  function escapeAttr(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function specialRequestsMarkup() {
    return `
      <div class="special-request-box" data-special-requests>
        <div class="special-request-head"><span data-i18n="SPECIAL">SPECIAL REQUESTS</span><small data-i18n="OPTIONAL">OPTIONAL ADD-ONS</small></div>
        <label class="special-check"><input type="checkbox" data-special="name"><span data-i18n="ADDNAME">ADD NAME</span><strong><b>+100</b><small>EGP / PC</small></strong></label>
        <div class="special-extra" data-extra="name"><input type="text" data-special-input="name" maxlength="30" placeholder="Name to print"></div>
        <label class="special-check"><input type="checkbox" data-special="text"><span data-i18n="CUSTOMTEXT">CUSTOM TEXT</span><strong><b>+75</b><small>EGP / PC</small></strong></label>
        <div class="special-extra" data-extra="text"><input type="text" data-special-input="text" maxlength="60" placeholder="Text to print"></div>
        <label class="special-check"><input type="checkbox" data-special="logo"><span data-i18n="CUSTOMLOGO">CUSTOM LOGO</span><strong><b>+200</b><small>EGP / PC</small></strong></label>
        <div class="special-extra" data-extra="logo"><input type="text" data-special-input="logo" maxlength="60" placeholder="Logo / brand name"></div>
      </div>`;
  }

  function getSpecialRequests(scope) {
    const result = [];
    if (!scope) return result;
    scope.querySelectorAll('[data-special]').forEach((check) => {
      if (!check.checked) return;
      const key = check.dataset.special;
      const cfg = window.VERV_CONFIG?.SPECIAL_REQUESTS?.[key] || {};
      const value = scope.querySelector(`[data-special-input="${key}"]`)?.value?.trim() || '';
      let detail = value;
      if (detail) result.push(`${cfg.label || key}: ${detail} (+${cfg.price || 0} EGP / PC)`);
      else result.push(`${cfg.label || key} (+${cfg.price || 0} EGP / PC)`);
    });
    return result;
  }

  function setupSpecialRequests(scope) {
    scope?.querySelectorAll('[data-special]').forEach((check) => {
      const key = check.dataset.special;
      const extra = scope.querySelector(`[data-extra="${key}"]`);
      const sync = () => extra?.classList.toggle('open', check.checked);
      check.addEventListener('change', sync);
      sync();
    });
  }

  function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const products = window.VERV_PRODUCTS || [];

    grid.innerHTML = products.map((p) => {
      const imgs = (p.images || []).filter(Boolean);
      const first = imgs[0] || '';
      const hasMultiple = imgs.length > 1;
      const dots = hasMultiple
        ? `<div class="card-dots" aria-label="Product images">${imgs.map((_, i) => `<button class="card-dot ${i === 0 ? 'active' : ''}" type="button" data-index="${i}" aria-label="View image ${i + 1}"></button>`).join('')}</div>`
        : '';

      return `
      <article class="card reveal" data-product-id="${escapeAttr(p.id)}" data-image-count="${imgs.length}">
        <div class="card-media-wrap">
          <a class="card-media" href="product.html?slug=${encodeURIComponent(p.slug)}" aria-label="View ${escapeAttr(p.name)}">
            <div class="card-media-track">
              ${imgs.map((src, i) => `<img class="card-slide ${i === 0 ? 'is-active' : ''}" src="${escapeAttr(src)}" alt="${escapeAttr(p.name)} — image ${i + 1}" loading="lazy" width="600" height="750">`).join('')}
            </div>
            ${hasMultiple ? `
              <button class="card-arrow card-arrow-prev" type="button" aria-label="Previous image">‹</button>
              <button class="card-arrow card-arrow-next" type="button" aria-label="Next image">›</button>
              <span class="card-image-count">${imgs.length} PHOTOS</span>
            ` : ''}
            <span class="card-shine"></span>
          </a>
          ${dots}
        </div>
        <div class="card-body">
          <div class="card-kicker">${escapeAttr(p.category || 'VERV')}</div>
          <h3><a href="product.html?slug=${encodeURIComponent(p.slug)}">${escapeAttr(p.name)}</a></h3>
          <div class="price">${escapeAttr(p.price)} ${escapeAttr(window.VERV_CONFIG.CURRENCY)}</div>
          <div class="desc">${escapeAttr(p.shortDescription || '')}</div>
        </div>
        <button class="addbtn whatsapp-order" type="button" data-product-id="${escapeAttr(p.id)}" ${p.available === false ? 'disabled' : ''}>
          ${p.available === false ? 'SOLD OUT' : 'ORDER VIA WHATSAPP'}
        </button>
      </article>`;
    }).join('');

    setupCardCarousels();
    setupWhatsAppOrders();
    if (window.VERV_observeReveals) window.VERV_observeReveals();
  }

  function setupCardCarousels() {
    document.querySelectorAll('.card[data-image-count]').forEach((card) => {
      const count = Number(card.dataset.imageCount || 0);
      if (count < 2) return;

      let index = 0;
      let startX = 0;
      let deltaX = 0;
      let dragging = false;
      const slides = [...card.querySelectorAll('.card-slide')];
      const dots = [...card.querySelectorAll('.card-dot')];
      const track = card.querySelector('.card-media-track');

      const go = (next) => {
        index = (next + count) % count;
        track.style.transform = `translate3d(${-index * 100}%,0,0)`;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      };

      card.querySelector('.card-arrow-prev')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(index - 1); });
      card.querySelector('.card-arrow-next')?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(index + 1); });
      dots.forEach((dot) => dot.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); go(Number(dot.dataset.index)); }));

      card.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; startX = e.clientX; deltaX = 0;
        card.classList.add('is-dragging');
        card.setPointerCapture?.(e.pointerId);
      });
      card.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        deltaX = e.clientX - startX;
        const progress = (deltaX / card.clientWidth) * 100;
        track.style.transform = `translate3d(calc(${-index * 100}% + ${progress}px),0,0)`;
      });
      const endDrag = () => {
        if (!dragging) return;
        dragging = false; card.classList.remove('is-dragging');
        if (Math.abs(deltaX) > 42) go(index + (deltaX < 0 ? 1 : -1)); else go(index);
      };
      card.addEventListener('pointerup', endDrag);
      card.addEventListener('pointercancel', endDrag);
      card.addEventListener('pointerleave', () => { if (dragging) endDrag(); });
    });
  }

  function makeWhatsAppUrl(product) {
    return { product, color:(product.colors||[])[0]||'', size:(product.sizes||[])[0]||'', quantity:1, specials:[] };
  }

  function setupWhatsAppOrders() {
    document.querySelectorAll('.whatsapp-order[data-product-id]').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const product = (window.VERV_PRODUCTS || []).find((p) => p.id === button.dataset.productId);
        if (!product || product.available === false) return;
        window.VERV_CHECKOUT?.start(makeWhatsAppUrl(product));
      });
    });
  }

  function getQueryParam(name) { return new URLSearchParams(window.location.search).get(name); }

  function renderProductPage() {
    const root = document.getElementById('productDetail');
    if (!root) return;
    const slug = getQueryParam('slug');
    const product = (window.VERV_PRODUCTS || []).find((p) => p.slug === slug);
    if (!product) { root.innerHTML = '<p class="empty">Product not found. <a href="index.html#shop" style="color:var(--accent)">Back to shop</a></p>'; return; }

    document.title = `${product.name} — ${window.VERV_CONFIG.BRAND_NAME}`;
    const imgs = product.images || [];
    const colors = product.colors || [];
    const sizes = product.sizes || [];

    root.innerHTML = `
      <div class="product-layout">
        <div>
          <div class="product-gallery-main" data-gallery-count="${imgs.length}">
            <div class="product-gallery-track" id="pgTrack">${imgs.map((src, i) => `<img class="product-gallery-slide ${i === 0 ? 'is-active' : ''}" src="${escapeAttr(src)}" alt="${escapeAttr(product.name)} — image ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">`).join('')}</div>
            ${imgs.length > 1 ? `<button type="button" class="product-gallery-arrow product-gallery-prev" aria-label="Previous image">‹</button><button type="button" class="product-gallery-arrow product-gallery-next" aria-label="Next image">›</button><div class="product-gallery-counter"><span id="pgIndex">1</span> / ${imgs.length}</div><div class="product-gallery-dots">${imgs.map((_, i) => `<button type="button" class="product-gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="View image ${i + 1}"></button>`).join('')}</div>` : ''}
          </div>
          ${imgs.length > 1 ? `<div class="product-thumbs">${imgs.map((src, i) => `<button class="product-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" data-src="${escapeAttr(src)}" aria-label="View image ${i + 1} of ${escapeAttr(product.name)}"><img src="${escapeAttr(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
        </div>
        <div class="product-info">
          <h1>${escapeAttr(product.name)}</h1>
          <div class="price">${escapeAttr(product.price)} ${escapeAttr(window.VERV_CONFIG.CURRENCY)}</div>
          <p class="short">${escapeAttr(product.description || product.shortDescription || '')}</p>
          ${colors.length ? `<div class="opt-group"><span class="opt-label" data-i18n="COLOR">COLOR</span><div class="opt-row" id="colorRow">${colors.map((c, i) => `<button class="opt-btn ${i === 0 ? 'selected' : ''}" data-color="${escapeAttr(c)}">${escapeAttr(c)}</button>`).join('')}</div></div>` : ''}
          ${sizes.length ? `<div class="opt-group"><span class="opt-label" data-i18n="SIZE">SIZE</span><div class="opt-row" id="sizeRow">${sizes.map((s, i) => `<button class="opt-btn ${i === 0 ? 'selected' : ''}" data-size="${escapeAttr(s)}">${escapeAttr(s)}</button>`).join('')}</div></div>` : ''}
          <div class="opt-group quantity-group">
            <span class="opt-label" data-i18n="QUANTITY">QUANTITY</span>
            <div class="quantity-control" aria-label="Quantity selector">
              <button type="button" class="qty-btn" id="qtyMinus" aria-label="Decrease quantity">−</button>
              <input id="qtyInput" class="qty-input" type="number" min="1" max="99" step="1" value="1" inputmode="numeric" aria-label="Quantity">
              <button type="button" class="qty-btn" id="qtyPlus" aria-label="Increase quantity">+</button>
            </div>
          </div>
          ${specialRequestsMarkup()}
          <button class="btn whatsapp-product-btn" id="pdAddBtn" ${product.available === false ? 'disabled' : ''}>${product.available === false ? 'Sold Out' : `<span data-i18n="ORDER">ORDER VIA WHATSAPP</span>`}</button>
          <div class="product-details">${product.details ? Object.entries(product.details).map(([k, v]) => `<div class="detail-row"><div class="dt-label">${escapeAttr(k.toUpperCase())}</div><div class="dt-value">${escapeAttr(v)}</div></div>`).join('') : ''}</div>
        </div>
      </div>
      ${product.fabric ? `<div class="fabric-section"><h3>FABRIC</h3><div class="fabric-grid">${(product.fabric.images || []).map((src) => `<img src="${escapeAttr(src)}" alt="${escapeAttr(product.name)} fabric detail" loading="lazy">`).join('')}<div class="fabric-meta">${product.fabric.weave ? `<div>${escapeAttr(product.fabric.weave)}</div>` : ''}${product.fabric.composition ? `<div>${escapeAttr(product.fabric.composition)}</div>` : ''}</div></div></div>` : ''}`;

    setupSpecialRequests(root);

    // Instagram-style product gallery: arrows, dots, thumbnails, and touch swipe.
    if (imgs.length > 1) {
      const gallery = root.querySelector('.product-gallery-main');
      const track = root.querySelector('#pgTrack');
      const slides = [...root.querySelectorAll('.product-gallery-slide')];
      const thumbs = [...root.querySelectorAll('.product-thumb')];
      const dots = [...root.querySelectorAll('.product-gallery-dot')];
      const counter = root.querySelector('#pgIndex');
      let galleryIndex = 0, startX = 0, deltaX = 0, dragging = false;
      const goTo = (next, animate = true) => {
        galleryIndex = (next + imgs.length) % imgs.length;
        track.style.transition = animate ? '' : 'none';
        track.style.transform = `translate3d(${-galleryIndex * 100}%,0,0)`;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === galleryIndex));
        thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === galleryIndex));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === galleryIndex));
        if (counter) counter.textContent = String(galleryIndex + 1);
      };
      root.querySelector('.product-gallery-prev')?.addEventListener('click', () => goTo(galleryIndex - 1));
      root.querySelector('.product-gallery-next')?.addEventListener('click', () => goTo(galleryIndex + 1));
      dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.index))));
      thumbs.forEach((btn) => btn.addEventListener('click', () => goTo(Number(btn.dataset.index))));
      gallery.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; startX = e.clientX; deltaX = 0; gallery.classList.add('is-dragging'); gallery.setPointerCapture?.(e.pointerId);
      });
      gallery.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        deltaX = e.clientX - startX;
        const progress = (deltaX / gallery.clientWidth) * 100;
        track.style.transition = 'none';
        track.style.transform = `translate3d(calc(${-galleryIndex * 100}% + ${progress}px),0,0)`;
      });
      const endGalleryDrag = () => {
        if (!dragging) return;
        dragging = false; gallery.classList.remove('is-dragging');
        if (Math.abs(deltaX) > 45) goTo(galleryIndex + (deltaX < 0 ? 1 : -1)); else goTo(galleryIndex);
      };
      gallery.addEventListener('pointerup', endGalleryDrag);
      gallery.addEventListener('pointercancel', endGalleryDrag);
      gallery.addEventListener('pointerleave', endGalleryDrag);
    }

    let selectedColor = colors[0] || '';
    let selectedSize = sizes[0] || '';
    root.querySelectorAll('#colorRow .opt-btn').forEach((btn) => btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color; root.querySelectorAll('#colorRow .opt-btn').forEach((b) => b.classList.remove('selected')); btn.classList.add('selected');
    }));
    root.querySelectorAll('#sizeRow .opt-btn').forEach((btn) => btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size; root.querySelectorAll('#sizeRow .opt-btn').forEach((b) => b.classList.remove('selected')); btn.classList.add('selected');
    }));
    const qtyInput = document.getElementById('qtyInput');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const clampQuantity = () => {
      if (!qtyInput) return 1;
      let qty = parseInt(qtyInput.value, 10);
      if (!Number.isFinite(qty)) qty = 1;
      qty = Math.min(99, Math.max(1, qty));
      qtyInput.value = qty;
      return qty;
    };
    qtyMinus?.addEventListener('click', () => { if (qtyInput) { qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1); } });
    qtyPlus?.addEventListener('click', () => { if (qtyInput) { qtyInput.value = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1); } });
    qtyInput?.addEventListener('change', clampQuantity);
    qtyInput?.addEventListener('blur', clampQuantity);

    const addBtn = document.getElementById('pdAddBtn');
    if (addBtn) addBtn.addEventListener('click', () => {
      if (product.available === false) return;
      const quantity = clampQuantity();
      const specialData = [];
      root.querySelectorAll('[data-special]').forEach((check) => {
        if (!check.checked) return;
        const key = check.dataset.special;
        const cfg = window.VERV_CONFIG?.SPECIAL_REQUESTS?.[key] || {};
        const value = root.querySelector(`[data-special-input="${key}"]`)?.value?.trim() || '';
        specialData.push({key,label:cfg.label||key,value,price:Number(cfg.price||0)});
      });
      window.VERV_CHECKOUT?.start({product,color:selectedColor,size:selectedSize,quantity,specials:specialData});
    });
  }

  document.addEventListener('DOMContentLoaded', () => { renderProductGrid(); renderProductPage(); });
})();
