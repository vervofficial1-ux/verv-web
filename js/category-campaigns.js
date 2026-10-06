(() => {
  const custom = window.VERV_ADMIN_CATEGORIES || [];
  if (!custom.length) return;
  const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  document.querySelectorAll('.category-campaign-grid').forEach(grid => {
    custom.forEach((c,i)=>{
      if (grid.querySelector(`[data-admin-category="${esc(c.id)}"]`)) return;
      const base=grid.querySelector('.category-campaign');
      const mode=(base?.getAttribute('href')||'').includes('mode=wholesale')?'wholesale':'retail';
      const a=document.createElement('a'); a.className='category-campaign'; a.dataset.adminCategory=c.id; a.href=`category.html?category=${encodeURIComponent(c.id)}&mode=${mode}`;
      a.innerHTML=`<img src="${esc(c.image||'')}" alt="${esc(c.name)}"><span>${String(6+i).padStart(2,'0')}</span><strong>${esc(c.name).toUpperCase()}</strong><small>${esc(c.subtitle||'EXPLORE THE CATEGORY')}</small>`;
      grid.appendChild(a);
    });
  });
})();
