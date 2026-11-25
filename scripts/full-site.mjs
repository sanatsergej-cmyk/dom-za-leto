import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const models = JSON.parse(read('content/invest-models.json'));
const landListings = JSON.stringify(JSON.parse(read('content/land-listings.json'))).replace(/</g, '\\u003c');
const image = (src, alt, eager = false) => `<img src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const editorial = (name, alt) => image(`assets/editorial/${name}.webp`, alt);
const action = (url, label) => `<a class="action" href="${url}">${label} <span aria-hidden="true">↗</span></a>`;
const card = (url, title, copy, media = '') => `<article class="tile">${media}<div><h3><a href="${url}">${title}</a></h3><p>${copy}</p></div></article>`;
const section = (title, body) => `<section class="band"><h2>${title}</h2>${body}</section>`;
const grid = (items) => `<div class="tile-grid">${items.join('')}</div>`;
const lead = (label, title, copy, buttons = '') => `<div class="lead"><p class="tag">${label}</p><h1>${title}</h1><p class="lede">${copy}</p>${buttons}</div>`;
const assets = {
  89: {area:'80,1', plan:'editorial/plan-89.webp', photo:'house89-daylight-640.webp', desc:'Три спальни и кухня-гостиная 29,2 м².', price:7800000},
  110: {area:'99,8', plan:'editorial/plan-110.webp', photo:'evening-640.webp', desc:'Три спальни, две гардеробные и отдельный санузел родителей.', price:8800000},
};
const houseCards = () => `<div class="project-grid">${[
  ...Object.entries(assets).map(([id,h]) => card(`projects/dom-${id}/`,`Дом ${id}`,`${h.area} м² внутри. ${h.desc}`,image('assets/'+h.photo,'Фасадный визуал из архива проекта'))),
  card('projects/dom-8x8/','Дом 8 × 8', 'Две спальни. Концепция дома с отделкой для переезда.',editorial('house-8x8-small','Концептуальный фасад Дома 8 × 8')),
].join('')}</div>`;
const gallery = [
  ['open-life','Open Life','Архитектурная визуализация Тетрики · слайд 15'],
  ['soft','Soft','Архитектурная визуализация Тетрики · слайд 16'],
  ['soft-alt','Soft · второй вариант','Архитектурная визуализация Тетрики · слайд 16'],
  ['resort','Resort','Архитектурная визуализация Тетрики · слайд 17'],
  ['resort-alt','Resort · второй вариант','Архитектурная визуализация Тетрики · слайд 17'],
  ['montage-1','Монтаж стен','Фото производителя · дом 80 м²'],
  ['montage-2','Монтаж панелей','Фото производителя · дом 80 м²'],
  ['montage-3','Площадка монтажа','Фото производителя · дом 80 м²'],
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
const chapters = [
  ['sketch','Эскиз','Сначала — замысел','Увязываем планировку, посадку дома и вид из окон.'],
  ['slab','Основание','Плита задаёт контур','Готовим основание и заливаем бетон.'],
  ['first-wall','Первая панель','Ставим первую панель','Кран подаёт первый стеновой элемент на свободное основание.'],
  ['walls','Стены','Собираем стены','Соседние панели встают по очереди. Под окна и двери остаются проёмы.'],
  ['first-roof','Первая плита покрытия','Начинаем покрытие','Первая плита опускается на подготовленные опоры. Остальная часть дома ещё открыта.'],
  ['shell','Собранная коробка','Покрытие на месте','Плиты покрытия установлены. Оконные и дверные проёмы пока открыты.'],
  ['glazing','Окна','Устанавливаем остекление','Окна и вход уже на месте. Наружная отделка ещё впереди.'],
  ['facade','Фасад','Дом 89','Три спальни и 80,1 м² внутри. Посмотрите план или подберите комплектацию для своего участка.'],
];
const buildImage = key => key==='facade'?'assets/house89-daylight-1100.webp':e('build-'+key+'.webp');
const scene = `<section class="build-story" aria-label="История строительства Дома 89">
  <div class="build-backdrop">${chapters.map(([key],i)=>`<img class="build-frame" data-build-frame="${key}" ${i===0?'data-active':''} src="${buildImage(key)}" alt="" loading="lazy" decoding="async">`).join('')}<nav class="build-nav" aria-label="Стадии строительства" hidden>${chapters.map(([key,label],i)=>`<button type="button" data-build-jump="${key}" aria-label="${i+1}. ${label}" title="${label}">${i+1}</button>`).join('')}</nav></div>
  <div class="build-chapters">${chapters.map(([key,label,title,copy],i)=>`<article class="build-chapter" data-build-chapter="${key}"${key==='sketch'?' id="stages"':''}>
    <picture class="build-static"><img src="${buildImage(key)}" alt="${title}" loading="lazy" decoding="async" width="768" height="512"></picture>
    <div class="chapter-note"><p class="tag">${String(i+1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')} · ${label}</p><h2 tabindex="-1">${title}</h2><p>${copy}</p>${key==='facade'?`<div class="buttons">${action('quiz/?model=89','Хочу такой дом')} <a href="projects/dom-89/">План дома</a> <a href="assets/editorial/build-preview.mp4">Смотреть ролик</a></div>`:''}</div>
  </article>`).join('')}</div>
  <p class="build-credit">Эскиз и стадии монтажа — художественная визуализация. Финальный фасад — изображение из коммерческого предложения.</p>
</section>`;
const technical = `<div class="spec-strip"><div><strong>230 мм</strong><span>Наружная стена</span></div><div><strong>120 мм</strong><span>Перегородка</span></div><div><strong>350 мм</strong><span>Панель покрытия</span></div></div><p>Толщина изделий по каталогу Тетрики. Состав, узлы и опирание уточняются под конкретный проект.</p>${grid([
  card(e('technical-06.webp'),'Армирование','Схема из презентации Тетрики, лист 6.',editorial('technical-06','Лист Тетрики о матричном армировании')),
  card(e('technical-07.webp'),'Логистика','Схема из презентации Тетрики, лист 7.',editorial('technical-07','Лист Тетрики о перевозке панелей')),
  card(e('technical-10.webp'),'Сборка','Фото и схема из презентации Тетрики, лист 10.',editorial('technical-10','Лист Тетрики о монтаже')),
])}<p>${action('technology/','Подробнее о технологии')}</p>`;
const routes = [
  ['projects/','Дома для жизни','Планы и комплектации'],
  ['mortgage/','Семейная ипотека','Выберите 89 или 110'],
  ['invest/','Доходные дома','Модели и калькулятор аренды'],
  ['land/','Земельный участок','Проверка и подбор'],
  ['production/','Производство','Технология заводских панелей'],
  ['construction/','Как строим','Этапы и контроль работ'],
];
add('index.html','Дома для жизни и для аренды в Крыму','Проекты домов 89, 110 и 8 × 8, ипотечный расчёт, участки и производство.',`
  <section class="opening home-editorial">
    <div class="opening-copy"><p class="tag">Дома из заводских панелей</p><h1>Свой дом<br>в Крыму.</h1><p>Сравните проекты, проверьте участок и выберите, в какой комплектации строить.</p><div class="buttons">${action('quiz/','Подобрать дом')}<a class="quiet" href="projects/">Смотреть проекты ↗</a></div></div>
    <figure><img src="assets/house89-daylight-1100.webp" srcset="assets/house89-daylight-640.webp 640w, assets/house89-daylight-1100.webp 1100w" sizes="(max-width: 740px) 100vw, 62vw" alt="Фасад Дома 89 на визуализации из КП" fetchpriority="high" decoding="async"><figcaption>Дом 89 · проектная визуализация</figcaption></figure>
  </section>
  <nav class="route-grid home-routes" aria-label="Разделы сайта">${routes.map(([url,name,copy])=>`<a href="${url}"><strong>${name} <span aria-hidden="true">↗</span></strong><span>${copy}</span></a>`).join('')}</nav>
  <section class="band home-intro"><div><p class="tag">Дом 89 · от эскиза до фасада</p><h2>Как собирается дом</h2></div><p>Листайте, чтобы пройти путь от чертежа до готового фасада. При прокрутке вверх история идёт обратно.</p></section>
  ${scene}
  <section class="band home-projects"><div class="home-section-heading"><div><p class="tag">Каталог</p><h2>Три дома для жизни</h2></div><a href="projects/">Смотреть каталог ↗</a></div>${houseCards()}</section>
  ${section('Архитектура Тетрики',`<p class="lede">Прямая геометрия Open Life, мягкие формы Soft и арочные фасады Resort.</p>${galleryItems(gallery.filter(([key])=>['open-life','soft','resort'].includes(key)))}`)}
  ${section('Узнайте, с чего начать',`<p class="lede">Расскажите о планах и участке. Покажем варианты, с которых можно начать.</p>${action('quiz/','Подобрать дом')}`)}
`,{script:'build-scene.js'});
add('projects/index.html','Проекты домов','Планировки и комплектации домов 89, 110 и концепции 8 × 8.',lead('Каталог','Дома для жизни','Планировки с двумя и тремя спальнями. Выберите, как хотите жить и какой уровень готовности вам нужен.')+section('Выбрать дом',houseCards()));
for(const [id,h] of Object.entries(assets)) {
  add(`projects/dom-${id}/index.html`,`Дом ${id}`,h.desc,lead('Проект дома',`Дом ${id}`,`${h.area} м² внутри. ${h.desc}`,action(`quiz/?model=${id}`,'Рассчитать для участка'))+
    `<div class="wide-media">${image('assets/'+h.photo,'Фасадный визуал из архива проекта',true)}</div>`+
    section('Планировка',`<div class="project-plan"><a class="plan" href="assets/${h.plan}">${image('assets/'+h.plan,`Планировка Дома ${id} из КП`)}</a><div class="plan-copy"><p class="tag">План из КП</p><h3>${h.area} м² внутри</h3><p>${h.desc}</p><p>${id} м² — наружный габарит проекта.</p>${action(`quiz/?model=${id}`,'Подобрать комплектацию')}</div></div>`)+
    section('От комплекта до отделки',`<p>Согласуйте состав готовности, инженерию и доплаты по участку.</p>${action(`equipment/?model=${id}#package-tool`,'Сравнить комплектации')} ${action(`mortgage/dom-${id}/`,'Рассчитать ипотеку')}`)+
    section('Как проходит стройка',`<p>Сначала проверяем участок и условия монтажа. Затем согласуем проект, состав работ и график.</p>${action('construction/','Посмотреть этапы')}`)+(id==='89'?scene:''),{script:id==='89'?'build-scene.js':''});
}
add('projects/dom-8x8/index.html','Дом 8 × 8 · Заходи и живи','Компактный одноэтажный дом с двумя спальнями, террасой и вариантом пристройки.',lead('Концепция · 64 м² по габариту','Дом 8 × 8','Две спальни и кухня-гостиная. Свой двор и возможность предусмотреть будущую террасу.', action('quiz/?model=8x8','Обсудить планировку'))+
  `<figure class="wide-media project-cover"><img src="assets/editorial/house-8x8.webp" srcset="assets/editorial/house-8x8-small.webp 660w, assets/editorial/house-8x8.webp 1200w" sizes="88vw" alt="Концептуальный фасад Дома 8 × 8" fetchpriority="high" decoding="async"><figcaption>Авторская визуализация концепции 8 × 8, 64 м² по наружному габариту. Проёмы и детали фасада уточняются при проектировании.</figcaption></figure>`+
  section('Как устроен дом',`<p class="lede">Цель эскиза — около 54 м² полезной площади. В задании две отдельные спальни, общая зона, ванная и туалет, гардероб и котельная.</p><figure class="room-program"><div class="room-grid"><span>Спальня 1</span><span>Спальня 2</span><span class="living">Кухня-гостиная</span><span>Гардероб</span><span>Котельная</span><span>Ванная</span><span>Туалет</span></div><figcaption>Состав помещений. Расположение, размеры и проходы уточняются на эскизе.</figcaption></figure>`)+
  section('Заходи и живи',`<p>В составе сметы проверим отделку, кухню, мебель, технику, свет, сантехнику, отопление и наружные подключения. Состав и цена будут согласованы по проекту.</p>`)+
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
add('invest/index.html','Инвестору · Доходные дома','Концепции на 4–6 квартир, расчёт аренды и проверка участка.',
 lead('ДАДК · Инвестору','Доходный дом на вашем участке','Сравните квартирографию и проверьте экономику на собственных вводных.',action('invest/calculator/','Рассчитать вложения и аренду'))+
 section('Выбрать концепцию',modelCards())+section('Участок и альтернативы',action('land/check/','Проверить участок')+' '+action('invest/rental/','Секционная линейка 4–8')));
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
add('quiz/index.html','Подобрать дом','Пройдите опрос и сохраните варианты и параметры.',lead('Подбор проекта','Какой дом вам подойдёт?','Расскажите, для чего нужен дом и есть ли у вас участок. Покажем подходящие проекты и поможем начать разговор о смете.')+
 `<section class="band"><form class="tool" data-quiz>
 <p class="tag" data-progress>Шаг 1 из 5</p>
 <fieldset data-step><legend>Для чего нужен дом?</legend><label>Цель<select name="goal" required><option value="">Выберите вариант</option><option value="living">Для постоянного проживания</option><option value="seasonal">Для отдыха и дачи</option><option value="rent">Для сдачи</option><option value="mixed">Жить и сдавать</option><option value="unknown">Пока выбираю</option></select></label></fieldset>
 <fieldset data-step hidden><legend>Что с участком?</legend><label>Статус<select name="land" required><option value="">Выберите вариант</option><option value="owned">Уже есть</option><option value="review">Есть вариант на примете</option><option value="search">Хочу подобрать</option><option value="unknown">Пока выбираю</option></select></label><label data-owned>Кадастровый номер или адрес<input name="location" maxlength="220"></label><div class="fields" data-looking><label>Район<input name="region" maxlength="100"></label><label>Бюджет на участок, ₽<input name="landBudget" min="0" type="number"></label><label>Желаемая площадь, соток<input name="landArea" min="0" step=".1" type="number"></label><label>Подъезд и сети<input name="landNeeds" maxlength="160"></label></div></fieldset>
 <fieldset data-step hidden><legend>Как устроить дом?</legend><div class="fields" data-family><label>Спальни<select name="bedrooms"><option value="">Пока выбираю</option><option value="2">Две</option><option value="3">Три</option></select></label><label>Что особенно важно?<select name="feature"><option value="">Пока выбираю</option><option value="terrace">Терраса</option><option value="privacy">Санузел при спальне</option></select></label></div><div class="fields" data-rental><label>Арендных единиц<select name="units"><option value="">Пока выбираю</option><option>4</option><option>5</option><option>6</option></select></label><label>Аренда<select name="rentType"><option value="">Пока выбираю</option><option>Долгосрочная</option><option>Посуточная</option></select></label><label>Управление<select name="operator"><option value="">Пока выбираю</option><option>Самостоятельно</option><option>Ищу оператора</option></select></label></div></fieldset>
 <fieldset data-step hidden><legend>Готовность и бюджет</legend><div class="fields"><label>Готовность<select name="finish"><option value="">Нужна помощь</option><option>Домокомплект</option><option>Тёплый контур</option><option>Предчистовая</option><option>Под ключ</option></select></label><label>Бюджет на строительство, ₽<input name="budget" min="0" type="number"></label></div></fieldset>
 <fieldset data-step hidden><legend>Когда и как планируете строить?</legend><div class="fields"><label>Оплата<select name="pay"><option value="">Пока выбираю</option><option value="cash">Свои средства</option><option value="mortgage">Ипотека</option><option value="mixed">Комбинированно</option></select></label><label>Когда начать?<select name="when"><option value="">Пока выбираю</option><option>В ближайшие месяцы</option><option>В течение года</option><option>Позже</option></select></label></div></fieldset>
 <div class="buttons"><button type="button" class="quiet" data-back hidden>Назад</button><button class="action" data-next>Далее</button></div>
 <div data-quiz-result hidden></div></form></section>`,{script:'full-site.js'});
add('production/index.html','Производство панелей','Заводские панели, контроль и монтаж.',
 lead('Производство','Как устроен заводской дом','Панели проектируют под конкретный дом и готовят до монтажа. По проекту согласуют проёмы, стыки и опирание.')+
 `<div class="wide-media">${image('assets/factory.webp','Материал о производстве из архива сайта')}</div>`+
 section('Панели и монтаж',technical)+section('От проекта к площадке',`<ol class="checklist"><li>Согласование планов, геометрии и инженерных проёмов.</li><li>Изготовление и проверка элементов по рабочим документам.</li><li>Доставка, монтаж и контроль соединений.</li></ol>${action('technology/','Читать о технологии')} ${action('objects/','Смотреть фото монтажа')}`));
add('objects/index.html','Объекты и монтаж','Документальные фотографии монтажа дома 80 м² из архива Тетрики.',
 lead('Объекты','Монтаж дома 80 м²','Фото предоставлены в архиве производителя Тетрика. Кадры показывают стадию монтажа.')+section('Фото с площадки',galleryItems(gallery.filter(([key])=>key.startsWith('montage'))))+section('Следующие этапы',action('construction/','Как строим')));
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
for(const [key,title,copy,more] of book) {
  add(`journal/${key}/index.html`,title,copy,lead('Журнал',title,copy)+
    section('На что обратить внимание',`<p class="lede">${more}</p>${['dokumenty','kadastr','vybor-uchastka','seti'].includes(key)?'<p><a href="https://nspd.gov.ru/map">Публичная кадастровая карта НСПД</a></p>':''}`)+
    section('Следующий шаг',action(key==='ipoteka'?'mortgage/':key==='arenda'?'invest/calculator/':key==='komplektaciya'?'equipment/':'land/check/',key==='ipoteka'?'Калькулятор ипотеки':key==='arenda'?'Рассчитать аренду':key==='komplektaciya'?'Посмотреть комплектации':'Проверить участок')));
}
const packages = [['Домокомплект',2278000,2745000],['Коробка на фундаменте клиента',3934000,4558000],['Коробка с окнами',4362000,4972000],['Тепловой контур',5353000,6187000],['Готовность к инженерии',5943000,6887000],['Предчистовая с инженерией',7800000,8800000],['Чистовая отделка',8580000,9680000],['Отделка и мебель',9360000,10560000]];
add('equipment/index.html','Комплектации и инженерия','Сравнение восьми уровней готовности и ориентир по пакету.',
 lead('Комплектации','Что входит в стоимость','Сравните уровни готовности домов 89 и 110. Цены из общего КП от 11 ноября 2026 требуют подтверждения для конкретного участка.')+
 section('Ориентир по пакету',`<form id="package-tool" class="tool" data-calculator="package"><div class="fields"><label>Дом<select name="model"><option value="89">Дом 89</option><option value="110">Дом 110</option></select></label><label>Готовность<select name="package">${packages.map(([name,a,b],i)=>`<option value="${i}" data-price89="${a}" data-price110="${b}" ${i===5?'selected':''}>${name}</option>`).join('')}</select></label></div><output aria-live="polite"></output><a data-package-quiz href="quiz/">Подобрать дом с этой комплектацией ↗</a></form>`)+
 section('Ступени готовности',`<div class="table-wrap"><table><thead><tr><th>Пакет</th><th>Дом 89</th><th>Дом 110</th></tr></thead><tbody>${packages.map(([n,a,b])=>`<tr><th scope="row">${n}</th><td>${a.toLocaleString('ru-RU')} ₽</td><td>${b.toLocaleString('ru-RU')} ₽</td></tr>`).join('')}</tbody></table></div><p>Землю, нестандартные работы и дополнительные подключения уточняем по смете.</p>`),{script:'full-site.js'});

export function buildFullSite({write,seo,escape}) {
  for (const {file,title,description,body,script} of entries) {
    const base = '../'.repeat(file.split('/').length-1)||'./';
    const here = file.replace(/index.html$/,'');
    const menu = [['projects/','Дома'],['construction/','Как строим'],['mortgage/','Ипотека'],['land/','Участки'],['invest/','Инвестору']];
    const links = menu.map(([url,name])=>`<a href="${url}"${here===url?' aria-current="page"':''}>${name}</a>`).join('');
    const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><base href="${base}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · Дом за лето</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#24372e"><link rel="icon" href="assets/logo.webp"><link rel="stylesheet" href="full-site.css">${seo(file,title,description,here.startsWith('journal/')&&here!=='journal/')}</head><body>
    <header class="top"><a class="brand" href="./">${image('assets/logo.webp','',true)}<b>Дом за лето</b></a><nav aria-label="Меню сайта">${links}</nav><a class="top-cta" href="quiz/">Подобрать дом ↗</a></header>
    <main>${body}</main>
    <footer class="foot"><div><b>Дом за лето</b><a href="tel:+79787245424">+7 978 724-54-24</a></div><nav aria-label="Разделы">${links}<a href="production/">Производство</a><a href="technology/">Технология</a><a href="construction/">Как строим</a><a href="equipment/">Комплектации</a><a href="configure/">Конфигуратор</a></nav><p>Крым · 2026. Стоимость и состав работ уточняются по проекту и участку.</p></footer>${script?`<script src="${script}" defer></script>`:''}</body></html>`;
    write(file, html.replace(/(<a [^>]*?)href="(\.\/|[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)((?:[?#][^"]*)?)"/g, '$1href="$2index.html$3"'));
  }
  return entries.map(({file})=>file.replace(/index.html$/,''));
}
