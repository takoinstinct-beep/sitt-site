(function(){
  function show(on){
    var g=document.querySelector('.grid-products'),p=document.getElementById('tees-soon');
    if(!g||!p)return;
    g.hidden=on;p.hidden=!on;
    var meta=document.querySelector('.filter-attrs'),m2=document.querySelector('.filter-meta');
    if(meta)meta.style.visibility=on?'hidden':'';if(m2)m2.style.visibility=on?'hidden':'';
    document.querySelectorAll('.filter-chips a').forEach(function(a){
      var t=a.hasAttribute('data-tees');
      if(on){a.classList.toggle('active',t)}else{a.classList.toggle('active',a.getAttribute('href')===location.pathname.split('/').pop()||(a.getAttribute('href')==='shop.html'&&!/shirts/.test(location.pathname)))}
    });
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('.filter-chips a[data-tees]');
    if(a&&document.getElementById('tees-soon')){e.preventDefault();show(true);try{history.replaceState(null,'','#tees')}catch(x){}}
  });
  function init(){show(location.hash==='#tees')}
  window.addEventListener('hashchange',init);
  if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
})();
