(function(){
  var PRE={malika:'shirt',shams:'flare',oud:'oud'};
  function swap(btn){
    var card=btn.closest('.card'); if(!card)return;
    var id=card.getAttribute('data-id'),pre=PRE[id];
    var cp=(window.SITT_CAT||[]).filter(function(p){return p.id===id})[0];
    var key=btn.getAttribute('data-c'),url='';
    if(cp&&cp.images&&cp.images[key])url=window.SITT_IMG(cp.images[key]);else if(pre)url='assets/img/'+pre+'-'+key+'.jpg';
    if(!url)return;
    var img=card.querySelector('.card-img img'); if(!img)return;
    card.querySelectorAll('.dot').forEach(function(d){d.classList.remove('on')});
    btn.classList.add('on');
    img.setAttribute('src',url);
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.card .dot'):null;
    if(b){e.preventDefault();e.stopPropagation();swap(b);}
  },true);
})();
