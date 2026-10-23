/* [نسخة مركّبة] أساس نظام «مساعد إياد» (حفظ ✅/🟡 + مفاتيح + وضعان + إلغاء الجولة) مع تحسينات الإملاء المباشر وتوحيد الأرقام ومنع نسخ الحل من الملف الثاني.
   اختبار التسميع: التلميذ يسمّع كل عنوان من الدرس (صوتًا أو كتابةً) ويُقارَن تسميعه بالإجابة النموذجية: كل محاولة تُقبل أو لا تُقبل حسب اكتمال الأفكار الأساسية (بلا نسبة مئوية). ثلاث محاولات لكل عنوان (تلميح بعد الثانية ثم الحل ثم تدريب) ونجوم إتقان. لا مؤقت ولا عدّاد وقت.
   عناصر الدرس: l.rec = [[العنوان, الإجابة النموذجية, كلمات مفتاحية اختيارية, (داخلي: اتركه null), المستوى: 2 للعنوان الثانوي], ...]
   الكلمات المفتاحية: نص = كلمة مستقلة، ومصفوفة ['يتوسط','يقع بين'] = بدائل مقبولة لنفس الفكرة. القائمة تعرض كل العناوين ليختار التلميذ منها.
   إن لم يوجد l.rec يُشتقّ الاختبار من أسئلة الدرس (qs) ما عدا الأسئلة التي تعتمد على رؤية الخيارات. */
/* RPASS: نسبة الأفكار/الكلمات المطلوبة لقبول العنوان (عنصر أو عنصران: كلاهما مطلوب، والأرقام والتواريخ يجب أن تصحّ دائمًا) */
const RPASS=.65;   /* عتبة القبول: 65% من الأفكار (عنصر أو عنصران: كلها). المحاولات: RMAX لكل عنوان */
const RMAX=3;
const AR_STOP=new Set('les des une est dans pour que qui par sur aux son ses ont sont avec ces cet cette mais في من على الى عن ان ما هو هي او ثم كل هذا هذه الذي التي بين كان يكون ذلك قد لا مع هذان هما انه انها التي الذين'.split(' '));
function rfixnum(t){return String(t||'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/(^|[^\d])(\d{1,3}(?:[\s,،٬]\d{3})+)(?!\d)/g,(m,p,n)=>p+n.replace(/[\s,،٬]/g,''))}
function rnorm(s){
  return rfixnum(String(s||'').replace(/[\u064B-\u065F\u0670\u0640]/g,''))
    .replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/œ/g,'oe').replace(/æ/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g,' ').replace(/(\d)(?=[^\d\s])/g,'$1 ').replace(/([^\d\s])(?=\d)/g,'$1 ').toLowerCase().replace(/\s+/g,' ').trim();
}
function rstem(w){
  w=w.replace(/^(وال|بال|كال|فال|لل|ال)/,'');
  if(w.length>3&&w[0]==='و')w=w.slice(1);
  if(w.length>4)w=w.replace(/(ات|ون|ين|ان)$/,'');
  if(w.length>3)w=w.replace(/ه$/,'');
  if(w.length>4&&/^[a-z]+$/.test(w))w=w.replace(/[sx]$/,'');   /* فرنسية: جمع */
  return w;
}
const rtok=s=>rnorm(s).split(' ').filter(w=>w&&!AR_STOP.has(w)&&(w.length>=3||/^\d+$/.test(w))).map(rstem);
/* مرادفات عامة: كلمات كل مجموعة تُعدّ متكافئة المعنى (تُطبَّع وتُجذَّع تلقائيًا). أضف مجموعات جديدة بحرية */
const RSYN=['تعريف مفهوم معنى','حرف اداة','يسمى يدعى يطلق','هدف غاية غرض مقصد','سبب علة دافع','نتيجة اثر ثمرة','مرحلة طور','اهمية فائدة فوائد','يتكون يتألف يتركب','يحتوي يشمل يتضمن','يساعد يعين يسهم','اولا اولى','ثانيا ثانية','ثالثا ثالثة','استعمار احتلال غزو','توسع امتداد انتشار','مستعمرة مستعمرات','سيطرة هيمنة نفوذ','مقاومة كفاح نضال جهاد','ثورة انتفاضة','استقلال تحرر','حرب معركة قتال','قائد زعيم','دولة بلد وطن','شعب سكان اهالي','ارض اقليم منطقة','مواد خام','ثروات موارد خيرات','هجرة نزوح','معاهدة اتفاقية','يمنع يحظر يحرم','يجب يلزم يتعين','نبي رسول','فرض وجوب','يقع يوجد يتواجد','كبير ضخم عظيم','صغير قليل','سريع فوري','بداية مطلع','نهاية خاتمة','ظهر برز نشا','اسباب دوافع عوامل','اهداف مرامي','يؤدي يفضي يقود','نزاع خلاف صراع خصومة','حل تسوية فض معالجة','ودي سلمي','تخفيف تقليل','تسريع سرعة','محافظة حفظ صون','وقاية حماية','اعباء ضغط عبء','قضاء محاكم محكمة','علاقات صلة روابط','توحيد تنسيق','شروط متطلبات','هيئة جهة مؤسسة'].map(g=>new Set(g.split(' ').map(w=>rstem(rnorm(w)))));
function rdist(a,b,max){
  if(Math.abs(a.length-b.length)>max)return max+1;
  let p=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){const c=[i];for(let j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}
  return p[b.length];
}
function rsame(a,b){
  if(a===b)return true;
  if(/^\d+$/.test(a)||/^\d+$/.test(b))return false;      /* الأرقام يجب أن تتطابق تمامًا */
  if(a.length<4||b.length<4)return false;
  let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
  if(i>=4&&i>=Math.min(a.length,b.length)-1)return true;  /* نفس الجذر مع اختلاف اللاحقة */
  const m=Math.min(a.length,b.length),t=m>=8?2:m>=5?1:0;   /* خطأ إملائي أو سماعي بسيط من التعرّف الصوتي */
  return t>0&&rdist(a,b,t)<=t;
}
const rhas=(got,w)=>got.some(g=>rsame(g,w))||RSYN.some(sy=>sy.has(w)&&got.some(g=>sy.has(g)));
/* الكلمات المفتاحية: نص عادي = كلمات منفصلة، أما مصفوفة ['يتوسط','يقع بين'] فهي بدائل مقبولة لنفس الفكرة (أي بديل يكفي) */
function rkeys(item){
  const raw=item[2]&&item[2].length?item[2]:null,out=[],seen=new Set();
  if(!raw){rtok(item[1]).forEach(w=>{if(!seen.has(w)){seen.add(w);out.push([[w]])}});return out}
  raw.forEach(k=>{
    if(Array.isArray(k)){const alts=k.map(a=>rtok(a)).filter(t=>t.length);if(alts.length)out.push(alts)}
    else rtok(k).forEach(w=>{if(!seen.has(w)){seen.add(w);out.push([[w]])}});
  });
  return out;
}
/* تقييم محاولة واحدة (التقييم الأول): يُقبل العنوان إذا ذكر التلميذ الأفكار/الكلمات المفتاحية المطلوبة (المرادفات مقبولة).
   عنصر أو عنصران: كلاهما مطلوب، وإلا يكفي 65% منها (RPASS). الأرقام والتواريخ يجب أن تصحّ دائمًا. بلا نسبة مئوية. */
function rscore(item,text){
  const keys=rkeys(item),auto=!(item[2]&&item[2].length);
  if(!keys.length)return{ok:false,hit:0,total:0,need:0,numMiss:false,auto};
  const got=rtok(text);
  const okK=keys.map(alts=>alts.some(ws=>ws.every(w=>rhas(got,w))));
  const hit=okK.filter(Boolean).length,total=keys.length;
  const nums=keys.map((alts,i)=>alts.every(ws=>ws.every(w=>/^\d+$/.test(w)))?i:-1).filter(i=>i>=0);
  const need=total<=2?total:Math.ceil(total*RPASS);
  const numMiss=!nums.every(i=>okK[i]);
  return{ok:hit>=need&&!numMiss,hit,total,need,numMiss,auto};
}
const rcheck=(item,text)=>rscore(item,text).ok;
/* الأفكار الناقصة في إجابة التلميذ (بنصّها الأصلي) لاستخراج تلميح منها */
function rmissing(item,text){
  const got=rtok(text),out=[],has=w=>rhas(got,w);
  const clean=x=>String(x).replace(/[^\u0621-\u064Aa-zA-Z0-9\u00C0-\u024F]/g,'');
  const raw=item[2]&&item[2].length?item[2]:null;
  if(!raw){
    const seen=new Set();
    String(item[1]).split(/\s+/).forEach(wd=>{const t=rtok(wd);if(t.length!==1)return;const w=t[0];if(seen.has(w)||/^\d+$/.test(w))return;seen.add(w);if(!has(w))out.push(clean(wd))});
  }else raw.forEach(k=>{
    if(Array.isArray(k)){const alts=k.map(a=>rtok(a)).filter(t=>t.length);if(alts.length&&!alts.some(ws=>ws.every(has)))out.push(String(k[0]).trim())}
    else String(k).split(/\s+/).forEach(wd=>{const t=rtok(wd);if(t.length===1&&!/^\d+$/.test(t[0])&&!has(t[0]))out.push(clean(wd))});
  });
  return out.filter(Boolean);
}
/* تلميح: بداية فكرة ناقصة فقط (أول كلمة إن كانت الفكرة عدة كلمات، وإلا أول حرفين بعد «ال») */
function rhint(item,text){
  const m=rmissing(item,text);if(!m.length)return '';
  const ws=m[0].trim().split(/\s+/);
  if(ws.length>1)return ws[0]+' …';
  const p=(ws[0].match(/^(ال)?/)[0]).length;return ws[0].slice(0,p+2)+'…';
}
/* حالة العنوان: ⚪ لم يُسمَّع · 🟡 لم يُحفظ · ✅ حفظه (101-103 = عدد النجوم: ⭐⭐⭐ من أول محاولة، ⭐⭐ في الثانية أو الثالثة، ⭐ بعد رؤية الحل؛ 100 = نتيجة قديمة بلا نجوم) */
const rmk=v=>v===undefined?'⚪':v>=100?'✅'+(v>100?' '+'⭐'.repeat(Math.min(3,v-100)):''):'🟡';
function getRec(l){
  if(l.rec&&l.rec.length)return l.rec;
  /* لا عناوين: نسأل عن محتوى الدرس نفسه من أسئلته. الأسئلة المعتمدة على رؤية الخيارات (أي...؟) تُحوَّل إلى «اذكر...» والسلبية (ليس...) تُهمل */
  return (l.qs||[]).map(q=>{
    let t=String(q[0]).trim();
    if(/ليس|غير\s+صحيح|لا\s+يُعد|لا\s+يعد/.test(t))return null;
    if(/^(أي|أيّ|أيها|أيهما)\s/.test(t))t='اذكر '+t.replace(/^(أي|أيّ|أيها|أيهما)\s+(مما يلي|منها|من التالية|من الآتية|مما يأتي)?\s*/,'').replace(/[؟?]\s*$/,'');
    return rtok(q[1]).length?[t,q[1],null,1]:null;
  }).filter(Boolean);
}
const rfmt=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
/* ===== نتائج التسميع تُحفظ فورًا في هاتف كل طفل (localStorage تحت اسمه) وتبقى بعد إغلاق التطبيق =====
   bt[الدرس][العنوان] = 100 إذا حفظ التلميذ العنوان (لا يرجع إلى الوراء أبدًا)، و0 إذا جرّبه أو اطّلع على حلّه ولم يُقبل بعد
   rnd[الدرس] = الجولة الأخيرة (العناوين المحدّدة فقط) */
const rrnd=l=>store.get('rnd',{})[l.id]||{q:[],sc:{}};
const rbt=l=>store.get('bt',{})[l.id]||{};   /* حالة كل عنوان من عناوين الدرس */
const rdoneN=(l,items)=>{const B=rbt(l);return items.filter(it=>B[it[0]]>=100).length};   /* عدد العناوين المحفوظة */
function rsetScore(l,items,title,v){
  const a=store.get('rnd',{}),R=a[l.id]||{q:[],sc:{}};
  if(R.sc[title]===undefined||v>R.sc[title]){R.sc[title]=v;a[l.id]=R;store.set('rnd',a)}
  const b=store.get('bt',{}),B=b[l.id]||{};
  if(B[title]===undefined||v>B[title]){B[title]=v;b[l.id]=B;store.set('bt',b)}
}
/* بداية جولة: نحفظ لقطة من نتائج الدرس قبلها، فإن غادر التلميذ الصفحة أثناء الجولة تُلغى نتائجها وتعود النتائج السابقة كما كانت */
function rstartRound(l,q){const a=store.get('rnd',{});a[l.id]={q,sc:{},snap:Object.assign({},rbt(l))};store.set('rnd',a)}
function rcancelRound(l){
  const a=store.get('rnd',{}),R=a[l.id];
  if(R&&R.snap){const b=store.get('bt',{});if(Object.keys(R.snap).length)b[l.id]=R.snap;else delete b[l.id];store.set('bt',b)}
  delete a[l.id];store.set('rnd',a);
}
/* عند تعديل عناوين الدرس: يُحذف فقط تقدّم العناوين التي لم تعد موجودة، وتبقى نتائج الباقي.
   وعند أول تشغيل بعد هذا التحديث تُنقل نتائج الجولة الأخيرة المحفوظة سابقًا إلى سجلّ العناوين */
function rmigrate(l,items){
  const titles=new Set(items.map(it=>it[0])),b=store.get('bt',{});
  if(b[l.id]===undefined){   /* ترحيل بيانات النسخة السابقة: درجات الجولة الأخيرة تصبح أعلى درجات العناوين */
    const R=rrnd(l),o={};Object.keys(R.sc||{}).forEach(t=>{if(titles.has(t))o[t]=R.sc[t]});
    if(Object.keys(o).length){b[l.id]=o;store.set('bt',b)}
  }
  const sig=items.map(it=>it[0]).join('|'),v=store.get('recv',{});
  if(v[l.id]===sig)return;
  if(v[l.id]!==undefined){
    const b2=store.get('bt',{});
    if(b2[l.id]){Object.keys(b2[l.id]).forEach(t=>{if(!titles.has(t))delete b2[l.id][t]});store.set('bt',b2)}
    const a=store.get('rnd',{});delete a[l.id];store.set('rnd',a);   /* أرقام عناوين الجولة تغيّرت */
  }
  v[l.id]=sig;store.set('recv',v);
}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}   /* يطلب من المتصفح ألا يمسح بيانات التطبيق */
function recBtn(l){
  const items=getRec(l);
  if(!items.length)return '';
  rmigrate(l,items);
  const B=rbt(l),tried=items.filter(it=>B[it[0]]!==undefined).length;
  return `<div class="acts"><div class="btn rec" id="rc">🎙️ اختبار التسميع</div></div>${tried?`<p class="hint">✅ حفظتَ ${rdoneN(l,items)} من ${items.length} عنوانًا</p>`:''}`;
}
let rTimer=null,rMic=null;
function rstopMic(){if(rMic){rMic._stop=true;if(rMic._flush)rMic._flush()}try{rMic&&rMic.stop()}catch(e){}rMic=null}
/* منع نسخ الإجابة النموذجية حتى لا تُلصق في التسميع */
function rnocopy(root){(root||document).querySelectorAll('.nocopy').forEach(e=>['copy','cut','contextmenu','selectstart','dragstart'].forEach(ev=>e.addEventListener(ev,x=>x.preventDefault())))}
const rnoPaste=ta=>{['paste','drop','cut','copy','contextmenu'].forEach(ev=>ta.addEventListener(ev,e=>e.preventDefault()));ta.addEventListener('beforeinput',e=>{if(/^insertFrom(Paste|Drop|Yank)/.test(e.inputType||''))e.preventDefault()})}
function recite(s,l){
  const items=getRec(l),n=items.length;
  const FD=s.id==='fr'?' dir="ltr" lang="fr"':'';
  rmigrate(l,items);rstopMic();clearInterval(rTimer);
  testActive={type:'recite',s,l};   /* التسميع محفوظ تلقائيًا: لا تُلغى نتائجه عند الخروج */
  const sel=new Set();   /* العناوين المحدّدة للتسميع دفعة واحدة */
  let cur=-1,att=0,peek=0,Q=[];
  const used={},seen=new Set();   /* محاولات كل عنوان في هذه الجلسة، والعناوين التي انكشف حلّها (يصبح تسميعها تدريبًا بنجمة واحدة) */
  const sc=k=>rbt(l)[items[k][0]];   /* حالة هذا العنوان (محفوظة بين الجولات) */
  const mark=k=>rmk(sc(k));
  const done=()=>rdoneN(l,items);   /* العناوين المحفوظة */

  /* ===== قائمة العناوين: يحدّد التلميذ عنوانًا أو أكثر ثم يبدأ ===== */
  const menu=()=>{
    rstopMic();cur=-1;testActive={type:'recite',s,l};
    const d=done();
    app.innerHTML=`<div class="rtop"><span>🎙️ التسميع</span><span>✅ ${d} / ${n}</span></div><div class="bar"><i style="width:${d/n*100}%"></i></div>
    <p class="hint">لكل عنوان ثلاث محاولات: يظهر تلميح بعد الثانية، فإن لم تنجح يظهر الحل ثم تعيد التسميع من حفظك حتى يُسجَّل ✅. النجوم: ⭐⭐⭐ من أول محاولة · ⭐⭐ في الثانية أو الثالثة · ⭐ بعد رؤية الحل. وتبقى نتيجتك محفوظة في جهازك. اضغط على عنوان أو أكثر ثم اختر «تسميع بالتتابع» (عنوانًا عنوانًا) أو «تسميع متواصل» (كل العناوين المحدّدة في تسميع واحد)</p>
    <div class="acts"><div class="btn" id="go2"></div><div class="btn" id="go3"></div></div>
    <div class="acts"><div class="btn alt" id="all"></div><div class="btn alt" id="rem">☑ تحديد ما لم يُحفظ بعد</div></div>
    <div class="rmenu">${items.map((it,k)=>`<div class="rit${it[4]===2?' sub':''}" data-k="${k}"${FD}><span class="ri">${mark(k)}</span><span class="rt">${esc(it[0])}</span><span class="ck">☐</span></div>`).join('')}</div>
    <div class="acts"><div class="btn alt" id="fin">🏁 اعرض النتيجة</div></div>
    <div class="acts"><div class="btn alt rst" id="rst">🔄 صفّر التقدّم</div></div>`;
    const upd=()=>{
      app.querySelectorAll('.rit').forEach(e=>{const on=sel.has(+e.dataset.k);e.classList.toggle('on',on);e.querySelector('.ck').textContent=on?'☑':'☐'});
      const c=sel.size?` (${sel.size})`:'';
      $('#go2').textContent='▶ تسميع بالتتابع'+c;$('#go3').textContent='🎙️ تسميع متواصل'+c;
      $('#go2').style.opacity=$('#go3').style.opacity=sel.size?1:.5;
      $('#all').textContent=sel.size===n?'✖ إلغاء التحديد':'☑ تحديد الكل';
    };
    app.querySelectorAll('.rit').forEach(el=>el.onclick=()=>{const k=+el.dataset.k;sel.has(k)?sel.delete(k):sel.add(k);upd()});
    $('#all').onclick=()=>{if(sel.size===n)sel.clear();else items.forEach((_,k)=>sel.add(k));upd()};
    $('#rem').onclick=()=>{sel.clear();items.forEach((_,k)=>{if(!(sc(k)>=100))sel.add(k)});if(!sel.size)alert('حفظتَ كل العناوين، حدّد منها ما تريد إعادته');upd()};
    $('#go2').onclick=()=>{if(!sel.size){alert('اختر عنوانًا واحدًا على الأقل لتبدأ التسميع');return}const q=[...sel].sort((x,y)=>x-y);rstartRound(l,q);open(q[0],q)};
    $('#go3').onclick=()=>{if(!sel.size){alert('اختر عنوانًا واحدًا على الأقل لتبدأ التسميع');return}const q=[...sel].sort((x,y)=>x-y);rstartRound(l,q);cont(q)};
    $('#fin').onclick=finish;
    $('#rst').onclick=()=>{if(confirm('ستُمسح نتائج عناوين هذا الدرس ويبدأ التسميع من جديد. هل تريد ذلك؟')){
      const a=store.get('rnd',{});delete a[l.id];store.set('rnd',a);
      const b=store.get('bt',{});delete b[l.id];store.set('bt',b);sel.clear();
      menu()}};
    upd();scrollTo(0,0);
  };

  /* ===== حفظ عنوان واحد ===== */
  const open=(k,q)=>{cur=k;peek=seen.has(k)?1:0;att=peek?0:(used[k]||0);Q=q||[k];if(testActive)testActive.live=true;draw()};
  const draw=()=>{
    const k=cur,it=items[k],pos=Math.max(0,Q.indexOf(k));
    const dots=()=>(peek?'📖 تدريب بعد رؤية الحل':[0,1,2].map(j=>j<att?'🔴':j===att?'🟡':'⚪').join(' ')+` &nbsp; المحاولة ${Math.min(att+1,RMAX)} من ${RMAX}`)+(sc(k)>=100?' · ✅ حفظتَ هذا العنوان':'');
    app.innerHTML=`<div class="rtop"><span>🎙️ التسميع</span><span>${pos+1} / ${Q.length}</span></div><div class="bar"><i style="width:${(pos+1)/Q.length*100}%"></i></div>
    <div class="qbox"${FD}>${it[3]?'':(FD?'Récite : ':'سمّع: ')}${esc(it[0])}</div>
    <p class="dots">${dots()}</p>
    <textarea id="ans" rows="5"${FD} placeholder="سمّع من حفظك… أو اكتب إجابتك بنفسك" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="acts"><div class="btn alt" id="mic">🎙️ ابدأ التسميع</div><div class="btn" id="chk">تحقّق ✔</div></div><div id="fb"></div>
    <div class="acts" id="tools"><div class="btn alt" id="peek">👁 أرني الحل</div>${pos+1<Q.length?'<div class="btn alt" id="skip">التالي ▶</div>':''}<div class="btn alt" id="mn">☰ العناوين</div></div>`;
    const ta=$('#ans');
    rnoPaste(ta);
    initMic($('#mic'),ta,s.id==='fr'?'fr-FR':'ar-DZ');
    $('#mn').onclick=menu;
    /* الانتقال إلى العنوان التالي مهما كانت النتيجة، وللتلميذ أن يعود إلى هذا العنوان لاحقًا من القائمة */
    if($('#skip'))$('#skip').onclick=()=>{rstopMic();open(Q[pos+1],Q)};
    /* الحل النموذجي + إمكانية الإعادة + الانتقال إلى التالي في القائمة المحدّدة */
    const lock=(head,all)=>{
      rstopMic();ta.disabled=true;$('#chk').hidden=true;$('#mic').hidden=true;$('#tools').hidden=true;
      const more=!all&&pos+1<Q.length;
      /* all=true: «أرني الحل» مع عدة عناوين محدّدة ← تُعرض الإجابة النموذجية لكل العناوين المحدّدة لا للأول فقط */
      const models=all
        ?`<div class="mlbl">${FD?'Réponses modèles ('+Q.length+') :':'الحلول النموذجية للعناوين المحدّدة ('+Q.length+'):'}</div>`+Q.map((j,i)=>`<div class="mitem"${FD}><div class="mt">${i+1}. ${esc(items[j][0])}</div><div class="mdl nocopy"${FD}>${esc(items[j][1])}</div></div>`).join('')
        :`<div class="mlbl">${FD?'Réponse modèle :':'الحل النموذجي:'}</div><div class="mdl nocopy"${FD}>${esc(it[1])}</div>`;
      $('#fb').innerHTML=`${head}${models}
      <div class="acts"><div class="btn alt" id="rt">${all?'🔁 أعد المحاولة من الأول':'🔁 أعد المحاولة'}</div>${all?'<div class="btn" id="nx2">☰ العناوين</div>':`<div class="btn" id="nx2">${more?'التالي ▶':(Q.length>1?'🏁 انتهى — العناوين':'☰ العناوين')}</div>`}</div>
      ${more?'<div class="acts"><div class="btn alt" id="mn2">☰ العناوين</div></div>':''}`;
      /* بعد رؤية الحل: تدريب، ويُسجَّل العنوان ✅ عند نجاح التسميع من الحفظ */
      $('#rt').onclick=()=>{if(all)cur=Q[0];att=0;peek=1;draw()};
      $('#nx2').onclick=()=>{if(more)open(Q[pos+1],Q);else{sel.clear();menu()}};
      if($('#mn2'))$('#mn2').onclick=menu;
      rnocopy($('#fb'));scrollTo(0,document.body.scrollHeight);
    };
    $('#peek').onclick=()=>{              /* الاطلاع على الحل يسجّل العنوان 🟡 مبدئيًا، ثم يستطيع التلميذ تسجيله ✅ بإعادة التسميع من حفظه */
      const all=Q.length>1;
      (all?Q:[k]).forEach(j=>{seen.add(j);if(sc(j)===undefined)rsetScore(l,items,items[j][0],0)});   /* كل عنوان انكشف حلّه يُسجَّل أنه اطُّلع عليه */
      peek=1;
      lock('<div class="fb b">اقرأ الحل جيدًا ثم أعد المحاولة من حفظك 👇</div>',all);
    };
    $('#chk').onclick=()=>{
      const was=!!rMic;rstopMic();
      const run=()=>{
      const text=ta.value.trim();
      if(text.length<2){$('#fb').innerHTML='<div class="fb b">اكتب أو سمّع إجابتك أولًا</div>';return}
      const r=rscore(it,text);
      att++;if(!peek)used[k]=att;
      if(r.ok){
        const stn=peek?1:att===1?3:2;   /* نجوم الإتقان */
        rsetScore(l,items,it[0],100+stn);   /* العنوان المقبول يبقى ✅ ولا يرجع، وتبقى أعلى نجومه */
        delete used[k];seen.delete(k);
        SFX.ok(stn===3?3:1);
        lock(`<div class="fb g">${pick(PRAISE)} ${'⭐'.repeat(stn)} حفظتَ هذا العنوان${stn===3?' من أول محاولة':''}${stn===1?'<br>والآن حاول أن تحفظه من غير أن تنظر إلى الحل':''}</div>`);
      }else{
        rsetScore(l,items,it[0],0);   /* 🟡 (لا يُنزل ✅ سابقًا) */
        SFX.no();
        /* ملاحظات بلا كشف الحل */
        const notes=[];
        if(!r.auto&&r.total)notes.push(`ذكرتَ ${r.hit} من ${r.total} فكرة`);
        if(r.numMiss)notes.push('لم تذكر الرقم/التاريخ المطلوب');
        if(!peek&&att>=RMAX){   /* انتهت المحاولات الثلاث: يظهر الحل ثم تدريب */
          seen.add(k);peek=1;
          lock(`<div class="fb b">انتهت المحاولات الثلاث 🟡<br>اقرأ الحل جيدًا ثم أعد المحاولة من حفظك 👇</div>`);
          return;
        }
        const left=RMAX-att,hint=(!peek&&att===RMAX-1)?rhint(it,text):'';
        const near=r.total&&r.hit/r.total>=.3;
        ta.value='';
        $('#fb').innerHTML=`<div class="fb b">${near?'اقتربت! أكمل الفكرة — ':'ليست الإجابة المطلوبة بعد — '}${notes.length?notes.join(' · ')+'<br>':''}${hint?`💡 تلميح: ما زالت ناقصة فكرة تبدأ بـ «${esc(hint)}»<br>`:''}${peek?'أعد المحاولة من حفظك':`بقيت ${left===1?'محاولة واحدة':'محاولتان'}`}${pos+1<Q.length?'، أو اضغط «التالي» وعد إليه لاحقًا':''} 👇</div>`;
        document.querySelector('.dots').innerHTML=dots();
      }
      };
      was?setTimeout(run,450):run();
    };
  };

  /* ===== تسميع متواصل: نص واحد لكل العناوين المحدّدة، ويُقيَّم كل عنوان منها على حدة ===== */
  const cont=(q,pk)=>{
    cur=-1;rstopMic();testActive={type:'recite',s,l,live:true};   /* live: جولة جارية، مغادرة الصفحة تلغيها */
    let att=0,peek=pk?1:0;
    const okSet=new Set();   /* العناوين التي قُبلت في هذه الجولة (تبقى مقبولة ولو تغيّر النص بعدها) */
    const rowsHtml=()=>q.map((j,i)=>`<div class="rrow"${FD}>${mark(j)} ${i+1}. ${esc(items[j][0])}</div>`).join('');
    app.innerHTML=`<div class="rtop"><span>🎙️ تسميع متواصل</span><span>${q.length} ${q.length===1?'عنوان':'عناوين'}</span></div>
    <p class="hint">سمّع العناوين التالية متتابعةً في تسميع واحد، ثم اضغط «تحقّق»${peek?' · تدريب بعد رؤية الحل':` · لك ${RMAX} محاولات للتسميع كله`}</p>
    <div class="rlist" id="clist">${rowsHtml()}</div>
    <textarea id="ans" rows="9"${FD} placeholder="سمّع كل العناوين من حفظك… أو اكتب إجابتك بنفسك" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="acts"><div class="btn alt" id="mic">🎙️ ابدأ التسميع</div><div class="btn" id="chk">تحقّق ✔</div></div><div id="fb"></div>
    <div class="acts" id="tools"><div class="btn alt" id="peek">👁 أرني الحل</div><div class="btn alt" id="clr">🧹 امسح النص</div><div class="btn alt" id="mn">☰ العناوين</div></div>`;
    const ta=$('#ans');
    rnoPaste(ta);
    initMic($('#mic'),ta,s.id==='fr'?'fr-FR':'ar-DZ');
    $('#mn').onclick=menu;
    $('#clr').onclick=()=>{rstopMic();ta.value='';$('#fb').innerHTML=''};
    const refresh=()=>{$('#clist').innerHTML=rowsHtml()};
    const models=list=>`<div class="mlbl">${FD?'Réponses modèles ('+list.length+') :':'الحلول النموذجية ('+list.length+'):'}</div>`+list.map((j,i)=>`<div class="mitem"${FD}><div class="mt">${i+1}. ${esc(items[j][0])}</div><div class="mdl nocopy"${FD}>${esc(items[j][1])}</div></div>`).join('');
    /* list: الحلول المعروضة · again: العناوين التي يُعاد تسميعها (تدريب) */
    const lockAll=(head,list,again)=>{
      rstopMic();ta.disabled=true;$('#chk').hidden=true;$('#mic').hidden=true;$('#tools').hidden=true;refresh();
      $('#fb').innerHTML=`${head}${models(list)}<div class="acts"><div class="btn alt" id="rt">${again.length<q.length?'🔁 أعد العناوين 🟡':'🔁 أعد المحاولة من الأول'}</div><div class="btn" id="nx2">☰ العناوين</div></div>`;
      $('#rt').onclick=()=>cont(again,1);   /* بعد رؤية الحل: تدريب */
      $('#nx2').onclick=()=>{sel.clear();menu()};
      rnocopy($('#fb'));scrollTo(0,document.body.scrollHeight);
    };
    $('#peek').onclick=()=>{
      q.forEach(j=>{if(sc(j)===undefined)rsetScore(l,items,items[j][0],0)});   /* كل عنوان انكشف حلّه يُسجَّل أنه اطُّلع عليه */
      const rest=q.filter(j=>!okSet.has(j)),r2=rest.length?rest:q;
      lockAll('<div class="fb b">اقرأ الحلول جيدًا ثم أعد المحاولة من حفظك 👇</div>',r2,r2);
    };
    $('#chk').onclick=()=>{
      const was=!!rMic;rstopMic();
      const run=()=>{
      const text=ta.value.trim();
      if(text.length<2){$('#fb').innerHTML='<div class="fb b">اكتب أو سمّع إجابتك أولًا</div>';return}
      att++;
      const R=q.map(j=>({j,r:rscore(items[j],text)}));
      R.forEach(({j,r})=>{
        if(okSet.has(j))return;
        if(r.ok){okSet.add(j);rsetScore(l,items,items[j][0],100+(peek?1:att===1?3:2))}   /* نجوم الإتقان حسب رقم المحاولة */
        else rsetScore(l,items,items[j][0],0);
      });
      refresh();
      if(okSet.size===q.length){
        SFX.ok(!peek&&att===1?3:1);
        lockAll(`<div class="fb g">${pick(PRAISE)} ${'⭐'.repeat(peek?1:att===1?3:2)} حفظتَ كل العناوين</div>`,q,q);return;
      }
      SFX.no();
      const rest=q.filter(j=>!okSet.has(j));
      if(!peek&&att>=RMAX){   /* انتهت المحاولات الثلاث: تُكشف حلول العناوين التي لم تُقبل فقط */
        lockAll(`<div class="fb b">انتهت المحاولات الثلاث — حفظتَ ${okSet.size} من ${q.length}<br>اقرأ حلول العناوين 🟡 ثم أعد المحاولة من حفظك 👇</div>`,rest,rest);return;
      }
      const rows=R.map(({j,r},i)=>{
        const ok=okSet.has(j),nt=[];
        if(!ok){
          if(!r.auto&&r.total)nt.push(`ذكرتَ ${r.hit} من ${r.total} فكرة`);
          if(r.numMiss)nt.push('لم تذكر الرقم/التاريخ المطلوب');
          if(!peek&&att===RMAX-1){const h=rhint(items[j],text);if(h)nt.push(`💡 فكرة ناقصة تبدأ بـ «${esc(h)}»`)}
        }
        return `<div class="rrow"${FD}>${ok?'✅':'🟡'} ${i+1}. ${esc(items[j][0])}${nt.length?` <small>— ${nt.join(' · ')}</small>`:''}</div>`}).join('');
      const left=RMAX-att;
      $('#fb').innerHTML=`<div class="fb b">حفظتَ ${okSet.size} من ${q.length} ${q.length===1?'عنوان':'عناوين'}<br>أعد تسميع العناوين 🟡 فقط${peek?'':` · بقيت ${left===1?'محاولة واحدة':'محاولتان'}`} 👇</div><div class="rlist">${rows}</div>`;
      };
      was?setTimeout(run,450):run();
    };
    scrollTo(0,0);
  };

  /* ===== شاشة النتيجة ===== */
  const finish=()=>{
    testActive=null;clearInterval(rTimer);rstopMic();
    const B=rbt(l),full=done(),tried=items.filter(it=>B[it[0]]!==undefined).length;
    addXp(Math.round(full/n*20));
    const nst=stars(Math.round(full/n*100)),good=full/n>=.7;
    const rows=items.map(it=>{const v=B[it[0]];return `<div class="rrow"${FD}>${rmk(v)} ${esc(it[0])}</div>`}).join('');
    app.innerHTML=`<div class="res"><div class="big">${good?'🏆':'💪'}</div><h2>${full} / ${n}</h2><div class="st">${starsHtml(nst)}</div>
    <p>حفظتَ ${full} من ${n} عنوانًا · سمّعتَ ${tried}</p><p class="hint">✓ تم حفظ النتيجة في جهازك</p>
    <div class="rlist">${rows}</div><p class="hint">✅ حفظتَه (⭐⭐⭐ من أول محاولة · ⭐⭐ في الثانية أو الثالثة · ⭐ بعد رؤية الحل) · 🟡 لم يكتمل بعد أو اطّلعتَ على الحل (أعد المحاولة من حفظك) · ⚪ لم يُسمَّع، راجعه في الدرس ثم سمّعه</p>
    <div class="acts"><div class="btn" id="again">أعد التسميع 🔄</div></div><div class="acts"><div class="btn alt" id="bk">الدروس</div></div></div>`;
    if(good){confetti();SFX.win()}else SFX.lose();
    $('#again').onclick=()=>recite(s,l);
    $('#bk').onclick=()=>{hist=hist.slice(0,2);show()};
  };
  menu();
}
/* دمج نتائج التعرّف الصوتي دون تكرار: في بعض هواتف أندرويد تعيد كل نتيجة الكلمات السابقة، فنحذف الجزء المكرّر */
function rmerge(acc,t){
  t=String(t||'').trim();if(!t)return acc;if(!acc)return t;
  const a=acc.split(/\s+/),b=t.split(/\s+/),na=a.map(rnorm),nb=b.map(rnorm);
  if(nb.length>=2&&na.join(' ').indexOf(nb.join(' '))>=0)return acc;
  for(let k=Math.min(na.length,nb.length);k>=1;k--){
    let ok=true;for(let j=0;j<k;j++)if(na[na.length-k+j]!==nb[j]){ok=false;break}
    if(ok)return a.concat(b.slice(k)).join(' ');
  }
  return acc+' '+t;
}
function initMic(btn,ta,lang){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){btn.textContent='🎙️ غير متاح في هذا المتصفح';btn.style.opacity=.5;btn.onclick=()=>alert('التسميع الصوتي يعمل في Chrome. يمكنك كتابة إجابتك في الخانة.');return}
  let on=false,base='',quick=0,lastStart=0,tgt=[],shw=[],tm=null;
  const st=document.createElement('div');st.className='mst';ta.insertAdjacentElement('afterend',st);
  const tail=()=>ta.value.trim().split(/\s+/).filter(Boolean).slice(-6).join(' ');
  const show=()=>{const t=tail();st.innerHTML=on?('🔴 يستمع… '+(t?'آخر ما سمعته: «'+esc(t)+'»':'ابدأ التسميع')):(t?'⏸ توقفت عند: «'+esc(t)+'» — اضغط 🎙️ وأكمل من هنا':'')};
  const off=()=>{if(rMic&&rMic._flush)rMic._flush();on=false;if(btn.isConnected)btn.textContent='🎙️ ابدأ التسميع';btn.classList.remove('live');show()};
  const start=()=>{
    const r=new SR();rMic=r;r.lang=lang||'ar-DZ';r.continuous=true;r.interimResults=true;r.maxAlternatives=1;
    base=ta.value.trim()?ta.value.trim()+' ':'';
    tgt=[];shw=[];if(tm){clearInterval(tm);tm=null}
    const paint=()=>{ta.value=base+shw.join(' ');ta.scrollTop=ta.scrollHeight;show()};
    const pump=()=>{const back=tgt.length-shw.length;if(back<=0){clearInterval(tm);tm=null;return}for(let j=0;j<(back>8?3:1);j++)if(shw.length<tgt.length)shw.push(tgt[shw.length]);paint()};
    r._flush=()=>{shw=tgt.slice();if(tm){clearInterval(tm);tm=null}paint()};
    r.onresult=e=>{
      let acc='';for(let i=0;i<e.results.length;i++)acc=rmerge(acc,e.results[i][0].transcript);
      acc=rfixnum(acc);tgt=acc.split(/\s+/).filter(Boolean);
      let k=0;while(k<shw.length&&k<tgt.length&&shw[k]===tgt[k])k++;
      if(k<shw.length){shw=shw.slice(0,k);paint()}
      if(r._stop){r._flush();return}
      if(!tm)tm=setInterval(pump,60);
    };
    r.onerror=e=>{if(e&&(e.error==='not-allowed'||e.error==='service-not-allowed'))r._stop=true};
    r.onend=()=>{
      if(r._flush)r._flush();
      if(!r._stop&&on&&btn.isConnected){
        const now=Date.now();quick=(now-lastStart<1500)?quick+1:0;lastStart=now;
        if(quick<3){setTimeout(()=>{if(on&&!r._stop){try{start()}catch(e){off()}}},250);return}
      }
      off();
    };
    if(typeof grace==='function')grace(15000);   /* نافذة إذن الميكروفون لا تُعدّ مغادرة */
    try{r.start();lastStart=Date.now();on=true;btn.textContent='⏹ توقّف';btn.classList.add('live');show()}catch(e){off()}
  };
  btn.onclick=()=>{if(on){rstopMic();return}quick=0;start()};
}
