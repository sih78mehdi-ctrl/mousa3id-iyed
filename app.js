const $=s=>document.querySelector(s),app=$('#app'),ttl=$('#title'),back=$('#back'),who=$('#who');
let hist=[],kid=null;
/* تقدّم كل طفل يُحفظ على هاتفه تحت مفتاح خاص به؛ لا خادم ولا قاعدة بيانات */
const GLOBAL=['mute','kid'];
const kkey=k=>GLOBAL.includes(k)?k:'k_'+(kid?kid.id:'')+'_'+k;
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(kkey(k)))??d}catch{return d}},set:(k,v)=>localStorage.setItem(kkey(k),JSON.stringify(v))};
const prog=()=>store.get('prog',{});
const color=c=>document.documentElement.style.setProperty('--c',c||'#6C4DF6');
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let testActive=null;
const show=()=>{testActive=null;const[f,t,c]=hist[hist.length-1];f();ttl.textContent=t;color(c);back.hidden=hist.length<2;scrollTo(0,0)};
const go=(fn,t,c)=>{hist.push([fn,t,c]);show()};
back.onclick=()=>{
  if(testActive){if(!confirm('ستُلغى كل إجاباتك ويبدأ الاختبار من الصفر. هل تريد الخروج؟'))return;testActive=null;rstopMic()}
  hist.pop();show()};
who.onclick=()=>{if(testActive&&!confirm('ستُلغى كل إجاباتك. هل تريد تبديل الطفل؟'))return;testActive=null;try{rstopMic()}catch(e){}pickKid()};
const PAL={hist:'#FF9F1C',geo:'#0FB5A6',civ:'#6C4DF6',isl:'#22B35E'},ICON={hist:'📜',geo:'🌍',civ:'🏛️',isl:'🕌'};
const PRAISE=['أحسنت!','ممتاز!','رائع!','يا بطل!','مذهل!'],OOPS=['لا بأس، تعلّم منها!','قريبًا تصيبها!','حاول في الجولة القادمة!'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const st=()=>store.get('st',{xp:0,day:'',streak:0}),lvl=x=>Math.floor(x/100)+1;
const stars=p=>p>=90?3:p>=70?2:p>0?1:0,starsHtml=n=>'★'.repeat(n)+'☆'.repeat(3-n);
function addXp(n){const t=st();t.xp+=n;const d=new Date().toDateString();if(t.day!==d){t.streak=(t.day===new Date(Date.now()-864e5).toDateString())?t.streak+1:1;t.day=d}store.set('st',t)}
function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const c=document.createElement('canvas');c.className='cf';document.body.append(c);const x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const P=Array.from({length:90},()=>({x:Math.random()*c.width,y:-Math.random()*c.height/2,v:2+Math.random()*4,s:6+Math.random()*8,h:Math.random()*360}));let f=0;(function t(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.y/30);x.fillStyle=`hsl(${p.h},90%,60%)`;x.fillRect(p.x,p.y,p.s,p.s*.6)});if(++f<160)requestAnimationFrame(t);else c.remove()})()}
var deferred=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
const standalone=()=>matchMedia('(display-mode:standalone)').matches||navigator.standalone;
async function install(){
  if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;const b=$('#inst');if(b)b.remove();return}
  alert(/iphone|ipad|ipod/i.test(navigator.userAgent)?'في آيفون: اضغط زر المشاركة في Safari ثم «إضافة إلى الشاشة الرئيسية».':'اضغط على قائمة المتصفح ⋮ ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».');
}
let muted=store.get('mute',false),AC=null;
function tone(f,t,d,ty='sine',v=.18){if(muted)return;try{AC=AC||new(window.AudioContext||webkitAudioContext)();if(AC.state==='suspended')AC.resume();const o=AC.createOscillator(),g=AC.createGain(),s=AC.currentTime+t;o.type=ty;o.frequency.setValueAtTime(f,s);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g);g.connect(AC.destination);o.start(s);o.stop(s+d)}catch(e){}}
const SFX={tap:()=>tone(520,0,.06,'triangle',.1),ok:c=>{const k=Math.min(c,6)*45;tone(660+k,0,.12);tone(880+k,.1,.22)},no:()=>{tone(220,0,.25,'sawtooth',.1);tone(165,.14,.3,'sawtooth',.1)},win:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,i*.11,.35,'triangle',.2)),lose:()=>{tone(392,0,.2,'triangle');tone(330,.18,.35,'triangle')}};
const snd=$('#snd');snd.textContent=muted?'🔇':'🔊';
snd.onclick=()=>{muted=!muted;store.set('mute',muted);snd.textContent=muted?'🔇':'🔊';SFX.tap()};
document.addEventListener('click',e=>{if(e.target.closest('.btn,.tile,.node,#back'))SFX.tap()});

/* اختيار الطفل */
function pickKid(){
  kid=null;hist=[];back.hidden=true;who.textContent='';color('#6C4DF6');ttl.textContent='دروسي';
  app.innerHTML=`<div class="res"><h2>من سيدرس اليوم؟</h2></div><div class="tiles">`+KIDS.map(k=>`<div class="tile" style="--c:${k.color}" data-id="${k.id}"><span class="em">${k.emoji}</span><b>${esc(k.name)}</b></div>`).join('')+'</div>';
  app.querySelectorAll('.tile').forEach(e=>e.onclick=()=>enter(e.dataset.id));
}
function enter(id){
  kid=KIDS.find(k=>k.id===id);if(!kid)return pickKid();
  localStorage.setItem('kid',JSON.stringify(id));
  window.SUBJECTS=SUBJECT_LIST.map(([sid,name])=>({id:sid,name,color:PAL[sid],sections:kid.subjects[sid]||[]}));
  who.textContent=kid.emoji;hist=[];go(home,'دروسي');
}
function home(){
  const t=st(),p=prog(),total=Object.values(p).reduce((x,r)=>x+stars(r.pct),0);
  app.innerHTML=`<div class="hero"><div class="hi">أهلًا ${esc(kid.name)} 👋<small>هيا نحفظ ونجمع النجوم!</small></div><div class="chips"><span>🔥 ${t.streak} يوم</span><span>⭐ ${total}</span><span>🏅 مستوى ${lvl(t.xp)}</span></div><div class="xp"><i style="width:${t.xp%100}%"></i></div></div>${standalone()?'':'<div class="btn inst" id="inst">📲 ثبّت التطبيق على هاتفك</div>'}<div class="tiles">`+
  SUBJECTS.map(s=>{const ls=s.sections.flatMap(x=>x.lessons),d=ls.filter(l=>p[l.id]&&p[l.id].pct>=70).length;
    return `<div class="tile" style="--c:${s.color}" data-id="${s.id}"><span class="em">${ICON[s.id]}</span><b>${s.name}</b><small>${d} / ${ls.length} دروس</small></div>`}).join('')+'</div>';
  if($('#inst'))$('#inst').onclick=install;
  app.querySelectorAll('.tile').forEach(e=>e.onclick=()=>{const s=SUBJECTS.find(x=>x.id==e.dataset.id);go(()=>subject(s),s.name,s.color)});
}
function subject(s){
  const p=prog();
  app.innerHTML=(s.sections.some(x=>x.lessons.length)?s.sections.map(sec=>`<h2>${esc(sec.name)}</h2><div class="path">`+sec.lessons.map((l,i)=>{const r=p[l.id];
    return `<div class="node ${i%2?'r':'l'}" data-l="${l.id}"><span class="dot ${r&&r.pct>=70?'done':''}">${i+1}</span><div><b dir="auto">${esc(l.title)}</b><small>${starsHtml(stars(r?r.pct:0))}</small></div></div>`}).join('')+'</div>').join(''):'<p class="hint">لا توجد دروس في هذه المادة بعد.</p>');
  app.querySelectorAll('.node').forEach(e=>e.onclick=()=>{
    const l=s.sections.flatMap(x=>x.lessons).find(x=>x.id==e.dataset.l);go(()=>lesson(s,l),l.title,s.color)});
}
function lesson(s,l){
  const r=prog()[l.id];
  app.innerHTML=`<h2 dir="auto">${esc(l.title)}</h2>${l.qs.length?`<div class="acts"><div class="btn" id="go">ابدأ الاختبار (${l.qs.length} سؤالًا)</div></div>${r?`<p class="hint">آخر نتيجة: ${r.last??r.pct}% · أفضل نتيجة: ${r.pct}%</p>`:''}`:'<p class="hint">لم تُضف أسئلة هذا الدرس بعد.</p>'}
  ${recBtn(l)}
  ${l.pdf?`<div id="pdf" class="pdf"><p class="hint">جارٍ تحميل الدرس…</p></div><div class="acts"><a class="btn alt" href="${l.pdf}" target="_blank" rel="noopener">فتح الملف في صفحة مستقلة</a></div>`:'<p class="hint">سيُضاف نص هذا الدرس قريبًا.</p>'}`;
  if(l.qs.length)$('#go').onclick=()=>go(()=>quiz(s,l),l.title,s.color);
  if($('#rc'))$('#rc').onclick=()=>go(()=>recite(s,l),l.title,s.color);
  if(l.pdf)l.pg?renderImgs(l,$('#pdf')):renderPdf(l.pdf,$('#pdf'));
}
/* صفحات الدرس كصور (pdf/<id>-<n>.jpg) إن حُدّد pg؛ وإن فُقدت الصورة يعود العرض إلى PDF */
function renderImgs(l,box){
  box.innerHTML='';
  for(let n=1;n<=l.pg;n++){
    const im=new Image();im.alt='صفحة '+n+' من الدرس';im.decoding='async';
    im.onerror=()=>{if(!box.dataset.fb){box.dataset.fb=1;box.innerHTML='<p class="hint">جارٍ تحميل الدرس…</p>';renderPdf(l.pdf,box)}};
    im.src=l.pdf.replace(/\.pdf$/,'-'+n+'.jpg');
    box.appendChild(im);
  }
}
async function renderPdf(url,box){
  try{
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf=await pdfjsLib.getDocument(url).promise;
    for(let n=1;n<=pdf.numPages;n++){
      if(!box.isConnected)return;
      const pg=await pdf.getPage(n),v0=pg.getViewport({scale:1}),sc=box.clientWidth/v0.width,v=pg.getViewport({scale:sc*(devicePixelRatio||1)});
      const c=document.createElement('canvas');c.width=v.width;c.height=v.height;box.appendChild(c);
      await pg.render({canvasContext:c.getContext('2d'),viewport:v}).promise;
      if(n===1)box.querySelector('.hint')?.remove();
    }
  }catch(e){
    const why=/Missing PDF|404|Unexpected/i.test(e.message||'')?'الملف غير موجود في المسار '+url+' — تأكد من رفع مجلد pdf إلى GitHub بنفس الاسم.':location.protocol==='file:'?'افتح التطبيق من رابط GitHub Pages، لا من الملف مباشرة من الجهاز.':'تأكد من الاتصال بالإنترنت ثم أعد فتح الدرس.';
    box.innerHTML=`<p class="hint">تعذّر عرض الملف داخل التطبيق.<br>${esc(why)}</p><object data="${url}" type="application/pdf" width="100%" height="500"></object>`;
  }
}
/* الاختبار: لا يُحفظ تقدّمه؛ الخروج منه يلغي الإجابات */
const qsave=S=>{},qload=()=>null,qclear=()=>{};
function quiz(s,l){
  const S={sid:s.id,lid:l.id,n:l.qs.length,idx:shuffle(l.qs.map((_,k)=>k)),i:0,right:0,wrong:[],combo:0,gain:0,round:0,opts:null,sel:null};
  testActive={type:'quiz',s,l};
  const draw=()=>{
    if(S.i>=S.idx.length)return done();
    const item=l.qs[S.idx[S.i]],q=item[0],a=item[1];
    if(!S.opts)S.opts=shuffle(item.slice(1));
    const opts=S.opts;
    app.innerHTML=`<div class="bar"><i style="width:${S.i/S.idx.length*100}%"></i></div><p class="cnt">${S.i+1} / ${S.idx.length}${S.combo>1?` <span class="combo">🔥 ×${S.combo}</span>`:''}</p><div class="qbox">${esc(q)}</div>`+opts.map((o,k)=>`<button class="opt"><span class="ltr">${'أبجد'[k]}</span>${esc(o)}</button>`).join('')+'<div id="nx"></div>';
    const mark=k=>{
      const good=opts[k]===a,bs=app.querySelectorAll('.opt');
      bs.forEach((x,j)=>{x.disabled=true;if(opts[j]===a)x.classList.add('ok')});
      bs[k].classList.add(good?'pop':'no');
      $('#nx').innerHTML=`<div class="fb ${good?'g':'b'}">${good?pick(PRAISE)+' ⭐ +10':pick(OOPS)}</div><div class="btn" id="n">التالي</div>`;
      $('#n').onclick=()=>{S.i++;S.opts=null;S.sel=null;draw()};
      scrollTo(0,document.body.scrollHeight);
    };
    app.querySelectorAll('.opt').forEach((b,k)=>b.onclick=()=>{
      const good=opts[k]===a;
      if(good){S.right++;S.combo++;S.gain+=10;SFX.ok(S.combo)}else{S.wrong.push(S.idx[S.i]);S.combo=0;SFX.no()}
      S.sel=k;mark(k);
    });
  };
  const done=()=>{
    testActive=null;
    const total=l.qs.length,correct=total-S.wrong.length,pct=Math.round(correct/total*100),corr=S.round>0;
    save(l,pct);
    if(pct>=90)S.gain+=20;addXp(S.gain);
    const best=(prog()[l.id]||{}).pct??pct,n=stars(best),gain=S.gain;
    app.innerHTML=`<div class="res"><div class="big">${n>=2?'🏆':'💪'}</div><h2>${pct}%</h2><div class="st">${starsHtml(n)}</div><p>${corr?'النتيجة بعد التصحيح: ':''}${correct} صحيحة من ${total} · ‎+${gain} نقطة</p><p class="msg">${pct>=90?'أسطوري! أنت بطل هذا الدرس':pct>=70?'عمل رائع، اقتربت من القمة!':'بداية جيدة، أعد المحاولة وستتفوق!'}</p><p class="hint">أفضل نتيجة لك في هذا الدرس: <b>${best}%</b></p><div class="acts">${S.wrong.length?'<div class="btn alt" id="re">أعد الأخطاء</div>':''}<div class="btn" id="again">محاولة جديدة 🔄</div></div><div class="acts"><div class="btn alt" id="bk">الدروس</div></div></div>`;
    if(pct>=70){confetti();SFX.win()}else SFX.lose();
    $('#again').onclick=()=>quiz(s,l);
    if(S.wrong.length)$('#re').onclick=()=>{testActive={type:'quiz',s,l};S.idx=shuffle(S.wrong);S.wrong=[];S.i=0;S.right=0;S.gain=0;S.combo=0;S.round++;S.opts=null;S.sel=null;draw()};
    $('#bk').onclick=()=>{hist=hist.slice(0,2);show()};
  };
  draw();
}
/* حفظ النتيجة على هاتف الطفل فقط (آخر نتيجة + أفضل نتيجة) */
function save(l,pct){const p=prog(),o=p[l.id]||{};p[l.id]={pct:Math.max(pct,o.pct||0),last:pct,at:Date.now()};store.set('prog',p)}

(function boot(){
  let id=null;try{id=JSON.parse(localStorage.getItem('kid'))}catch(e){}
  id&&KIDS.some(k=>k.id===id)?enter(id):pickKid();
})();
