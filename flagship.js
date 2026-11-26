const flagship = document.querySelector('.flagship-hero');
const controls = flagship.querySelector('.flagship-light');
const day = controls.querySelector('[data-flagship-light="day"]');
const dusk = controls.querySelector('[data-flagship-light="dusk"]');
const status = flagship.querySelector('.flagship-status');
let image;
let loading;
let desired = 'day';

function show(mode) {
  flagship.classList.toggle('shows-dusk',mode==='dusk');
  day.setAttribute('aria-pressed',String(mode==='day'));
  dusk.setAttribute('aria-pressed',String(mode==='dusk'));
}

function loadDusk() {
  if (loading) return loading;
  image=document.createElement('img');
  image.className='flagship-dusk';
  image.alt='';
  loading=new Promise((resolve,reject)=>{
    image.addEventListener('load',resolve,{once:true});
    image.addEventListener('error',reject,{once:true});
    flagship.querySelector('.flagship-day').after(image);
    image.sizes='100vw';
    image.srcset='assets/editorial/house89-dusk-640.webp 640w, assets/editorial/house89-dusk-1440.webp 1440w';
    image.src='assets/editorial/house89-dusk-1440.webp';
  }).then(()=>new Promise(resolve=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      image.classList.add('is-ready');
      resolve();
    }));
  })).catch(error=>{
    image.remove();
    loading=undefined;
    throw error;
  });
  return loading;
}

day.addEventListener('click',()=>{
  desired='day';
  show('day');
  status.textContent='';
});

dusk.addEventListener('click',async ()=>{
  desired='dusk';
  if (!image?.classList.contains('is-ready')) status.textContent='Загружаем сумеречный вид…';
  try {
    await loadDusk();
    if (desired==='dusk') {
      show('dusk');
      status.textContent='';
    }
  } catch {
    if (desired==='dusk') {
      show('day');
      status.textContent='Сумеречный вид не загрузился. Нажмите, чтобы повторить.';
    }
  }
});
controls.hidden=false;
