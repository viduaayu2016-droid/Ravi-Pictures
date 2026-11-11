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

/* Keep the photo globe still off-screen and respect the visitor's pause choice. */
(() => {
  const globe = document.getElementById('photo-globe');
  const button = globe?.querySelector('.globe-motion');
  if (!button || !('IntersectionObserver' in window)) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let inView = false;
  function sync() {
    globe.classList.toggle('globe-visible', inView && !reduced.matches);
    globe.classList.toggle('globe-paused', paused);
    button.hidden = reduced.matches;
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume globe' : 'Pause globe';
  }
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(globe);
  sync();
})();
