
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('is-open')));
  }

  const calc = document.querySelector('[data-calculator]');
  if (calc) {
    const distance = calc.querySelector('[data-distance]');
    const price = calc.querySelector('[data-price]');
    const rateLabel = calc.querySelector('[data-rate]');
    // Stejny tarif jako na taxihodonin.com. Letistni sazba plati jen pro
    // predvolene letistni trasy, ne pro rucne zadanou vzdalenost.
    const T = { boarding: 20, min: 100, threshold: 50,
                std: { short: 30, long: 28, airport: 25 },
                van: { short: 40, long: 38, airport: 35 } };
    let airport = false;
    const vehicle = () => (calc.querySelector('[data-vehicle]:checked') || {}).value === 'van' ? 'van' : 'std';
    const compute = () => {
      const km = Math.max(0, parseFloat(distance.value || '0'));
      const v = vehicle();
      const rate = airport ? T[v].airport : (km > T.threshold ? T[v].long : T[v].short);
      const total = km * rate + T.boarding;
      const result = Math.round(v === 'van' ? total : Math.max(T.min, total));
      price.textContent = new Intl.NumberFormat('cs-CZ').format(result) + ' Kč';
      rateLabel.textContent = `Sazba ${rate} Kč/km + nástup ${T.boarding} Kč`
        + (v === 'van' ? '' : ` · minimum ${T.min} Kč`)
        + (airport ? ' · letištní tarif' : '');
    };
    const syncQuick = () => {
      const key = vehicle() === 'van' ? 'van' : 'std';
      calc.querySelectorAll('.calc-quick-grid small').forEach(s => {
        s.textContent = new Intl.NumberFormat('cs-CZ').format(parseInt(s.dataset[key], 10)) + ' Kč';
      });
    };
    calc.querySelector('[data-calc]')?.addEventListener('click', compute);
    distance.addEventListener('input', () => { airport = false; });
    calc.querySelectorAll('[data-vehicle]').forEach(r => r.addEventListener('change', () => { syncQuick(); compute(); }));
    calc.querySelectorAll('[data-km]').forEach(btn => btn.addEventListener('click', () => {
      distance.value = btn.dataset.km;
      airport = btn.dataset.airport === '1';
      compute();
    }));
    syncQuick();
    distance.addEventListener('input', compute);
    compute();
  }

  const banner = document.querySelector('[data-cookie-banner]');
  if (banner && !localStorage.getItem('rb-cookie-choice')) banner.classList.add('is-visible');
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => { localStorage.setItem('rb-cookie-choice','accepted'); banner?.classList.remove('is-visible'); });
  document.querySelector('[data-cookie-decline]')?.addEventListener('click', () => { localStorage.setItem('rb-cookie-choice','declined'); banner?.classList.remove('is-visible'); });

  document.querySelectorAll('[data-mailto-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = form.dataset.subject || 'Zpráva z webu RB Taxi';
      const body = [...data.entries()].map(([k,v]) => `${k}: ${v}`).join('\n');
      window.location.href = `mailto:${form.dataset.to || 'info@rbgroup.cz'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
})();
