/* landing page effects (progressive, content is visible without them) */
(function(){
  if(document.body.getAttribute('data-page')!=='home')return;
  function go(){
    var rs=document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
      rs.forEach(function(r){io.observe(r)});
      var ws=document.querySelectorAll('#mf b');
      var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=[].indexOf.call(ws,e.target);setTimeout(function(){e.target.classList.add('on')},Math.min(i,14)*60)}})},{threshold:.6});
      ws.forEach(function(w){io2.observe(w)});
    } else { rs.forEach(function(r){r.classList.add('in')}); document.querySelectorAll('#mf b').forEach(function(b){b.classList.add('on')}); }
    document.querySelectorAll('.sc').forEach(function(c){
      c.addEventListener('click',function(){c.classList.toggle('flip')});
      c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){c.classList.toggle('flip')}});
    });
    var pal=document.getElementById('pal'),pn=document.getElementById('pn');
    document.querySelectorAll('.dots button').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.dots button').forEach(function(x){x.classList.remove('on')});
        b.classList.add('on');pn.textContent=b.dataset.n;
        pal.style.setProperty('--pbg',b.dataset.bg);pal.style.setProperty('--pfg',b.dataset.fg);pal.style.setProperty('--pac',b.dataset.ac);
      });
    });
    pal.style.setProperty('--pbg','#662c38');pal.style.setProperty('--pfg','#f4eee3');pal.style.setProperty('--pac','#e3c98e');
  }
  if(document.readyState!=='loading')go();else document.addEventListener('DOMContentLoaded',go);
})();
