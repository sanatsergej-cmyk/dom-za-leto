import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const base = 'https://sanatsergej-cmyk.github.io/dom-za-leto/';
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, text) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
};
const escape = text => String(text).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const entries = [
  ['', 'index.html', 'Строительство домов из заводских панелей в Крыму', 'Проекты домов 89 и 110 м², заводские панели, этапы строительства, комплектации и расчёт для вашего участка.'],
  ['projects', 'projects/index.html', 'Проекты домов 89 и 110 м²', 'Сравните внутреннюю площадь, планировки, три спальни и комплектации проектов.'],
  ['project/89', 'projects/dom-89/index.html', 'Дом 89 м² — планировка и комплектация', 'Внутренняя площадь 80,1 м², три спальни и два санузла. Состав готовности и исходные данные для сметы.'],
  ['project/110', 'projects/dom-110/index.html', 'Дом 110 м² — планировка и комплектация', 'Внутренняя площадь 99,8 м², три спальни и кухня-гостиная. Обсудите комплектацию и условия участка.'],
  ['technology', 'technology/index.html', 'Технология заводских железобетонных панелей', 'Разбор слоёв панели, проектных узлов, утепления, инженерии и монтажа.'],
  ['construction', 'construction/index.html', 'Этапы строительства дома и контроль качества', 'От обследования участка до приёмки. Основание, изготовление панелей, монтаж, инженерия и контроль скрытых работ.'],
  ['equipment', 'equipment/index.html', 'Комплектации и инженерные системы дома', 'Что включают конструкция, инженерия и отделка, как считать подключения и дополнительные работы.'],
  ['configure', 'configure/index.html', 'Выбор фасада, интерьера и сада', 'Сохраните пожелания к комплектации будущего дома и обсудите индивидуальный проект.'],
  ['quiz', 'quiz/index.html', 'Подбор проекта дома для вашей семьи', 'Подготовьте бриф по участку, площади, бюджету и срокам строительства.'],
  ['invest', 'invest/index.html', 'Инвестиционные сценарии строительства', 'Как оценить участок, затраты и сценарий продажи или аренды дома. Индивидуальная экономика требует расчёта.'],
  ['land', 'land/index.html', 'Участок для строительства дома в Крыму', 'Какие исходные данные нужны, чтобы выбрать участок, основание и комплектацию дома.']
];
const mapping = Object.fromEntries(entries.map(([route, file]) => [route, file]));
mapping.build = mapping.move = 'construction/index.html';
function links(html) {
  return html.replace(/href="#\/([^"]*)"/g, (match, route) =>
    mapping[route] ? 'href="' + base + mapping[route].replace(/index.html$/, '') + '"' : match);
}
const images = JSON.parse(read('scripts/images.json'));
function media(html) {
  return html.replace(/<img\b[^>]*>/g, tag => {
    const source = tag.match(/src="([^"]+)"/)?.[1];
    const item = images[source];
    if (!item) return tag;
    const priority = tag.includes('cinema-bg');
    return tag.replace(/>$/, ' width="'+item.width+'" height="'+item.height+
      '" srcset="'+item.srcset+'" sizes="(max-width: 700px) 95vw, 70vw" decoding="async"'+
      (priority ? ' fetchpriority="high"' : '')+'>');
  });
}
const organization = {
  '@type': 'Organization', '@id': base+'#organization',
  name: 'Дом за лето', url: base, telephone: '+79787245424'
};
function seo(file, title, description, article = false) {
  const url = base + file.replace(/index.html$/, '');
  const breadcrumb = {
    '@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Дом за лето', item: base},
      ...(file === 'index.html' ? [] : [{'@type': 'ListItem', position: 2, name: title, item: url}])
    ]
  };
  const entity = article ? {
    '@type': 'Article', headline: title, description,
    mainEntityOfPage: url, publisher: {'@id': base+'#organization'}
  } : {
    '@type': 'WebPage', name: title, description, url,
    isPartOf: {'@id': base+'#website'}
  };
  const graph = {'@context': 'https://schema.org', '@graph': [
    organization, {'@type': 'WebSite', '@id': base+'#website', url: base, name: 'Дом за лето'},
    entity, breadcrumb
  ]};
  return '<link rel="canonical" href="'+url+'">'+
    '<meta property="og:type" content="'+(article?'article':'website')+'">'+
    '<meta property="og:title" content="'+escape(title)+'">'+
    '<meta property="og:description" content="'+escape(description)+'">'+
    '<meta property="og:url" content="'+url+'">'+
    '<meta property="og:image" content="'+base+'assets/sunny-house.webp">'+
    '<meta property="og:locale" content="ru_RU">'+
    '<script type="application/ld+json">'+JSON.stringify(graph).replace(/</g,'\\u003c')+'</script>';
}
let template = read('scripts/template.html');
for (const [route, file, title, description] of entries) {
  const app = {innerHTML: ''};
  const context = {
    document: {
      currentScript: {src: base+'app.js'}, body: {dataset: {route}},
      querySelector: () => app, querySelectorAll: () => [], addEventListener: () => {}
    },
    location: {hash: ''}, window: {addEventListener: () => {}},
    localStorage: {getItem: () => null}, URL, console
  };
  vm.createContext(context);
  vm.runInContext(read('app.js'), context);
  const depth = path.dirname(file).split('/').filter(x=>x!=='.').length;
  let html = template.replace('<head>', '<head><base href="'+('../'.repeat(depth)||'./')+'">');
  html = html.replace('<body>', '<body data-route="'+route+'">');
  html = html.replace('<main id="app"></main>', '<main id="app">'+app.innerHTML+'</main>');
  html = html.replace(/<title>.*?<\/title>/, '<title>'+escape(title)+' · Дом за лето</title>');
  html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="'+escape(description)+'">');
  html = html.replace('</head>', seo(file,title,description)+'</head>');
  html = media(links(html));
  write(file,html);
}
const urls = entries.map(([,file]) => base+file.replace(/index.html$/,''));
const header = links(template.match(/<header>.*?<\/header>/s)[0]);
const footer = links(template.match(/<footer>.*?<\/footer>/s)[0]);
for (const file of fs.readdirSync(path.join(root,'buyer')).filter(name=>name.endsWith('.html'))) {
  const relative = 'buyer/'+file;
  let html = read(relative);
  const title = html.match(/<title>(.*?) · Дом за лето<\/title>/)[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
  html = html.replace(/<link rel="canonical"[^>]*>/g,'')
    .replace(/<meta property="og:[^>]*>/g,'')
    .replace(/<script type="application\/ld\+json">.*?<\/script>/gs,'');
  html = html.replace(/<header>.*?<\/header>/s, header.replaceAll('href="buyer/', 'href="'+base+'buyer/'));
  html = html.replace(/<footer>.*?<\/footer>/s, footer.replaceAll('href="buyer/', 'href="'+base+'buyer/'));
  // Buyer assets remain relative to their own directory.
  html = html.replace('src="assets/logo.webp"', 'src="../assets/logo.webp"');
  if(!html.includes('unified.css')) html = html.replace('</head>','<link rel="stylesheet" href="../unified.css"></head>');
  html = html.replace('</head>',seo(relative,title,description,!['index.html','estimate.html'].includes(file))+'</head>');
  write(relative,html);
  urls.push(base+relative.replace(/index.html$/,''));
}
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>');
write('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
write('.nojekyll','');
console.log('Built',urls.length,'indexable HTML pages.');
