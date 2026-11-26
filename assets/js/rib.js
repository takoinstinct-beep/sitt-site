(function(){
  var el=document.querySelector('.rib div'); if(!el) return; el.parentNode.style.direction='ltr';
  el.style.animation='none'; el.style.willChange='transform';
  var x=0, last=0, paused=false, speed=28; // px per second, gentle
  var one=0;
  function measure(){ one=el.scrollWidth/3; if(!one) one=300; }
  function tick(t){
    if(!last) last=t;
    var dt=Math.min(t-last,60)/1000; last=t;
    if(!paused){ x+=speed*dt; if(x>=one) x-=one; el.style.transform='translate3d('+(x-one)+'px,0,0)'; }
    requestAnimationFrame(tick);
  }
  var rib=el.parentNode;
  ['touchstart','mouseenter'].forEach(function(e){rib.addEventListener(e,function(){paused=true},{passive:true})});
  ['touchend','touchcancel','mouseleave'].forEach(function(e){rib.addEventListener(e,function(){paused=false},{passive:true})});
  measure(); window.addEventListener('resize',measure);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
  requestAnimationFrame(tick);
})();
