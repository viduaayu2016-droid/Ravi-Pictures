const nav=document.querySelector('nav'),menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');document.querySelectorAll('nav a').forEach(n=>n.classList.remove('active'));a.classList.add('active')}));document.getElementById('year').textContent=new Date().getFullYear();document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b)});document.querySelectorAll('.gallery-item').forEach(x=>x.hidden=b.dataset.filter!=='all'&&x.dataset.category!==b.dataset.filter)}));const lightbox=document.getElementById('lightbox');document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{const image=b.querySelector('img');lightbox.querySelector('img').src=image.src;lightbox.querySelector('img').alt=image.alt;lightbox.querySelector('p').textContent=b.querySelector('b').textContent+' — illustrative visual direction';lightbox.showModal()}));document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});document.querySelectorAll('[data-reel]').forEach(b=>b.addEventListener('click',()=>document.getElementById('reel-dialog').showModal()));document.querySelectorAll('[data-subject]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('select').value=a.dataset.subject}));document.getElementById('enquiry').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const subject='Project enquiry: '+f.get('service');const body=`Name: ${f.get('name')}\nEmail: ${f.get('email')}\nService: ${f.get('service')}\n\n${f.get('brief')}`;location.href='mailto:info@ravipictures.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent='Your email draft is ready. If your email app did not open, write to info@ravipictures.com directly.'});
const reelStage=document.querySelector('.reel-stage'),motionButton=document.querySelector('.reel-motion');if(reelStage&&motionButton){motionButton.addEventListener('click',()=>{const paused=reelStage.classList.toggle('is-paused');motionButton.setAttribute('aria-pressed',paused);motionButton.setAttribute('aria-label',paused?'Resume reel animation':'Pause reel animation');motionButton.textContent=paused?'▶ RESUME MOTION':'Ⅱ PAUSE MOTION'});const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');function syncReelMotion(){reelStage.classList.toggle('is-paused',motionPreference.matches);motionButton.setAttribute('aria-pressed',motionPreference.matches);motionButton.setAttribute('aria-label',motionPreference.matches?'Resume reel animation':'Pause reel animation');motionButton.textContent=motionPreference.matches?'▶ RESUME MOTION':'Ⅱ PAUSE MOTION'}motionPreference.addEventListener('change',syncReelMotion);syncReelMotion();}

/* The photographed lamp stays on; the slate operator polishes its lens once. */
(() => {
  const section = document.getElementById('about');
  const polisher = section?.querySelector('.about-lens-operator .about-slate');
  const puller = section?.querySelector('.about-pull-slate');
  if (!polisher || !puller) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canObserve = 'IntersectionObserver' in window;
  let stage = 'waiting';
  section.classList.add('about-light-lit');

  function finish() {
    stage = 'complete';
    section.classList.remove('about-lens-rubbing', 'about-film-pulling');
    section.classList.add('about-film-done');
  }

  if (reduced.matches || !canObserve) finish();

  polisher.addEventListener('animationend', (event) => {
    if (event.target !== polisher || event.animationName !== 'rp-lens-walk' || stage !== 'rubbing') return;
    section.classList.remove('about-lens-rubbing');
    stage = 'pulling';
    section.classList.add('about-film-pulling');
  });
  puller.addEventListener('animationend', (event) => {
    if (event.target === puller && event.animationName === 'rp-pull-operator' && stage === 'pulling') finish();
  });
  reduced.addEventListener('change', ({ matches }) => {
    if (matches) finish();
  });

  if (!canObserve) return;
  new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting);
    section.classList.toggle('about-light-visible', visible);
    if (!visible || stage !== 'waiting') return;
    if (reduced.matches) return finish();
    stage = 'rubbing';
    section.classList.add('about-lens-rubbing');
  }).observe(section);
})();
