'use strict';
const form=document.getElementById('calc');
const labels={land:'Покупка земли',access:'Подготовка и подъезд',nets:'Наружные сети'};
const money=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
const controls=form.elements;
const names={stone:'светлый камень',porcelain:'керамогранит',warm:'тёплый минимализм',natural:'природная палитра',contrast:'графичный интерьер',med:'средиземноморский сад',family:'семейный двор',easy:'сад простого ухода'};
let config={};
try{config=JSON.parse(localStorage.getItem('dzl-config-v1'))||{};}catch{}
document.querySelector('#plots').innerHTML=['a','b'].map((id,i)=>'<div><h3>Вариант '+['А','Б'][i]+'</h3>'+Object.entries(labels).map(([k,title])=>'<label>'+title+', ₽<input type="number" name="'+id+'_'+k+'" min="0" max="1000000000" placeholder="Уточнить"></label>').join('')+'<label>Въезд и условия монтажа<select name="'+id+'_road"><option>Не проверены</option><option>Нужен выезд специалиста</option><option>Согласованы с монтажной командой</option></select></label></div>').join('');
try{const saved=JSON.parse(sessionStorage.getItem('dzl-estimate'))||{};for(const [k,v] of Object.entries(saved))if(controls[k])controls[k].value=v;}catch{}
if(config.house==='89'||config.house==='110')controls.house.value=config.house;
const decor=[names[config.facade],names[config.interior],names[config.garden]].filter(Boolean).join(', ');
document.querySelector('#spec').textContent=decor?'Ваш выбор в конфигураторе — '+decor+'.':'Выберите оформление в конфигураторе. В расчёт попадут сохранённые пожелания.';
let brief='';
function recalc(){
 const data=Object.fromEntries(new FormData(form));
 try{sessionStorage.setItem('dzl-estimate',JSON.stringify(data));}catch{}
 const result=document.querySelector('#result');
 if(!form.checkValidity()){result.textContent='Исправьте значения за пределами указанных диапазонов.';brief='';return;}
 const base=data.house==='110'?8800000:7800000;
 const plots=['a','b'].map(id=>{
  const missing=Object.keys(labels).filter(k=>data[id+'_'+k]==='');
  const sum=Object.keys(labels).reduce((n,k)=>n+Number(data[id+'_'+k]||0),0);
  return {sum,missing};
 });
 const selected=data.pick==='a'?0:1,plot=plots[selected],total=base+plot.sum+Number(data.extras||0);
 const outstanding=plot.missing.map(k=>labels[k]).concat(data.extras===''?['Дополнительные работы']:[]);
 const months=Number(data.years)*12,principal=Number(data.principal),rate=Number(data.rate)/1200;
 let credit='Для платежа заполните сумму кредита, ставку и срок.';
 if(principal&&months&&data.rate!=='')credit='Ориентир ежемесячного аннуитетного платежа — '+money(rate===0?principal/months:principal*rate/(-Math.expm1(-months*Math.log1p(rate))))+'.';
 const lines=['Дом '+data.house+' м². Ориентир предчистовой готовности с инженерией по материалам октября 2026 года — '+money(base)+'.',...plots.map((v,i)=>'Участок '+['А','Б'][i]+': '+money(v.sum)+' по заполненным строкам. '+(v.missing.length?'Уточнить: '+v.missing.map(k=>labels[k]).join(', ')+'.':'Все три статьи оценены.')),'Выбран участок '+['А','Б'][selected]+'. Доступ техники: '+data[data.pick+'_road']+'.','Допработы: '+(data.extras===''?'уточнить':money(Number(data.extras)))+'.',...(decor?['Оформление: '+decor+'.']:[]),'Итого по заполненным строкам: '+money(total)+'.',outstanding.length?'До полной сметы уточнить: '+outstanding.join(', ')+'.':'Индивидуальную смету подтвердит подрядчик.',credit];
 brief='Проект: Дом за лето\nТелефон: +7 978 724-54-24\nСайт: https://sanatsergej-cmyk.github.io/dom-za-leto/\n\nПредварительный расчёт\n'+lines.join('\n');
 result.replaceChildren();const strong=document.createElement('strong');strong.textContent=money(total)+' по заполненным строкам';result.append(strong);
 for(const line of lines){const el=document.createElement('p');el.textContent=line;result.append(el);}
 document.querySelector('#sms').href='sms:+79787245424?body='+encodeURIComponent('Добрый день. Хочу обсудить дом '+data.house+' м². Предварительный бюджет по заполненным строкам '+money(total)+'.');
}
form.addEventListener('input',recalc);recalc();
document.getElementById('share').onclick=async()=>{if(!brief)return;try{if(navigator.share)await navigator.share({title:'Расчёт дома',text:brief});else{await navigator.clipboard.writeText(brief);document.querySelector('#notice').textContent='Бриф скопирован. Вставьте его в нужный чат Telegram или MAX.';}}catch(e){if(e.name!=='AbortError')document.querySelector('#notice').textContent='Скачайте бриф и приложите файл к сообщению.';}};
document.getElementById('save').onclick=()=>{if(!brief)return;const url=URL.createObjectURL(new Blob(['\ufeff',brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Расчёт-дома.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
for(const [channel,host,label] of [['telegram','t.me','Telegram'],['max','max.ru','MAX']]){
 const value=window.DZL_CHANNELS?.[channel];
 if(!value)continue;
 let url;try{url=new URL(value);}catch{continue;}
 if(url.protocol!=='https:'||url.hostname!==host||url.pathname==='/')continue;
 const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener';link.textContent='Открыть бота в '+label;
 link.addEventListener('click',()=>{if(brief&&navigator.clipboard)navigator.clipboard.writeText(brief).then(()=>{document.querySelector('#notice').textContent='Вставьте скопированный бриф в открытый диалог.';}).catch(()=>{document.querySelector('#notice').textContent='Приложите скачанный бриф к сообщению боту.';});});
 document.querySelector('.actions').append(link);
}
