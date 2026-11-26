const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const portrait = matchMedia('(max-width: 740px)');
const clampProgress = value => Math.max(0, Math.min(1, value));

for (const run of document.querySelectorAll('.build-run')) {
  const video = run.querySelector('.build-video');
  const stages = [...run.querySelectorAll('[data-stage-time]')].map(element => ({
    element,
    path: element.querySelector('.build-road-progress'),
    time: Number(element.dataset.stageTime),
  }));
  const backdrop = run.querySelector('.build-backdrop');
  let frame = 0;
  let lastTime = 0;
  let targetTime = 0;
  let displayedTime = 0;
  let current = 0;
  let sourcesLoaded = false;
  let inView = false;
  let active = false;

  function seek() {
    if (!active || !inView || video.error || video.readyState < 1 || video.seeking) return;
    const time = Math.min(displayedTime, video.duration - .045);
    if (Math.abs(video.currentTime - time) > .038) video.currentTime = time;
  }

  function paint(timestamp) {
    frame = 0;
    const elapsed = lastTime ? Math.min(timestamp - lastTime, 40) : 16;
    const distance = targetTime - displayedTime;
    displayedTime = Math.abs(distance) < .023 ? targetTime : displayedTime + distance * (1 - Math.exp(-elapsed / 75));
    seek();
    lastTime = timestamp;
    if (displayedTime !== targetTime) frame = requestAnimationFrame(paint);
    else lastTime = 0;
  }

  function track() {
    if (!active || !inView) return;
    const line = portrait.matches ? backdrop.offsetHeight + (innerHeight - backdrop.offsetHeight) * .49 : innerHeight * .52;
    const position = line - run.getBoundingClientRect().top;
    let stageIndex = 0;
    while (stages[stageIndex + 1]?.element.offsetTop <= position) stageIndex++;
    const stage = stages[stageIndex];
    const progress = clampProgress((position - stage.element.offsetTop) / stage.element.offsetHeight);
    if (current !== stageIndex) {
      stages[current].element.removeAttribute('data-current');
      stage.element.setAttribute('data-current', '');
      current = stageIndex;
    }
    stages.forEach(({ path }, index) => {
      path.style.strokeDashoffset = index < stageIndex ? '0' : index === stageIndex ? String(1 - progress) : '1';
    });
    const endTime = stages[stageIndex + 1]?.time ?? (video.duration || 18.8);
    targetTime = stage.time + (endTime - stage.time) * progress;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function load() {
    if (!active || sourcesLoaded) return;
    sourcesLoaded = true;
    video.preload = 'auto';
    video.src = portrait.matches ? video.dataset.videoSmall : video.dataset.videoSrc;
  }

  function configure() {
    active = !motionPreference.matches && Boolean(video.canPlayType('video/mp4'));
    run.classList.toggle('has-motion', active);
    if (active && inView) load();
    if (active) track();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (sourcesLoaded) {
        video.removeAttribute('src');
        video.load();
        sourcesLoaded = false;
        displayedTime = 0;
      }
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) {
      load();
      track();
    }
  }, { rootMargin: '100px 0px' });
  observer.observe(run);

  video.addEventListener('loadedmetadata', track);
  video.addEventListener('seeked', seek);
  addEventListener('scroll', track, { passive: true });
  addEventListener('resize', track);
  motionPreference.addEventListener('change', configure);
  configure();
}
