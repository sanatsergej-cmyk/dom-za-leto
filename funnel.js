(() => {
  const params = new URLSearchParams(location.search);
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const clean = value => String(value || '').replace(/[\u0000-\u001f]/g, '').slice(0,160);
  let record = {};
  try { record = JSON.parse(sessionStorage.getItem('dzl.attribution.v1')) || {}; } catch {}
  const incoming = Object.fromEntries(allowed.filter(key => params.has(key)).map(key => [key,clean(params.get(key))]));
  if(Object.keys(incoming).length) {
    const touch = { ...incoming, page: location.pathname, time: new Date().toISOString() };
    record.first ||= touch;
    record.last = touch;
  }
  if (/^dzl_(home|build|investor|rent|partner)(_[A-Za-z0-9_-]+)?$/.test(params.get('start') || '')) {
    record.entry = clean(params.get('start'));
  }
  try { sessionStorage.setItem('dzl.attribution.v1', JSON.stringify(record)); } catch {}
  window.DZL_FUNNEL = {
    record,
    code(sections, floors) { return 'dzl_rent_'+sections+'_'+floors; },
    startUrl(sections, floors) {
      const url = new URL(location.href);
      url.searchParams.set('start', this.code(sections, floors));
      url.searchParams.set('sections',sections);
      url.searchParams.set('floors',floors);
      return url;
    },
    summary() {
      return ['Вход: '+(record.entry || 'прямой'),
        'Первый источник: '+JSON.stringify(record.first || {}),
        'Последний источник: '+JSON.stringify(record.last || {})].join('\n');
    }
  };
})();
