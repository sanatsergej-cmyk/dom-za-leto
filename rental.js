(() => {
  const form = document.getElementById('rental-options');
  const e = form.elements;
  const params = new URLSearchParams(location.search);
  if (['4','6','8'].includes(params.get('sections'))) e.sections.value=params.get('sections');
  if (['2','3'].includes(params.get('floors'))) e.floors.value=params.get('floors');
  let brief = '';
  const rows = [];
  for (const sections of [4,6,8]) {
    for (const floors of [2,3]) {
      rows.push({sections,floors,sectionArea:floors*40,area:sections*floors*40,footprint:sections*40});
    }
  }
  const format = n=>n.toLocaleString('ru-RU');
  document.querySelector('#modifications tbody').innerHTML=rows.map(r=>
    '<tr><td>'+r.sections+'</td><td>'+r.floors+'</td><td>'+r.sectionArea+' м²</td><td>'+r.area+' м²</td><td>'+r.footprint+' м²</td></tr>').join('');
  function update() {
    const sections=Number(e.sections.value), floors=Number(e.floors.value);
    const scenario=e.scenario.value, code=window.DZL_FUNNEL.code(sections,floors);
    const area=sections*floors*40;
    document.getElementById('selected-area').textContent=format(area)+' м²';
    document.getElementById('selected-detail').textContent=sections+' секций × '+(floors*40)+' м², '+floors+' этажа под одной крышей';
    const image=document.getElementById('rental-picture');
    image.src='assets/rental-'+floors+'.webp';
    image.alt='Архитектурная концепция арендного блока в '+floors+' этажа';
    const source=window.DZL_FUNNEL.summary();
    brief=['Проект: Дом за лето','Арендный дом — предварительный запрос','Телефон команды: +7 978 724-54-24',
      'Вариант: '+sections+' секций / '+floors+' этажа','Площадь секции по модели: '+(floors*40)+' м²',
      'Общая площадь по модели: '+area+' м²','Пятно основного объёма: '+sections*40+' м²',
      'Сценарий: '+scenario,'Код входа: '+code,source,
      'Модель геометрии: 40 м² на этаж секции. Уточнить конструктив, лестницы, инженерные узлы, отступы, парковку и эксплуатацию.',
      'Запрос: стартовая стоимость, комплектация, проверка участка и индивидуальная инвестиционная модель.'].join('\n');
    const url=window.DZL_FUNNEL.startUrl(sections,floors);
    url.searchParams.set('scenario',scenario);
    history.replaceState(null,'',url);
    document.querySelector('#entry-code').textContent=code;
    document.querySelector('#sms-rental').href='sms:+79787245424?body='+encodeURIComponent('Здравствуйте! '+code+'. Арендный дом '+sections+' секций, '+floors+' этажа. '+scenario+'. Прошу подготовить стартовую стоимость.');
    const telegram=document.getElementById('bot-link');
    const configured=window.DZL_CHANNELS?.telegram;
    let bot;try{bot=new URL(configured);}catch{}
    if(bot?.protocol==='https:'&&bot.hostname==='t.me'&&bot.pathname.length>1){
      bot.searchParams.set('start',code);telegram.href=bot.href;telegram.hidden=false;
    }
  }
  if (['Долгосрочная аренда','Посуточная аренда','Сравнить сценарии'].includes(params.get('scenario'))) e.scenario.value=params.get('scenario');
  form.addEventListener('change',update);
  document.querySelector('#rental-download').onclick=()=>{
    const url=URL.createObjectURL(new Blob(['\ufeff',brief],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='Дом-за-лето-арендный-дом.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  document.querySelector('#rental-share').onclick=async()=>{
    try{
      if(navigator.share) await navigator.share({title:'Арендный дом — запрос',text:brief});
      else {await navigator.clipboard.writeText(brief);document.querySelector('#rental-status').textContent='Запрос скопирован. Вставьте его в диалог с командой.';}
    }catch(error){if(error.name!=='AbortError')document.querySelector('#rental-status').textContent='Скачайте запрос и приложите файл к сообщению.';}
  };
  update();
})();
