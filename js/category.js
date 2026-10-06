(() => {
  const escape = (v) => String(v ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const params = new URLSearchParams(location.search);
  const key = params.get('category') || 'tshirts';
  const mode = params.get('mode') === 'wholesale' ? 'wholesale' : 'retail';
  const builtIn = {
    tshirts: {title:'T-SHIRTS', desc:'Explore every T-shirt shape available from VERV.', categories:['Tee']},
    hoodies: {title:'HOODIES', desc:'Explore every hoodie shape available from VERV.', categories:['Hoodie']},
    pants: {title:'PANTS', desc:'Sweatpants, cargos and every trouser direction in the VERV line.', categories:['Pants','Sweatpants','Cargo']},
    jackets: {title:'JACKETS', desc:'Explore the jacket shapes available from VERV.', categories:['Jacket']},
    crewnecks: {title:'CREWNECKS', desc:'Explore the crewneck shapes available from VERV.', categories:['Crewneck']}
  };
  const custom = (window.VERV_ADMIN_CATEGORIES || []).find(c => c.id === key);
  const group = builtIn[key] || (custom ? {title:custom.name.toUpperCase(),desc:custom.description||`Explore every ${custom.name} shape available from VERV.`,categories:[custom.name]} : builtIn.tshirts);
  const products = (window.VERV_PRODUCTS || []).filter(p => group.categories.includes(p.category) && p.available !== false);
  const root = document.getElementById('categoryDetail');
  if (!root) return;
  document.title = `VERV — ${group.title}`;
  const wholesale = mode === 'wholesale';
  root.innerHTML = `
    <div class="category-hero"><span class="eyebrow">VERV / ${wholesale ? 'WHOLESALE' : 'RETAIL'} / CATEGORY</span><h1>${escape(group.title)}</h1><p>${escape(group.desc)}</p></div>
    <div class="category-mode-note"><span>${wholesale ? 'BULK ORDERS' : 'INDIVIDUAL PIECES'}</span><a href="index.html#business">CHANGE MODE</a></div>
    <div class="category-products">${products.length ? products.map(p => renderCard(p, wholesale)).join('') : `<div class="category-empty">More ${escape(group.title.toLowerCase())} shapes are coming soon.</div>`}</div>`;
  setupCards(root);
  window.VERV_observeReveals?.();

  function specialMarkup(){return `<div class="special-request-box" data-special-requests><div class="special-request-head"><span>SPECIAL REQUESTS</span><small>OPTIONAL ADD-ONS</small></div><label class="special-check"><input type="checkbox" data-special="name"><span>ADD NAME</span><strong><b>+100</b><small>EGP / PC</small></strong></label><div class="special-extra" data-extra="name"><input type="text" data-special-input="name" maxlength="30" placeholder="Name to print"></div><label class="special-check"><input type="checkbox" data-special="text"><span>CUSTOM TEXT</span><strong><b>+75</b><small>EGP / PC</small></strong></label><div class="special-extra" data-extra="text"><input type="text" data-special-input="text" maxlength="60" placeholder="Text to print"></div><label class="special-check"><input type="checkbox" data-special="logo"><span>CUSTOM LOGO</span><strong><b>+200</b><small>EGP / PC</small></strong></label><div class="special-extra" data-extra="logo"><input type="text" data-special-input="logo" maxlength="60" placeholder="Logo / brand name"></div></div>`;}
  function renderCard(p, isWholesale) {
    const colors=p.colors||['Black'], sizes=p.sizes||['S','M','L','XL'];
    const t=p.wholesaleTiers||[]; const tiers=isWholesale?`<div class="category-tiers">${(t.length?t:[{min:30,price:Math.round(p.price*.24)},{min:50,price:Math.round(p.price*.216)},{min:70,price:Math.round(p.price*.2)},{min:100,price:Math.round(p.price*.184)}]).map((x,i)=>`<span>${i===0?'30–50':i===1?'50–70':i===2?'70–100':'100+'}: ${escape(x.price)} EGP/PC</span>`).join('')}</div>`:`<div class="category-price">${escape(p.price)} EGP</div>`;
    return `<article class="category-product reveal"><a class="category-product-image" href="product.html?slug=${encodeURIComponent(p.slug)}"><img src="${escape(p.images?.[0]||'')}" alt="${escape(p.name)}"></a><div class="category-product-body"><div><span class="product-category">${escape(p.category)}</span><h2>${escape(p.name)}</h2><p>${escape(p.shortDescription||'')}</p></div>${tiers}</div><div class="category-order-box" data-category-order data-product-id="${escape(p.id)}"><div class="category-options"><label><span>COLOR</span><select data-color>${colors.map(c=>`<option>${escape(c)}</option>`).join('')}</select></label><label><span>SIZE</span><select data-size>${sizes.map(s=>`<option>${escape(s)}</option>`).join('')}</select></label><label><span>QUANTITY</span><input data-qty type="number" min="${isWholesale?30:1}" max="999" value="${isWholesale?30:1}"></label></div>${specialMarkup()}<button type="button" class="btn category-order-btn" data-wholesale="${isWholesale}">${isWholesale?'ORDER WHOLESALE VIA WHATSAPP':'ORDER VIA WHATSAPP'}</button><a class="category-view-link" href="product.html?slug=${encodeURIComponent(p.slug)}">VIEW PRODUCT PAGE</a></div></article>`;
  }
  function setupCards(scope){
    scope.querySelectorAll('[data-special]').forEach(check=>{const extra=scope.querySelector(`[data-extra="${check.dataset.special}"]`);const sync=()=>extra?.classList.toggle('open',check.checked);check.addEventListener('change',sync);sync();});
    scope.querySelectorAll('[data-category-order]').forEach(box=>{const p=(window.VERV_PRODUCTS||[]).find(x=>x.id===box.dataset.productId);if(!p)return;box.querySelector('.category-order-btn')?.addEventListener('click',()=>{const isWholesale=box.querySelector('.category-order-btn').dataset.wholesale==='true';const min=isWholesale?30:1;const qtyEl=box.querySelector('[data-qty]');let qty=parseInt(qtyEl.value,10);if(!Number.isFinite(qty)||qty<min)qty=min;qtyEl.value=qty;const color=box.querySelector('[data-color]')?.value||'—',size=box.querySelector('[data-size]')?.value||'—';const specials=[];const specialData=[];box.querySelectorAll('[data-special]').forEach(ch=>{if(!ch.checked)return;const k=ch.dataset.special,cfg=window.VERV_CONFIG?.SPECIAL_REQUESTS?.[k]||{},v=box.querySelector(`[data-special-input="${k}"]`)?.value?.trim()||'';specials.push(`${cfg.label||k}${v?`: ${v}`:''} (+${cfg.price||0} EGP / PC)`);specialData.push({key:k,label:cfg.label||k,value:v,price:Number(cfg.price||0)});});window.VERV_CHECKOUT?.start({product:p,color,size,quantity:qty,specials:specialData,wholesale:isWholesale});});});
  }
})();
