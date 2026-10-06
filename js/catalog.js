// VERV — live catalog layer for the admin dashboard
(function(){
  const PRODUCT_KEY='verv_admin_products_v1';
  const CATEGORY_KEY='verv_admin_categories_v1';
  const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch{return fallback}};
  const baseProducts=window.VERV_PRODUCTS||[];
  const adminProducts=read(PRODUCT_KEY,[]);
  const adminCategories=read(CATEGORY_KEY,[]);
  const map=new Map(baseProducts.map(p=>[p.id,p]));
  adminProducts.forEach(p=>map.set(p.id,p));
  window.VERV_PRODUCTS=Array.from(map.values()).filter(p=>p.deleted!==true && p.available!==false);
  window.VERV_ADMIN_PRODUCTS=adminProducts;
  window.VERV_ADMIN_CATEGORIES=adminCategories;
  try { const s=JSON.parse(localStorage.getItem('verv_admin_settings_v1')||'null'); if(s){ if(s.whatsapp) window.VERV_CONFIG.WHATSAPP_NUMBER=s.whatsapp; if(window.VERV_CONFIG.SPECIAL_REQUESTS){ ['name','text','logo'].forEach(k=>{if(Number.isFinite(Number(s[k]))) window.VERV_CONFIG.SPECIAL_REQUESTS[k].price=Number(s[k]);}); } } } catch(e) {}
  window.VERV_CATALOG={
    saveProduct(p){const arr=read(PRODUCT_KEY,[]).filter(x=>x.id!==p.id);arr.push(p);const payload=JSON.stringify(arr);try{localStorage.setItem(PRODUCT_KEY,payload)}catch(e){throw new Error('PRODUCT_STORAGE_FULL')}location.reload();},
    deleteProduct(id){const arr=read(PRODUCT_KEY,[]); const existing=arr.find(x=>x.id===id); if(existing){existing.deleted=true; existing.available=false;} else {const base=baseProducts.find(x=>x.id===id); arr.push({...base,deleted:true,available:false});} localStorage.setItem(PRODUCT_KEY,JSON.stringify(arr));location.reload();},
    saveCategory(c){const arr=read(CATEGORY_KEY,[]).filter(x=>x.id!==c.id);arr.push(c);const payload=JSON.stringify(arr);try{localStorage.setItem(CATEGORY_KEY,payload)}catch(e){throw new Error('CATEGORY_STORAGE_FULL')}location.reload();},
    deleteCategory(id){localStorage.setItem(CATEGORY_KEY,JSON.stringify(read(CATEGORY_KEY,[]).filter(x=>x.id!==id)));location.reload();},
    clearAll(){localStorage.removeItem(PRODUCT_KEY);localStorage.removeItem(CATEGORY_KEY);localStorage.removeItem('verv_admin_settings_v1');location.reload();},
    exportData(){return {version:1,exportedAt:new Date().toISOString(),products:read(PRODUCT_KEY,[]),categories:read(CATEGORY_KEY,[]),settings:(()=>{try{return JSON.parse(localStorage.getItem('verv_admin_settings_v1')||'{}')}catch{return {}}})()}},
    importData(data){if(!data||typeof data!=='object') throw new Error('Invalid backup'); if(Array.isArray(data.products)) localStorage.setItem(PRODUCT_KEY,JSON.stringify(data.products)); if(Array.isArray(data.categories)) localStorage.setItem(CATEGORY_KEY,JSON.stringify(data.categories)); if(data.settings&&typeof data.settings==='object') localStorage.setItem('verv_admin_settings_v1',JSON.stringify(data.settings)); location.reload();}
  };
})();
