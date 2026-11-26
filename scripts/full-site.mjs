import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const models = JSON.parse(read('content/invest-models.json'));
const landListings = JSON.stringify(JSON.parse(read('content/land-listings.json'))).replace(/</g, '\\u003c');
const image = (src, alt, eager = false) => `<img src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const editorial = (name, alt) => image(`assets/editorial/${name}.webp`, alt);
const action = (url, label, tone = 'primary') => `<a class="action action--${tone}" href="${url}">${label}<span class="action-arrow" aria-hidden="true">↗</span></a>`;
const card = (url, title, copy, media = '') => `<article class="tile">${media}<div><h3><a href="${url}">${title}</a></h3><p>${copy}</p></div></article>`;
const section = (title, body) => `<section class="band"><h2>${title}</h2>${body}</section>`;
const grid = (items) => `<div class="tile-grid">${items.join('')}</div>`;
const lead = (label, title, copy, buttons = '') => `<div class="lead"><p class="tag">${label}</p><h1>${title}</h1><p class="lede">${copy}</p>${buttons}</div>`;
const assets = {
  89: {area:'80,1', plan:'editorial/plan-89.webp', photo:'house89-daylight-640.webp', desc:'Три спальни и кухня-гостиная 29,2 м².', price:7800000},
  110: {area:'99,8', plan:'editorial/plan-110.webp', photo:'evening-640.webp', desc:'Три спальни, две гардеробные и отдельный санузел родителей.', price:8800000},
};
const houseCards = () => `<div class="project-grid">${[
  ...Object.entries(assets).map(([id,h]) => card(`projects/dom-${id}/`,`Дом ${id}`,`${h.area} м² внутри. ${h.desc}`, `<img src="assets/${h.photo}" srcset="assets/${h.photo} 640w, assets/${h.photo.replace('-640','-1100')} 1100w" sizes="(max-width: 740px) 90vw, 43vw" alt="Фасад Дома ${id} из КП" loading="lazy" decoding="async">`)),
  card('architecture/soft/','Soft','Мягкие углы и спокойный фасад. Концепция для доработки.',editorial('soft','Визуальный референс фасада Soft')),
  card('architecture/resort/','Resort','Арки и светлая отделка. Концепция для доработки.',editorial('resort','Визуальный референс фасада Resort')),
].join('')}</div>`;
const gallery = [
  ['open-life','Open Life','Архитектурный референс'],
  ['soft','Soft','Архитектурный референс'],
  ['soft-alt','Soft · второй вариант','Архитектурный референс'],
  ['resort','Resort','Архитектурный референс'],
  ['resort-alt','Resort · второй вариант','Архитектурный референс'],
  ['montage-1','Фасад с остеклением','Фото со стройки · дом 80 м²'],
  ['montage-2','Панельная коробка','Фото со стройки · дом 80 м²'],
  ['montage-3','Боковой фасад','Фото со стройки · дом 80 м²'],
];
const galleryItems = (items) => grid(items.map(([key,title,caption]) => card(`assets/editorial/${key}.webp`,title,caption,editorial(key,title))));
const book = [
  ['vybor-uchastka','Как выбрать участок под дом','Начните с модели дома и условий жизни. Сверьте расположение пятна по плану, доступ техники, уклон и существующие сети.','При осмотре пройдите будущий подъезд, отметьте перепады участка, уточните точки подключения и оставьте место для монтажа.'],
  ['dokumenty','Какие документы проверить перед покупкой','Запросите актуальную выписку ЕГРН и документы продавца. Сопоставьте идентификатор, площадь и границы с выбранным участком.','Для оценки застройки запросите градостроительные сведения и проверьте ограничения, доступ и условия сетей. Спорные сведения сверяйте с профильным специалистом.'],
  ['kadastr','Где найти кадастровый номер и ВРИ','Кадастровый номер указан в выписке ЕГРН. По номеру или адресу можно найти объект на публичной карте.','Вид разрешённого использования помогает определить, какие сценарии проверить. Уточните также территориальную зону, ограничения и параметры конкретного проекта.'],
  ['seti','Как проверить подъезд и сети','Проверьте, может ли техника попасть на площадку и есть ли место для разгрузки. Для подключения уточните расстояния и доступную мощность.','Попросите документы или условия подключения. Наличие столба или трубы рядом с границей требует отдельной проверки.'],
  ['komplektaciya','Предчистовая или под ключ','Сравнивайте пакеты по перечню работ. Отдельно выпишите отопление, отделку, кухню, свет, мебель и внешние сети.','В смете уточните, какие работы зависят от конкретного участка и кто выполняет подключения.'],
  ['ipoteka','Как читать расчёт ипотеки','Платёж зависит от суммы кредита, ставки и срока. Одинаковые платежи за разные дома возможны при одинаковом кредите.','Сопоставьте собственные средства, внешние работы и расходы сделки. Актуальные условия и доступность подтверждает кредитор.'],
  ['arenda','Как читать расчёт доходного дома','Начните с полной суммы вложений и ставок аренды по отдельным единицам. Учтите простой и расходы эксплуатации.','Сравните операционный доход и поток после налогов, резерва и долга. Проверьте, как изменится итог при снижении ставок и росте расходов.'],
];
const entries = [];
const add = (file,title,description,body,{script='',indexable=true}={}) => entries.push({file,title,description,body,script,indexable});
const e = (name) => `assets/editorial/${name}`;
const buildFilm = e('build-route.mp4?v=1');
const buildStages = [
  ['Дом 89',0,'Свой дом в предгорьях','Три спальни, кухня-гостиная 29,2 м² и выход во двор. Так выглядит Дом 89 в одном из вариантов отделки.','80,1 м² полезной площади','projects/dom-89/#floor-plan','Посмотреть план дома'],
  ['Участок',2.6,'Выбираем место для дома','Смотрим, где будут свет, вид из окон и удобный вход. До покупки участка проверяем подъезд крана, рельеф и расстояние до сетей.','Посадка дома, въезд и будущая терраса','land/search/','Подобрать участок'],
  ['Фундамент',5,'Заливаем плиту','Сначала увязываем основание с грунтом и планировкой. Вводы воды и канализации размещаем заранее, чтобы они вышли там, где запланированы кухня и санузлы.','Основание под конкретный участок','construction/','Как готовим основание'],
  ['Монтаж',7.2,'Собираем стены и перекрытие','Панели с готовыми проёмами изготавливают на заводе по раскладке. На площадке кран последовательно ставит стеновые элементы, затем монтируем несколько плит перекрытия.','Наружная панель: бетон, утеплитель, бетон','technology/','Посмотреть устройство панели'],
  ['Остекление',11.3,'Закрываем дом от погоды','В готовые проёмы устанавливаем окна и наружные двери. Дальше можно переходить к инженерии и внутренним работам по выбранной комплектации.','Высота и ширина окон заданы в проекте','equipment/','Сравнить комплектации'],
  ['Фасад',13.4,'Отделываем фасад','У Дома 89 светлые плоскости фасада сочетаются с вертикальной облицовкой под дерево. Образцы покрытия и цвет обсуждаем до закупки.','Отделка и её состав фиксируются в смете','architecture/open-life/','Посмотреть Open Life'],
  ['Двор',15.8,'Доводим участок до жизни','Планируем дорожку от калитки, место для террасы и посадок. Озеленение, ограждение и освещение двора можно включить в отдельный этап.','Благоустройство рассчитывается по участку','quiz/?model=89','Хочу такой дом'],
];
const roadShape = 'M48 0C48 12 85 14 85 26S48 42 48 50 12 64 12 76 48 88 48 100';
const scene = `<section class="build-story" id="stages" aria-label="Маршрут строительства Дома 89">
  <div class="build-run">
    <div class="build-backdrop">
      <div class="build-visual">
        <video class="build-video" data-video-src="${buildFilm}" data-video-small="${e('build-route-compact.mp4?v=1')}" poster="assets/house89-daylight-1100.webp" preload="none" muted playsinline disablepictureinpicture aria-hidden="true"></video>
      </div>
      <span class="build-film-credit">Дом 89 · проектная визуализация</span>
    </div>
    <div class="build-steps">
      ${buildStages.map(([label,time,title,copy,detail,url,cta],i)=>`<article class="build-step" data-stage-time="${time}"${i===0?' data-current':''}>
        <svg class="build-road" viewBox="0 0 96 100" preserveAspectRatio="none" aria-hidden="true">
          <path class="build-road-edge" d="${roadShape}"/>
          <path class="build-road-center" d="${roadShape}"/>
          <path class="build-road-progress" d="${roadShape}" pathLength="1"/>
        </svg>
        <span class="build-station" aria-hidden="true"></span>
        <div class="build-step-copy">
          <p class="tag">${label}</p>
          <h2>${title}</h2>
          <p>${copy}</p>
          <p class="build-detail">${detail}</p>
          ${action(url,cta,i===buildStages.length-1?'primary':'outline')}
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
const technical = `<div class="spec-strip"><div><strong>230 мм</strong><span>Наружная стена</span></div><div><strong>120 мм</strong><span>Перегородка</span></div><div><strong>350 мм</strong><span>Панель покрытия</span></div></div><p>Толщина типовых изделий. Состав, узлы и опирание уточняются по проекту.</p>${grid([
  card('technology/','Устройство панели','Два слоя бетона и утеплитель между ними.',image('assets/panel.webp','Схема железобетонной панели с утеплителем')),
  card('objects/','Фото со стройки','Панельная коробка и установленное остекление.',editorial('montage-1','Фото дома на стадии монтажа')),
])}<p>${action('technology/','Подробнее о технологии')}</p>`;
const collections = [
  ['open-life','Open Life','Чистые линии, широкие проёмы и прямой выход на террасу.','open-life'],
  ['soft','Soft','Мягкие углы, светлый фасад и спокойный ритм окон.','soft'],
  ['resort','Resort','Арочные проёмы и выразительные формы для дома и гостевых сценариев.','resort'],
];
const collectionCards = () => grid(collections.map(([id,title,description,photo])=>card(`architecture/${id}/`,title,description,editorial(photo,`Архитектурная концепция ${title}`))));
const readiness = [
  ['Домокомплект','Стеновые панели, перегородки и панели покрытия по проекту.'],
  ['Тепловой контур','Фундамент, стены, кровля и окна в согласованной комплектации.'],
  ['Предчистовая с инженерией','Подготовка поверхностей и инженерные системы по смете.'],
  ['Отделка и мебель','Согласованные покрытия и выбранный комплект мебели.'],
];
const readinessCards = `<dl class="sales-points">${readiness.map(([title,text])=>`<div><dt>${title}</dt><dd>${text}</dd></div>`).join('')}</dl>`;
const advantages = `<dl class="sales-points">
  <div><dt>Панели изготавливают на заводе</dt><dd>Состав и размеры панелей сверяем по проекту до монтажа.</dd></div>
  <div><dt>Железобетон и утеплитель в стене</dt><dd>В типовой наружной панели утеплитель расположен между двумя слоями бетона.</dd></div>
  <div><dt>Смета с понятной готовностью</dt><dd>Отдельно видны работы по дому, доплаты по участку и опции.</dd></div>
</dl><p>Сравниваете с СИП или каркасом? Сопоставьте одинаковую комплектацию, характеристики стены и состав работ по смете.</p>${action('technology/compare/','Как сравнить технологии')}`;
const dimensionsForm = `<form class="tool" data-calculator="dimensions">
 <div class="fields"><label>Длина, м<input name="length" type="number" min="1" step="0.01" required value="8"></label>
 <label>Ширина, м<input name="width" type="number" min="1" step="0.01" required value="8"></label>
 <label>Этажность<select name="floors"><option value="1">Один этаж</option><option value="2">Два этажа одинакового габарита</option></select></label>
 <label>Готовность<select name="readiness">${readiness.map(([title])=>`<option>${title}</option>`).join('')}</select></label></div>
 <button class="action" type="submit">Рассчитать</button>
 <div data-dimensions-result hidden><dl class="sales-points"><div><dt>Пятно дома</dt><dd><output name="footprint"></output></dd></div><div><dt>Площадь по наружному контуру</dt><dd><output name="gross"></output></dd></div><div><dt>Периметр основания</dt><dd><output name="perimeter"></output></dd></div></dl>
 <p>Расчёт для прямоугольного контура. Полезную площадь определяем по планировке, цену — по проекту и участку.</p>
 <div class="buttons"><a class="action" data-dimensions-request href="sms:+79787245424">Запросить смету по SMS</a><a href="tel:+79787245424">Позвонить</a></div></div></form>`;
const landscapeCard = `<section class="place-feature" aria-labelledby="place-title">
  <figure>${editorial('fiolent-project','Мыс Фиолент: море, светлый камень и склон')}<figcaption>Мыс Фиолент · <a href="credits.html">Источник фото</a></figcaption></figure>
  <div class="place-copy">
    <h2 id="place-title">Дом начинается<br>с участка</h2>
    <p>Где открывается вид? Как заедет кран? Где удобнее поставить дом и вывести террасу? Начинаем проект с этих вопросов.</p>
    <div class="buttons">${action('land/check/','Проверить участок')}${action('land/search/','Подобрать участок','outline')}</div>
  </div>
</section>`;
const rentalAndGuest = `<section class="band home-directions" aria-labelledby="direction-title">
  <h2 id="direction-title">Дома для аренды и отдыха</h2>
  <div class="direction-grid">
    <article class="direction-card">${editorial('rental-direction','Визуализация секционного доходного дома')}<div><h3>Доходные дома</h3><p>Несколько квартир в одном здании. Подбираем квартирографию под участок и задачу аренды.</p>${action('dohodnye-doma/','Смотреть проекты','outline')}</div></article>
    <article class="direction-card">${editorial('resort','Визуализация гостевых домиков с арками')}<div><h3>Гостевые дома</h3><p>От отдельного домика до комплекса. Продумываем входы, приватность, дорожки и общие зоны.</p>${action('gostevye-doma/','Смотреть варианты','outline')}</div></article>
  </div>
</section>`;
add('index.html','Частные, доходные и гостевые дома в Крыму','Дом за лето строит дома для жизни и проектирует доходные и гостевые дома из заводских панелей.',`
  <section class="flagship-hero" aria-labelledby="flagship-title">
    <picture class="flagship-day">
      <img src="assets/house89-daylight-1100.webp" srcset="assets/house89-daylight-640.webp 640w, assets/house89-daylight-1100.webp 1100w, assets/house89-daylight-1440.webp 1440w" sizes="100vw" alt="Дом 89 на фоне крымских предгорий, проектная визуализация" fetchpriority="high" width="1100" height="619">
    </picture>
    <div class="flagship-copy">
      <p class="flagship-location">Крым · дома из заводских панелей</p>
      <h1 id="flagship-title">Свой дом<br>в Крыму.</h1>
      <p>Дома для жизни, доходные дома и гостевые комплексы под ваш участок.</p>
      <div class="buttons">${action('quiz/','Выбрать свой дом')}${action('dohodnye-doma/','Доходные дома','outline')}</div>
    </div>
    <div class="flagship-details">
      <a class="flagship-project" href="projects/dom-89/"><strong>Дом 89</strong><span>80,1 м² внутри · 3 спальни</span><span class="flagship-reference">Визуализация проекта</span><span aria-hidden="true">↗</span></a>
      <div class="flagship-light" role="group" aria-label="Освещение фасада" hidden>
        <button type="button" data-flagship-light="day" aria-pressed="true">День</button>
        <button type="button" data-flagship-light="dusk" aria-pressed="false">Сумерки</button>
      </div>
    </div>
    <span class="flagship-status" role="status"></span>
  </section>
  ${scene}
  <section class="band home-projects"><div class="home-section-heading"><div><p class="tag">Каталог</p><h2>Наши дома</h2></div><a href="objects/">Проекты и фото строительства ↗</a></div>${houseCards()}</section>
  ${rentalAndGuest}
  ${landscapeCard}
  ${section('Почему заводские панели',advantages)}
  <section class="band estimate-callout" aria-labelledby="home-estimate"><div><p class="tag">Индивидуальный проект</p><h2 id="home-estimate">Рассчитайте свой дом</h2><p>Укажите наружные габариты и уровень готовности. Узнайте площадь и периметр, затем отправьте параметры для сметы.</p><a href="contacts/">Обсудить проект с нами ↗</a></div>${dimensionsForm}</section>
`,{script:['build-scene.js','full-site.js','flagship.js']});
add('projects/index.html','Проекты домов','Планировки и комплектации домов 89 и 110.',lead('Каталог','Дома для жизни','Планировки с двумя и тремя спальнями. Выберите, как хотите жить и какой уровень готовности вам нужен.')+section('Выбрать дом',houseCards())+section('Проект в разработке',`<p>Компактный Дом 64 м². Планировка и смета готовятся.</p>${action('projects/dom-8x8/','О концепции 64 м²')}`));
for(const [id,h] of Object.entries(assets)) {
  add(`projects/dom-${id}/index.html`,`Дом ${id}`,h.desc,lead('Проект дома',`Дом ${id}`,`${h.area} м² внутри. ${h.desc}`,action(`quiz/?model=${id}`,'Рассчитать для участка'))+
    `<div class="wide-media">${image('assets/'+h.photo,'Фасадный визуал из архива проекта',true)}</div>`+
    section('Планировка',`<div class="project-plan"${id==='89'?' id="floor-plan"':''}><a class="plan" href="assets/${h.plan}">${image('assets/'+h.plan,`Планировка Дома ${id} из КП`)}</a><div class="plan-copy"><p class="tag">План из КП</p><h3>${h.area} м² внутри</h3><p>${h.desc}</p><p>${id} м² — наружный габарит проекта.</p>${action(`quiz/?model=${id}`,'Подобрать комплектацию')}</div></div>`)+
    section('От комплекта до отделки',`<p>Согласуйте состав готовности, инженерию и доплаты по участку.</p>${action(`equipment/?model=${id}#package-tool`,'Сравнить комплектации')} ${action(`mortgage/dom-${id}/`,'Рассчитать ипотеку')}`)+
    section('Как проходит стройка',`<p>Сначала проверяем участок и условия монтажа. Затем согласуем проект, состав работ и график.</p>${action('construction/','Посмотреть этапы')}`)+(id==='89'?scene:''),{script:id==='89'?'build-scene.js':''});
}
add('projects/dom-8x8/index.html','Дом 64 м² · Заходи и живи','Компактный одноэтажный дом с двумя спальнями, террасой и вариантом пристройки.',lead('Концепция · 64 м² по габариту','Дом 64 м²','Две спальни и кухня-гостиная в одноэтажном доме. Основа — квадрат 8 × 8 м. Террасу можно предусмотреть отдельным этапом.', action('quiz/?model=8x8','Обсудить планировку'))+
  section('Как устроен дом',`<p class="lede">Цель эскиза — около 54 м² полезной площади. В задании две отдельные спальни, общая зона, ванная и туалет, гардероб и котельная.</p><figure class="room-program"><div class="room-grid"><span>Спальня 1</span><span>Спальня 2</span><span class="living">Кухня-гостиная</span><span>Гардероб</span><span>Котельная</span><span>Ванная</span><span>Туалет</span></div><figcaption>Состав помещений. Расположение, размеры и проходы уточняются на эскизе.</figcaption></figure>`)+
  section('Заходи и живи',`<p>В составе сметы проверим отделку, кухню, мебель, технику, свет, сантехнику, отопление и наружные подключения. Состав и цена будут согласованы по проекту.</p>`)+
  section('Два варианта для участка',`<div class="compact-options"><article><h3>Дом 64 м²</h3><p>Две изолированные спальни, общая кухня-гостиная, гардероб и котельная. Ванную и туалет планируем раздельно.</p></article><article><h3>Дом с террасой</h3><p>Открытая терраса со стороны кухни-гостиной. Её площадь и стоимость считаются отдельно, 64 м² относятся к контуру дома.</p></article></div><p>Планировка и смета в разработке.</p>`)+
  section('Терраса и пристройка',`<p>Терраса задумана как отдельный этап. Для пристройки проектировщик проверит место, примыкание, конструкцию и запас инженерии.</p>${action('land/check/','Проверить участок')}`));
const mortgageForm = (price) => `<form class="tool" data-calculator="mortgage" data-model="${price===7800000?89:110}"><div class="fields">
<label>Стоимость дома, ₽<input name="cost" type="number" min="1" required value="${price}"></label><label>Собственные средства, ₽<input name="deposit" type="number" min="0" required value="${price-6000000}"></label>
<label>Ставка, % годовых<input name="rate" type="number" min="0" max="100" step=".01" required value="6"></label><label>Срок, лет<input name="years" type="number" min="1" max="50" required value="30"></label>
</div><button class="action">Рассчитать платёж</button><output aria-live="polite"></output><div class="buttons"><a class="action" data-mortgage-request href="sms:+79787245424">Оставить заявку по SMS</a><a href="tel:+79787245424">Позвонить</a></div><p class="request-note">Сайт подготовит сообщение. Отправьте его из приложения SMS.</p></form>`;
add('mortgage/index.html','Семейная ипотека','Строительство Дома 89 или 110. Сравнение исходных и расчёт платежа.',
 lead('Дома для жизни','Дом в семейную ипотеку','Сравните два проекта и посмотрите, сколько собственных средств нужно в каждом примере.',action('mortgage/dom-89/','Рассчитать для Дома 89'))+
 section('Два дома. Два бюджета',`<p class="lede">Пример из КП от 12 ноября 2026. При одинаковой сумме кредита платёж одинаковый, а собственные средства различаются.</p><div class="project-grid mortgage-grid">${Object.entries(assets).map(([id,h])=>card(`mortgage/dom-${id}/`,`Дом ${id}`,`${h.area} м² внутри · ${(h.price/1000000).toLocaleString('ru-RU')} млн ₽ за предчистовую с инженерией. Собственные средства в примере — ${((h.price-6000000)/1000000).toLocaleString('ru-RU')} млн ₽.`,image('assets/'+h.photo,`Фасад Дома ${id} по КП`))).join('')}</div><p>Дом рассчитывается отдельно от земли и расходов сделки. Ставка, условия программы и смета подтверждаются индивидуально.</p>`)+
 section('Как подать запрос',`<ol class="checklist"><li>Выберите дом и уровень готовности.</li><li>Укажите, есть ли участок и сколько собственных средств готовы вложить.</li><li>Обсудите с менеджером смету и условия банка.</li></ol>${action('quiz/?pay=mortgage','Подобрать дом в ипотеку')}`));
for (const [id,h] of Object.entries(assets)) {
  add(`mortgage/dom-${id}/index.html`,`Ипотека · Дом ${id}`,h.desc,
    lead('Ипотека на строительство',`Дом ${id} в ипотеку`,`${h.area} м² внутри. ${h.desc}`,action(`quiz/?model=${id}&pay=mortgage`,'Проверить условия для семьи'))+
    section('Посчитать платёж',`<div class="mortgage-layout"><div><p>Пример из КП от 12 ноября 2026 для предчистовой с инженерией. Около 35 973 ₽ в месяц при кредите 6 млн ₽ на 30 лет под 6% годовых. Измените взнос, срок и ставку, чтобы сравнить варианты. Земля и расходы сделки отдельно.</p><p>Условия банка, цена и доступность программы подтверждаются индивидуально.</p></div>${mortgageForm(h.price)}</div>`)+
    section('Платёж на разных сроках',`<p>Пример на одних условиях: кредит 6 млн ₽ под 6% годовых. Земля, страхование и расходы сделки считаются отдельно.</p><div class="spec-strip"><div><strong>50 631 ₽</strong><span>в месяц · 15 лет</span></div><div><strong>42 986 ₽</strong><span>в месяц · 20 лет</span></div><div><strong>35 973 ₽</strong><span>в месяц · 30 лет</span></div></div>`)+
    section('План дома',`<a class="plan" href="assets/${h.plan}">${image('assets/'+h.plan,`План Дома ${id}`)}</a>${action(`projects/dom-${id}/`,'Открыть карточку')}`),{script:'full-site.js'});
}
const modelUrl = (key) => `invest/projects/dd-${key}/`;
const modelCards = () => grid([...models.map(m=>card(modelUrl(m.key),m.code,m.mix,image(m.facade,`Схема фасада ${m.code}`))),card('invest/projects/dd-5/','Дом на пять квартир','Презентационная концепция',editorial('five-units','Лист концепции дома на пять квартир'))]);
add('dohodnye-doma/index.html','Доходные дома в Крыму','Дом за лето. Проекты доходных домов на несколько квартир и индивидуальное проектирование под аренду.',
 lead('Дома для аренды','Доходные дома','Проектируем здания с несколькими квартирами для сдачи в аренду. Начинаем с участка, состава квартир и полной сметы.',action('quiz/?goal=rent','Обсудить доходный дом'))+
 section('От двух квартир до крупного проекта',`<p class="lede">Начинаем с запроса от двух квартир. Задания до 15 квартир на этаже рассматриваем индивидуально после проверки участка и норм. В каталоге ниже показаны проработанные концепции на 4–6 квартир.</p>${modelCards()}`)+
 section('Перед выбором проекта',`<dl class="sales-points"><div><dt>Участок</dt><dd>Проверим, какой тип здания и масштаб можно рассматривать.</dd></div><div><dt>Состав квартир</dt><dd>Подберём форматы под задачу аренды и габариты участка.</dd></div><div><dt>Экономика</dt><dd>Отдельно считаем стройку, оснащение, аренду и расходы.</dd></div></dl>${action('invest/','Посмотреть расчёты для инвестора')}`));
add('gostevye-doma/index.html','Гостевые дома в Крыму','Гостевые домики из заводских панелей. Концепции отдельных домиков и групп на участке.',
 lead('Отдельный домик или комплекс','Гостевые дома','Разрабатываем отдельные гостевые домики и группы домов. Планируем размещение, входы, инженерные сети и наружные зоны под формат отдыха.',action('quiz/?goal=guest','Обсудить гостевой дом'))+
 section('Архитектура для гостевого проекта',grid([
   card('architecture/resort/','Resort','Арочные фасады и несколько домиков в единой архитектуре.',editorial('resort','Архитектурный референс гостевых домов')),
   card('architecture/soft/','Soft','Мягкая геометрия фасада для камерного гостевого формата.',editorial('soft','Архитектурная концепция Soft')),
 ]))+
 section('Домики на вашем участке',`<p>Индивидуально определяем число домиков, приватность и подъезд. Проверяем участок и готовим состав работ для расчёта.</p>${action('land/check/','Проверить участок')}`));
add('invest/index.html','Инвестору · Расчёт проекта','Вложения, доход от аренды, сценарии расходов и проверка участка.',
 lead('ДАДК · Инвестору','Посчитать инвестиции','Сравните три сценария. Учтите стройку, оснащение, простой, управление и выплаты по кредиту.',action('invest/calculator/','Рассчитать вложения и аренду'))+
 section('Что проверяем до вложений',`<dl class="sales-points"><div><dt>Полный бюджет</dt><dd>Земля, стройка, подключения, отделка и оснащение.</dd></div><div><dt>Поток от аренды</dt><dd>Вводные по ставкам, простоям, расходам и финансированию.</dd></div><div><dt>Сценарий управления</dt><dd>Самостоятельная сдача или работа с управляющей компанией.</dd></div></dl>${action('dohodnye-doma/','Посмотреть доходные дома')}`)+
 section('Участок и альтернативы',action('land/check/','Проверить участок')+' '+action('invest/rental/','Секционная линейка 4–8')));
add('invest/projects/index.html','Каталог доходных домов','Пять концепций доходных домов.',lead('ДАДК · Каталог','Доходные дома','Схемы для сравнения квартирографии и проработки участка.')+section('Проекты',modelCards()));
for (const m of models) {
  add(`${modelUrl(m.key)}index.html`,m.code,m.mix,
    lead('ДАДК · Концепция',m.code,`${m.tagline} ${m.mix}.`,action(`invest/calculator/?model=${m.key}`,'Рассчитать арендный сценарий'))+
    `<div class="wide-media">${image(m.facade,`Архитектурная схема ${m.code}`,true)}</div>`+
    section('Планы двух этажей', `<div class="tile-grid plans">${[m.floor1,m.floor2].map((src,i)=>`<figure><a href="${src}">${image(src,`Эскиз этажа ${i+1}`)}</a><figcaption>Этаж ${i+1} · концептуальная схема</figcaption></figure>`).join('')}</div><p>Ориентир общей площади по HTML-концепции Арсена: ${m.area}. ${m.risk}.</p>`)+
    section('Подходит ли участок',`<p>Проверяем участок, допустимую типологию, проект и эксплуатацию до сметы.</p>${action('land/check/','Проверить участок')}`));
}
add('invest/projects/dd-5/index.html','Дом на пять квартир','Концепция арендного дома на пять квартир.',
 lead('ДАДК · Концепция','Дом на пять квартир','Презентационный вариант. План, инженерные решения и смета требуют согласования.',action('invest/calculator/?model=5','Сравнить экономику'))+
 `<figure class="wide-media">${editorial('five-units','Концептуальный лист дома на пять квартир')}</figure>`);
const numeric = (name,label,extra='') => `<label>${label}<input name="${name}" type="number" min="0" required ${extra}></label>`;
add('invest/calculator/index.html','Калькулятор доходного дома','Демонстрационный расчёт вложений, аренды, операционного дохода и денежного потока.',
 lead('ДАДК · Демонстрационный расчёт','Посчитать аренду','Введите значения для своего сценария. Расчёт опирается на ваши вводные.')+
 `<section class="band"><form class="tool" data-calculator="invest">
 <label>Модель<select name="model">${models.map(m=>`<option value="${m.key}" data-units="${m.units}">${m.code} · ${m.mix}</option>`).join('')}<option value="5" data-units="5">Дом на пять квартир</option></select></label>
 <fieldset><legend>Вложения, ₽</legend><div class="fields">${[['land','Земля'],['build','Стройка'],['fit','Отделка и оснащение'],['infra','Подключения и инфраструктура'],['other','Другие затраты']].map(([k,v])=>numeric(k,v)).join('')}</div></fieldset>
 <fieldset><legend>Аренда каждой единицы, ₽ в месяц</legend><div class="fields" data-rents></div></fieldset>
 <fieldset><legend>Простой и расходы</legend><div class="fields">${[['vacancy','Простой, %'],['management','Управление, % поступлений'],['variable','Переменные, % поступлений'],['tax','Налог, % поступлений']].map(([k,v])=>numeric(k,v,'max="100" step=".1"')).join('')}${[['fixed','Фиксированные расходы, ₽/год'],['reserve','Резерв, ₽/год'],['debt','Выплаты по кредиту, ₽/год']].map(([k,v])=>numeric(k,v)).join('')}</div></fieldset>
 <p>Если статьи нет, укажите 0. В стрессе аренда снижена на 10%, простой увеличен на 7 п. п., переменные расходы на 4 п. п., вложения на 8%. В оптимистичном сценарии аренда выше на 10%, простой ниже на 3 п. п., переменные расходы ниже на 2 п. п.</p>
 <button class="action">Сравнить три сценария</button><output aria-live="polite"></output>
 </form></section>`,{script:'full-site.js'});
add('land/index.html','Земельный участок','Проверка участка, подбор предложений и документы.',lead('Земля','Участок под ваш дом','Начните с конкретного участка или задайте условия поиска.')+
 section('Что нужно сделать',grid([card('land/check/','Проверить участок','Номер, местоположение и список проверок.'),card('land/search/','Подобрать участки','Поиск по базе проверенных предложений.'),card('journal/dokumenty/','Какие документы запросить','Чек-лист перед покупкой.')])));
add('land/check/index.html','Проверка участка','Найти участок по кадастровому номеру и подготовить вопросы для специалиста.',
 lead('Помощник по участку','Проверить участок','Укажите кадастровый номер или адрес. Исходные данные можно сверить на публичной карте.')+
 `<section class="band"><form class="tool" data-calculator="land"><label>Кадастровый номер или адрес<input name="location" placeholder="Например, 90:00:000000:00" maxlength="220" required></label><button class="action">Подготовить проверку</button><div data-land-result hidden><p data-location></p><p>Откройте публичную карту и введите этот номер или адрес. Затем проверьте площадь, границы, ВРИ, ограничения, подъезд и сети. Сведения карты и результат этого помощника требуют сверки с документами.</p>${action('https://nspd.gov.ru/map','Открыть публичную карту')} <a data-land-quiz href="quiz/">Обсудить участок</a></div></form></section>`+
 section('Что сверить перед покупкой',action('journal/dokumenty/','Открыть список документов')),{script:'full-site.js'});
add('land/search/index.html','Подобрать участки','Фильтры подбора помеченных датой предложений из базы.',
 lead('Земля','Подобрать участки','Задайте параметры. В выдаче используются только записи, прошедшие проверку.')+
 `<section class="band"><form class="tool" data-calculator="search"><script type="application/json" id="land-listings">${landListings}</script><div class="fields"><label>Район или населённый пункт<input name="region"></label><label>Бюджет до, ₽<input name="max" type="number" min="0"></label><label>Площадь от, соток<input name="area" type="number" min="0" step=".1"></label><label>Давность проверки<select name="days"><option value="0">Сегодня</option><option value="3" selected>За последние 3 дня</option><option value="7">За последнюю неделю</option></select></label><label>Подъезд<select name="access"><option value="">Любой</option><option value="yes">Нужен подтверждённый</option></select></label><label>Коммуникации<select name="utilities"><option value="">Любые</option><option value="yes">Нужны подтверждённые</option></select></label><label>Назначение<select name="purpose"><option value="">Любое</option><option value="living">Дом для жизни</option><option value="rental">Арендный проект</option></select></label></div><button class="action">Показать участки</button><output aria-live="polite"></output><a data-search-brief href="quiz/?land=search">Обсудить подбор</a></form></section>`,{script:'full-site.js'});
add('quiz/index.html','Выбрать свой дом','Подбор проекта по цели, участку и бюджету.',
 `<section class="band quiz-page"><h1>Выберите свой дом</h1><div class="quiz-layout"><form class="tool" data-quiz>
 <p class="tag" data-progress>Шаг 1 из 5</p><p class="quiz-selection" data-quiz-selection hidden></p>
 <fieldset data-step><legend>Для чего нужен дом?</legend><label>Цель<select name="goal" required><option value="">Выберите вариант</option><option value="living">Для постоянного проживания</option><option value="seasonal">Для отдыха и дачи</option><option value="rent">Доходный дом с квартирами</option><option value="guest">Гостевой дом или комплекс</option><option value="mixed">Жить и сдавать</option><option value="unknown">Пока выбираю</option></select></label></fieldset>
 <fieldset data-step hidden><legend>Что с участком?</legend><label>Статус<select name="land" required><option value="">Выберите вариант</option><option value="owned">Уже есть</option><option value="review">Есть вариант на примете</option><option value="search">Хочу подобрать</option><option value="unknown">Пока выбираю</option></select></label><label data-owned>Кадастровый номер или адрес<input name="location" maxlength="220"></label><div class="fields" data-looking><label>Район<input name="region" maxlength="100"></label><label>Бюджет на участок, ₽<input name="landBudget" min="0" type="number"></label><label>Желаемая площадь, соток<input name="landArea" min="0" step=".1" type="number"></label><label>Подъезд и сети<input name="landNeeds" maxlength="160"></label></div></fieldset>
 <fieldset data-step hidden><legend>Как устроить дом?</legend><div class="fields" data-family><label>Спальни<select name="bedrooms"><option value="">Пока выбираю</option><option value="2">Две</option><option value="3">Три</option></select></label><label>Что особенно важно?<select name="feature"><option value="">Пока выбираю</option><option value="terrace">Терраса</option><option value="privacy">Санузел при спальне</option></select></label></div><div class="fields" data-rental><label>Арендных единиц<select name="units"><option value="">Пока выбираю</option><option value="custom">2–3 или больше 6 · индивидуально</option><option>4</option><option>5</option><option>6</option></select></label><label>Аренда<select name="rentType"><option value="">Пока выбираю</option><option>Долгосрочная</option><option>Посуточная</option></select></label><label>Управление<select name="operator"><option value="">Пока выбираю</option><option>Самостоятельно</option><option>Ищу оператора</option></select></label></div></fieldset>
 <fieldset data-step hidden><legend>Готовность и бюджет</legend><div class="fields"><label>Готовность<select name="finish"><option value="">Нужна помощь</option><option>Домокомплект</option><option>Тёплый контур</option><option>Предчистовая</option><option>Под ключ</option></select></label><label>Бюджет на строительство, ₽<input name="budget" min="0" type="number"></label></div></fieldset>
 <fieldset data-step hidden><legend>Когда и как планируете строить?</legend><div class="fields"><label>Оплата<select name="pay"><option value="">Пока выбираю</option><option value="cash">Свои средства</option><option value="mortgage">Ипотека</option><option value="mixed">Комбинированно</option></select></label><label>Когда начать?<select name="when"><option value="">Пока выбираю</option><option>В ближайшие месяцы</option><option>В течение года</option><option>Позже</option></select></label></div></fieldset>
 <div class="buttons"><button type="button" class="quiet" data-back hidden>Назад</button><button class="action" data-next>Далее</button></div>
 <div data-quiz-result hidden></div></form>
 <aside class="quiz-projects"><img src="assets/house89-daylight-640.webp" alt="Проектная визуализация Дома 89" decoding="async" width="640" height="427">
 <div><h2>Уже выбрали проект?</h2><p>Продолжите подбор с выбранной моделью.</p>
 <div class="quiz-model-links">${Object.keys(assets).map(id=>`<a href="quiz/?model=${id}">Дом ${id} ↗</a>`).join('')}</div></div></aside></div></section>`,{script:'full-site.js'});
add('production/index.html','Производство панелей','Заводские панели, контроль и монтаж.',
 lead('Производство','Как устроен заводской дом','Панели проектируют под конкретный дом и готовят до монтажа. По проекту согласуют проёмы, стыки и опирание.')+
 `<div class="wide-media">${image('assets/factory.webp','Материал о производстве из архива сайта')}</div>`+
 section('Панели и монтаж',technical)+section('От проекта к площадке',`<ol class="checklist"><li>Согласование планов, геометрии и инженерных проёмов.</li><li>Изготовление и проверка элементов по рабочим документам.</li><li>Доставка, монтаж и контроль соединений.</li></ol>${action('technology/','Читать о технологии')} ${action('objects/','Смотреть фото монтажа')}`));
add('objects/index.html','Наши дома','Дома 89 и 110, архитектурные направления и фотографии с площадки строительства.',
 lead('Проекты и стройка','Наши дома','Выберите проект или архитектуру. Ниже — реальные кадры сборки панельного дома на площадке.',action('quiz/','Выбрать свой дом'))+
 section('Проекты и архитектура',houseCards())+
 section('Монтаж дома 80 м²',`<p>Архивные фотографии панельного дома на этапе строительства.</p>${galleryItems(gallery.filter(([key])=>key.startsWith('montage')))}`)+
 section('Дома по вашему заданию',action('calculator/','Рассчитать габариты')));
add('architecture/index.html','Архитектура домов','Три архитектурных направления: Open Life, Soft и Resort.',
  lead('Архитектура','Три характера дома','Посмотрите, как форма фасада, окна и отделка меняют впечатление от дома.')+section('Коллекции',collectionCards()));
for (const [id,title,description,photo] of collections) {
  add(`architecture/${id}/index.html`,title,description,lead('Архитектура домов',title,description,action('quiz/','Подобрать дом'))+
    `<figure class="wide-media project-cover">${editorial(photo,`Архитектурная концепция ${title}`)}<figcaption>Архитектурный референс. Фасад и планировка уточняются при проектировании.</figcaption></figure>`+
    section('Проекты в этой архитектуре',`<p>Линейка в разработке. Планировку, фасад и комплектацию подбираем по проекту.</p>${action('projects/','Смотреть доступные проекты')}`));
}
add('gallery/index.html','Галерея архитектуры','Open Life, Soft, Resort, интерьеры, планы и монтаж.',
 lead('Галерея','Архитектура в деталях','Сравните фасады. Откройте изображение, чтобы рассмотреть детали.')+
 section('Фасады и монтаж',`<div class="filter"><label>Направление<select data-gallery-filter><option value="">Все</option>${gallery.map(([key,title])=>`<option value="${key}">${title}</option>`).join('')}</select></label></div><div class="tile-grid" data-gallery>${gallery.map(([key,title,caption])=>`<div data-frame="${key}">${card(e(key+'.webp'),title,caption,editorial(key,title))}</div>`).join('')}</div>`)+
 section('Интерьеры и планы',grid([
 card('assets/interior-natural-1100.webp','Натуральная палитра','Интерьерный референс',image('assets/interior-natural-640.webp','Интерьер в тёплых тонах')),
 card('assets/interior-graphic-1100.webp','Графичная палитра','Интерьерный референс',image('assets/interior-graphic-640.webp','Контрастный интерьер')),
 ...Object.entries(assets).map(([id,h])=>card('assets/'+h.plan,`План Дома ${id}`,`${h.area} м² внутри`,image('assets/'+h.plan,`План Дома ${id}`))),
 ])),{script:'full-site.js'});
add('journal/index.html','Журнал','Советы по участку, комплектации и расчётам.',
 lead('Журнал','До начала стройки','Инструкции для выбора участка, проекта и готовности.')+
 section('Статьи',grid(book.map(([key,title,copy])=>card(`journal/${key}/`,title,copy))))+
 section('Другие материалы',action('buyer/index.html','Материалы покупателю')));
const articleChecks = {
  'vybor-uchastka':['Возьмите габариты двух понравившихся домов и нанесите их на схему участка. Оставьте место для подхода, парковки и работ.','Проверьте доступ техники и задайте продавцу вопросы об уклоне, воде и подключениях.','Посчитайте участок и подготовку вместе с домом, чтобы сравнивать полный бюджет.'],
  dokumenty:['Сопоставьте кадастровый номер и границы из выписки с тем участком, который смотрели.','Попросите документы об основаниях владения, сведения об ограничениях и доступе.','До задатка обсудите размещение выбранного дома с проектировщиком и проверьте спорные сведения со специалистом.'],
  kadastr:['Сверьте номер из карточки объявления с номером из выписки.','Откройте публичную карту, проверьте положение участка и запишите вопросы по границам.','Запросите подтверждение назначения и условий размещения выбранного дома.'],
  seti:['Попросите показать путь от дороги до площадки и место для разгрузки панелей.','Уточните доступность электричества, воды и способ отвода стоков.','Включите внешние работы в сравнение участков и смет.'],
  komplektaciya:['Сравните одинаковые уровни готовности по двум домам.','Запишите отдельно то, что уже входит, опции и работы по участку.','Попросите уточнить, на каком этапе можно завозить мебель и переезжать.'],
  ipoteka:['Введите стоимость дома и собственные средства, чтобы определить сумму кредита.','Сравните несколько сроков при одной ставке и учтите расходы сверх сметы.','Уточните у банка доступность программы, требования к договору и подрядчику.'],
  arenda:['Разложите вложения на участок, строительство, отделку и подключения.','Добавьте простой и регулярные расходы, затем сравните несколько сценариев.','Проверьте, остаётся ли положительный поток после долга и резерва.'],
};
for(const [key,title,copy,more] of book) {
  add(`journal/${key}/index.html`,title,copy,lead('Журнал',title,copy)+
    section('На что обратить внимание',`<p class="lede">${more}</p><ol class="checklist">${articleChecks[key].map(item=>`<li>${item}</li>`).join('')}</ol>${['dokumenty','kadastr','vybor-uchastka','seti'].includes(key)?'<p><a href="https://nspd.gov.ru/map">Публичная кадастровая карта НСПД</a></p>':''}`)+
    section('Следующий шаг',action(key==='ipoteka'?'mortgage/':key==='arenda'?'invest/calculator/':key==='komplektaciya'?'equipment/':'land/check/',key==='ipoteka'?'Калькулятор ипотеки':key==='arenda'?'Рассчитать аренду':key==='komplektaciya'?'Посмотреть комплектации':'Проверить участок')));
}
const packages = [['Домокомплект',2278000,2745000],['Коробка на фундаменте клиента',3934000,4558000],['Коробка с окнами',4362000,4972000],['Тепловой контур',5353000,6187000],['Готовность к инженерии',5943000,6887000],['Предчистовая с инженерией',7800000,8800000],['Чистовая отделка',8580000,9680000],['Отделка и мебель',9360000,10560000]];
add('calculator/index.html','Калькулятор габаритов дома','Предварительный расчёт площади, пятна застройки и периметра по длине, ширине и этажности.',
 lead('Индивидуальный проект','Рассчитать габариты дома','Укажите наружные размеры. Для сметы также понадобятся планировка, участок и комплектация.')+
 section('Введите размеры',dimensionsForm),{script:'full-site.js'});
add('contacts/index.html','Контакты','Связаться с командой «Дом за лето» по строительству домов в Крыму.',
 lead('Связаться с нами','Контакты «Дом за лето»','Обсудим проект, комплектацию и условия строительства на вашем участке.')+
 section('Телефон и сообщения',`<div class="contact-card"><a class="contact-number" href="tel:+79787245424">+7 978 724-54-24</a><div class="buttons">${action('tel:+79787245424','Позвонить')}<a href="sms:+79787245424">Написать SMS</a></div></div>`));
add('technology/compare/index.html','Панельный дом, СИП и каркас · Что сравнить','Сравнение стройки по конструкции, смете, влажности и контролю монтажа.',
 lead('Технология','За что вы платите в смете','Сравните одинаковый уровень готовности и посмотрите, какие параметры подтверждены документами.')+
 section('Четыре проверки перед выбором',`<dl class="sales-points"><div><dt>Состав стены и узлы</dt><dd>Запросите разрез стены, утепление, схему примыканий, расчётные характеристики и проектные ограничения.</dd></div><div><dt>Влажность и защита</dt><dd>Для деревянных конструкций проверьте влажность материала, условия хранения и защиту от намокания. Для панелей — гидроизоляцию и герметизацию стыков по проекту.</dd></div><div><dt>Готовность и добавки</dt><dd>Сопоставьте фундамент, кровлю, окна, инженерию, доставку и монтаж на одной стадии готовности.</dd></div><div><dt>Контроль монтажа</dt><dd>Уточните, что принимается на заводе, что проверяется на участке и кто отвечает за исправления.</dd></div></dl>${action('equipment/','Сравнить готовность домов')}`));
add('equipment/index.html','Комплектации и инженерия','Сравнение восьми уровней готовности и ориентир по пакету.',
 lead('Комплектации','Что входит в стоимость','Сравните уровни готовности домов 89 и 110. Цены из общего КП от 11 ноября 2026 требуют подтверждения для конкретного участка.')+
 section('Четыре уровня готовности',readinessCards)+
 section('Ориентир по пакету',`<form id="package-tool" class="tool" data-calculator="package"><div class="fields"><label>Дом<select name="model"><option value="89">Дом 89</option><option value="110">Дом 110</option></select></label><label>Готовность<select name="package">${packages.map(([name,a,b],i)=>`<option value="${i}" data-price89="${a}" data-price110="${b}" ${i===5?'selected':''}>${name}</option>`).join('')}</select></label></div><output aria-live="polite"></output><a data-package-quiz href="quiz/">Подобрать дом с этой комплектацией ↗</a></form>`)+
 section('Ступени готовности',`<div class="table-wrap"><table><thead><tr><th>Пакет</th><th>Дом 89</th><th>Дом 110</th></tr></thead><tbody>${packages.map(([n,a,b])=>`<tr><th scope="row">${n}</th><td>${a.toLocaleString('ru-RU')} ₽</td><td>${b.toLocaleString('ru-RU')} ₽</td></tr>`).join('')}</tbody></table></div><p>Землю, нестандартные работы и дополнительные подключения уточняем по смете.</p>`),{script:'full-site.js'});

export function buildFullSite({write,seo,escape}) {
  write('projects/dom-62/index.html','<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=../index.html"><title>Проекты домов · Дом за лето</title></head><body><a href="../index.html">Перейти в каталог</a></body></html>');
  for (const {file,title,description,body,script} of entries) {
    const base = '../'.repeat(file.split('/').length-1)||'./';
    const here = file.replace(/index.html$/,'');
    const isHome = file==='index.html';
    const hasBuildStory = isHome || here==='projects/dom-89/';
    const menu = [['objects/','Наши дома'],['dohodnye-doma/','Доходные дома'],['gostevye-doma/','Гостевые дома'],['architecture/','Архитектура'],['land/','Участки'],['invest/','Инвестору'],['calculator/','Калькулятор']];
    const links = menu.map(([url,name])=>`<a href="${url}"${here===url?' aria-current="page"':''}>${name}</a>`).join('');
    const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><base href="${base}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · Дом за лето</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#24372e"><link rel="icon" href="assets/logo.webp"><link rel="stylesheet" href="full-site.css?v=layout2"><link rel="stylesheet" href="crimea.css?v=${hasBuildStory?3:1}">${isHome?'<link rel="stylesheet" href="flagship.css?v=3">':''}${seo(file,title,description,here.startsWith('journal/')&&here!=='journal/')}</head><body>
    <header class="top"><a class="brand" href="./"><img src="assets/logo.webp" alt="Дом за лето · Главная" width="398" height="200"></a><nav aria-label="Меню сайта">${links}</nav><div class="top-actions"><div class="top-contact"><a class="top-phone" href="tel:+79787245424">+7 978 724-54-24</a><a href="contacts/"${here==='contacts/'?' aria-current="page"':''}>Контакты</a></div><a class="top-cta" href="quiz/">Выбрать свой дом<span class="action-arrow" aria-hidden="true">↗</span></a></div></header>
    <main>${body}</main>
    <footer class="foot"><div class="foot-brand"><a class="brand" href="./">${image('assets/logo.webp','')}<b>Дом за лето</b></a><p>Частные, доходные и гостевые дома в Крыму</p><a href="tel:+79787245424">+7 978 724-54-24</a></div><nav aria-label="Разделы">${links}<a href="contacts/">Контакты</a><a href="projects/">Каталог проектов</a><a href="production/">Производство</a><a href="technology/">Технология</a><a href="construction/">Как строим</a><a href="equipment/">Комплектации</a><a href="configure/">Конфигуратор</a></nav><div class="foot-bottom"><span>Дом за лето · Крым · 2026</span><span>Стоимость и состав работ подтверждаются по проекту и участку.</span></div></footer>${[].concat(script).filter(Boolean).map(file=>`<script src="${file}?v=${file==='build-scene.js'?'route1':file==='flagship.js'?'scroll3':'crimea1'}" defer></script>`).join('')}</body></html>`;
    write(file, html.replace(/(<a [^>]*?)href="(\.\/|[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)((?:[?#][^"]*)?)"/g, '$1href="$2index.html$3"'));
  }
  return entries.map(({file})=>file.replace(/index.html$/,''));
}
