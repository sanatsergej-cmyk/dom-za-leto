const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const portrait = matchMedia('(max-width: 740px)');
const clampProgress = value => Math.max(0, Math.min(1, value));
const filmDuration = 18.8;
const sequenceFPS = 3;
const sequenceColumns = 8;
const sequenceFrames = Math.ceil(filmDuration * sequenceFPS);

for (const run of document.querySelectorAll('.build-run')) {
  const video = run.querySelector('.build-video');
  const sequence = run.querySelector('.build-sequence');
  const canvas = sequence.getContext('2d', { alpha: false });
  const sheet = new Image();
  sheet.fetchPriority = 'high';
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
  let presentedTime = -Infinity;
  let current = 0;
  let sourcesLoaded = false;
  let inView = false;
  let sheetLoaded = false;
  let videoLoadTimer = 0;
  let lastSequenceFrame = -1;
  let frameCallback = 0;

  function canShowVideo() {
    return !motionPreference.matches && !video.error && video.readyState >= 2
      && Math.abs(presentedTime - displayedTime) < .16;
  }

  function draw() {
    const showVideo = canShowVideo();
    run.classList.toggle('shows-video', showVideo);
    if (showVideo || !sheetLoaded) return;
    const index = Math.min(sequenceFrames - 1, Math.round(displayedTime * sequenceFPS));
    if (index === lastSequenceFrame) return;
    const { width, height } = sequence;
    canvas.drawImage(sheet, index % sequenceColumns * width, Math.floor(index / sequenceColumns) * height,
      width, height, 0, 0, width, height);
    lastSequenceFrame = index;
    sequence.hidden = false;
  }

  function seek() {
    if (motionPreference.matches || !inView || video.error || video.readyState < 1 || video.seeking) return;
    const time = Math.min(displayedTime, video.duration - .045);
    if (Math.abs(video.currentTime - time) > .038) video.currentTime = time;
  }

  function trackVideoFrame() {
    if (frameCallback || !inView || !sourcesLoaded || motionPreference.matches || !video.requestVideoFrameCallback) return;
    frameCallback = video.requestVideoFrameCallback((_time, { mediaTime }) => {
      frameCallback = 0;
      presentedTime = mediaTime;
      draw();
      trackVideoFrame();
    });
  }

  function paint(timestamp) {
    frame = 0;
    const elapsed = lastTime ? Math.min(timestamp - lastTime, 40) : 16;
    const distance = targetTime - displayedTime;
    displayedTime = motionPreference.matches || Math.abs(distance) < .023
      ? targetTime : displayedTime + distance * (1 - Math.exp(-elapsed / 75));
    draw();
    seek();
    lastTime = timestamp;
    if (displayedTime !== targetTime) frame = requestAnimationFrame(paint);
    else lastTime = 0;
  }

  function track() {
    if (!inView) return;
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
    const endTime = stages[stageIndex + 1]?.time ?? filmDuration;
    const fraction = motionPreference.matches ? .52 : progress;
    targetTime = stage.time + (endTime - stage.time) * fraction;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function loadVideo() {
    clearTimeout(videoLoadTimer);
    videoLoadTimer = 0;
    if (!inView || motionPreference.matches || sourcesLoaded || !video.canPlayType('video/mp4') || !video.requestVideoFrameCallback) return;
    sourcesLoaded = true;
    video.preload = 'auto';
    video.src = portrait.matches ? video.dataset.videoSmall : video.dataset.videoSrc;
    trackVideoFrame();
  }

  function stopVideoTracking() {
    if (frameCallback) video.cancelVideoFrameCallback(frameCallback);
    frameCallback = 0;
  }

  function configure() {
    if (motionPreference.matches && sourcesLoaded) {
      stopVideoTracking();
      video.removeAttribute('src');
      video.load();
      sourcesLoaded = false;
      presentedTime = -Infinity;
    }
    if (inView) {
      if (!sheet.src) sheet.src = sequence.dataset.frames;
      if (sheetLoaded || (sheet.complete && !sheet.naturalWidth)) loadVideo();
      else if (!videoLoadTimer && !sourcesLoaded && !motionPreference.matches) videoLoadTimer = setTimeout(loadVideo, 4000);
      trackVideoFrame();
      track();
    }
  }

  run.classList.add('has-motion');
  sheet.addEventListener('load', () => {
    sheetLoaded = true;
    draw();
    loadVideo();
  });
  sheet.addEventListener('error', loadVideo);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) configure();
    else stopVideoTracking();
  }, { rootMargin: '180px 0px' });
  observer.observe(run);

  video.addEventListener('loadedmetadata', track);
  video.addEventListener('seeked', seek);
  video.addEventListener('error', draw);
  addEventListener('scroll', track, { passive: true });
  addEventListener('resize', track);
  motionPreference.addEventListener('change', configure);
}
