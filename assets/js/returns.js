(function(){
var f=document.getElementById('rt-form');if(!f)return;
var AR='٠١٢٣٤٥٦٧٨٩';function ar(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var API=(window.SITT_API||'').replace(/\/$/,'')+'/api/returns';
var REASONS=[['size','المقاس مش مناسب'],['color','اللون مختلف عن اللي توقعته'],['defect','فيها عيب'],['notasdescribed','مش زي الوصف أو الصور'],['changed','غيّرت رأيي'],['other','سبب تاني']];
var TS={new:'اتسجل',contacted:'اتواصلنا معاكي',approved:'اتقبل',rejected:'اترفض',received:'استلمنا القطعة',exchanged:'تم الاستبدال'};
var err=document.getElementById('r-err'),s2=document.getElementById('r-step2'),cur={};
function post(b){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.json().then(function(j){return {s:r.status,j:j}})})}
f.addEventListener('submit',function(e){e.preventDefault();err.textContent='';s2.innerHTML='';
 cur.no=document.getElementById('r-no').value.trim();cur.ph=document.getElementById('r-ph').value.replace(/[\s-]/g,'').replace(/^\+?20/,'0');
 post({orderNo:cur.no,phone:cur.ph}).then(function(r){
  if(r.s===404){err.textContent='مش لاقيين طلب بالبيانات دي. اتأكدي من الرقم وموبايلك.';return}
  if(r.s!==200){err.textContent='حصلت مشكلة. جربي تاني بعد شوية.';return}
  var o=r.j,prev=(o.previous||[]).map(function(p){return '<li>طلب '+esc(p.id)+': '+esc(TS[p.status]||p.status)+'</li>'}).join('');
  s2.innerHTML='<div class="rt-box"><h2>طلب <span dir="ltr">'+esc(o.orderNo)+'</span></h2>'+(prev?'<p>طلبات سابقة على الأوردر ده:</p><ul class="how">'+prev+'</ul>':'')+
  '<form id="rt-form2"><p><strong>اختاري القطعة</strong></p>'+o.items.map(function(i,k){return '<label class="rt-opt"><input type="radio" name="it" value="'+i.idx+'"'+(k===0?' checked':'')+'><span>'+esc(i.name)+' / '+esc(i.color)+' / '+esc(i.size)+' × '+ar(i.qty)+'</span></label>'}).join('')+
  '<p><strong>عايزة إيه؟</strong></p><label class="rt-opt"><input type="radio" name="ty" value="exchange" checked><span>استبدال (الأفضل)</span></label><label class="rt-opt"><input type="radio" name="ty" value="return"><span>استرجاع</span></label>'+
  '<label for="rs">السبب</label><select id="rs">'+REASONS.map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>'}).join('')+'</select>'+
  '<label for="rn">ملاحظات (اختياري)، مثلًا المقاس أو اللون اللي عايزاه بدل ده</label><textarea id="rn" rows="3" maxlength="400"></textarea>'+
  '<p style="margin-top:12px"><button class="btn" type="submit">ابعتي الطلب <span class="arr">←</span></button></p><p id="r-err2" class="note" style="color:#a33"></p></form></div>';
  document.getElementById('rt-form2').addEventListener('submit',function(e2){e2.preventDefault();var er=document.getElementById('r-err2');er.textContent='';
   var b=e2.target.querySelector('button');b.disabled=true;
   post({action:'create',orderNo:cur.no,phone:cur.ph,itemIdx:e2.target.elements.it.value,type:e2.target.elements.ty.value,reason:document.getElementById('rs').value,note:document.getElementById('rn').value}).then(function(r2){
    if(r2.s===200){s2.innerHTML='<div class="rt-ok"><strong>اتسجل طلبك. رقمه <span dir="ltr">'+esc(r2.j.id)+'</span></strong><p>هنكلمك على رقم الموبايل اللي طلبتي بيه عشان نأكد معاكي. شكرًا إنك قلتيلنا.</p></div>';return}
    b.disabled=false;er.textContent=r2.s===409?'فيه طلب مفتوح على القطعة دي بالفعل، وهنكلمك عليه.':'حصلت مشكلة. جربي تاني بعد شوية.'}).catch(function(){b.disabled=false;er.textContent='حصلت مشكلة في الاتصال.'});
  });
 }).catch(function(){err.textContent='حصلت مشكلة في الاتصال. جربي تاني بعد شوية.'});
});
})();
