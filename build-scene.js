for (const story of document.querySelectorAll('.build-story')) {
  const chapters = [...story.querySelectorAll('[data-build-chapter]')];
  const frames = [...story.querySelectorAll('[data-build-frame]')];
  const navigation = story.querySelector('.build-nav');
  const buttons = [...navigation.querySelectorAll('button')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let previous = -1;
  let cleanup;
  let pending = false;

  function update() {
    pending = false;
    const midpoint = window.innerHeight * .56;
    const index = Math.max(0, chapters.findLastIndex(chapter => chapter.getBoundingClientRect().top <= midpoint));
    if (index === active) return;
    previous = active;
    active = index;
    clearTimeout(cleanup);
    frames.forEach((frame,i) => {
      frame.toggleAttribute('data-outgoing',i === previous);
      frame.toggleAttribute('data-active',i === index);
      if (i === index) buttons[i].setAttribute('aria-current','step');
      else buttons[i].removeAttribute('aria-current');
    });
    if (previous >= 0) {
      const outgoing = frames[previous];
      cleanup = setTimeout(() => outgoing.removeAttribute('data-outgoing'), 500);
    }
  }

  function schedule() {
    if (pending || reduced.matches) return;
    pending = true;
    requestAnimationFrame(update);
  }

  function applyMode() {
    story.classList.toggle('is-enhanced',!reduced.matches);
    navigation.hidden = reduced.matches;
    active = -1;
    clearTimeout(cleanup);
    frames.forEach(frame => frame.removeAttribute('data-outgoing'));
    schedule();
  }

  buttons.forEach((button,i) => button.addEventListener('click', () => {
    chapters[i].scrollIntoView({block:'start'});
    chapters[i].querySelector('h2').focus({preventScroll:true});
    schedule();
  }));

  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', applyMode);
  applyMode();
}
