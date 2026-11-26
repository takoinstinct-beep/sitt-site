(function(){
  var form=document.getElementById('checkout-form');
  if(!form)return;
  var CAT={malika:['شميز اللفّة الذهبية',950],shams:['بلوزة جرس اللوتس',650],oud:['بلوزة العود الذهبي',950],nil:['شميز اللفّة الذهبية',950]};
  var AR='٠١٢٣٤٥٦٧٨٩';
  function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]}).replace(/,/g,'٬')}
  function money(n){return ar(Number(n).toLocaleString('en-US'))+' ج.م'}
  function rd(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
  function api(){return (window.SITT_API||'').replace(/\/$/,'')}
  function newNo(){var s='';var a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';for(var i=0;i<6;i++)s+=a[Math.floor(Math.random()*a.length)];return 'SITT-'+s}
  function post(order){
    if(!api())return Promise.reject(new Error('no-api'));
    var c=new AbortController();var t=setTimeout(function(){c.abort()},15000);
    return fetch(api()+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(order),signal:c.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http '+r.status);return r.json()});
  }
  function flush(){
    var q=rd('sitt_order_queue',[]);if(!q.length||!api())return;
    var left=[];var chain=Promise.resolve();
    q.forEach(function(o){chain=chain.then(function(){return post(o).catch(function(){left.push(o)})})});
    chain.then(function(){localStorage.setItem('sitt_order_queue',JSON.stringify(left))});
  }
  flush();
  // payment options
  var payBox=document.querySelector('.pay-opt');
  if(payBox&&!document.getElementById('pay-cod')){
    var wrap=document.createElement('div');wrap.className='pay-list';
    wrap.innerHTML='<label class="pay-row on"><input type="radio" name="pay" id="pay-cod" value="cod" checked><span>الدفع عند الاستلام</span></label>'+
      '<label class="pay-row off"><input type="radio" name="pay" value="card" disabled><span>بطاقة / محفظة إلكترونية</span><em>قريبًا</em></label>';
    payBox.parentNode.replaceChild(wrap,payBox);
  }
  function val(id){var e=document.getElementById(id);return e?e.value.trim():''}
  function mark(id,bad){var e=document.getElementById(id);if(e)e.style.borderColor=bad?'#a33':''}
  document.addEventListener('submit',function(e){
    if(e.target!==form)return;
    e.preventDefault();e.stopImmediatePropagation();
    var err=document.getElementById('co-err');
    var cart=rd('sitt_cart',[]).filter(function(i){return CAT[i.id]});
    var bad=[];
    var email=val('email'),fname=val('fname'),lname=val('lname'),phone=val('phone').replace(/[\s-]/g,'').replace(/^\+?20/,'0'),gov=val('gov'),area=val('area'),addr=val('addr');var otherTxt=val('area-other');if(area==='أخرى')area=otherTxt?('أخرى: '+otherTxt):'';
    var checks={email:/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email),fname:!!fname,lname:!!lname,phone:/^01[0125]\d{8}$/.test(phone),gov:!!gov,area:!!area,addr:addr.length>5};
    Object.keys(checks).forEach(function(k){mark(k,!checks[k]);if(!checks[k])bad.push(k)});
    var terms=form.querySelector('.terms input');if(terms&&!terms.checked)bad.push('terms');
    if(!cart.length){err.textContent='الحقيبة فاضية. ضيفي قطعة الأول.';err.classList.add('on');return}
    if(bad.length){err.textContent=bad.indexOf('phone')>-1&&Object.keys(checks).filter(function(k){return !checks[k]}).length===1?'رقم الموبايل لازم يكون رقم مصري صحيح (01xxxxxxxxx).':'كمّلي البيانات المطلوبة الأول وتأكدي منها، ووافقي على الشروط.';err.classList.add('on');return}
    err.classList.remove('on');
    var items=cart.map(function(i){return {id:i.id,name:CAT[i.id][0],color:i.color,size:i.size,qty:i.qty,unitPrice:CAT[i.id][1]}});
    var subtotal=items.reduce(function(s,i){return s+i.qty*i.unitPrice},0);
    var order={clientRef:newNo(),orderNo:'',items:items,subtotal:subtotal,currency:'EGP',
      customer:{email:email,name:fname+' '+lname,phone:phone},
      shipping:{governorate:gov,area:area,address:addr,floor:val('floor'),landmark:val('mark')},
      payment:{method:'cod',status:'pending'},status:'awaiting_payment',createdAt:new Date().toISOString()};
    var btn=form.querySelector('.co-submit');btn.disabled=true;btn.firstChild.textContent='جاري حفظ الطلب... ';
    function done(saved,srvNo){
      if(srvNo)order.orderNo=srvNo;var shown=order.orderNo||'قيد التأكيد';
      localStorage.setItem('sitt_cart','[]');
      var hist=rd('sitt_orders',[]);hist.unshift({orderNo:shown,total:subtotal,at:order.createdAt,saved:saved});localStorage.setItem('sitt_orders',JSON.stringify(hist.slice(0,20)));
      var rows=items.map(function(i){return '<div class="sum-row"><span>'+i.name+' / '+i.color+' / '+i.size+' × '+ar(i.qty)+'</span><span>'+money(i.qty*i.unitPrice)+'</span></div>'}).join('');
      document.getElementById('checkout-form-wrap').innerHTML='<div class="co-success"><span class="eyebrow-latin">ORDER '+shown+'</span><h2 class="display">طلبك وصلنا.</h2>'+
        '<p>رقم طلبك <strong dir="ltr">'+shown+'</strong>. '+(saved?'اتسجل عندنا':'اتحفظ على جهازك وهيتبعت لينا أول ما الاتصال يرجع')+'، وفريق ست هيتواصل معاكي على '+phone+' لتأكيد الشحن والدفع.</p>'+
        '<div class="sum-rows" style="max-width:460px;margin:22px auto">'+rows+'<div class="sum-row total"><span>الإجمالي (قبل الشحن)</span><span>'+money(subtotal)+'</span></div></div>'+
        (order.orderNo?'<p><a class="btn" href="track.html">تتبع طلبي <span class="arr">←</span></a></p>':'')+'<p style="color:var(--muted);font-size:14px">طريقة الدفع: عند الاستلام. الدفع الإلكتروني قريبًا.</p>'+
        '<p style="margin-top:22px"><a class="btn" href="shop.html">كمّلي تسوق <span class="arr">←</span></a></p></div>';
      try{window.dispatchEvent(new Event('storage'))}catch(x){}
      document.querySelectorAll('.bag-count').forEach(function(b){b.textContent='';b.classList.remove('on')});
      window.scrollTo({top:0,behavior:'smooth'});
    }
    post(order).then(function(r){done(true,r&&r.orderNo)}).catch(function(){
      var q=rd('sitt_order_queue',[]);q.push(order);localStorage.setItem('sitt_order_queue',JSON.stringify(q));done(false);
    });
  },true);
})();
