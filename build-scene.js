for (const story of document.querySelectorAll('.build-story')) {
  const run = story.querySelector('.build-run');
  const backdrop = story.querySelector('.build-backdrop');
  const frames = [...story.querySelectorAll('[data-build-frame]')];
  const captions = [...story.querySelectorAll('.build-chapter figcaption')];
  const titles = [...story.querySelectorAll('.build-chapter img')].map(img => img.alt);
  const title = story.querySelector('[data-build-title]');
  const copy = story.querySelector('[data-build-copy]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0,Math.min(1,value));
  let requested = 0;
  let displayed = 0;
  let pending = 0;
  let lastTime = 0;
  let previousCaption = -1;
  let heldIndex = 0;

  function setCaption(index) {
    if (index === previousCaption) return;
    previousCaption = index;
    title.textContent = titles[index];
    copy.textContent = captions[index].lastChild.textContent.trim();
  }

  function paint(time) {
    pending = 0;
    const duration = lastTime ? Math.min(time-lastTime,32) : 16;
    const remaining = requested-displayed;
    displayed = Math.abs(remaining)<.002 ? requested : displayed+remaining*(1-Math.exp(-duration/80));
    lastTime = time;
    const position = displayed*(frames.length-1);
    const index = Math.floor(position);
    const fraction = clamp((position-index-.12)/.76);
    const nextFrame = frames[index+1];
    const shownIndex = frames[index].naturalWidth ? index : heldIndex;
    const mix = nextFrame?.naturalWidth && shownIndex===index ? fraction : 0;
    frames.forEach((frame,i)=>{
      const isNext = i===index+1 && mix>0;
      frame.style.opacity = i===shownIndex ? '1' : isNext ? String(mix*mix*(3-2*mix)) : '0';
      frame.style.zIndex = isNext ? '2' : '1';
    });
    heldIndex = mix>=.5 ? index+1 : shownIndex;
    setCaption(heldIndex);
    if (displayed!==requested) pending=requestAnimationFrame(paint);
    else lastTime=0;
  }

  function trackScroll() {
    if (reduced.matches) return;
    const travel=run.offsetHeight-backdrop.offsetHeight;
    if(travel<=0) return;
    requested=clamp(-run.getBoundingClientRect().top/travel);
    if (!pending) pending=requestAnimationFrame(paint);
  }

  function applyMode() {
    cancelAnimationFrame(pending);
    pending=0;
    lastTime=0;
    story.classList.toggle('is-enhanced',!reduced.matches);
    backdrop.hidden=reduced.matches;
    trackScroll();
  }

  frames.forEach(frame=>frame.addEventListener('load',trackScroll,{once:true}));
  addEventListener('scroll',trackScroll,{passive:true});
  addEventListener('resize',trackScroll);
  reduced.addEventListener('change',applyMode);
  applyMode();
}
