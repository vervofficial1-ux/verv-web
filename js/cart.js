// ==========================================================
// VERV — CART
// localStorage-based cart + WhatsApp checkout.
// WhatsApp number comes from config.js (window.VERV_CONFIG) —
// never hardcode it here.
// ==========================================================

(function () {
  const STORAGE_KEY = 'verv_cart';
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { cart = []; }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable — cart still works for this session */ }
  }

  function findProduct(id) {
    return (window.VERV_PRODUCTS || []).find((p) => p.id === id);
  }

  function addToCart(id, opts) {
    opts = opts || {};
    const key = id + '|' + (opts.color || '') + '|' + (opts.size || '');
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      const p = findProduct(id);
      if (!p) return;
      cart.push({
        key, id: p.id, name: p.name, price: p.price, qty: 1,
        color: opts.color || (p.colors && p.colors[0]) || '',
        size: opts.size || (p.sizes && p.sizes[0]) || '',
        image: p.images && p.images[0],
      });
    }
    saveCart();
    renderCart();
    openCart();
    flashAddButton(id);
  }

  function removeFromCart(key) {
    cart = cart.filter((i) => i.key !== key);
    saveCart();
    renderCart();
  }

  function flashAddButton(id) {
    const btn = document.getElementById('addbtn-' + id);
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('added'); }, 1200);
  }

  function renderCart() {
    const box = document.getElementById('cartItems');
    const countEl = document.getElementById('cartCount');
    if (!box || !countEl) return;

    const count = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = count;

    if (cart.length === 0) {
      box.innerHTML = '<div class="empty">Your cart is empty.</div>';
    } else {
      box.innerHTML = cart.map((i) => `
        <div class="citem">
          <span>${i.name}${i.color ? ' — ' + i.color : ''}${i.size ? ' / ' + i.size : ''} × ${i.qty}</span>
          <span>${i.price * i.qty} ${window.VERV_CONFIG.CURRENCY} <button class="rm" aria-label="Remove ${i.name}" onclick="VERV_CART.remove('${i.key}')">remove</button></span>
        </div>`).join('');
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total + ' ' + window.VERV_CONFIG.CURRENCY;

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.href = '#';
      checkoutBtn.onclick = (e) => {
        e.preventDefault();
        if (!cart.length) return;
        window.VERV_CHECKOUT?.start({cartItems: cart.map(i => ({...i, quantity:i.qty})), total});
      };
    }
  }

  function openCart() {
    const d = document.getElementById('drawer'), o = document.getElementById('overlay');
    if (d) d.classList.add('open');
    if (o) o.classList.add('open');
  }
  function closeCart() {
    const d = document.getElementById('drawer'), o = document.getElementById('overlay');
    if (d) d.classList.remove('open');
    if (o) o.classList.remove('open');
  }

  window.VERV_CART = { add: addToCart, remove: removeFromCart, open: openCart, close: closeCart, render: renderCart };

  document.addEventListener('DOMContentLoaded', renderCart);
})();
