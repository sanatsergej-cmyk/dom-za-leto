import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content/knowledge.json'),'utf8'));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function page(file,title,description,content){
 const html='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+esc(title)+' · Дом за лето</title><meta name="description" content="'+esc(description)+'">'+
 '<link rel="stylesheet" href="buyer.css"><link rel="icon" href="../assets/logo.webp"></head><body><header></header><main>'+content+
 '</main><footer></footer></body></html>';
 fs.writeFileSync(path.join(root,'buyer',file),html);
}
for(const article of data.articles){
 const content='<article><a href="index.html">← Покупателю</a><small>'+esc(article.category)+'</small><h1>'+esc(article.title)+
 '</h1><p class="lead">'+esc(article.description)+'</p>'+
 article.sections.map(([heading,text])=>'<h2>'+esc(heading)+'</h2><p>'+esc(text)+'</p>').join('')+
 '<aside>Редакционный материал «Дом за лето». Обновлён 4 ноября 2026 года. Основа — материалы производителя и согласованный состав проектов. Решения для конкретного участка подтверждаются специалистом.</aside>'+
 '<p><a class="cta" href="../'+esc(article.related)+'">Посмотреть решения по проекту ↗</a></p>'+
 '<p><a href="estimate.html">Подготовить расчёт ↗</a></p></article>';
 page(article.slug+'.html',article.title,article.description,content);
}
page('questions.html','Вопросы о строительстве панельного дома','Площадь проекта, состав цены, сроки, фундамент и изменения планировки.',
 '<article><small>ОТВЕТЫ ПО ПРОЕКТУ</small><h1>До начала стройки</h1>'+data.questions.map(item=>
 '<section class="answer" id="'+data.questions.indexOf(item)+'"><h2>'+esc(item.question)+'</h2><p>'+esc(item.answer)+
 '</p><a href="../'+esc(item.related)+'">Подробнее ↗</a></section>').join('')+'</article>');
page('crimea.html','Строительство домов в Крыму и возле Симферополя','Условия участка, доставки и монтажа заводского дома в Крыму.',
 '<article><small>ТЕРРИТОРИЯ РАБОТЫ</small><h1>Построить дом в Крыму</h1><p class="lead">Начинаем с проекта и условий земли. Производственная площадка партнёров находится в Крыму. Для объекта возле Симферополя или в другом районе отдельно проверяем доставку и организацию монтажа.</p>'+
 '<h2>Что прислать для оценки участка</h2><ul><li>Населённый пункт или точку расположения, размеры и форму участка.</li><li>Фото въезда с дороги, поворотов и препятствий для техники.</li><li>Данные о рельефе, известных сетях и существующих постройках.</li><li>Выбранный проект, желаемую готовность и срок начала работ.</li></ul>'+
 '<h2>Что влияет на смету в конкретном районе</h2><p>Длина и условия доставки, доступ крана, место разгрузки, подготовка площадки, основание и подключения. Для участка с уклоном сначала согласуем обследования и решение основания.</p>'+
 '<h2>Что проверяем до производства</h2><p>Совместимость планировки, проёмов и инженерных вводов. Готовность площадки к приёму элементов. Последовательность работ и ответственных за подготовку участка и сети.</p>'+
 '<h2>Как двигаться дальше</h2><p>Выберите дом 89 или 110 м², подготовьте бриф и обсудите условия выезда с командой. Для другого района Крыма начнём с проверки маршрута и условий монтажа.</p>'+
 '<p><a class="cta" href="estimate.html">Рассчитать дом и участок ↗</a></p><p><a href="tel:+79787245424">Обсудить участок — +7 978 724-54-24</a></p></article>');
const buyerIndex=path.join(root,'buyer/index.html');
let index=fs.readFileSync(buyerIndex,'utf8');
const start='<!-- knowledge -->',end='<!-- /knowledge -->';
index=index.replace(new RegExp(start+'[\\s\\S]*?'+end),'');
const cards=data.articles.map(a=>'<a class="tile" href="'+a.slug+'.html"><small>'+esc(a.category)+
 '</small><h2>'+esc(a.title)+'</h2><p>'+esc(a.description)+'</p><b>Читать ↗</b></a>').join('');
const block=start+'<section><h2>Технология и работа на участке</h2><div class="grid">'+cards+
 '</div><p><a href="questions.html">Ответы на частые вопросы ↗</a></p><p><a href="crimea.html">Строительство в Крыму ↗</a></p></section>'+end;
index=index.replace('</main>',block+'</main>');
fs.writeFileSync(buyerIndex,index);
console.log('Knowledge pages prepared.');
