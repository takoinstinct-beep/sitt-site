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
    var pn=document.getElementById('pn'),root=document.documentElement;
    var map={'بوردو':'burgundy','أسود':'black','كريمي':'cream'};
    document.querySelectorAll('.dots button').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.dots button').forEach(function(x){x.classList.remove('on')});
        b.classList.add('on');pn.textContent=b.dataset.n;
        root.setAttribute('data-theme',map[b.dataset.n]||'burgundy');try{localStorage.setItem('sitt-theme',map[b.dataset.n]||'burgundy')}catch(e){}[].forEach.call(document.querySelectorAll('.tsw .pn button'),function(x){x.className=x.getAttribute('aria-label')===b.dataset.n?'on':''});
        try{var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',b.dataset.bg)}catch(e){}
      });
    });
  }
  if(document.readyState!=='loading')go();else document.addEventListener('DOMContentLoaded',go);
})();
