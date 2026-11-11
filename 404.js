(function(){
  // show the missing path
  var p=document.getElementById('path');
  if(p&&location.pathname&&location.pathname!=='/')p.textContent=decodeURIComponent(location.pathname.split('/').slice(-2).join('/')||location.pathname);

  // back to previous page (falls back to home if there is no history)
  document.getElementById('prev').addEventListener('click',function(){
    if(window.history.length>1&&document.referrer){window.history.back();}
    else{window.location.href='index.html';}
  });

  if(!window.gsap)return;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

  // rising sport icons
  var icons=['fa-futbol','fa-basketball','fa-dumbbell','fa-person-running','fa-trophy','fa-medal','fa-bolt','fa-table-tennis-paddle-ball'],n=innerWidth<600?5:8;
  for(var i=0;i<n;i++){var e=document.createElement('i');e.className='fa-solid '+icons[i]+' pt';e.style.cssText='left:'+(6+i*12)+'%;font-size:'+(16+(i%3)*10)+'px;animation-duration:'+(9+i*1.7)+'s;animation-delay:'+(-i*2)+'s';document.body.prepend(e);}

  // intro: digits drop, ball bounces with squash and shadow
  var tl=gsap.timeline({delay:.15});
  tl.from('.tag',{y:-20,opacity:0,duration:.6})
    .from('.d',{y:-260,rotation:function(i){return i?18:-18},opacity:0,duration:1.2,ease:'bounce.out',stagger:.15},'-=.2')
    .from('h1,.msg,.btns .btn,.links li',{y:30,opacity:0,stagger:.1,duration:.7,clearProps:'transform,opacity'},'-=.5');
  var ball=document.getElementById('ball'),sh=document.getElementById('shadow');
  gsap.from('.ballwrap',{y:-400,opacity:0,duration:1.1,ease:'power2.in',delay:.3});
  var b=gsap.timeline({repeat:-1,delay:1.4});
  b.to(ball,{y:-70,duration:.55,ease:'power2.out'},0).to(sh,{scale:.6,opacity:.35,duration:.55,ease:'power2.out'},0)
   .to(ball,{y:0,duration:.55,ease:'power2.in'}).to(sh,{scale:1,opacity:1,duration:.55,ease:'power2.in'},'<')
   .to(ball,{scaleY:.8,scaleX:1.15,transformOrigin:'50% 100%',duration:.09,yoyo:true,repeat:1});
  gsap.to(ball,{rotation:360,duration:2.2,repeat:-1,ease:'none'});

  // glitch the 4s every few seconds
  setInterval(function(){var d=document.querySelectorAll('.d');d.forEach(function(x){x.classList.remove('glitch');void x.offsetWidth;x.classList.add('glitch')});},3500);

  if(fine){
    // mouse: spotlight + layered parallax
    var spot=document.getElementById('spot');
    addEventListener('mousemove',function(e){
      spot.style.setProperty('--mx',e.clientX+'px');spot.style.setProperty('--my',e.clientY+'px');
      var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
      document.querySelectorAll('[data-depth]').forEach(function(el){gsap.to(el,{x:x*el.dataset.depth,y:y*el.dataset.depth,duration:.8,overwrite:'auto'});});
    });
    // magnetic buttons
    document.querySelectorAll('.mag').forEach(function(m){
      m.addEventListener('mousemove',function(e){var r=m.getBoundingClientRect();gsap.to(m,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.25,duration:.3});});
      m.addEventListener('mouseleave',function(){gsap.to(m,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'});});
    });
  }
})();