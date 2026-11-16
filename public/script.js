const nav=document.querySelector('nav'),menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');document.querySelectorAll('nav a').forEach(n=>n.classList.remove('active'));a.classList.add('active')}));document.getElementById('year').textContent=new Date().getFullYear();document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b)});document.querySelectorAll('.gallery-item').forEach(x=>x.hidden=b.dataset.filter!=='all'&&x.dataset.category!==b.dataset.filter)}));const lightbox=document.getElementById('lightbox');document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{const image=b.querySelector('img');lightbox.querySelector('img').src=image.src;lightbox.querySelector('img').alt=image.alt;lightbox.querySelector('p').textContent=b.querySelector('b').textContent+' — illustrative visual direction';lightbox.showModal()}));document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});document.querySelectorAll('[data-reel]').forEach(b=>b.addEventListener('click',()=>document.getElementById('reel-dialog').showModal()));document.querySelectorAll('[data-subject]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('select').value=a.dataset.subject}));document.getElementById('enquiry').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const subject='Project enquiry: '+f.get('service');const body=`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nService: ${f.get('service')}\n\n${f.get('brief')}`;location.href='mailto:info@ravipictures.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent='Your email draft is ready. If your email app did not open, write to info@ravipictures.com directly.'});
const reelStage=document.querySelector('.reel-stage'),motionButton=document.querySelector('.reel-motion');if(reelStage&&motionButton){motionButton.addEventListener('click',()=>{const paused=reelStage.classList.toggle('is-paused');motionButton.setAttribute('aria-pressed',paused);motionButton.setAttribute('aria-label',paused?'Resume reel animation':'Pause reel animation');motionButton.textContent=paused?'▶ RESUME MOTION':'Ⅱ PAUSE MOTION'});const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');function syncReelMotion(){reelStage.classList.toggle('is-paused',motionPreference.matches);motionButton.setAttribute('aria-pressed',motionPreference.matches);motionButton.setAttribute('aria-label',motionPreference.matches?'Resume reel animation':'Pause reel animation');motionButton.textContent=motionPreference.matches?'▶ RESUME MOTION':'Ⅱ PAUSE MOTION'}motionPreference.addEventListener('change',syncReelMotion);syncReelMotion();}

/* Restart the corner lights whenever About returns to view. */
(() => {
  const section = document.getElementById('about');
  if (!section?.querySelector('.about-light') || !('IntersectionObserver' in window)) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  function sync() {
    section.classList.toggle('about-light-waiting', !reduced.matches && !visible);
    section.classList.toggle('about-light-running', !reduced.matches && visible);
  }
  sync();
  reduced.addEventListener('change', sync);
  const trigger = section.querySelector('.about-copy') || section;
  const threshold = 0.15;
  new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold);
    sync();
  }, { threshold }).observe(trigger);
})();

/* The visitor catches the slate only after crossing a real viewport threshold. */
(() => {
  const section = document.getElementById('about');
  const scene = section?.querySelector('.slate-scene');
  const creature = scene?.querySelector('.slate-creature');
  if (!creature || !('IntersectionObserver' in window)) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const trigger = scene;
  const variants = ['caught', 'trip', 'peek', 'statue'];
  let bag = [];
  let last = '';
  let armed = true;
  let resetTimer;

  function nextEncounter() {
    if (!bag.length) {
      bag = [...variants];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.at(-1) === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    last = bag.pop();
    return last;
  }

  function reset() {
    clearTimeout(resetTimer);
    resetTimer = undefined;
    delete scene.dataset.encounter;
    scene.style.removeProperty('--slate-caught');
    armed = true;
  }

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      reset();
      section.classList.remove('slate-near');
    }
  });

  new IntersectionObserver(([entry]) => {
    section.classList.toggle('slate-near', entry.isIntersecting && !reduced.matches);
  }, { rootMargin: '180px 0px' }).observe(section);

  new IntersectionObserver(([entry]) => {
    if (reduced.matches) return;
    if (!entry.isIntersecting || entry.intersectionRatio <= 0.04) {
      if (!armed && resetTimer === undefined) resetTimer = setTimeout(reset, 240);
      return;
    }
    clearTimeout(resetTimer);
    resetTimer = undefined;
    if (!armed || entry.intersectionRatio < 0.18) return;
    armed = false;
    const pose = getComputedStyle(creature).transform;
    scene.style.setProperty('--slate-caught', pose === 'none' ? 'translateX(-113%)' : pose);
    scene.dataset.encounter = nextEncounter();
  }, { threshold: [0, 0.04, 0.18] }).observe(trigger);
})();



/* Curved photo tiles projected onto the visible face of an oval dome. */
(() => {
  const gallery = document.getElementById('photo-globe');
  const canvas = gallery?.querySelector('.dome-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
  const sources = [...new Set([...gallery.querySelectorAll('.globe-tile')].map(image => image.src))];
  const photos = sources.map(src => { const image = new Image(); image.addEventListener('load', queue); image.src = src; return image; });
  const dots = [...gallery.querySelectorAll('.dome-dots button')];
  const motion = gallery.querySelector('.globe-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tau = 2 * Math.PI;
  const cols = 14;
  let turn = 0, goal = 0, last = 0, frame = 0, visible = false, paused = false, drag;
  let w = 0, h = 0;
  function queue() { if (!frame) frame = requestAnimationFrame(render); }
  function wrap(angle) { return ((angle % tau) + tau) % tau; }
  function updateControls() {
    const active = Math.round(wrap(goal) / (tau / 4)) % 4;
    dots.forEach((dot, index) => dot.setAttribute('aria-pressed', String(index === active)));
    motion.hidden = reduced.matches;
    motion.textContent = paused ? 'Resume globe' : 'Pause globe';
    motion.setAttribute('aria-pressed', String(paused));
  }
  function triangle(image, a,b,c, u,v,t) {
    const den = (v[0]-u[0])*(t[1]-u[1])-(t[0]-u[0])*(v[1]-u[1]);
    if (Math.abs(den)<.001) return;
    const A=((b[0]-a[0])*(t[1]-u[1])-(c[0]-a[0])*(v[1]-u[1]))/den;
    const B=((b[1]-a[1])*(t[1]-u[1])-(c[1]-a[1])*(v[1]-u[1]))/den;
    const C=((c[0]-a[0])*(v[0]-u[0])-(b[0]-a[0])*(t[0]-u[0]))/den;
    const D=((c[1]-a[1])*(v[0]-u[0])-(b[1]-a[1])*(t[0]-u[0]))/den;
    ctx.save(); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.clip();
    ctx.transform(A,B,C,D,a[0]-A*u[0]-C*u[1],a[1]-B*u[0]-D*u[1]); ctx.drawImage(image,0,0); ctx.restore();
  }
  function render(time) {
    frame=0;
    const dt=last ? Math.min(32,time-last) : 16;
    last=time;
    if(!w||!h)return;
    if(visible&&!paused&&!drag&&!reduced.matches) goal+=dt*.00014;
    turn=reduced.matches||drag ? goal : turn+(goal-turn)*Math.min(1,dt*.012);
    ctx.clearRect(0,0,w,h);
    const cx=w*.5, cy=h*.88, rx=w*.458, ry=h*.79;
    const point=(lon,lat)=>[cx+rx*Math.cos(lat)*Math.sin(lon),cy-ry*Math.sin(lat)];
    ctx.save();
    ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,Math.PI,tau);ctx.strokeStyle='#ff963e';ctx.lineWidth=2;ctx.shadowColor='#ff691b';ctx.shadowBlur=24;ctx.stroke();
    ctx.shadowBlur=0;
    ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,tau);ctx.clip();
    ctx.fillStyle='#160a05';ctx.fillRect(0,0,w,h);
    const edges=[-.22,.20,.53,.87,1.17,1.57];
    const step=tau/cols;
    for(let row=0;row<edges.length-1;row++)for(let col=0;col<cols;col++){
      const center=wrap(col*step+turn+Math.PI)-Math.PI;
      const start=center-step*.48,end=center+step*.48;
      const l=Math.max(-Math.PI/2,start),r=Math.min(Math.PI/2,end);
      if(r<=l)continue;
      const b=edges[row]+.012,top=edges[row+1]-.012;
      const image=photos[(col+row*Math.max(1,photos.length-1))%photos.length];
      if(!image?.naturalWidth)continue;
      const iw=image.naturalWidth,ih=image.naturalHeight;
      for(let y=0;y<2;y++)for(let x=0;x<3;x++){
        const p=l+(r-l)*x/3,q=l+(r-l)*(x+1)/3,low=b+(top-b)*y/2,high=b+(top-b)*(y+1)/2;
        const a=point(p,high),d=point(q,high),e=point(q,low),f=point(p,low);
        const u=(p-start)/(end-start)*iw,v=(q-start)/(end-start)*iw,s=ih*(1-(y+1)/2),t=ih*(1-y/2);
        triangle(image,a,d,e,[u,s],[v,s],[v,t]);triangle(image,a,e,f,[u,s],[v,t],[u,t]);
      }
    }
    const light=ctx.createLinearGradient(0,cy-ry,0,cy);
    light.addColorStop(0,'#ff9a4755');light.addColorStop(.23,'#ff71150a');light.addColorStop(.67,'#09040300');light.addColorStop(1,'#080403');
    ctx.fillStyle=light;ctx.fillRect(0,0,w,h);ctx.restore();
    ctx.save();ctx.beginPath();ctx.ellipse(cx,h*.69,rx*1.08,h*.18,0,.05,Math.PI-.05);ctx.strokeStyle='#ff781bc4';ctx.lineWidth=2.5;ctx.shadowColor='#ff7c20';ctx.shadowBlur=16;ctx.stroke();ctx.restore();
    const fade=ctx.createLinearGradient(0,h*.83,0,h);fade.addColorStop(0,'#08040300');fade.addColorStop(1,'#080403');
    ctx.fillStyle=fade;ctx.fillRect(0,h*.83,w,h*.17);
    updateControls();
    if(visible&&((!paused&&!reduced.matches)||Math.abs(goal-turn)>.0001))queue();else last=0;
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;
    const ratio=Math.min(1.5,devicePixelRatio||1);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);queue();
  }
  function move(amount){goal+=amount;queue();}
  gallery.querySelector('.dome-prev').onclick=()=>move(-tau/4);
  gallery.querySelector('.dome-next').onclick=()=>move(tau/4);
  dots.forEach((dot,i)=>dot.onclick=()=>{let delta=i*tau/4-wrap(goal);if(delta>Math.PI)delta-=tau;if(delta< -Math.PI)delta+=tau;move(delta);});
  canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={id:event.pointerId,x:event.clientX,angle:turn};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;goal=drag.angle+(event.clientX-drag.x)*tau/Math.max(w,1);queue();});
  canvas.addEventListener('lostpointercapture',()=>{drag=null;queue();});
  motion.onclick=()=>{paused=!paused;updateControls();queue();};
  reduced.addEventListener('change',()=>{updateControls();queue();});
  gallery.classList.add('dome-ready');gallery.querySelector('.dome-interaction').hidden=false;
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)queue();}).observe(canvas);
  updateControls();resize();
})();
