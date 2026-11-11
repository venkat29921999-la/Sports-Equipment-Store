// Mobile menu: adds a close button inside the full-screen menu, and closes it with the Esc key
(()=>{const n=document.getElementById('nav'),b=document.getElementById('burger');if(!n||!b)return;
const c=document.createElement('button');c.type='button';c.className='nav-close';c.setAttribute('aria-label','Close menu');c.innerHTML='<i class="fa-solid fa-xmark"></i>';n.prepend(c);
c.addEventListener('click',()=>{if(n.classList.contains('open'))b.click()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open'))b.click()})})();
// Safety: any image that fails to load gets a gradient placeholder instead of a broken icon
(()=>{const ph='data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAAAQBQCdASpAAEAAPrVaqU+nJSOqIggBQBaJQMsAU7nkqEG/oBOV2QX//5G//+9n//PAAP6/Q4C3f++1ivT33/lyXp681MXC17mE2F8Q2yv5aXphj5uAhyADsjIpd+KXKriBejD9DgDTgS7zcHmnTETTpmUBRYg4/6Mm4tbikn3eC4SZFDAXb6YiZlZAEGAA';
const bad=e=>{const i=e.target;if(i&&i.tagName==='IMG'&&!i.dataset.fb&&i.src.indexOf('data:')!==0){i.dataset.fb=1;i.src=ph}};
document.addEventListener('error',bad,true);
addEventListener('load',()=>document.querySelectorAll('img').forEach(i=>{if(i.complete&&!i.naturalWidth)bad({target:i})}))})();
// PAGE-SPLIT: one file, runs the right code for index.html or about.html
if(document.body.classList.contains('auth')){
// ===== LOGIN / SIGNUP =====
const $=s=>document.querySelector(s),isLogin=document.body.classList.contains('login');
const DEMO=[{name:'Admin',email:'admin@stackly.com',pass:'Admin@123',role:'admin'},{name:'Alex Carter',email:'user@stackly.com',pass:'User@123',role:'user'}];
const getU=()=>{try{return JSON.parse(localStorage.getItem('stk_users')||'[]')}catch(e){return[]}};
const af=$('#af'),am=$('#amsg'),sb=$('#sb');
const msg=(t,ok)=>{am.className='amsg show '+(ok?'good':'bad');am.innerHTML=`<i class="fa-solid ${ok?'fa-circle-check':'fa-circle-exclamation'}"></i><span>${t}</span>`;gsap.fromTo(am,{y:-8,opacity:0},{y:0,opacity:1,duration:.4});if(!ok)gsap.fromTo('.au-card',{x:-10},{x:0,duration:.7,ease:'elastic.out(1,.25)'})};
const busy=on=>{sb.classList.toggle('load',on);sb.disabled=on};
const seg=$('.seg');seg.querySelectorAll('input').forEach(r=>r.addEventListener('change',()=>seg.dataset.v=r.value));
document.querySelectorAll('.eye').forEach(b=>b.onclick=()=>{const i=b.parentElement.querySelector('input'),s=i.type==='password';i.type=s?'text':'password';b.innerHTML=`<i class="fa-regular fa-eye${s?'-slash':''}"></i>`});
// intro animations
gsap.from('.au-card',{y:70,opacity:0,scale:.94,duration:1.1,ease:'power4.out'});
gsap.from('.au-card h1,.au-card .au-sub,.au-card .seg,.au-card .fld,.au-card .fp,.au-card .tc,.au-card .sbtn,.au-card .alt,.au-card .hint',{y:26,opacity:0,stagger:.07,duration:.7,delay:.35,clearProps:'transform,opacity'});
gsap.from('.au-side .rise',{y:40,opacity:0,stagger:.15,duration:.9,delay:.4});
gsap.from('.glass',{scale:.4,opacity:0,stagger:.2,duration:1,delay:.7,ease:'back.out(1.7)'});
gsap.from('.au-top',{y:-30,opacity:0,duration:.8,delay:.2});
// mouse tilt on the card (desktop)
if(matchMedia('(hover:hover) and (pointer:fine)').matches)$('.au-main').addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;gsap.to('.au-card',{rotationY:x*6,rotationX:-y*6,transformPerspective:900,duration:.6});gsap.to('.orb2',{x:x*50,y:y*50,duration:1})});
const go=u=>{try{localStorage.setItem('stk_session',JSON.stringify({name:u.name,email:u.email,role:u.role}))}catch(e){}sb.classList.remove('load');sb.classList.add('done');msg('Welcome back! Taking you to your dashboard...',true);gsap.to('.au-card',{y:-40,opacity:0,duration:.6,delay:.9,onComplete:()=>location.href=u.role==='admin'?'admin.html':'user.html'})};
if(isLogin){
 const q=new URLSearchParams(location.search);if(q.get('registered')){msg('Account created successfully. Please log in.',true);if(q.get('email'))$('#em').value=q.get('email')}
 af.addEventListener('submit',e=>{e.preventDefault();const em=$('#em').value.trim(),role=af.role.value,nm=em?em.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()):(role==='admin'?'Admin':'Member');
  busy(true);setTimeout(()=>go({name:nm,email:em||'guest@stackly.com',role}),900)});
}else{
 $('#pw').addEventListener('input',e=>{const v=e.target.value;let s=0;if(v.length>=8)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;$('#str').dataset.s=v?s:0});
 af.addEventListener('submit',e=>{e.preventDefault();const n=$('#nm').value.trim()||'New Member',em=$('#em').value.trim(),pw=$('#pw').value;
  busy(true);setTimeout(()=>{if(em){const l=getU().filter(x=>x.email!==em.toLowerCase());l.push({name:n,email:em.toLowerCase(),pass:pw,role:af.role.value});try{localStorage.setItem('stk_users',JSON.stringify(l))}catch(x){}}
   sb.classList.remove('load');sb.classList.add('done');msg('Account created! Taking you to login...',true);
   gsap.to('.au-card',{y:-40,opacity:0,duration:.6,delay:.9,onComplete:()=>location.href='login.html?registered=1'+(em?'&email='+encodeURIComponent(em):'')})},900)});
}
}else if(document.body.classList.contains('dash')){
// ===== DASHBOARDS (admin + user) =====
const role=document.body.dataset.role,ad=role==='admin';let S=null;try{S=JSON.parse(localStorage.getItem('stk_session'))}catch(e){}
if(!S||S.role!==role){location.replace('login.html')}else{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const setName=()=>$$('.u-name').forEach(e=>e.textContent=S.name);setName();
const toast=t=>{const d=document.createElement('div');d.className='toast';d.innerHTML='<i class="fa-solid fa-circle-check"></i> '+t;document.body.append(d);gsap.fromTo(d,{y:40,opacity:0},{y:0,opacity:1,duration:.4});setTimeout(()=>gsap.to(d,{y:20,opacity:0,duration:.4,onComplete:()=>d.remove()}),2400)};
$('#lo').onclick=()=>{try{localStorage.removeItem('stk_session')}catch(e){}location.href='login.html'};
const sb=$('.sb'),ov=$('.dov'),tg=()=>{sb.classList.toggle('open');ov.classList.toggle('show')};$('.ham').onclick=tg;ov.onclick=tg;
const stored=()=>{try{return JSON.parse(localStorage.getItem('stk_users')||'[]')}catch(e){return[]}};
// ---- grouped sidebar (sub-headings with several pages each)
const NAV=ad?[['Main',[['overview','fa-chart-pie','Overview'],['inbox','fa-envelope','Inbox']]],['Store',[['products','fa-boxes-stacked','Products'],['orders','fa-bag-shopping','Orders'],['users','fa-users','Customers']]],['Marketing',[['campaigns','fa-bullhorn','Campaigns'],['coupons','fa-ticket','Coupons']]],['Analytics',[['reports','fa-chart-line','Reports'],['traffic','fa-globe','Traffic']]],['System',[['tickets','fa-headset','Support Tickets'],['settings','fa-gear','Settings']]]]:[['Main',[['overview','fa-chart-pie','Overview'],['inbox','fa-envelope','Inbox']]],['Shopping',[['orders','fa-bag-shopping','My Orders'],['wishlist','fa-heart','Wishlist'],['rewards','fa-gift','Rewards']]],['Account',[['profile','fa-user-gear','Profile'],['addresses','fa-location-dot','Addresses'],['support','fa-headset','Support']]]];
$$('.sb .cap,.sb .nv:not(.lo)').forEach(e=>e.remove());
NAV.forEach(([g,it])=>{const w=document.createElement('div');w.className='grp';w.innerHTML=`<button class="cap">${g}<i class="fa-solid fa-chevron-down"></i></button><div class="gi">${it.map(([v,ic,t])=>`<button class="nv" data-v="${v}"><i class="fa-solid ${ic}"></i><span>${t}</span>${v==='inbox'?'<em class="bdg" id="ibdg">0</em>':''}</button>`).join('')}</div>`;sb.insertBefore(w,$('#lo'))});
$('.nv[data-v=overview]').classList.add('on');
$$('.cap').forEach(c=>c.onclick=()=>{const g=c.parentElement,x=g.querySelector('.gi'),cl=g.classList.toggle('closed');gsap.to(x,{height:cl?0:'auto',opacity:cl?0:1,duration:.4,ease:'power2.inOut'})});
// ---- overview
const KP=ad?[['fa-sack-dollar','Revenue',48920,'$'],['fa-bag-shopping','Orders',1284,''],['fa-users','Users',3402+stored().length,''],['fa-ticket','Open tickets',23,'']]:[['fa-box','My orders',12,''],['fa-heart','Wishlist',8,''],['fa-star','Reward points',2450,''],['fa-wallet','Total spent',842,'$']];
$('#kpis').innerHTML=KP.map(k=>`<div class="kc stg"><i class="fa-solid ${k[0]}"></i><small>${k[1]}</small><b data-n="${k[2]}" data-p="${k[3]}">0</b></div>`).join('');
const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],VA=ad?[42,55,48,70,62,80,74,90,85,96,88,100]:[20,35,25,60,40,55,30,70,45,80,50,65];
$('#bars').innerHTML=MO.map((m,i)=>`<div data-h="${VA[i]}"><span>${m}</span></div>`).join('');
const goal=ad?.78:.64;
$('#feed').innerHTML=(ad?[['fa-bag-shopping','New order #1291','Team kit - 18 jerseys','2 min ago'],['fa-user-plus','New user registered','Priya Nair joined','18 min ago'],['fa-ticket','Support ticket opened','Racquet restring request','1 hr ago'],['fa-truck-fast','Order #1284 delivered','Chennai, India','3 hr ago']]:[['fa-truck-fast','Order #STK-2041 shipped','Arriving Friday','1 hr ago'],['fa-star','You earned 120 points','Thanks for your purchase','Yesterday'],['fa-tag','New offer unlocked','15% off cycling gear','2 days ago'],['fa-heart','Item added to wishlist','AeroRun Pro Shoes','3 days ago']]).map(f=>`<li class="stg"><i class="fa-solid ${f[0]}"></i><div><b>${f[1]}</b><small>${f[2]} · ${f[3]}</small></div></li>`).join('');
const anim=()=>{$$('#kpis b').forEach(b=>{const o={v:0};gsap.to(o,{v:+b.dataset.n,duration:1.6,ease:'power3.out',onUpdate:()=>b.textContent=b.dataset.p+Math.round(o.v).toLocaleString()})});
 gsap.fromTo('#bars div',{height:0},{height:(i,el)=>el.dataset.h+'%',duration:1.1,stagger:.06,ease:'back.out(1.4)'});
 const r={v:0};gsap.fromTo('.ring-fg',{strokeDashoffset:314},{strokeDashoffset:314*(1-goal),duration:1.6,ease:'power3.out'});gsap.to(r,{v:goal*100,duration:1.6,ease:'power3.out',onUpdate:()=>$('#rtx').textContent=Math.round(r.v)+'%'})};
// ---- views
const show=v=>{$$('.nv[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===v));$$('.dv').forEach(d=>d.classList.remove('on'));const el=$(`.dv[data-v=${v}]`);el.classList.add('on');$('#vt').textContent=$(`.nv[data-v=${v}] span`).textContent;
 gsap.fromTo(el,{y:26,opacity:0,filter:'blur(8px)'},{y:0,opacity:1,filter:'blur(0px)',duration:.6,ease:'power3.out',clearProps:'filter'});gsap.from(el.querySelectorAll('.stg'),{y:30,opacity:0,stagger:.08,duration:.6,delay:.1,clearProps:'transform,opacity'});
 if(v==='overview')anim();gsap.fromTo(el.querySelectorAll('.bxt i'),{width:0},{width:(i,t)=>t.dataset.w+'%',duration:1.2,stagger:.1,ease:'power3.out'});sb.classList.remove('open');ov.classList.remove('show')};
$$('.nv[data-v]').forEach(b=>b.onclick=()=>show(b.dataset.v));$('#bell').onclick=()=>show('inbox');
// ---- inbox (dynamic)
let id=0;const mk=(f,s,b,t,u,tag)=>({id:++id,f,s,b,t,u,st:0,tag});
let E=ad?[mk('Priya Nair','Custom jerseys for 25 players','Hi team, our club needs 25 custom jerseys in navy and orange with logos on the chest. Could you share pricing and the delivery timeline before the 20th?','09:12',1,'Order'),mk('Daniel Reyes','Weekly sales report is ready','The weekly report is attached to the shared drive. Revenue is up 12% and football gear leads the categories.','08:40',1,'Report'),mk('Sara Lin','Return request for order #1271','The running shoes are a size too small. Please arrange an exchange for the next size up. Photos are attached.','Yesterday',1,'Support'),mk('Maya Collins','Great service, thank you!','Just wanted to say the racquet repair was quick and perfect. Will be back soon.','Yesterday',0,'Feedback'),mk('Courier Hub','Pickup scheduled for tomorrow','Your 14 parcels will be collected between 10AM and 12PM tomorrow.','Mon',0,'Shipping'),mk('Marketing','Diwali campaign draft','Attached is the draft for the festive campaign. Please review the offers and approve by Friday.','Sun',0,'Internal')]:[mk('Stackly Orders','Your order #STK-2041 has shipped','Good news! Your AeroRun Pro Shoes are on the way. Track your parcel with the code STK2041IN. Estimated delivery is Friday.','10:05',1,'Order'),mk('Coach Sara','Your custom training plan','Hi! I have prepared a 4-week plan based on your goals. Open the attachment and tell me which days suit you.','09:30',1,'Coach'),mk('Stackly Rewards','You earned 120 points','Thanks for shopping with us. Your balance is now 2,450 points - enough for a free water bottle!','Yesterday',1,'Rewards'),mk('Stackly Offers','15% off cycling gear','Members get 15% off all cycling gear this week. Use code RIDE15 at checkout.','Yesterday',0,'Offer'),mk('Support Team','We received your return request','We have received your request. A prepaid label is attached. Refunds take 3 to 5 working days.','Mon',0,'Support'),mk('Stackly Journal','New article: 5 sprint drills','This week on the blog: five drills to boost your sprint speed. Read it in 6 minutes.','Sun',0,'News')];
let flt='all',mq='',cur=null;
const cnt=()=>{const n=E.filter(e=>e.u).length;$('#bb').textContent=n;$('#ibdg').textContent=n;$('#bb').style.display=n?'grid':'none'};
const rl=(anim=true)=>{const it=E.filter(e=>(flt==='all'||(flt==='unread'&&e.u)||(flt==='star'&&e.st))&&(e.f+e.s+e.b).toLowerCase().includes(mq));
 $('#ml').innerHTML=it.length?it.map(e=>`<div class="mi${e.u?' un':''}${cur===e.id?' act':''}" data-id="${e.id}"><b class="av">${e.f[0]}</b><div style="min-width:0"><strong>${e.f}</strong><p>${e.s}</p></div><div class="mm"><small>${e.t}</small><button class="sr${e.st?' on':''}" data-s="${e.id}" aria-label="Star"><i class="fa-${e.st?'solid':'regular'} fa-star"></i></button></div></div>`).join(''):'<div class="empty">No emails found</div>';
 if(anim)gsap.from('.mi',{x:-30,opacity:0,stagger:.05,duration:.45,clearProps:'transform,opacity'});cnt()};
const rd=e=>{cur=e.id;e.u=0;$('#mr').innerHTML=`<button class="btn btn-sm ghost mb" data-a="back"><i class="fa-solid fa-arrow-left"></i> Back</button><h3>${e.s}</h3><div class="mh"><b class="av">${e.f[0]}</b><div><strong>${e.f}</strong><small>${e.t} · ${e.tag}</small></div></div><p>${e.b}</p><div class="ma"><button class="btn btn-sm" data-a="reply"><i class="fa-solid fa-reply"></i> Reply</button><button class="btn btn-sm ghost" data-a="del"><i class="fa-regular fa-trash-can"></i> Delete</button></div>`;
 $('#mr').classList.add('open');gsap.from('#mr>*:not(.mb)',{y:20,opacity:0,stagger:.08,duration:.5});rl(false)};
$('#ml').addEventListener('click',ev=>{const s=ev.target.closest('.sr');if(s){const e=E.find(x=>x.id==s.dataset.s);e.st=e.st?0:1;rl(false);return}const m=ev.target.closest('.mi');if(m)rd(E.find(x=>x.id==m.dataset.id))});
$('#mr').addEventListener('click',ev=>{const a=ev.target.closest('[data-a]');if(!a)return;const e=E.find(x=>x.id===cur);
 if(a.dataset.a==='back')$('#mr').classList.remove('open');
 if(a.dataset.a==='reply'){$('#mr').classList.remove('open');$('#cf').hidden=false;$('#ct').value=ad?'':'support@stackly.com';$('#cs').value='Re: '+e.s;$('#cm').focus()}
 if(a.dataset.a==='del'){gsap.to('#mr',{opacity:0,x:30,duration:.3,onComplete:()=>{E=E.filter(x=>x.id!==cur);cur=null;$('#mr').classList.remove('open');$('#mr').innerHTML='<div class="empty"><p>Email deleted</p></div>';gsap.set('#mr',{opacity:1,x:0});rl();toast('Email deleted')}})}});
$('#mt').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;$$('#mt button').forEach(x=>x.classList.toggle('on',x===b));flt=b.dataset.f;rl()});
$('#mq').addEventListener('input',e=>{mq=e.target.value.toLowerCase();rl(false)});
$('#cb').onclick=()=>{const f=$('#cf');f.hidden=!f.hidden;if(!f.hidden)gsap.from(f,{y:-20,opacity:0,duration:.4})};
// Compose: script validation (no browser pop-up). Valid -> 'Message sent' then 404.html; coming back shows a clean, refreshed inbox
const cmF=$('#cf'),cmFs=[$('#ct'),$('#cs'),$('#cm')],cmMail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;let sentId=0;cmF.noValidate=true;
const cmRule=[v=>!v?'Please enter the recipient email.':cmMail.test(v)?'':'Please enter a valid email, like name@example.com.',v=>v?'':'Please enter a subject.',v=>v?'':'Please write a message.'];
const cmErr=cmFs.map(f=>{const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='display:none;align-items:center;gap:6px;margin:-6px 4px 0;font-size:.85rem;font-weight:600;color:#ff8a5c';f.after(p);return p});
const cmShow=(k,t)=>{const f=cmFs[k],p=cmErr[k];f.style.borderColor=t?'#ff5a1f':'';f.style.boxShadow=t?'0 0 0 4px rgba(255,90,31,.18)':'';f.setAttribute('aria-invalid',t?'true':'false');
  if(t){p.innerHTML='<i class="fa-solid fa-circle-exclamation"></i><span>'+t+'</span>';p.style.display='flex';gsap.fromTo(p,{y:-6,opacity:0},{y:0,opacity:1,duration:.3})}else p.style.display='none'};
cmFs.forEach((f,k)=>f.addEventListener('input',()=>cmShow(k,'')));
cmF.addEventListener('submit',()=>{let first=-1;cmFs.forEach((f,k)=>{const t=cmRule[k](f.value.trim());cmShow(k,t);if(t&&first<0)first=k});
  if(first>=0){cmFs[first].focus();gsap.fromTo(cmFs[first],{x:-8},{x:0,duration:.5,ease:'elastic.out(1,.3)'});return}
  const m=mk('To: '+$('#ct').value.trim(),$('#cs').value.trim(),$('#cm').value.trim(),'Now',0,'Sent');sentId=m.id;E.unshift(m);cmF.reset();cmF.hidden=true;rl();toast('Message sent');
  setTimeout(()=>{location.href='404.html'},1500)});
addEventListener('pageshow',e=>{if(!e.persisted)return;cmF.reset();cmF.hidden=true;cmFs.forEach((f,k)=>cmShow(k,''));
  if(sentId){E=E.filter(x=>x.id!==sentId);sentId=0}
  flt='all';mq='';cur=null;$('#mq').value='';$$('#mt button').forEach(x=>x.classList.toggle('on',x.dataset.f==='all'));
  $('#mr').classList.remove('open');$('#mr').innerHTML='<div class="empty"><div><i class="fa-regular fa-envelope-open" style="font-size:2.4rem;color:var(--acc)"></i><p>Select an email to read it</p></div></div>';rl(false)});
rl(false);
// ---- users (admin)
if(ad){let UL=[['Maya Collins','maya@mail.com','user','Active'],['Daniel Reyes','daniel@mail.com','user','Active'],['Sara Lin','sara@mail.com','admin','Active'],['Priya Nair','priya@mail.com','user','Blocked'],...stored().map(u=>[u.name,u.email,u.role,'Active'])],uq='';
 const ru=()=>{$('#ub').innerHTML=UL.map((u,i)=>[u,i]).filter(([u])=>(u[0]+u[1]).toLowerCase().includes(uq)).map(([u,i])=>`<tr><td data-label="Name"><b>${u[0]}</b></td><td data-label="Email">${u[1]}</td><td data-label="Role"><span class="stpill ${u[2]==='admin'?'st-o':''}">${u[2]}</span></td><td data-label="Status"><button class="stpill ${u[3]==='Active'?'st-g':'st-o'}" data-t="${i}">${u[3]}</button></td><td data-label=""><button class="xb" data-d="${i}" aria-label="Remove"><i class="fa-regular fa-trash-can"></i></button></td></tr>`).join('')||'<tr><td>No users found</td></tr>';gsap.from('#ub tr',{y:20,opacity:0,stagger:.05,duration:.4,clearProps:'transform,opacity'})};
 $('#uq').addEventListener('input',e=>{uq=e.target.value.toLowerCase();ru()});
 $('#ub').addEventListener('click',ev=>{const t=ev.target.closest('[data-t]'),d=ev.target.closest('[data-d]');if(t){const u=UL[t.dataset.t];u[3]=u[3]==='Active'?'Blocked':'Active';ru();toast(u[0]+' is now '+u[3])}if(d){const n=UL[d.dataset.d][0];UL.splice(d.dataset.d,1);ru();toast(n+' removed')}});ru()}
// ---- orders
const OR=ad?[['#1291','Priya Nair','Custom jerseys x25','$1,240','Processing','Assest/sq1.webp'],['#1290','Sara Lin','AeroRun Pro Shoes','$89','Shipped','Assest/sq11.webp'],['#1289','Maya Collins','IronCore Weight Set','$129','Delivered','Assest/sq13.webp'],['#1288','Daniel Reyes','Striker Match Ball','$45','Delivered','Assest/sq12.webp'],['#1287','Alex Carter','Cycling Helmet','$72','Shipped','Assest/sq8.webp']]:[['#STK-2041','AeroRun Pro Shoes','Nov 02, 2026','$89','Shipped','Assest/sq11.webp'],['#STK-1987','Striker Match Ball','Oct 21, 2026','$45','Delivered','Assest/sq12.webp'],['#STK-1934','IronCore Weight Set','Oct 09, 2026','$129','Delivered','Assest/sq13.webp'],['#STK-1880','FlexFit Training Kit','Sep 28, 2026','$59','Processing','Assest/sq14.webp']];
let of='all';const pc=s=>s==='Delivered'?'st-g':s==='Shipped'?'st-o':'';
const ro=()=>{$('#ob').innerHTML=OR.filter(o=>of==='all'||o[4]===of).map(o=>{const th=`<img class="oth" src="${o[5]}" alt="">`;return ad?`<tr><td data-label="Order"><b>${o[0]}</b></td><td data-label="Customer">${o[1]}</td><td data-label="Item">${th}${o[2]}</td><td data-label="Amount">${o[3]}</td><td data-label="Status"><span class="stpill ${pc(o[4])}">${o[4]}</span></td></tr>`:`<tr><td data-label="Order"><b>${o[0]}</b></td><td data-label="Item">${th}${o[1]}</td><td data-label="Date">${o[2]}</td><td data-label="Amount">${o[3]}</td><td data-label="Status"><span class="stpill ${pc(o[4])}">${o[4]}</span></td></tr>`}).join('')||'<tr><td>No orders</td></tr>';gsap.from('#ob tr',{x:-30,opacity:0,stagger:.06,duration:.45,clearProps:'transform,opacity'})};
$('#ot').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;$$('#ot button').forEach(x=>x.classList.toggle('on',x===b));of=b.dataset.f;ro()});ro();
// ---- profile (user)
// Profile: script validation (no browser pop-up). All fields valid -> 'Profile saved' then 404.html; coming back shows the form exactly as first shown
if(!ad){const pF=$('#pf'),pFs=['#pn','#pe','#pp','#pc','#pa'].map(x=>$(x)),pInit=[S.name,S.email,'','',''],pMail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;pF.noValidate=true;
 const pFill=()=>pFs.forEach((f,k)=>f.value=pInit[k]);pFill();
 const pRule=[v=>v.length<2?'Please enter your full name.':'',v=>!v?'Please enter your email address.':pMail.test(v)?'':'Please enter a valid email, like name@example.com.',v=>!v?'Please enter your phone number.':/^\+?\d{10,13}$/.test(v.replace(/[\s-]/g,''))?'':'Please enter a valid phone number, like +91 98765 43210.',v=>v.length<2?'Please enter your city.':'',v=>v.length<5?'Please enter your full address.':''];
 const pErr=pFs.map(f=>{const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='display:none;align-items:center;gap:6px;margin:0;font-size:.82rem;font-weight:600;color:#ff8a5c';f.after(p);return p});
 const pShow=(k,t)=>{const f=pFs[k],p=pErr[k];f.style.borderColor=t?'#ff5a1f':'';f.style.boxShadow=t?'0 0 0 4px rgba(255,90,31,.18)':'';f.setAttribute('aria-invalid',t?'true':'false');
  if(t){p.innerHTML='<i class="fa-solid fa-circle-exclamation"></i><span>'+t+'</span>';p.style.display='flex';gsap.fromTo(p,{y:-6,opacity:0},{y:0,opacity:1,duration:.3})}else p.style.display='none'};
 pFs.forEach((f,k)=>f.addEventListener('input',()=>pShow(k,'')));
 pF.addEventListener('submit',()=>{let first=-1;pFs.forEach((f,k)=>{const t=pRule[k](f.value.trim());pShow(k,t);if(t&&first<0)first=k});
  if(first>=0){pFs[first].focus();gsap.fromTo(pFs[first],{x:-8},{x:0,duration:.5,ease:'elastic.out(1,.3)'});return}
  toast('Profile saved');setTimeout(()=>{location.href='404.html'},1500)});
 addEventListener('pageshow',()=>{pFill();pFs.forEach((f,k)=>pShow(k,''))})}
// ---- extra pages (built from data)
const IMG=u=>u;
const mk2=(id,html)=>{const s=document.createElement('section');s.className='dv';s.dataset.v=id;s.innerHTML=html;$('.mn').append(s)};
const pan=(h,body,extra='')=>`<div class="panel stg"><div class="ptop"><h4>${h}</h4>${extra}</div>${body}</div>`;
const bt=(a,m,l,c='btn btn-sm')=>`<button class="${c}" data-act="${a}" data-m="${m}">${l}</button>`;
const tb2=(h,r)=>`<div class="twrap"><table class="tbl"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map(x=>`<tr>${x.map((c,i)=>`<td data-label="${h[i]}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const bxs=a=>a.map(([n,v])=>`<div class="bx"><div class="bxh"><span>${n}</span><b>${v}%</b></div><div class="bxt"><i data-w="${v}"></i></div></div>`).join('');
const xc=(u,t,s,b,btns)=>`<div class="xc"><div class="xci"><img src="${IMG(u)}" alt="">${b?`<span class="xcb">${b}</span>`:''}</div><div class="xcd"><h5>${t}</h5><p class="muted">${s}</p><div class="xca">${btns}</div></div></div>`;
const stp=(a,b,on)=>`<button class="stpill ${on?'st-g':''}" data-act="st" data-a="${a}" data-b="${b}">${on?a:b}</button>`;
const sw2=(on)=>`<button class="tgl ${on?'on':''}" data-act="sw" aria-label="Toggle"></button>`;
const pbt=bt('go','404.html','Edit')+bt('go','404.html','Delete','btn btn-sm ghost');
if(ad){
 const PR=[['Assest/sq11.webp','AeroRun Pro Shoes','$89 · 42 in stock','Best seller'],['Assest/sq12.webp','Striker Match Ball','$45 · 120 in stock','New'],['Assest/sq13.webp','IronCore Weight Set','$129 · 18 in stock','Low stock'],['Assest/sq14.webp','FlexFit Training Kit','$59 · 64 in stock',''],['Assest/sq8.webp','Trail Cycling Helmet','$72 · 30 in stock',''],['Assest/sq9.webp','ProStrike Racquet','$110 · 25 in stock','Hot']];
 mk2('products',pan('Products',`<div class="xg" id="pg">${PR.map(p=>xc(p[0],p[1],p[2],p[3],pbt)).join('')}</div>`,bt('add','','<i class="fa-solid fa-plus"></i> Add product')));
 mk2('campaigns',pan('Campaigns',tb2(['Campaign','Channel','Reach','Status'],[['Festive Sale','Email','42,000',stp('Live','Paused',1)],['Summer Run Club','Instagram','88,500',stp('Live','Paused',1)],['Team Kit Offer','Google Ads','15,200',stp('Live','Paused',0)],['Back To Gym','YouTube','61,300',stp('Live','Paused',1)]])));
 mk2('coupons',pan('Coupons',`<div class="xg">${[['RIDE15','15% off cycling gear','128 uses',1],['FIRST10','10% off first order','542 uses',1],['SHIPFREE','Free express shipping','76 uses',0],['TEAM20','20% off team kits','31 uses',1]].map(c=>`<div class="cpn"><small class="muted">${c[1]}</small><b>${c[0]}</b><small class="muted">${c[2]}</small><div class="xca">${bt('copy',c[0],'<i class="fa-regular fa-copy"></i> Copy')}${sw2(c[3])}</div></div>`).join('')}</div>`));
 mk2('reports',`<div class="two2">${pan('Sales by category',bxs([['Football',82],['Fitness',68],['Cycling',54],['Tennis',41]]))}${pan('Key metrics',`<div class="kgrid" style="grid-template-columns:1fr 1fr;margin:0">${[['fa-bullseye','Conversion','3.8%'],['fa-receipt','Avg order','$62'],['fa-rotate-left','Return rate','2.1%'],['fa-repeat','Repeat buyers','41%']].map(k=>`<div class="kc"><i class="fa-solid ${k[0]}"></i><small>${k[1]}</small><b style="font-size:1.5rem">${k[2]}</b></div>`).join('')}</div>`)}</div>`);
 mk2('traffic',pan('Traffic sources',bxs([['Organic search',46],['Direct',24],['Social media',18],['Email',8],['Referral',4]])));
 mk2('tickets',pan('Support tickets',tb2(['Ticket','Customer','Issue','Priority','Status'],[['#T-304','Sara Lin','Wrong size delivered','<span class="stpill st-o">High</span>',stp('Resolved','Open',0)],['#T-303','Maya Collins','Refund status','<span class="stpill">Medium</span>',stp('Resolved','Open',1)],['#T-302','Daniel Reyes','Bulk order discount','<span class="stpill">Low</span>',stp('Resolved','Open',0)],['#T-301','Priya Nair','Jersey print colour','<span class="stpill st-o">High</span>',stp('Resolved','Open',1)]])));
 mk2('settings',pan('Store settings',[['Email notifications','Get an email for every new order',1],['Two-factor login','Extra security for admin accounts',1],['Auto backup','Back up store data every night',0],['Public store','Show the store to all visitors',1]].map(s=>`<div class="srow"><div><b>${s[0]}</b><small>${s[1]}</small></div>${sw2(s[2])}</div>`).join('')+`<div style="margin-top:18px">${bt('go','404.html','Save changes')}</div>`));
}else{
 const WL=[['Assest/sq11.webp','AeroRun Pro Shoes','$89','Sale'],['Assest/sq12.webp','Striker Match Ball','$45',''],['Assest/sq8.webp','Trail Cycling Helmet','$72',''],['Assest/sq9.webp','ProStrike Racquet','$110','Hot']];
 mk2('wishlist',pan('My wishlist',`<div class="xg">${WL.map(p=>xc(p[0],p[1],p[2],p[3],bt('go','404.html','<i class="fa-solid fa-cart-plus"></i> Add')+bt('go','404.html','Remove','btn btn-sm ghost'))).join('')}</div>`));
 mk2('rewards',`<div class="two2">${pan('Gold level progress',bxs([['2,450 / 3,000 points',82]])+'<p class="muted">Only 550 points to unlock Gold perks.</p>')}${pan('Redeem points',[['Free water bottle','500 pts'],['10% off voucher','800 pts'],['Free shipping','300 pts']].map(r=>`<div class="srow"><div><b>${r[0]}</b><small>${r[1]}</small></div>${bt('toast',r[0]+' redeemed','Redeem')}</div>`).join(''))}</div>`);
 mk2('addresses',pan('Saved addresses',`<div class="xg">${[['Home','24 Marina Road, Chennai 600004','Default'],['Office','88 OMR, Sholinganallur, Chennai','']].map(a=>`<div class="cpn"><small class="muted">${a[2]||'Saved'}</small><b style="font-size:1.3rem;letter-spacing:0;color:var(--cream)">${a[0]}</b><small class="muted">${a[1]}</small><div class="xca">${bt('go','404.html','Edit')}${bt('go','404.html','Remove','btn btn-sm ghost')}</div></div>`).join('')}</div>`,bt('go','404.html','<i class="fa-solid fa-plus"></i> Add address')));
 mk2('support',`<div class="two2">${pan('Contact support',`<form class="pf" id="sf" onsubmit="return false" style="grid-template-columns:1fr"><label>Topic<select><option>Order help</option><option>Returns</option><option>Custom kits</option><option>Other</option></select></label><label>Message<textarea rows="5" placeholder="Tell us how we can help"></textarea></label><button class="btn" style="justify-content:center">Submit ticket</button></form>`)}${pan('Recent tickets',tb2(['Ticket','Topic','Status'],[['#S-118','Returns',stp('Resolved','Open',1)],['#S-109','Order help',stp('Resolved','Open',1)]]))}</div>`);
 // Support ticket: script validation (no browser pop-up). Valid -> 'Ticket submitted' then 404.html; coming back shows the form as first shown
{const sF=$('#sf'),sFs=[sF.querySelector('select'),sF.querySelector('textarea')];sF.noValidate=true;
 const sRule=[v=>v?'':'Please choose a topic.',v=>!v?'Please write a message.':v.length<10?'Please write at least 10 characters so we can help.':''];
 const sErr=sFs.map(f=>{const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='display:none;align-items:center;gap:6px;margin:0;font-size:.82rem;font-weight:600;color:#ff8a5c';f.after(p);return p});
 const sShow=(k,t)=>{const f=sFs[k],p=sErr[k];f.style.borderColor=t?'#ff5a1f':'';f.style.boxShadow=t?'0 0 0 4px rgba(255,90,31,.18)':'';f.setAttribute('aria-invalid',t?'true':'false');
  if(t){p.innerHTML='<i class="fa-solid fa-circle-exclamation"></i><span>'+t+'</span>';p.style.display='flex';gsap.fromTo(p,{y:-6,opacity:0},{y:0,opacity:1,duration:.3})}else p.style.display='none'};
 sFs.forEach((f,k)=>['input','change'].forEach(v=>f.addEventListener(v,()=>sShow(k,''))));
 sF.addEventListener('submit',()=>{let first=-1;sFs.forEach((f,k)=>{const t=sRule[k](f.value.trim());sShow(k,t);if(t&&first<0)first=k});
  if(first>=0){sFs[first].focus();gsap.fromTo(sFs[first],{x:-8},{x:0,duration:.5,ease:'elastic.out(1,.3)'});return}
  toast('Ticket submitted');setTimeout(()=>{location.href='404.html'},1500)});
 addEventListener('pageshow',()=>{sF.reset();sFs.forEach((f,k)=>sShow(k,''))})}
}
$('.mn').addEventListener('click',ev=>{const a=ev.target.closest('[data-act]');if(!a)return;const k=a.dataset.act;
 if(k==='toast')toast(a.dataset.m);
 if(k==='go')location.href=a.dataset.m;
 if(k==='copy'){try{navigator.clipboard.writeText(a.dataset.m)}catch(e){}toast('Code '+a.dataset.m+' copied')}
 if(k==='sw')a.classList.toggle('on');
 if(k==='st'){const on=a.classList.toggle('st-g');a.textContent=on?a.dataset.a:a.dataset.b}
 if(k==='rm'){const c=a.closest('.xc,.cpn');gsap.to(c,{scale:.8,opacity:0,duration:.35,onComplete:()=>{c.remove();toast(a.dataset.m)}})}
 if(k==='add'){const g=$('#pg');g.insertAdjacentHTML('afterbegin',xc('Assest/sq1.webp','New Product','$0 · 0 in stock','Draft',pbt));gsap.from(g.firstElementChild,{scale:.6,opacity:0,duration:.5,ease:'back.out(1.7)'});toast('Product added')}});
// ---- intro
gsap.from('.sb .nv,.sb .logo,.sb .cap',{x:-40,opacity:0,stagger:.07,duration:.6,clearProps:'transform,opacity'});gsap.from('.tb',{y:-40,opacity:0,duration:.6});gsap.from('.dv.on .stg',{y:30,opacity:0,stagger:.1,duration:.7,delay:.2,clearProps:'transform,opacity'});anim();cnt();
}
}else if(document.body.classList.contains('contact')){
// ===== CONTACT PAGE =====
document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(i=>{if(!i.classList.contains('bgi'))i.loading='lazy'});
setTimeout(()=>{const l=document.querySelector('.loader');if(l)l.style.display='none'},4000);
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia(),isFine=matchMedia('(hover:hover) and (pointer:fine)').matches,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const hd=document.getElementById('header'),nav=document.getElementById('nav'),bg=document.getElementById('burger'),toTop=document.getElementById('top');
const shut=()=>{nav.classList.remove('open');document.body.classList.remove('lock');bg.innerHTML='<i class="fa-solid fa-bars"></i>'};
bg.onclick=()=>{const o=nav.classList.toggle('open');document.body.classList.toggle('lock',o);bg.innerHTML=o?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{hd.classList.toggle('scrolled',scrollY>50);toTop.classList.toggle('show',scrollY>600)},{passive:true});
const pb=document.createElement('div');pb.className='progress';document.body.prepend(pb);
gsap.to(pb,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
if(isFine){const cu=document.createElement('div');cu.className='cursor';document.body.append(cu);const qx=gsap.quickTo(cu,'x',{duration:.4}),qy=gsap.quickTo(cu,'y',{duration:.4});addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});document.querySelectorAll('a,button,.pin').forEach(el=>{el.addEventListener('mouseenter',()=>cu.classList.add('big'));el.addEventListener('mouseleave',()=>cu.classList.remove('big'))})}
// 1. Hero: letters drop in, then dodge the cursor (wave on touch)
const rep=document.getElementById('rep');rep.innerHTML=[...rep.textContent].map(c=>`<span class="ch">${c===' '?'&nbsp;':c}</span>`).join('');
const chs=[...rep.children],qs=chs.map(c=>[gsap.quickTo(c,'x',{duration:.5,ease:'power3'}),gsap.quickTo(c,'y',{duration:.5,ease:'power3'})]);
addEventListener('load',()=>{gsap.to('.loader',{opacity:0,duration:.5,onComplete:()=>document.querySelector('.loader').style.display='none'});
 gsap.timeline({delay:.3}).from('.ct-hero .tag',{y:20,opacity:0}).from(chs,{y:()=>gsap.utils.random(-260,-100),rotation:()=>gsap.utils.random(-90,90),opacity:0,stagger:.06,duration:1.3,ease:'bounce.out'},'-=.2').from('.ct-hero p,.bub span',{y:30,opacity:0,stagger:.12},'-=.6')
  .add(()=>{if(!isFine)gsap.to(chs,{y:-14,stagger:{each:.08,repeat:-1,yoyo:true},duration:.5,ease:'sine.inOut'})})});
if(isFine)document.querySelector('.ct-hero').addEventListener('mousemove',e=>{chs.forEach((c,i)=>{const r=c.getBoundingClientRect(),cx=r.left+r.width/2-gsap.getProperty(c,'x'),cy=r.top+r.height/2-gsap.getProperty(c,'y'),dx=cx-e.clientX,dy=cy-e.clientY,d=Math.hypot(dx,dy)||1,p=d<170?(170-d)/170*70:0;qs[i][0](dx/d*p);qs[i][1](dy/d*p)})});
document.querySelector('.ct-hero').addEventListener('mouseleave',()=>qs.forEach(q=>{q[0](0);q[1](0)}));
// 2. Channel cards: flip up + ripple from the touch point
document.querySelectorAll('.ic').forEach(c=>['pointerenter','pointerdown'].forEach(v=>c.addEventListener(v,e=>{const r=c.getBoundingClientRect(),s=document.createElement('span');s.className='rip';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';c.append(s);setTimeout(()=>s.remove(),900)})));
gsap.fromTo('.ic',{rotationX:-90,opacity:0,transformPerspective:700,transformOrigin:'50% 100%'},{rotationX:0,opacity:1,stagger:.12,duration:.9,ease:'back.out(1.4)',clearProps:'opacity,transform',scrollTrigger:{trigger:'.ic-grid',start:'top 88%'}});
// 3. Form wizard: slide steps, progress bar, drawn checkmark
const stp=[...document.querySelectorAll('.stp')],wn=document.getElementById('wn'),wb=document.getElementById('wb'),wp=document.querySelector('.wprog i');let si=0;
const upd=()=>{gsap.to(wp,{scaleX:(si+1)/3,duration:.5});wb.style.visibility=si===0?'hidden':'visible';wn.innerHTML=si===1?'Send <i class="fa-solid fa-paper-plane"></i>':'Next <i class="fa-solid fa-arrow-right"></i>';if(si===2)document.querySelector('.wbtn').style.display='none'};
const go=n=>{const cur=stp[si],nx=stp[n],d=n>si?1:-1;gsap.to(cur,{x:-40*d,opacity:0,duration:.3,onComplete:()=>{cur.classList.remove('on');nx.classList.add('on');si=n;upd();gsap.fromTo(nx,{x:40*d,opacity:0},{x:0,opacity:1,duration:.4});if(n===2)gsap.to('.done circle,.done path',{strokeDashoffset:0,duration:.9,stagger:.5,ease:'power2.out'})}})};
// Script validation (no browser pop-up). All fields valid -> 'Message sent!' then 404.html; coming back shows step 1 with empty fields
const wF=document.getElementById('wiz'),wFs=[...stp[1].querySelectorAll('input,textarea')],wMail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wRule=[v=>v?'':'Please enter your name.',v=>!v?'Please enter your email address.':wMail.test(v)?'':'Please enter a valid email, like name@example.com.',v=>v?'':'Please write a message.'];
const wErr=wFs.map(f=>{const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='display:none;align-items:center;gap:6px;margin:-8px 4px 0;font-size:.85rem;font-weight:600;color:#ff8a5c';f.after(p);return p});
const wShow=(k,t)=>{const f=wFs[k],p=wErr[k];f.style.borderColor=t?'#ff5a1f':'';f.style.boxShadow=t?'0 0 0 4px rgba(255,90,31,.18)':'';f.setAttribute('aria-invalid',t?'true':'false');
  if(t){p.innerHTML='<i class="fa-solid fa-circle-exclamation"></i><span>'+t+'</span>';p.style.display='flex';gsap.fromTo(p,{y:-6,opacity:0},{y:0,opacity:1,duration:.3})}else p.style.display='none'};
wFs.forEach((f,k)=>f.addEventListener('input',()=>wShow(k,'')));
let wSent=false;
wn.onclick=()=>{if(wSent)return;if(si===1){let first=-1;wFs.forEach((f,k)=>{const t=wRule[k](f.value.trim());wShow(k,t);if(t&&first<0)first=k});
  if(first>=0){wFs[first].focus();gsap.fromTo(wFs[first],{x:-8},{x:0,duration:.5,ease:'elastic.out(1,.3)'});return}
  wSent=true;go(2);setTimeout(()=>{location.href='404.html'},2200);return}go(si+1)};
wFs.forEach(f=>{if(f.tagName==='INPUT')f.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();wn.click()}})});
wb.onclick=()=>go(si-1);upd();
addEventListener('pageshow',()=>{wSent=false;wF.reset();wFs.forEach((f,k)=>wShow(k,''));gsap.killTweensOf(stp);stp.forEach((x,k)=>x.classList.toggle('on',k===0));gsap.set(stp,{clearProps:'transform,opacity'});gsap.set('.done circle,.done path',{clearProps:'strokeDashoffset'});si=0;upd();document.querySelector('.wbtn').style.display=''});
gsap.from('.fm-img',{clipPath:'inset(0 0 0 100%)',duration:1.3,ease:'power4.out',scrollTrigger:{trigger:'.fm-img',start:'top 85%'}});
// 4. Store locator: radar map, pins drop in, tap a pin
const stores=[{n:'Marina Flagship',a:'24 Marina Road, Chennai',h:'Mon - Sat · 9AM - 8PM',u:'Assest/sq8.webp'},{n:'T. Nagar Studio',a:'12 Usman Road, T. Nagar',h:'Mon - Sat · 10AM - 9PM',u:'Assest/sq11.webp'},{n:'OMR Training Hub',a:'88 OMR, Sholinganallur',h:'Daily · 6AM - 10PM',u:'Assest/sq13.webp'}];
const pins=[...document.querySelectorAll('.pin')],sc=document.querySelector('.scard');
const showStore=i=>{const s=stores[i];pins.forEach((p,k)=>p.classList.toggle('on',k===i));sc.querySelector('img').src=s.u;sc.querySelector('h4').textContent=s.n;sc.querySelector('p').textContent=s.a;sc.querySelector('small').innerHTML='<i class="fa-regular fa-clock"></i> '+s.h;gsap.fromTo(sc,{y:30,opacity:0},{y:0,opacity:1,duration:.5})};
pins.forEach((p,i)=>p.addEventListener('click',()=>showStore(i)));showStore(0);
gsap.from(pins,{y:-140,opacity:0,stagger:.25,duration:1,ease:'bounce.out',scrollTrigger:{trigger:'.mapx',start:'top 80%'}});
// 5. Live chat: typing dots, then messages pop in (loops)
const cb=document.getElementById('cbody'),script=[['u','Hi! Do you make custom team kits?'],['a','Absolutely! How many players?'],['u','About 18, with our club logo.'],['a','Perfect. I will send a design draft today!']];
const say=async(w,t)=>{if(w==='a'){const d=document.createElement('div');d.className='msg typing';d.innerHTML='<i></i><i></i><i></i>';cb.append(d);gsap.from(d,{scale:.5,opacity:0,transformOrigin:'left bottom',duration:.3});await sleep(1100);d.remove()}const m=document.createElement('div');m.className='msg '+w;m.textContent=t;cb.append(m);gsap.from(m,{y:20,scale:.7,opacity:0,transformOrigin:w==='u'?'right bottom':'left bottom',duration:.5,ease:'back.out(2)'});await sleep(1000)};
let chatOn=false;const loop=async()=>{while(true){cb.innerHTML='';for(const [w,t] of script)await say(w,t);await sleep(3500)}};
ScrollTrigger.create({trigger:'.chat',start:'top 80%',once:true,onEnter:()=>{if(!chatOn){chatOn=true;loop()}}});
// 6. Social wall: photos scattered everywhere, they snap into a grid as you scroll
const f=innerWidth<700?.4:1;
gsap.from('.wt',{x:()=>gsap.utils.random(-320,320)*f,y:()=>gsap.utils.random(-220,220)*f,rotation:()=>gsap.utils.random(-35,35),scale:.6,ease:'none',scrollTrigger:{trigger:'.wall',start:'top 92%',end:'top 35%',scrub:true}});
// 7. Live clock (IST) + open/closed status
const faceEl=document.querySelector('.face');for(let k=0;k<12;k++){const u=document.createElement('u');u.style.setProperty('--r',k*30+'deg');faceEl.prepend(u)}
const hH=document.querySelector('.h'),hM=document.querySelector('.m'),hS=document.querySelector('.s'),bd=document.getElementById('openB'),rows=[...document.querySelectorAll('.hrs li')],info=document.getElementById('dayinfo');
let sd=null,hold=false,tmr=[],selDay=null,todayD=0,nowTxt='',nowCol='#3ddc84';
const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],notes=['Store closed. Online orders still ship on Monday.','Team kit consultations all day.','Free racquet and bike safety checks.','Coaching clinic with our trainers at 5PM.','Gear repair day. Drop off before noon.','Late fitting sessions. Book a slot at the desk.','Community meet-up at 10AM. Everyone welcome!'];
const setBadge=(t,c)=>{bd.textContent=t;bd.style.setProperty('--c',c)};
const selectDay=(d,user)=>{selDay=d;rows.forEach(li=>li.classList.toggle('sel',+li.dataset.d===d));const closed=d===0;
 info.innerHTML=`<i class="fa-solid ${closed?'fa-moon':'fa-star'}"></i><div><b>${names[d]} · ${closed?'Closed':'9AM - 8PM'}</b><p class="muted">${notes[d]}</p></div>`;
 gsap.fromTo(info,{y:16,opacity:0},{y:0,opacity:1,duration:.5});
 if(d===todayD)setBadge(nowTxt,nowCol);else setBadge(closed?'Closed all day':'Open 9AM - 8PM',closed?'#ff5a1f':'#3ddc84');
 if(!user)return;
 tmr.forEach(clearTimeout);hold=true;[hH,hM].forEach(x=>x.style.transition='transform 1.4s cubic-bezier(.6,0,.2,1)');
 if(closed){hH.style.transform='rotate(0deg)';hM.style.transform='rotate(0deg)';tmr=[setTimeout(()=>hold=false,2600)]}
 else{hH.style.transform='rotate(270deg)';hM.style.transform='rotate(0deg)';tmr=[setTimeout(()=>{hH.style.transform='rotate(600deg)';hM.style.transform='rotate(720deg)'},1500),setTimeout(()=>hold=false,3400)]}
 tmr.push(setTimeout(()=>[hH,hM].forEach(x=>x.style.transition=''),3500))};
rows.forEach(li=>{const go=()=>{selectDay(+li.dataset.d,true);gsap.fromTo(li,{scale:.96},{scale:1,duration:.6,ease:'elastic.out(1,.4)'})};li.addEventListener('click',go);li.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
const tickClock=()=>{const n=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})),h=n.getHours(),m=n.getMinutes(),s=n.getSeconds();if(sd===null)sd=s*6;else sd+=6;
 hS.style.transform=`rotate(${sd}deg)`;if(!hold){hM.style.transform=`rotate(${m*6+s/10}deg)`;hH.style.transform=`rotate(${(h%12)*30+m/2}deg)`}
 const d=n.getDay(),op=d!==0&&h>=9&&h<20;todayD=d;nowTxt=op?'Open now · closes 8PM':'Closed · opens 9AM';nowCol=op?'#3ddc84':'#ff5a1f';
 rows.forEach(li=>li.classList.toggle('today',+li.dataset.d===d));
 if(selDay===null)selectDay(d,false);else if(selDay===d)setBadge(nowTxt,nowCol)};
tickClock();setInterval(tickClock,1000);
gsap.from('.face',{rotation:-180,scale:.3,opacity:0,duration:1.4,ease:'back.out(1.4)',scrollTrigger:{trigger:'.face',start:'top 85%'}});
gsap.from('.hrs li',{x:60,opacity:0,stagger:.08,duration:.7,clearProps:'transform,opacity',scrollTrigger:{trigger:'.hrs',start:'top 88%'}});
// Headings: wipe in from the left
gsap.utils.toArray('h2').forEach(h=>gsap.fromTo(h,{clipPath:'inset(0 100% 0 0)',x:-30},{clipPath:'inset(0 -5% 0 0)',x:0,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
}else if(document.body.classList.contains('blog')){
// ===== BLOG PAGE =====
document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(i=>{if(!i.classList.contains('th')&&!i.closest('.ftimg'))i.loading='lazy'});
document.getElementById('mask').style.setProperty('--img',`url(Assest/sq1.webp)`);
setTimeout(()=>{const l=document.querySelector('.loader');if(l)l.style.display='none'},4000);
gsap.registerPlugin(ScrollTrigger,Flip);
const mm=gsap.matchMedia(),isFine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hd=document.getElementById('header'),nav=document.getElementById('nav'),bg=document.getElementById('burger'),toTop=document.getElementById('top');
const shut=()=>{nav.classList.remove('open');document.body.classList.remove('lock');bg.innerHTML='<i class="fa-solid fa-bars"></i>'};
bg.onclick=()=>{const o=nav.classList.toggle('open');document.body.classList.toggle('lock',o);bg.innerHTML=o?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{hd.classList.toggle('scrolled',scrollY>50);toTop.classList.toggle('show',scrollY>600)},{passive:true});
const pb=document.createElement('div');pb.className='progress';document.body.prepend(pb);
gsap.to(pb,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
if(isFine){const cu=document.createElement('div');cu.className='cursor';document.body.append(cu);const qx=gsap.quickTo(cu,'x',{duration:.4}),qy=gsap.quickTo(cu,'y',{duration:.4});addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});document.querySelectorAll('a,button,.pol,.tr').forEach(el=>{el.addEventListener('mouseenter',()=>cu.classList.add('big'));el.addEventListener('mouseleave',()=>cu.classList.remove('big'))})}
// 1. Hero: image-filled headline rises out of a blur
addEventListener('load',()=>{gsap.to('.loader',{opacity:0,duration:.5,onComplete:()=>document.querySelector('.loader').style.display='none'});
 gsap.timeline({delay:.3}).from('.bl-hero .tag',{y:20,opacity:0}).from('#mask',{y:90,opacity:0,filter:'blur(16px)',duration:1.4,ease:'power4.out'},'-=.2').from('.bl-hero p,.srch',{y:30,opacity:0,stagger:.15},'-=.7')});
// 2. Featured: window blinds open over the photo
gsap.to('.blinds i',{scaleY:0,stagger:.12,duration:.9,ease:'power3.inOut',scrollTrigger:{trigger:'.ftimg',start:'top 80%'}});
gsap.from('.ft>div:last-child>*',{x:50,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:'.ft',start:'top 75%'}});
// 3. Filter + search with FLIP layout animation and sliding pill
const cards=[...document.querySelectorAll('.bp')],fl=document.getElementById('filters'),pill=fl.querySelector('.pill'),qi=document.getElementById('q');let cat='all',qv='';
const movePill=(b,anim=true)=>gsap[anim?'to':'set'](pill,{x:b.offsetLeft,y:b.offsetTop,width:b.offsetWidth,height:b.offsetHeight,duration:.5,ease:'power3.out'});
const apply=()=>{const st=Flip.getState(cards);let n=0;cards.forEach(c=>{const ok=(cat==='all'||c.dataset.c===cat)&&c.querySelector('h4').textContent.toLowerCase().includes(qv);c.style.display=ok?'':'none';n+=ok});document.querySelector('.none').style.display=n?'none':'block';Flip.from(st,{duration:.7,ease:'power3.inOut',scale:true,absolute:true,onEnter:e=>gsap.fromTo(e,{opacity:0,scale:.5},{opacity:1,scale:1,duration:.6}),onLeave:e=>gsap.to(e,{opacity:0,scale:.5,duration:.4})})};
fl.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{fl.querySelector('.on').classList.remove('on');b.classList.add('on');cat=b.dataset.f;movePill(b);apply()}));
qi.addEventListener('input',()=>{qv=qi.value.trim().toLowerCase();apply()});
const syncPill=()=>movePill(fl.querySelector('.on'),false);syncPill();addEventListener('resize',syncPill);addEventListener('load',syncPill);
gsap.from('.bp',{y:60,opacity:0,stagger:.1,duration:.8,clearProps:'transform,opacity',scrollTrigger:{trigger:'.pgrid',start:'top 88%'}});
// 4. Trending: hover preview photo follows the cursor
const pv=document.querySelector('.pv'),pi=pv.querySelector('img');
gsap.set(pv,{scale:.6});
if(isFine){const px=gsap.quickTo(pv,'x',{duration:.5,ease:'power3'}),py=gsap.quickTo(pv,'y',{duration:.5,ease:'power3'});let shown=null;
 const hidePv=()=>{if(shown){shown=null;gsap.to(pv,{opacity:0,scale:.6,rotation:0,duration:.3,overwrite:'auto'})}};
 addEventListener('mousemove',e=>{const t=e.target.closest&&e.target.closest('.tr');if(!t){hidePv();return}px(e.clientX+30);py(e.clientY-95);if(shown!==t){shown=t;pi.src=t.querySelector('.th').src;gsap.to(pv,{opacity:1,scale:1,rotation:-4,duration:.4,overwrite:'auto'})}});
 addEventListener('scroll',hidePv,{passive:true});document.addEventListener('mouseleave',hidePv)}
gsap.from('.tr',{x:-60,opacity:0,stagger:.12,duration:.8,clearProps:'transform,opacity',scrollTrigger:{trigger:'.trend',start:'top 85%'}});
// 5. Authors: stacked photo pile fans out as you scroll
mm.add('(min-width:601px)',()=>{const sp=innerWidth<900?120:200;gsap.fromTo('.pol',{x:0,y:0,rotation:i=>[-2,2,-1,1][i]},{x:i=>(i-1.5)*sp,y:i=>[20,-10,-10,20][i],rotation:i=>(i-1.5)*8,ease:'none',scrollTrigger:{trigger:'.fan',start:'top 80%',end:'top 30%',scrub:true}})});
mm.add('(max-width:600px)',()=>{gsap.fromTo('.pol',{x:0,y:0,rotation:i=>[-2,2,-1,1][i]},{x:i=>(i-1.5)*62,y:i=>[40,-30,-30,40][i],rotation:i=>(i-1.5)*9,ease:'none',scrollTrigger:{trigger:'.fan',start:'top 85%',end:'top 35%',scrub:true}})});
// 6. Stories: 3D ring that spins on its own, faster when you scroll, and can be dragged
const cyl=document.querySelector('.cyl'),st3=document.getElementById('stage3d');let rot=0,vel=0,dn3=false,lx=0;
gsap.ticker.add(()=>{if(!dn3)rot-=.18+vel;vel*=.94;gsap.set(cyl,{rotationY:rot})});
ScrollTrigger.create({trigger:st3,start:'top bottom',end:'bottom top',onUpdate:s=>{vel=gsap.utils.clamp(-4,4,s.getVelocity()/700)}});
st3.addEventListener('pointerdown',e=>{dn3=true;lx=e.clientX;st3.setPointerCapture(e.pointerId)});
st3.addEventListener('pointermove',e=>{if(dn3){rot+=(e.clientX-lx)*.4;lx=e.clientX}});
['pointerup','pointercancel'].forEach(v=>st3.addEventListener(v,()=>dn3=false));
gsap.from(cyl,{scale:.3,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:st3,start:'top 85%'}});
// 7. Newsletter: envelope opens and the letter slides out
const fp=document.querySelector('.flap'),lt=document.querySelector('.letter');
gsap.timeline({scrollTrigger:{trigger:'#env',start:'top 80%',once:true}}).to(fp,{rotationX:180,duration:.7,ease:'power2.inOut'}).set(fp,{zIndex:1},'-=.35').to(lt,{y:-85,duration:.8,ease:'back.out(1.5)'}).to(lt,{y:-95,duration:1.4,repeat:-1,yoyo:true,ease:'sine.inOut'});
document.querySelector('.nl .sub').addEventListener('submit',e=>{const b=e.target.querySelector('button'),t=b.innerHTML;b.innerHTML='<i class="fa-solid fa-check"></i> Subscribed!';e.target.reset();gsap.fromTo('#env',{rotation:-6},{rotation:0,duration:.8,ease:'elastic.out(1,.3)'});setTimeout(()=>b.innerHTML=t,2500)});
// Newsletter: script validation (no browser pop-up). Valid email -> 404.html; coming back shows an empty field
const subF=document.querySelector('.nl .sub');
if(subF){subF.noValidate=true;
 const subI=subF.querySelector('input'),subB=subF.querySelector('button'),subT=subB.innerHTML,subW=document.createElement('div'),subE=document.createElement('span');
 subW.setAttribute('role','alert');subW.style.cssText='display:flex;justify-content:center;min-height:46px;margin-top:14px';
 subE.style.cssText='display:none;align-items:center;gap:8px;padding:9px 18px;border-radius:50px;background:rgba(11,15,20,.9);border:1px solid #ff5a1f;color:#f3efe7;font-size:.92rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.35)';
 subW.append(subE);subF.after(subW);subF.style.transition='box-shadow .3s';
 const subMsg=t=>{subF.style.boxShadow=t?'0 0 0 3px rgba(255,90,31,.75)':'';subI.setAttribute('aria-invalid',t?'true':'false');
  if(t){subE.innerHTML='<i class="fa-solid fa-circle-exclamation" style="color:#ff5a1f;font-size:1.05rem"></i><span>'+t+'</span>';subE.style.display='inline-flex';gsap.fromTo(subE,{y:-10,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'})}
  else subE.style.display='none'};
 subI.addEventListener('input',()=>subMsg(''));
 subF.parentElement.addEventListener('submit',e=>{if(e.target!==subF)return;const v=subI.value.trim();
  const err=!v?'Please enter your email address.':!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'Please enter a valid email, like name@example.com.':'';
  if(err){e.preventDefault();e.stopPropagation();subMsg(err);subI.focus();gsap.fromTo(subF,{x:-8},{x:0,duration:.6,ease:'elastic.out(1,.3)'})}},true);
 subF.addEventListener('submit',()=>setTimeout(()=>{location.href='404.html'},1500));
 addEventListener('pageshow',()=>{subF.reset();subMsg('');subB.innerHTML=subT})}
// Headings: 3D flip up
gsap.utils.toArray('h2').forEach(h=>gsap.from(h,{rotationX:-80,y:30,opacity:0,transformPerspective:600,transformOrigin:'50% 100%',duration:1,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
// Search: script validation (no browser pop-up). Valid search -> 404.html; coming back shows an empty field and all articles
const srF=document.querySelector('.srch');
if(srF){srF.noValidate=true;
 const srI=srF.querySelector('input'),srW=document.createElement('div'),srE=document.createElement('span');
 srW.setAttribute('role','alert');srW.style.cssText='display:flex;justify-content:center;min-height:46px;margin-top:14px';
 srE.style.cssText='display:none;align-items:center;gap:8px;padding:9px 18px;border-radius:50px;background:rgba(11,15,20,.9);border:1px solid #ff5a1f;color:#f3efe7;font-size:.92rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.35)';
 srW.append(srE);srF.after(srW);
 const srMsg=t=>{srF.style.borderColor=t?'#ff5a1f':'';srF.style.boxShadow=t?'0 0 0 3px rgba(255,90,31,.75)':'';srI.setAttribute('aria-invalid',t?'true':'false');
  if(t){srE.innerHTML='<i class="fa-solid fa-circle-exclamation" style="color:#ff5a1f;font-size:1.05rem"></i><span>'+t+'</span>';srE.style.display='inline-flex';gsap.fromTo(srE,{y:-10,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'})}
  else srE.style.display='none'};
 srI.addEventListener('input',()=>srMsg(''));
 srF.parentElement.addEventListener('submit',e=>{if(e.target!==srF)return;const v=srI.value.trim();
  const err=!v?'Please enter a search term.':v.length<2?'Please enter at least 2 characters.':'';
  if(err){e.preventDefault();e.stopPropagation();srMsg(err);srI.focus();gsap.fromTo(srF,{x:-8},{x:0,duration:.6,ease:'elastic.out(1,.3)'})}},true);
 srF.addEventListener('submit',()=>{const b=srF.querySelector('button');b.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Searching...';setTimeout(()=>{location.href='404.html'},900)});
 addEventListener('pageshow',e=>{srF.reset();srMsg('');if(e.persisted)srI.dispatchEvent(new Event('input'));srF.querySelector('button').textContent='Search'})}
// Articles grid: hold its height while the cards animate so the Trending section never slides up over them
const pgG=document.querySelector('.pgrid');
if(pgG){let pgT;const pgLock=()=>{clearTimeout(pgT);gsap.killTweensOf(pgG);pgG.style.minHeight=pgG.offsetHeight+'px';
  pgT=setTimeout(()=>{const old=pgG.offsetHeight;pgG.style.minHeight='';const nh=pgG.offsetHeight;pgG.style.minHeight=old+'px';gsap.to(pgG,{minHeight:nh,duration:.4,ease:'power2.out',onComplete:()=>pgG.style.minHeight=''})},1000)};
 document.getElementById('filters').addEventListener('click',e=>{if(e.target.closest('button'))pgLock()},true);
 document.querySelector('.srch').addEventListener('input',pgLock,true)}
}else if(document.body.classList.contains('services')){
// ===== SERVICES PAGE =====
document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(i=>{if(!i.closest('.sv-hero'))i.loading='lazy'});
setTimeout(()=>{const l=document.querySelector('.loader');if(l)l.style.display='none'},4000);
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia(),isFine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hd=document.getElementById('header'),nav=document.getElementById('nav'),bg=document.getElementById('burger'),toTop=document.getElementById('top');
const shut=()=>{nav.classList.remove('open');document.body.classList.remove('lock');bg.innerHTML='<i class="fa-solid fa-bars"></i>'};
bg.onclick=()=>{const o=nav.classList.toggle('open');document.body.classList.toggle('lock',o);bg.innerHTML=o?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{hd.classList.toggle('scrolled',scrollY>50);toTop.classList.toggle('show',scrollY>600)},{passive:true});
const pb=document.createElement('div');pb.className='progress';document.body.prepend(pb);
gsap.to(pb,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
if(isFine){const cu=document.createElement('div');cu.className='cursor';document.body.append(cu);const qx=gsap.quickTo(cu,'x',{duration:.4}),qy=gsap.quickTo(cu,'y',{duration:.4});addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});document.querySelectorAll('a,button,.sc,.plan,.cmp').forEach(el=>{el.addEventListener('mouseenter',()=>cu.classList.add('big'));el.addEventListener('mouseleave',()=>cu.classList.remove('big'))})}
// 1. Hero: typewriter + hexagon spin-in
const words=['Delivery','Custom Kits','Gear Repair','Coaching'],ty=document.getElementById('typed');let wi=0,ci=0,del=false;
const tick=()=>{const w=words[wi];ci+=del?-1:1;ty.textContent=w.slice(0,ci);let t=del?50:110;if(!del&&ci===w.length){del=true;t=1400}else if(del&&ci===0){del=false;wi=(wi+1)%words.length;t=300}setTimeout(tick,t)};tick();
addEventListener('load',()=>{gsap.to('.loader',{opacity:0,duration:.5,onComplete:()=>document.querySelector('.loader').style.display='none'});
 gsap.timeline({delay:.3}).from('.hex',{scale:.3,rotation:-40,opacity:0,duration:1.3,ease:'back.out(1.4)'}).from('.o',{opacity:0,stagger:.15,duration:.8},'-=.6').from('.sv-hero .tag,.sv-hero h1,.sv-hero p,.sv-hero .hero-btns',{y:40,opacity:0,stagger:.12,clearProps:'transform,opacity'},'-=1.2')});
// 2. Cards: blur-rise + cursor-tracking glow
document.querySelectorAll('.sc').forEach(c=>{if(isFine)c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')})});
gsap.fromTo('.sc',{y:70,opacity:0,filter:'blur(10px)'},{y:0,opacity:1,filter:'blur(0px)',stagger:.1,duration:.9,ease:'power3.out',clearProps:'filter,transform,opacity',scrollTrigger:{trigger:'.svc-grid',start:'top 88%'}});
// 3. Process: numbers fill with colour as you scroll, photos wipe in
gsap.utils.toArray('.step').forEach(s=>{gsap.to(s.querySelector('.num'),{backgroundPositionX:'0%',ease:'none',scrollTrigger:{trigger:s,start:'top 80%',end:'top 40%',scrub:true}});gsap.fromTo(s.querySelector('img'),{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.1,ease:'power4.out',scrollTrigger:{trigger:s,start:'top 85%'}})});
// 4. Before/after slider (drag, auto-demo)
const cmp=document.getElementById('cmp');let drag=false;
const setP=x=>{const r=cmp.getBoundingClientRect();cmp.style.setProperty('--p',Math.min(100,Math.max(0,(x-r.left)/r.width*100))+'%')};
cmp.addEventListener('pointerdown',e=>{drag=true;cmp.setPointerCapture(e.pointerId);gsap.killTweensOf(cmp);setP(e.clientX)});
cmp.addEventListener('pointermove',e=>{if(drag)setP(e.clientX)});
['pointerup','pointercancel'].forEach(v=>cmp.addEventListener(v,()=>drag=false));
gsap.timeline({scrollTrigger:{trigger:cmp,start:'top 75%',once:true}}).fromTo(cmp,{'--p':'4%'},{'--p':'96%',duration:2,ease:'power2.inOut'}).to(cmp,{'--p':'50%',duration:1.2,ease:'power2.out'});
// 5. Plans: 3D flip-in, price roll on billing toggle
const bt=document.getElementById('billT');let yearly=false;
bt.onclick=()=>{yearly=!yearly;bt.classList.toggle('on',yearly);document.querySelectorAll('.pr b').forEach(b=>{const o={v:+b.textContent};gsap.to(o,{v:+(yearly?b.dataset.y:b.dataset.m),duration:.9,ease:'power3.out',onUpdate:()=>b.textContent=Math.round(o.v)})})};
gsap.fromTo('.plan',{rotationY:90,opacity:0,transformPerspective:900},{rotationY:0,opacity:1,stagger:.18,duration:1.1,ease:'back.out(1.3)',clearProps:'opacity',scrollTrigger:{trigger:'.plans',start:'top 88%'}});
// 6. Delivery tracker: truck drives as you scroll
const stn=[...document.querySelectorAll('.stn')],truck=document.querySelector('.truck'),rl=document.querySelector('.rl'),road=document.querySelector('.road'),tk=document.querySelector('.track2');
const lit=p=>stn.forEach((el,i)=>el.classList.toggle('on',p>=i/(stn.length-1)-.03));
mm.add('(min-width:701px)',()=>{gsap.set(truck,{y:0});ScrollTrigger.create({trigger:tk,start:'top 75%',end:'bottom 55%',scrub:true,onUpdate:s=>{gsap.set(truck,{x:road.offsetWidth*s.progress,y:0});gsap.set(rl,{scaleX:s.progress,scaleY:1});lit(s.progress)}})});
mm.add('(max-width:700px)',()=>{gsap.set(truck,{x:0});ScrollTrigger.create({trigger:tk,start:'top 75%',end:'bottom 55%',scrub:true,onUpdate:s=>{gsap.set(truck,{y:road.offsetHeight*s.progress,x:0});gsap.set(rl,{scaleY:s.progress,scaleX:1});lit(s.progress)}})});
// 7. FAQ: smooth accordion + image iris-in
document.querySelectorAll('.fq').forEach((f,i)=>{const a=f.querySelector('.fa');if(i===0){f.classList.add('open');gsap.set(a,{height:'auto'})}
 f.querySelector('button').onclick=()=>{const was=f.classList.contains('open');document.querySelectorAll('.fq.open').forEach(x=>{x.classList.remove('open');gsap.to(x.querySelector('.fa'),{height:0,duration:.5,ease:'power3.inOut'})});if(!was){f.classList.add('open');gsap.to(a,{height:'auto',duration:.5,ease:'power3.inOut'})}}});
gsap.fromTo('.faqimg>img',{scale:1.4,clipPath:'inset(18% 18% 18% 18% round 30px)'},{scale:1,clipPath:'inset(0% 0% 0% 0% round 30px)',duration:1.4,ease:'power4.out',scrollTrigger:{trigger:'.faqimg',start:'top 88%'}});
// Headings: skew-in
gsap.utils.toArray('h2').forEach(h=>gsap.from(h,{skewY:6,y:40,opacity:0,transformOrigin:'left top',duration:1,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
}else if(!document.body.classList.contains('about')){
// ===== HOME PAGE =====
// Safety: never leave the loader stuck
setTimeout(()=>{const l=document.querySelector('.loader');if(l)l.style.display='none'},4000);
// Images: Unsplash WEBP (q=60, resized to stay under 100KB) with gradient fallback
document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(i=>{i.loading='lazy'});
if(innerWidth<900)document.querySelectorAll('[data-aos=fade-left],[data-aos=fade-right],[data-aos=flip-left]').forEach(e=>e.dataset.aos='fade-up');
AOS.init({duration:900,once:true,easing:'ease-out-cubic'});
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();
// loader + hero intro
window.addEventListener('load',()=>{
  const tl=gsap.timeline();
  tl.to('.loader',{opacity:0,duration:.6,delay:.4,onComplete:()=>document.querySelector('.loader').style.display='none'})
    .from('.hero .line span',{yPercent:110,duration:1,stagger:.15,ease:'power4.out'},'-=.2')
    .from('.hero .tag,.hero p,.hero-btns,.hero-mini',{y:30,opacity:0,stagger:.12},'-=.6')
    .from('.hi',{scale:.6,opacity:0,y:60,stagger:.15,duration:1,ease:'back.out(1.5)'},'-=1')
    .from('.chip,.ring',{scale:0,stagger:.1,ease:'elastic.out(1,.5)',duration:1},'-=.6');
});
// hero mouse parallax
const art=document.getElementById('heroArt');
if(matchMedia('(hover:hover)').matches){
  document.querySelector('.hero').addEventListener('mousemove',e=>{
    const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    art.querySelectorAll('[data-depth]').forEach(el=>gsap.to(el,{x:x*el.dataset.depth,y:y*el.dataset.depth,duration:.8,overwrite:'auto'}));
  });
  // magnetic buttons
  document.querySelectorAll('.magnetic').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.3,duration:.3})});
    b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
  // 3D tilt on category tiles
  document.querySelectorAll('.tilt').forEach(c=>{
    c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();gsap.to(c,{rotationY:((e.clientX-r.left)/r.width-.5)*12,rotationX:-((e.clientY-r.top)/r.height-.5)*12,transformPerspective:800,duration:.4})});
    c.addEventListener('mouseleave',()=>gsap.to(c,{rotationX:0,rotationY:0,duration:.6}));
  });
}
// image reveal (about)
document.querySelectorAll('.reveal').forEach(r=>gsap.from(r,{clipPath:'inset(0 100% 0 0)',duration:1.4,ease:'power4.out',scrollTrigger:{trigger:r,start:'top 85%'}}));
// gallery parallax
mm.add('(min-width:601px)',()=>{
  document.querySelectorAll('.gal img').forEach(img=>gsap.to(img,{y:img.dataset.speed,ease:'none',scrollTrigger:{trigger:'.gal',start:'top bottom',end:'bottom top',scrub:true}}));
});
// counters
document.querySelectorAll('.cnt').forEach(c=>{
  const o={v:0};
  gsap.to(o,{v:+c.dataset.n,duration:2.2,ease:'power2.out',scrollTrigger:{trigger:c,start:'top 90%',once:true},onUpdate:()=>c.textContent=Math.round(o.v).toLocaleString()+(c.dataset.n>=1000?'+':'')});
});
// section headings split reveal
gsap.utils.toArray('h2').forEach(h=>gsap.fromTo(h,{clipPath:'inset(0 0 100% 0)',y:40},{clipPath:'inset(0 0 -15% 0)',y:0,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
gsap.to('.marquee',{skewX:-4,scrollTrigger:{trigger:'.marquee',scrub:1}});
// header, menu, active link, back-to-top
const hd=document.getElementById('header'),nav=document.getElementById('nav'),bg=document.getElementById('burger'),toTop=document.getElementById('top');
bg.onclick=()=>{nav.classList.toggle('open');bg.innerHTML=nav.classList.contains('open')?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'};
nav.querySelectorAll('a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');bg.innerHTML='<i class="fa-solid fa-bars"></i>'});
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const links=[...nav.querySelectorAll('a:not(.btn)')];
addEventListener('scroll',()=>{
  hd.classList.toggle('scrolled',scrollY>50);toTop.classList.toggle('show',scrollY>600);
  links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s){const r=s.getBoundingClientRect();a.classList.toggle('active',r.top<=200&&r.bottom>200)}});
},{passive:true});

// ===== Creative layer v2 =====
const pb=document.createElement('div');pb.className='progress';document.body.prepend(pb);
gsap.to(pb,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  const cu=document.createElement('div');cu.className='cursor';document.body.append(cu);
  const qx=gsap.quickTo(cu,'x',{duration:.4}),qy=gsap.quickTo(cu,'y',{duration:.4});
  addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});
  document.querySelectorAll('a,button,.card,.cat,.srv').forEach(el=>{el.addEventListener('mouseenter',()=>cu.classList.add('big'));el.addEventListener('mouseleave',()=>cu.classList.remove('big'))});
}
// hero scroll-out
gsap.to('.hero-art',{yPercent:-10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero-text',{opacity:.2,y:-60,ease:'none',scrollTrigger:{trigger:'.hero',start:'center top',end:'bottom top',scrub:true}});
// about
gsap.from('.ticks li',{x:-40,opacity:0,stagger:.15,duration:.8,scrollTrigger:{trigger:'.ticks',start:'top 88%'}});
gsap.from('.badge',{scale:0,rotation:-180,ease:'back.out(1.7)',duration:1.2,scrollTrigger:{trigger:'.badge',start:'top 92%'}});
// categories, gallery, blog wipes
gsap.from('.cat img',{scale:1.35,duration:1.6,ease:'power3.out',stagger:.12,scrollTrigger:{trigger:'.cats',start:'top 85%'}});
gsap.from('.gal>div',{clipPath:'inset(100% 0 0 0)',duration:1.3,stagger:.18,ease:'power4.out',scrollTrigger:{trigger:'.gal',start:'top 85%'}});
gsap.from('.post .pimg',{clipPath:'inset(0 0 100% 0)',duration:1.2,stagger:.15,ease:'power4.out',scrollTrigger:{trigger:'#blog .grid3',start:'top 85%'}});
gsap.from('.stats .grid4>div',{y:50,opacity:0,scale:.8,stagger:.15,ease:'back.out(1.7)',duration:.9,scrollTrigger:{trigger:'.stats',start:'top 85%'}});
gsap.from('.info li',{x:-40,opacity:0,stagger:.15,duration:.8,scrollTrigger:{trigger:'.info',start:'top 90%'}});
gsap.from('.fgrid>div',{y:40,opacity:0,stagger:.12,duration:.9,scrollTrigger:{trigger:'.footer',start:'top 92%'}});
// desktop-only parallax (kept light on phones)
mm.add('(min-width:901px)',()=>{
  gsap.utils.toArray('.about-imgs img').forEach((im,i)=>gsap.to(im,{yPercent:i?-8:8,scale:1.12,ease:'none',scrollTrigger:{trigger:'.about-imgs',scrub:true}}));
  gsap.to('.cta>img',{yPercent:15,scale:1.2,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});
});
// lock scroll while menu is open
bg.addEventListener('click',()=>document.body.classList.toggle('lock',nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('lock')));

// ===== Creative layer v3 =====
const isFine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const boom=(x,y)=>{for(let i=0;i<26;i++){const d=document.createElement('i');d.className='conf';d.style.cssText=`left:${x}px;top:${y}px;background:${['#ff5a1f','#f3efe7','#ffb199'][i%3]}`;document.body.append(d);gsap.to(d,{x:gsap.utils.random(-150,150),y:gsap.utils.random(-170,90),rotation:gsap.utils.random(-360,360),opacity:0,duration:1.3,ease:'power3.out',onComplete:()=>d.remove()})}};
// hero: rising sport icons + mouse spotlight
const hero=document.querySelector('.hero');
['fa-futbol','fa-basketball','fa-dumbbell','fa-person-running','fa-trophy','fa-medal','fa-bolt','fa-table-tennis-paddle-ball'].forEach((ic,i)=>{if(innerWidth<600&&i>4)return;const p=document.createElement('i');p.className='fa-solid '+ic+' ptc';p.style.cssText=`left:${6+i*12}%;font-size:${16+i%3*10}px;animation-duration:${9+i*1.7}s;animation-delay:${-i*2}s`;hero.prepend(p)});
if(isFine)hero.addEventListener('mousemove',e=>{hero.style.setProperty('--mx',e.clientX+'px');hero.style.setProperty('--my',(e.clientY-hero.getBoundingClientRect().top)+'px')});
// second marquee row (outlined, reverse direction, crosses the first)
const mq=document.querySelector('.marquee'),mq2=mq.cloneNode(true);mq2.removeAttribute('id');mq2.classList.add('rev');mq.after(mq2);
// categories: image follows cursor inside tile
if(isFine)document.querySelectorAll('.cat').forEach(c=>{const im=c.querySelector('img');c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();im.style.translate=`${-((e.clientX-r.left)/r.width-.5)*30}px ${-((e.clientY-r.top)/r.height-.5)*30}px`});c.addEventListener('mouseleave',()=>im.style.translate='')});
// products: wishlist hearts
document.querySelectorAll('.card .pimg').forEach(p=>{const h=document.createElement('button');h.className='heart';h.setAttribute('aria-label','Wishlist');h.innerHTML='<i class="fa-regular fa-heart"></i>';h.onclick=()=>{const on=h.classList.toggle('on');h.innerHTML=`<i class="fa-${on?'solid':'regular'} fa-heart"></i>`;if(on){const r=h.getBoundingClientRect();boom(r.left+18,r.top+18)}};p.append(h)});
// stats: elastic pop when counting ends
ScrollTrigger.create({trigger:'.stats',start:'top 85%',once:true,onEnter:()=>gsap.delayedCall(2.2,()=>gsap.fromTo('.cnt',{scale:1.35},{scale:1,duration:1,ease:'elastic.out(1,.4)',stagger:.1}))});
// lookbook labels (accordion on desktop)
['Strength','Speed','Teamwork','Endurance'].forEach((t,i)=>{const g=document.querySelectorAll('.gal>div')[i];if(g)g.dataset.label=t});
// reviews: rotating spotlight
const rv=[...document.querySelectorAll('.rev')];let ri=0;setInterval(()=>{rv.forEach((r,i)=>r.classList.toggle('on',i===ri));ri=(ri+1)%rv.length},2600);
// forms: confetti on submit
document.querySelectorAll('.sub,.form').forEach(f=>f.addEventListener('submit',()=>{const b=f.querySelector('button'),r=b.getBoundingClientRect(),t=b.innerHTML;boom(r.left+r.width/2,r.top+r.height/2);b.innerHTML='<i class="fa-solid fa-check"></i> Done!';f.reset();setTimeout(()=>b.innerHTML=t,2500)}));
// Subscribe: script validation (no browser pop-up). Valid email -> 404.html; coming back shows an empty field
const subF=document.querySelector('.cta .sub');
if(subF){subF.noValidate=true;
 const subI=subF.querySelector('input'),subW=document.createElement('div'),subE=document.createElement('span');
 subW.setAttribute('role','alert');subW.style.cssText='display:flex;justify-content:center;min-height:46px;margin-top:14px';
 subE.style.cssText='display:none;align-items:center;gap:8px;padding:9px 18px;border-radius:50px;background:rgba(11,15,20,.9);border:1px solid #ff5a1f;color:#f3efe7;font-size:.92rem;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.35)';
 subW.append(subE);subF.after(subW);subF.style.transition='box-shadow .3s';
 const subMsg=t=>{subF.style.boxShadow=t?'0 0 0 3px rgba(255,90,31,.75)':'';subI.setAttribute('aria-invalid',t?'true':'false');
  if(t){subE.innerHTML='<i class="fa-solid fa-circle-exclamation" style="color:#ff5a1f;font-size:1.05rem"></i><span>'+t+'</span>';subE.style.display='inline-flex';gsap.fromTo(subE,{y:-10,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'})}
  else subE.style.display='none'};
 subI.addEventListener('input',()=>subMsg(''));
 subF.parentElement.addEventListener('submit',e=>{if(e.target!==subF)return;const v=subI.value.trim();
  const err=!v?'Please enter your email address.':!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'Please enter a valid email, like name@example.com.':'';
  if(err){e.preventDefault();e.stopPropagation();subMsg(err);subI.focus();gsap.fromTo(subF,{x:-8},{x:0,duration:.6,ease:'elastic.out(1,.3)'})}},true);
 subF.addEventListener('submit',()=>setTimeout(()=>{location.href='404.html'},1500));
 const subB=subF.querySelector('button'),subT=subB.innerHTML;
 addEventListener('pageshow',()=>{subF.reset();subMsg('');subB.innerHTML=subT})}
// Contact form: script validation (no browser pop-up). All fields valid -> 404.html; coming back shows empty fields
const cF=document.querySelector('#contact .form');
if(cF){cF.noValidate=true;
 const cFs=[...cF.querySelectorAll('input,textarea')],cMail=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 const cRule=[v=>v?'':'Please enter your name.',v=>!v?'Please enter your email address.':cMail.test(v)?'':'Please enter a valid email, like name@example.com.',v=>v?'':'Please write a message.'];
 const cErr=cFs.map(f=>{const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='display:none;align-items:center;gap:6px;margin:-8px 4px 0;font-size:.85rem;font-weight:600;color:#ff8a5c';f.after(p);return p});
 const cShow=(k,t)=>{const f=cFs[k],p=cErr[k];f.style.borderColor=t?'#ff5a1f':'';f.style.boxShadow=t?'0 0 0 4px rgba(255,90,31,.18)':'';f.setAttribute('aria-invalid',t?'true':'false');
  if(t){p.innerHTML='<i class="fa-solid fa-circle-exclamation"></i><span>'+t+'</span>';p.style.display='flex';gsap.fromTo(p,{y:-6,opacity:0},{y:0,opacity:1,duration:.3})}else p.style.display='none'};
 cFs.forEach((f,k)=>f.addEventListener('input',()=>cShow(k,'')));
 cF.parentElement.addEventListener('submit',e=>{if(e.target!==cF)return;let first=-1;
  cFs.forEach((f,k)=>{const t=cRule[k](f.value.trim());cShow(k,t);if(t&&first<0)first=k});
  if(first>=0){e.preventDefault();e.stopPropagation();cFs[first].focus();gsap.fromTo(cF,{x:-8},{x:0,duration:.6,ease:'elastic.out(1,.3)'})}},true);
 cF.addEventListener('submit',()=>setTimeout(()=>{location.href='404.html'},1500));
 const cB=cF.querySelector('button'),cT=cB.innerHTML;
 addEventListener('pageshow',()=>{cF.reset();cFs.forEach((f,k)=>cShow(k,''));cB.innerHTML=cT})}

}else{
// ===== ABOUT PAGE =====
// Shared: images (Unsplash WEBP, <100KB) with fallback
document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(i=>{if(!i.closest('.ab-hero'))i.loading='lazy'});
setTimeout(()=>{const l=document.querySelector('.loader');if(l)l.style.display='none'},4000);
if(innerWidth<900)document.querySelectorAll('[data-aos=fade-left],[data-aos=fade-right]').forEach(e=>e.dataset.aos='fade-up');
AOS.init({duration:900,once:true});
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia(),isFine=matchMedia('(hover:hover) and (pointer:fine)').matches;
// Header, menu, progress bar, cursor, back-to-top
const hd=document.getElementById('header'),nav=document.getElementById('nav'),bg=document.getElementById('burger'),toTop=document.getElementById('top');
const shut=()=>{nav.classList.remove('open');document.body.classList.remove('lock');bg.innerHTML='<i class="fa-solid fa-bars"></i>'};
bg.onclick=()=>{const o=nav.classList.toggle('open');document.body.classList.toggle('lock',o);bg.innerHTML=o?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>{hd.classList.toggle('scrolled',scrollY>50);toTop.classList.toggle('show',scrollY>600)},{passive:true});
const pb=document.createElement('div');pb.className='progress';document.body.prepend(pb);
gsap.to(pb,{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
if(isFine){const cu=document.createElement('div');cu.className='cursor';document.body.append(cu);const qx=gsap.quickTo(cu,'x',{duration:.4}),qy=gsap.quickTo(cu,'y',{duration:.4});addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});document.querySelectorAll('a,button,.tm,.slide,.vcard').forEach(el=>{el.addEventListener('mouseenter',()=>cu.classList.add('big'));el.addEventListener('mouseleave',()=>cu.classList.remove('big'))})}

// 1. Banner: curtain strips open + 3D letter drop
const split=el=>{const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(' ');return}const s=document.createElement('span');s.className='wd';[...w].forEach(ch=>{const k=document.createElement('span');k.className='ch';k.textContent=ch;s.append(k)});f.append(s)});c.replaceWith(f)}else walk(c)});walk(el)};
split(document.getElementById('abTitle'));
addEventListener('load',()=>{
  gsap.to('.loader',{opacity:0,duration:.5,onComplete:()=>document.querySelector('.loader').style.display='none'});
  gsap.timeline({delay:.3}).to('.curtain i',{yPercent:-100,duration:1.1,stagger:.1,ease:'power4.inOut'})
   .from('.ab-hero .ch',{rotationX:-90,y:60,opacity:0,stagger:.045,duration:.9,ease:'back.out(1.7)'},'-=.5')
   .from('.ab-hero .tag,.crumbs',{y:20,opacity:0,stagger:.15},'-=.4');
});
// 2. Story: words light up as you scroll
const st=document.getElementById('story');st.innerHTML=st.textContent.trim().split(' ').map(w=>`<span class="sw">${w}</span>`).join(' ');
gsap.to('.sw',{color:'#f3efe7',stagger:.1,ease:'none',scrollTrigger:{trigger:st,start:'top 80%',end:'bottom 45%',scrub:true}});
gsap.from('.blob',{scale:.5,rotation:-30,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'.blob',start:'top 85%'}});
// 3. Timeline: line draws itself, cards fly in from alternating sides
gsap.to('.tl-line',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.tl',start:'top 70%',end:'bottom 70%',scrub:true}});
document.querySelectorAll('.tl-item').forEach((it,i)=>gsap.from(it,{x:innerWidth<700?40:(i%2?80:-80),opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:it,start:'top 85%'}}));
// 4. Values: sticky cards stack and shrink back
gsap.utils.toArray('.vcard').forEach((c,i,a)=>{if(a[i+1])gsap.to(c,{scale:.92,opacity:.45,ease:'none',scrollTrigger:{trigger:a[i+1],start:'top 85%',end:'top 20%',scrub:true}})});
// 5. Team: colour spotlight follows the cursor
document.querySelectorAll('.tm img').forEach(i=>{const c=i.cloneNode();c.className='rv';c.alt='';i.after(c)});
if(isFine)document.querySelectorAll('.tm').forEach(t=>{t.addEventListener('mousemove',e=>{const b=t.getBoundingClientRect();t.style.setProperty('--x',e.clientX-b.left+'px');t.style.setProperty('--y',e.clientY-b.top+'px')});t.addEventListener('mouseleave',()=>t.style.setProperty('--x','-300px'))});
// 6. Odometer counters (rolling digits)
document.querySelectorAll('.odo').forEach(o=>{const n=o.dataset.n,s=o.dataset.s||'';o.innerHTML='';const cols=[...n].map(d=>{const c=document.createElement('div');c.className='col';c.innerHTML=[...Array(10).keys()].map(k=>`<span>${k}</span>`).join('');o.append(c);return[c,+d]});if(s){const x=document.createElement('span');x.textContent=s;o.append(x)}
  ScrollTrigger.create({trigger:o,start:'top 90%',once:true,onEnter:()=>cols.forEach(([c,d],i)=>gsap.to(c,{yPercent:-d*10,duration:2+i*.4,ease:'power4.out'}))})});
// 7. Zone explorer: circle-wipe image swap + auto-play with progress bar
const zt=[...document.querySelectorAll('.zt')],zi=[...document.querySelectorAll('.zi')],zbT=document.querySelector('.zbadge span');
let zc=0,zTw,zBusy=false;
const zStart=()=>{if(zTw)zTw.kill();gsap.set('.zp',{scaleX:0});zTw=gsap.to(zt[zc].querySelector('.zp'),{scaleX:1,duration:4.5,ease:'none',onComplete:()=>zShow((zc+1)%zt.length)})};
const zShow=n=>{if(zBusy||n===zc)return;zBusy=true;const prev=zi[zc];zc=n;if(zTw)zTw.kill();
  zt.forEach((t,i)=>t.classList.toggle('active',i===n));gsap.set('.zp',{scaleX:0});
  gsap.set(zi[n],{opacity:1,zIndex:3,clipPath:'circle(0% at 50% 50%)'});
  gsap.to(zi[n],{clipPath:'circle(150% at 50% 50%)',duration:1.1,ease:'power3.inOut',onComplete:()=>{gsap.set(prev,{opacity:0,zIndex:1});prev.classList.remove('on');zi[n].classList.add('on');gsap.set(zi[n],{zIndex:2,clearProps:'clipPath'});zBusy=false;zStart()}});
  gsap.fromTo(zi[n],{scale:1.3},{scale:1,duration:1.6,ease:'power2.out'});
  zbT.textContent=zt[n].querySelector('strong').textContent;document.querySelector('.zcount b').textContent='0'+(n+1);gsap.fromTo('.zbadge',{y:20,opacity:0},{y:0,opacity:1,duration:.7,delay:.4})};
zt.forEach((t,i)=>t.addEventListener('click',()=>zShow(i)));
const zw=document.querySelector('.zones');
if(isFine){zw.addEventListener('mouseenter',()=>zTw&&zTw.pause());zw.addEventListener('mouseleave',()=>zTw&&zTw.resume())}
gsap.fromTo('.zt',{x:-50,opacity:0},{x:0,opacity:1,stagger:.12,duration:.8,clearProps:'transform,opacity',scrollTrigger:{trigger:zw,start:'top 90%'}});
gsap.fromTo('.zstage',{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.3,ease:'power4.out',clearProps:'clipPath',scrollTrigger:{trigger:zw,start:'top 90%'}});
ScrollTrigger.create({trigger:zw,start:'top 70%',once:true,onEnter:zStart});
// Headings: blur + tracking collapse
gsap.utils.toArray('h2').forEach(h=>gsap.from(h,{letterSpacing:'.25em',opacity:0,filter:'blur(12px)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 88%'}}));

}