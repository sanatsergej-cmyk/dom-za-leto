const params = new URLSearchParams(location.search);
const rubles = new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB',maximumFractionDigits:0});
const money = value => rubles.format(value);
const control = (form, name) => form.elements.namedItem(name);
const number = (form,name) => Number(control(form,name).value);
const prefix = path => {
  const url = new URL(path, document.baseURI);
  if (url.protocol === 'file:' && url.pathname.endsWith('/')) url.pathname += 'index.html';
  return url;
};
function link(path,label) {
  const a = document.createElement('a');
  a.href = prefix(path);
  a.textContent = label;
  return a;
}
function paragraph(value) {
  const p = document.createElement('p');
  p.textContent = value;
  return p;
}
function choose(select,key) {
  if (Array.from(select.options).some(option => option.value === key)) select.value = key;
}
const mortgage = document.querySelector('[data-calculator="mortgage"]');
const smsLink = text => `sms:+79787245424?body=${encodeURIComponent(text)}`;
if (mortgage) {
  const request = mortgage.querySelector('[data-mortgage-request]');
  function mortgageEstimate() {
    const principal = number(mortgage,'cost') - number(mortgage,'deposit');
    const rate = number(mortgage,'rate')/1200;
    const months = number(mortgage,'years')*12;
    const result = mortgage.querySelector('output');
    const intro = `Здравствуйте! Интересует Дом ${mortgage.dataset.model} в ипотеку.`;
    if (!mortgage.checkValidity()) {
      result.textContent = '';
      request.href = smsLink(intro);
      return;
    }
    if (principal <= 0) {
      result.textContent = 'При таком взносе кредит не требуется. Проверьте введённые суммы.';
      request.href = smsLink(intro);
      return;
    }
    const payment = rate ? principal*rate/-Math.expm1(-months*Math.log1p(rate)) : principal/months;
    result.textContent = `Около ${money(payment)} в месяц. Сумма кредита ${money(principal)}.`;
    request.href = smsLink(`${intro} Собственные средства: ${money(number(mortgage,'deposit'))}. Срок: ${months/12} лет. Подскажите, какие условия доступны для моего участка?`);
  }
  mortgage.addEventListener('submit', event => {
    event.preventDefault();
    mortgageEstimate();
  });
  mortgage.addEventListener('input',mortgageEstimate);
  mortgageEstimate();
}
const investor = document.querySelector('[data-calculator="invest"]');
if (investor) {
  const model = control(investor,'model');
  const rents = investor.querySelector('[data-rents]');
  const result = investor.querySelector('output');
  const savedRents = new Map();
  let previous;
  function refreshRents() {
    if (previous) savedRents.set(previous, Array.from(rents.querySelectorAll('input'),input=>input.value));
    previous = model.value;
    const count = Number(model.selectedOptions[0].dataset.units);
    rents.replaceChildren(...Array.from({length:count},(_,i)=>{
      const label = document.createElement('label');
      label.textContent = `Единица ${i+1}`;
      const input = document.createElement('input');
      Object.assign(input,{type:'number',name:`rent${i}`,required:true,min:'0',value:savedRents.get(previous)?.[i]||''});
      label.append(input);
      return label;
    }));
    result.replaceChildren();
  }
  choose(model,params.get('model'));
  refreshRents();
  model.addEventListener('change',refreshRents);
  investor.addEventListener('input',()=>result.replaceChildren());
  investor.addEventListener('submit',event=>{
    event.preventDefault();
    const capex = ['land','build','fit','infra','other'].reduce((sum,key)=>sum+number(investor,key),0);
    if (capex <= 0) {
      result.textContent = 'Укажите полную сумму вложений больше нуля.';
      return;
    }
    const annual = Array.from(rents.querySelectorAll('input')).reduce((sum,i)=>sum+Number(i.value),0)*12;
    const scenarios = [['Стресс',.9,7,4,1.08],['База',1,0,0,1],['Рост',1.1,-3,-2,1]];
    const percent = value => Math.min(100,Math.max(0,value))/100;
    result.replaceChildren(...scenarios.map(([label,rentFactor,vacancyDelta,variableDelta,costFactor])=>{
      const gross = annual*rentFactor;
      const received = gross*(1-percent(number(investor,'vacancy')+vacancyDelta));
      const noi = received*(1-percent(number(investor,'management'))-percent(number(investor,'variable')+variableDelta))-number(investor,'fixed');
      const cash = noi-received*percent(number(investor,'tax'))-number(investor,'reserve')-number(investor,'debt');
      const cost = capex*costFactor;
      const yieldOnCost = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1,style:'percent'}).format(noi/cost);
      const payback = cash>0 ? `Простой ориентир окупаемости: ${(cost/cash).toLocaleString('ru-RU',{maximumFractionDigits:1})} лет.` : 'При таком потоке расчётной окупаемости нет.';
      return paragraph(`${label}. Вложения ${money(cost)}. Валовая аренда ${money(gross)}/год. После простоя ${money(received)}/год. NOI ${money(noi)}/год (${yieldOnCost} от вложений). Поток ${money(cash)}/год. ${payback}`);
    }));
  });
}
const packageTool = document.querySelector('[data-calculator="package"]');
if (packageTool) {
  const model = control(packageTool,'model');
  const packageSelect = control(packageTool,'package');
  choose(model,params.get('model'));
  function packageResult() {
    const level = packageSelect.selectedOptions[0];
    packageTool.querySelector('output').textContent = `Ориентир по КП: ${money(Number(level.dataset['price'+model.value]))}.`;
    const target = prefix('quiz/');
    target.search = new URLSearchParams({model:model.value,package:level.textContent});
    packageTool.querySelector('[data-package-quiz]').href = target;
  }
  packageTool.addEventListener('change',packageResult);
  packageResult();
}
const land = document.querySelector('[data-calculator="land"]');
land?.addEventListener('submit',event=>{
  event.preventDefault();
  const value = control(land,'location').value.trim().replace(/\s*:\s*/g,':');
  if (!value) return;
  land.querySelector('[data-location]').textContent = `Участок для проверки: ${value}.`;
  const target = prefix('quiz/');
  target.search = new URLSearchParams({land:'review',location:value});
  land.querySelector('[data-land-quiz]').href = target;
  land.querySelector('[data-land-result]').hidden = false;
});
const search = document.querySelector('[data-calculator="search"]');
if (search) {
  const dataset = document.querySelector('#land-listings');
  search.addEventListener('submit',event=>{
    event.preventDefault();
    const data = Object.fromEntries(new FormData(search));
    const target = prefix('quiz/');
    target.search = new URLSearchParams({land:'search',region:data.region,landBudget:data.max,landArea:data.area,landNeeds:[data.access?'Подтверждённый подъезд':'',data.utilities?'Подтверждённые сети':''].filter(Boolean).join(', '),goal:data.purpose==='rental'?'rent':data.purpose});
    search.querySelector('[data-search-brief]').href = target;
    const result = search.querySelector('output');
    result.textContent = 'Проверяем базу…';
    try {
      const database = JSON.parse(dataset.textContent);
      const today = new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow'}).format(new Date());
      const age = date => (Date.parse(today)-Date.parse(date))/86400000;
      const matches = database.filter(item=>item.status==='active' &&
        age(item.checkedAt)>=0 && age(item.checkedAt)<=Number(data.days) &&
        item.region.toLowerCase().includes(data.region.trim().toLowerCase()) &&
        (!data.max||item.price<=Number(data.max)) && (!data.area||item.area>=Number(data.area)) &&
        (!data.access||item.access===true) && (!data.utilities||item.utilities===true) &&
        (!data.purpose||item.purpose===data.purpose)).sort((a,b)=>b.checkedAt.localeCompare(a.checkedAt));
      if (!matches.length) {
        result.textContent = database.length ? 'Свежих предложений по этим параметрам нет. Измените фильтры или сохраните запрос.' : 'Подтверждённые предложения ещё не загружены. Можно сохранить запрос на подбор.';
        return;
      }
      result.replaceChildren(...matches.map(item=>{
        const p = paragraph(`${item.region} · ${item.area} сот. · ${money(item.price)}. Проверено ${item.checkedAt}. `);
        if (/^https?:\/\//.test(item.source||'')) p.append(link(item.source,'Источник'));
        return p;
      }));
    } catch {
      result.textContent = 'База пока недоступна. Можно сохранить запрос на подбор.';
    }
  });
}
const quiz = document.querySelector('[data-quiz]');
if (quiz) {
  const steps = Array.from(quiz.querySelectorAll('[data-step]'));
  const next = quiz.querySelector('[data-next]');
  const back = quiz.querySelector('[data-back]');
  const result = quiz.querySelector('[data-quiz-result]');
  const progress = quiz.querySelector('[data-progress]');
  const selection = quiz.querySelector('[data-quiz-selection]');
  const requested = params.get('model');
  const initialModels = {'89':'Дом 89','110':'Дом 110','8x8':'Дом 64 м²','62':'Дом 62 м²'};
  if (Object.hasOwn(initialModels,requested)) {
    selection.textContent = `Выбранный проект · ${initialModels[requested]}`;
    selection.hidden = false;
  }
  const storeKey = 'dzl-quiz-v3:' + (Object.hasOwn(initialModels, requested) ? requested : 'general');
  let saved = {};
  try {saved = JSON.parse(sessionStorage.getItem(storeKey)||'{}')||{};} catch {}
  for (const input of quiz.querySelectorAll('[name]')) {
    const value = params.get(input.name) ?? saved[input.name];
    if (value == null) continue;
    if (input.tagName==='SELECT') choose(input,value);
    else input.value = value;
  }
  const save = () => {
    try {sessionStorage.setItem(storeKey,JSON.stringify(Object.fromEntries(new FormData(quiz))));} catch {}
  };
  function branch(selector,show) {
    const group = quiz.querySelector(selector);
    group.hidden = !show;
    for (const input of group.querySelectorAll('input,select')) input.disabled = !show;
  }
  function branches() {
    const goal = control(quiz,'goal').value;
    const land = control(quiz,'land').value;
    branch('[data-family]',goal!=='rent'&&goal!=='guest');
    branch('[data-rental]',goal==='rent'||goal==='mixed'||goal==='guest');
    branch('[data-owned]',land==='owned'||land==='review');
    branch('[data-looking]',land==='search');
  }
  let step = 0;
  function render() {
    steps.forEach((field,i)=>{
      field.hidden = i!==step;
      field.disabled = i!==step;
    });
    progress.textContent = step===steps.length ? 'Ваши варианты' : `Шаг ${step+1} из ${steps.length}`;
    back.hidden = step===0;
    next.hidden = step===steps.length;
    next.textContent = step===steps.length-1?'Показать варианты':'Далее';
    result.hidden = step!==steps.length;
  }
  function values() {
    return Object.fromEntries(Array.from(quiz.querySelectorAll('[name]')).filter(x=>!x.disabled).map(x=>[x.name,x.value]));
  }
  function showResult() {
    const data = values();
    const rental = data.units==='5'?'5':data.units==='6'?'6':'4m';
    const home = data.bedrooms==='2'?(requested==='62'?'62':'8x8'):data.feature==='privacy'?'110':data.bedrooms==='3'&&['8x8','62'].includes(requested)?'89':Object.hasOwn(initialModels,requested)?requested:'89';
    const recommendations = [];
    if (data.goal==='guest') recommendations.push(['gostevye-doma/','Гостевые дома'],['architecture/resort/','Архитектура Resort']);
    else {
      if (data.goal!=='rent') recommendations.push([`projects/dom-${home}/`,initialModels[home]]);
      if (data.goal==='rent'||data.goal==='mixed') recommendations.push(data.units==='custom'?['dohodnye-doma/','Индивидуальный доходный дом']:[`invest/projects/dd-${rental}/`,'Подходящая концепция доходного дома']);
      else recommendations.push(home==='89'?['projects/dom-110/','Сравнить с Домом 110']:['projects/dom-89/','Сравнить с Домом 89']);
    }
    result.replaceChildren(paragraph('Посмотрите планировки и уточните готовность по своему бюджету.'));
    const list = document.createElement('ul');
    for (const item of recommendations) {
      const li = document.createElement('li');
      li.append(link(...item));
      list.append(li);
    }
    result.append(list);
    const selected = data.goal==='guest' ? 'Гостевой дом' : data.goal==='rent' ? (data.units==='custom'?'Доходный дом по индивидуальному заданию':`ДД-${rental}`) : initialModels[home];
    const briefLabels = {goal:'Цель',land:'Статус участка',location:'Кадастровый номер или адрес',region:'Район',landBudget:'Бюджет на участок',landArea:'Площадь участка',landNeeds:'Подъезд и сети',bedrooms:'Спальни',feature:'Приоритет',units:'Арендные единицы',rentType:'Тип аренды',operator:'Управление',finish:'Готовность',budget:'Бюджет на дом',pay:'Оплата',when:'Срок'};
    const answerLabels = {living:'Постоянное проживание',seasonal:'Дача',rent:'Доходный дом',guest:'Гостевой дом',custom:'2–3 или больше 6',mixed:'Комбинированно',unknown:'Пока выбираю',owned:'Свой участок',review:'Есть вариант',search:'Нужен подбор',cash:'Свои средства',mortgage:'Ипотека',terrace:'Терраса',privacy:'Санузел при спальне'};
    const note = ['Подбор дома','Здравствуйте! Хочу обсудить строительство.',`Ориентир проекта: ${selected}`,...Object.entries(data).filter(([,value])=>value).map(([key,value])=>`${briefLabels[key]}: ${answerLabels[value]||value}`)];
    if (params.get('package')) note.push(`Интересующий пакет: ${params.get('package')}`);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content']) if(params.has(key)) note.push(`${key}: ${params.get(key)}`);
    const request = link(smsLink(note.slice(1).join('\n')),'Оставить заявку по SMS');
    request.className = 'action';
    result.append(request,paragraph('Сообщение с вашими ответами откроется в приложении SMS. Также можно позвонить.'),link('tel:+79787245424','Позвонить'));
    if(data.land==='search') result.append(paragraph('Следующий шаг по земле'),link('land/search/','Подобрать участки'));
  }
  const saveAll = () => {
    steps.forEach(field=>field.disabled=false);
    save();
  };
  quiz.addEventListener('input',()=>{
    branches();saveAll();render();
  });
  quiz.addEventListener('submit',event=>{
    event.preventDefault();
    if (step>=steps.length||!quiz.reportValidity()) return;
    saveAll();
    step++;
    if (step===steps.length) showResult();
    render();
    steps[step]?.querySelector('select,input')?.focus();
  });
  back.addEventListener('click',()=>{if (step>0)step--;render();});
  if (!control(quiz,'goal').value && Object.hasOwn(initialModels,requested)) choose(control(quiz,'goal'),'living');
  branches();
  render();
}
const filter = document.querySelector('[data-gallery-filter]');
filter?.addEventListener('change',()=>{
  for (const frame of document.querySelectorAll('[data-frame]')) {
    frame.hidden = Boolean(filter.value&&frame.dataset.frame!==filter.value);
  }
});
