/* Live catalog from the founders dashboard. Runs before everything else. Falls back to the built-in 3 products. */
(function(){
  var K='sitt-cat3',c=null,A=window.SITT_API||'';
  try{c=JSON.parse(localStorage.getItem(K))}catch(e){}
  var list=c&&c.products&&c.products.length?c.products:null;
  window.SITT_CAT=list;
  window.SITT_IMG=function(u){return /^(https?:|data:)/.test(u)?u:A+u};
  if(list){
    var q=window.SITT_I18N_Q=window.SITT_I18N_Q||[],ps=[];
    list.forEach(function(p){if(p.name&&p.nameEn)ps.push([p.name,p.nameEn]);if(p.desc&&p.descEn)ps.push([p.desc,p.descEn]);(p.colors||[]).forEach(function(k){if(k.name&&k.nameEn)ps.push([k.name,k.nameEn])})});
    q.push(ps);
  }
  try{
    fetch(A+'/api/products').then(function(r){return r.json()}).then(function(j){
      if(!j||!j.products||!j.products.length)return;
      var s=JSON.stringify(j.products),o=list?JSON.stringify(list):'';
      localStorage.setItem(K,JSON.stringify(j));
      if(s!==o&&(j.custom||list)){
        var t=+sessionStorage.getItem('sitt-rl')||0;
        if(Date.now()-t>15000){sessionStorage.setItem('sitt-rl',Date.now());location.reload()}
      }
    }).catch(function(){});
  }catch(e){}
})();
