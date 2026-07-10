
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
    const compute = () => {
      const km = Math.max(0, parseFloat(distance.value || '0'));
      const rate = km > 50 ? 28 : 30;
      const result = Math.max(100, Math.round((20 + km * rate) / 10) * 10);
      price.textContent = new Intl.NumberFormat('cs-CZ').format(result) + ' Kč';
      rateLabel.textContent = `Sazba ${rate} Kč/km + nástup 20 Kč · minimum 100 Kč`;
    };
    calc.querySelector('[data-calc]')?.addEventListener('click', compute);
    calc.querySelectorAll('[data-km]').forEach(btn => btn.addEventListener('click', () => { distance.value = btn.dataset.km; compute(); }));
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
