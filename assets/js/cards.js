(function(){
  var PRE={malika:'shirt',shams:'flare',oud:'oud'};
  function swap(btn){
    var card=btn.closest('.card'); if(!card)return;
    var pre=PRE[card.getAttribute('data-id')]; if(!pre)return;
    var img=card.querySelector('.card-img img'); if(!img)return;
    card.querySelectorAll('.dot').forEach(function(d){d.classList.remove('on')});
    btn.classList.add('on');
    img.setAttribute('src','assets/img/'+pre+'-'+btn.getAttribute('data-c')+'.jpg');
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.card .dot'):null;
    if(b){e.preventDefault();e.stopPropagation();swap(b);}
  },true);
})();
