// VERV — local order management layer
(function(){
  const KEY='verv_orders_v1';
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch{return false}};
  const money=n=>`${Number(n||0)} ${window.VERV_CONFIG?.CURRENCY||'EGP'}`;
  function create(payload){
    const orders=read();
    const order={
      id:`VERV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Date.now()).slice(-5)}`,
      createdAt:new Date().toISOString(), status:'NEW',
      customerName:'', customerPhone:'', notes:'', source:'WHATSAPP',
      total:0, ...payload
    };
    orders.unshift(order); write(orders); return order;
  }
  function recordSingle({product,color,size,quantity,specials,wholesale=false}){
    const unit=Number(product?.price||0);
    const specialTotal=(specials||[]).reduce((sum,s)=>sum+Number(s.price||0),0)*Number(quantity||1);
    return create({type:wholesale?'WHOLESALE':'RETAIL', items:[{productId:product?.id||'',name:product?.name||'',price:unit,quantity:Number(quantity||1),color:color||'',size:size||'',specials:specials||[]}], total:unit*Number(quantity||1)+specialTotal});
  }
  function recordCart(items,total){
    return create({type:'RETAIL',items:(items||[]).map(i=>({productId:i.id,name:i.name,price:Number(i.price||0),quantity:Number(i.qty||1),color:i.color||'',size:i.size||'',specials:i.specials||[]})),total:Number(total||0)});
  }
  function update(id,patch){const a=read(),i=a.findIndex(x=>x.id===id);if(i<0)return; a[i]={...a[i],...patch,updatedAt:new Date().toISOString()};write(a);return a[i]}
  function remove(id){write(read().filter(x=>x.id!==id))}
  function clear(){localStorage.removeItem(KEY)}
  function all(){return read()}
  window.VERV_ORDERS={all,create,recordSingle,recordCart,update,remove,clear,money};
})();
