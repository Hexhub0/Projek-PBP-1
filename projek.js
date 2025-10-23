const KEY='hex_cart',
  G=()=>JSON.parse(localStorage.getItem(KEY)||'{}'),
  S=c=>localStorage.setItem(KEY,JSON.stringify(c)),
  Cl=()=>localStorage.removeItem(KEY),
  pRp=s=>Number((s||'').toString().replace(/[^\d]/g,'')),
  fRp=n=>'Rp'+Number(n||0).toLocaleString('id-ID');

function add(item){const c=G(); c[item.id]?c[item.id].qty++:(c[item.id]={...item,qty:1}); S(c);}
function qty(id,d){const c=G(); if(!c[id])return; c[id].qty+=d; if(c[id].qty<=0) delete c[id]; S(c);}
function delItem(id){const c=G(); if(c[id]){delete c[id]; S(c);}}


function initHome(){
  document.querySelectorAll('a#btn-keranjang,.btn-keranjang').forEach(b=>{
    b.addEventListener('click',e=>{
      e.preventDefault();
      const card=b.closest('.card,.row,.col')||document,
        img=card.querySelector('img')?.src||'',
        name=(card.querySelector('p')?.childNodes[0]?.nodeValue||'Produk').trim(),
        price=pRp(card.querySelector('span b')?.textContent);
      add({id:(name+'|'+img).toLowerCase(),name,price,image:img});
      location.href='checkout.html';
    });
  });
}

function alertOK(msg){
  const a=document.getElementById('alert-area'); if(!a) return;
  const el=document.createElement('div');
  el.className='alert alert-success alert-dismissible fade show';
  el.role='alert'; el.innerHTML=`${msg}<button class="btn-close" data-bs-dismiss="alert"></button>`;
  a.appendChild(el); setTimeout(()=>{el.classList.remove('show'); setTimeout(()=>el.remove(),200)},2500);
}

function render(){
  const list=document.getElementById('cart-list'),
        total=document.getElementById('cart-total'),
        buy=document.getElementById('buy-btn');
  if(!list||!total||!buy) return;

  const c=G(), items=Object.values(c);
  if(!items.length){
    list.innerHTML=`<div class="list-group-item">Keranjang kosong.</div>`;
    total.textContent='Rp0'; buy.disabled=true; buy.classList.add('disabled'); return;
  }
  buy.disabled=false; buy.classList.remove('disabled');

  let sum=0;
  list.innerHTML=items.map(it=>{
    const sub=it.price*it.qty; sum+=sub;
    return `
    <div class="list-group-item d-flex align-items-center gap-3" data-id="${it.id}">
      <img src="${it.image||''}" width="60" height="60" style="object-fit:cover;border-radius:8px;">
      <div class="flex-grow-1">
        <div class="fw-semibold">${it.name}</div>
        <div class="text-secondary small">Harga: ${fRp(it.price)}</div>
        <div class="text-secondary small">Subtotal: ${fRp(sub)}</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary btn-sm act" data-act="-" data-id="${it.id}">−</button>
        <span class="px-2 fw-semibold">${it.qty}</span>
        <button class="btn btn-outline-secondary btn-sm act" data-act="+" data-id="${it.id}">+</button>
      </div>
      <button class="btn btn-outline-danger btn-sm ms-2 act" data-act="x" data-id="${it.id}">Hapus</button>
    </div>`;
  }).join('');
  total.textContent=fRp(sum);
}

function attachCheckout(){
  const list=document.getElementById('cart-list'), buy=document.getElementById('buy-btn');
  if(!list||!buy) return;
  list.addEventListener('click',e=>{
    const t=e.target.closest('.act'); if(!t) return;
    const {act,id}=t.dataset;
    if(act==='+') qty(id,1);
    else if(act==='-') qty(id,-1);
    else if(act==='x') delItem(id);
    render();
  });

  buy.addEventListener('click',()=>{
    if(!Object.keys(G()).length) return;
    Cl(); render(); alertOK('Barang sudah dibeli');
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('a#btn-keranjang,.btn-keranjang')) initHome();
  if(document.getElementById('cart-list')){ render(); attachCheckout(); }
});