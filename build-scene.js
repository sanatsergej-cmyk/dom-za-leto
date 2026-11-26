for (const story of document.querySelectorAll('.build-story')) {
  const run = story.querySelector('.build-run');
  const backdrop = story.querySelector('.build-backdrop');
  const video = story.querySelector('.build-video');
  const frames = [...story.querySelectorAll('[data-build-frame]')];
  const beats = [...story.querySelectorAll('[data-build-beat]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0,Math.min(1,value));
  const beatStops = [0,.13,.30,.70,.9];
  let requested = 0;
  let displayed = 0;
  let pending = 0;
  let lastTime = 0;
  let previousBeat = 0;
  let heldIndex = 0;
  let wantsVideo = false;
  let videoFailed = false;

  function showBeat(progress) {
    const index = beatStops.findLastIndex(start=>progress>=start);
    if (index===previousBeat) return;
    beats[previousBeat].hidden = true;
    beats[index].hidden = false;
    previousBeat = index;
  }

  function paintFallback(progress) {
    const position = progress*(frames.length-1);
    const index = Math.floor(position);
    const fraction = clamp(position-index);
    const frame = frames[index];
    const nextFrame = frames[index+1];
    if (frame.dataset.src && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
    if (fraction>0 && nextFrame?.dataset.src && !nextFrame.hasAttribute('src')) nextFrame.src = nextFrame.dataset.src;
    const shownIndex = frame.naturalWidth ? index : heldIndex;
    const mix = nextFrame?.naturalWidth && shownIndex===index ? fraction : 0;
    frames.forEach((frame,i)=>{
      const isNext = i===index+1 && mix>0;
      frame.style.opacity = i===shownIndex ? '1' : isNext ? String(mix*mix*(3-2*mix)) : '0';
      frame.style.zIndex = isNext ? '2' : '1';
    });
    heldIndex = mix>=.5 ? index+1 : shownIndex;
  }

  function desiredTime() {
    return displayed * Math.max(0,video.duration-0.045);
  }

  function seekVideo() {
    if (!wantsVideo || reduced.matches || videoFailed || video.readyState<2 || video.seeking || !Number.isFinite(video.duration)) return;
    const time = desiredTime();
    if (Math.abs(video.currentTime-time)>.045) video.currentTime = time;
    else video.classList.add('is-visible');
  }

  function paint(time) {
    pending=0;
    const interval=lastTime?Math.min(time-lastTime,32):16;
    const remaining=requested-displayed;
    displayed=Math.abs(remaining)<.002?requested:displayed+remaining*(1-Math.exp(-interval/52));
    lastTime=time;
    showBeat(displayed);
    if (!video.classList.contains('is-visible')) paintFallback(displayed);
    seekVideo();
    if(displayed!==requested) pending=requestAnimationFrame(paint);
    else lastTime=0;
  }

  function trackScroll() {
    if(reduced.matches) return;
    const travel=run.offsetHeight-backdrop.offsetHeight;
    if(travel<=0) return;
    const rect=run.getBoundingClientRect();
    if(scrollY>0 && rect.top<innerHeight-30 && rect.bottom>0) loadVideo();
    requested=clamp(-rect.top/travel);
    if(!pending) pending=requestAnimationFrame(paint);
  }

  function loadVideo() {
    if (reduced.matches || wantsVideo || !video.canPlayType('video/mp4')) return;
    wantsVideo=true;
    video.preload='auto';
    video.src=video.dataset.videoSrc;
    video.load();
  }

  function applyMode() {
    cancelAnimationFrame(pending);
    pending=0;
    lastTime=0;
    story.classList.toggle('is-enhanced',!reduced.matches);
    backdrop.hidden=reduced.matches;
    trackScroll();
  }

  video.addEventListener('loadeddata',seekVideo);
  video.addEventListener('seeked',seekVideo);
  video.addEventListener('error',()=>{
    videoFailed=true;
    video.classList.remove('is-visible');
    trackScroll();
  });
  frames.forEach(frame=>frame.addEventListener('load',trackScroll,{once:true}));
  addEventListener('scroll',trackScroll,{passive:true});
  addEventListener('resize',trackScroll);
  reduced.addEventListener('change',applyMode);
  applyMode();
}
