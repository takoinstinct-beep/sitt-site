(function(){
var f=document.getElementById('track-form');if(!f)return;
var ST=[['new','اتستلم الطلب'],['confirmed','اتأكد'],['shipped','اتشحن'],['delivered','اتسلّم']];
var AR='٠١٢٣٤٥٦٧٨٩';function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
f.addEventListener('submit',function(e){e.preventDefault();
 var err=document.getElementById('t-err'),res=document.getElementById('t-res');err.textContent='';res.innerHTML='';
 var no=document.getElementById('t-no').value.trim(),ph=document.getElementById('t-ph').value.replace(/[\s-]/g,'').replace(/^\+?20/,'0');
 fetch((window.SITT_API||'').replace(/\/$/,'')+'/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderNo:no,phone:ph})})
 .then(function(r){if(r.status===404)throw new Error('nf');if(!r.ok)throw new Error('x');return r.json()})
 .then(function(o){
  var idx=o.status==='cancelled'?-1:ST.findIndex(function(s){return s[0]===o.status});
  var steps=o.status==='cancelled'?'<p class="note" style="color:#a33">الطلب ده اتلغى.</p>':'<ol class="steps-track">'+ST.map(function(s,i){return '<li class="'+(i<=idx?'on':'')+'">'+s[1]+'</li>'}).join('')+'</ol>';
  var items=(o.items||[]).map(function(i){return '<li>'+esc(i.name)+' / '+esc(i.color)+' / '+esc(i.size)+' × '+ar(i.qty)+'</li>'}).join('');
  res.innerHTML='<h2>طلب <span dir="ltr">'+esc(o.orderNo)+'</span></h2>'+steps+(o.courierNo?'<p>رقم شحنة شركة الشحن: <strong dir="ltr">'+esc(o.courierNo)+'</strong></p>':'')+'<ul class="how">'+items+'</ul><p>الإجمالي: '+ar(Number(o.total).toLocaleString('en-US'))+' ج.م، الدفع عند الاستلام.</p>';
 }).catch(function(x){err.textContent=x.message==='nf'?'مش لاقيين طلب بالبيانات دي. اتأكدي من الرقم وموبايلك.':'حصلت مشكلة في الاتصال. جربي تاني بعد شوية.'});
});
})();
