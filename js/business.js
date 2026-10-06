// VERV BUSINESS — retail / wholesale switcher + wholesale WhatsApp ordering
(() => {
  const root = document.getElementById('business');
  if (root) {
    const tabs = root.querySelectorAll('[data-business-tab]');
    const panels = root.querySelectorAll('[data-business-panel]');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      const target = tab.dataset.businessTab;
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        const active = panel.dataset.businessPanel === target;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
      });
    }));
  }

  function getSpecialRequests(scope) {
    const result = [];
    scope?.querySelectorAll('[data-special]').forEach((check) => {
      if (!check.checked) return;
      const key = check.dataset.special;
      const cfg = window.VERV_CONFIG?.SPECIAL_REQUESTS?.[key] || {};
      const value = scope.querySelector(`[data-special-input="${key}"]`)?.value?.trim() || '';
      let detail = value;
      result.push(`${cfg.label || key}${detail ? `: ${detail}` : ''} (+${cfg.price || 0} EGP / PC)`);
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

  function setupWholesaleOrders() {
    const root = document.getElementById('wholesalePanel');
    if (!root) return;
    const number = String(window.VERV_CONFIG?.WHATSAPP_NUMBER || '01288200543').replace(/\D/g, '');
    root.querySelectorAll('[data-wholesale-order]').forEach((box) => {
      setupSpecialRequests(box);
      const btn = box.querySelector('.wholesale-order-btn');
      const color = box.querySelector('[data-wholesale-color]');
      const size = box.querySelector('[data-wholesale-size]');
      const qty = box.querySelector('[data-wholesale-qty]');
      if (!btn || !qty) return;
      const minQty = Number(btn.dataset.minQty || 30);
      const clamp = () => {
        let value = parseInt(qty.value, 10);
        if (!Number.isFinite(value)) value = minQty;
        value = Math.max(minQty, value);
        qty.value = value;
        return value;
      };
      qty.addEventListener('change', clamp);
      qty.addEventListener('blur', clamp);
      btn.addEventListener('click', () => {
        const quantity = clamp();
        const product = btn.dataset.wholesaleProduct || 'Wholesale Order';
        const selectedColor = color?.value || '—';
        const selectedSize = size?.value || '—';
        const specials = getSpecialRequests(box);
        const specialData = specials.map(label => ({key:'custom',label,value:'',price:0}));
        if (window.VERV_CHECKOUT?.start) {
          window.VERV_CHECKOUT.start({product:{id:'wholesale-custom',name:product,price:0},color:selectedColor,size:selectedSize,quantity,specials:specialData,wholesale:true});
        }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', setupWholesaleOrders);
})();
