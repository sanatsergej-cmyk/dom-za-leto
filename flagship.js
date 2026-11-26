const flagship = document.querySelector('.flagship-hero');
const controls = flagship.querySelector('.flagship-light');
const day = controls.querySelector('[data-flagship-light="day"]');
const dusk = controls.querySelector('[data-flagship-light="dusk"]');
const status = flagship.querySelector('.flagship-status');
let image;
let loaded;
let active = 'day';

function show(value) {
  active = value;
  flagship.classList.toggle('shows-dusk',value==='dusk');
  day.setAttribute('aria-pressed',String(value==='day'));
  dusk.setAttribute('aria-pressed',String(value==='dusk'));
}

day.addEventListener('click', () => {
  show('day');
  status.textContent = '';
});

dusk.addEventListener('click', async () => {
  show('dusk');
  if (!loaded) {
    image = document.createElement('img');
    image.className = 'flagship-dusk';
    image.alt = '';
    image.sizes = '100vw';
    image.srcset = 'assets/editorial/house89-dusk-640.webp 640w, assets/editorial/house89-dusk-1440.webp 1440w';
    image.src = 'assets/editorial/house89-dusk-1440.webp';
    loaded = image.decode().then(()=>{
      flagship.querySelector('.flagship-day').after(image);
      // Allow the browser to paint the transparent layer before fading it in.
      requestAnimationFrame(()=>requestAnimationFrame(()=>image.classList.add('is-ready')));
    }).catch(error=>{
      loaded = undefined;
      throw error;
    });
  }
  status.textContent = 'Загружаем сумеречный вид…';
  try {
    await loaded;
    if (active==='dusk') status.textContent = '';
  } catch {
    if (active==='dusk') {
      show('day');
      status.textContent = 'Сумеречный вид не загрузился.';
    }
  }
});
controls.hidden = false;
