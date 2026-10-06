(() => {
  const root=document.getElementById('retailProducts'); if(!root) return;
  const products=(window.VERV_PRODUCTS||[]).filter(p=>p.available!==false && p.featured!==false).slice(0,12);
  if(!products.length) return;
  const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  root.innerHTML=products.map((p,i)=>`<article class="retail-product"><div class="business-product-image"><img src="${esc(p.images?.[0]||'')}" alt="${esc(p.name)}" loading="lazy"></div><div class="business-product-info"><div><span class="product-category">${esc(p.category)}</span><h4>${esc(p.name)}</h4></div><div class="retail-price"><span>PRICE</span><strong>${esc(p.price)} <small>EGP</small></strong></div></div><a href="product.html?slug=${encodeURIComponent(p.slug)}" class="business-product-link"><span>VIEW PRODUCT</span></a></article>`).join('');
})();
