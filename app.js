(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const menu = $('#menu-toggle'), nav = $('#nav-links');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); $('.ti', menu).className = open ? 'ti ti-x' : 'ti ti-menu-2'; });
  $$('#nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const theme = $('#theme-toggle');
  const applyTheme = value => { document.documentElement.dataset.theme = value; localStorage.setItem('rahisi-theme', value); $('.ti', theme).className = value === 'dark' ? 'ti ti-sun' : 'ti ti-moon'; };
  applyTheme(localStorage.getItem('rahisi-theme') || 'light');
  theme.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  $('#today-label').textContent = new Intl.DateTimeFormat('en-KE', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date());

  $$('.faq-item button').forEach(button => button.addEventListener('click', () => button.parentElement.classList.toggle('open')));
  const modal = $('#trial-modal');
  const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  $$('.open-trial').forEach(button => button.addEventListener('click', () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; $('input', modal).focus(); }));
  $('.modal-close').addEventListener('click', closeModal); modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  $('#trial-form').addEventListener('submit', e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); localStorage.setItem('rahisi-lead', JSON.stringify({...data, createdAt: new Date().toISOString()})); $('#trial-status').textContent = `Thanks, ${data.name}! Your request was saved. We’ll contact you shortly.`; e.currentTarget.reset(); });

  const booking = $('#booking-form'); const steps = $$('.booking-step'); let step = 1; let selectedSlot = '';
  const setStep = value => { step = value; steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === step)); $$('.booking-progress span').forEach((s, i) => s.classList.toggle('active', i < step)); };
  $$('.open-booking').forEach(button => button.addEventListener('click', () => { document.querySelector('#demo').scrollIntoView(); setStep(1); }));
  const date = $('#booking-date'); date.min = new Date().toISOString().split('T')[0]; date.value = date.min;
  const slots = ['09:00','10:00','11:30','13:00','14:30','16:00'];
  const renderSlots = () => { $('#slot-grid').innerHTML = slots.map(time => `<button type="button" class="slot ${selectedSlot === time ? 'selected' : ''}" data-time="${time}">${time}</button>`).join(''); $$('.slot').forEach(button => button.addEventListener('click', () => { selectedSlot = button.dataset.time; renderSlots(); })); };
  renderSlots(); date.addEventListener('change', renderSlots);
  $$('.next-step').forEach(button => button.addEventListener('click', () => { if (step === 1 && !booking.querySelector('[name=service]:checked')) return ($('#booking-status').textContent = 'Choose a service first.'); if (step === 2 && !selectedSlot) return ($('#booking-status').textContent = 'Choose an available time.'); $('#booking-status').textContent = ''; setStep(Math.min(3, step + 1)); }));
  $$('.back-step').forEach(button => button.addEventListener('click', () => setStep(Math.max(1, step - 1)));
  booking.addEventListener('submit', e => { e.preventDefault(); const service = booking.querySelector('[name=service]:checked'); const data = { service: service.value, price: service.dataset.price, date: date.value, stylist: $('#stylist').value, time: selectedSlot, name: $('#booking-name').value, phone: $('#booking-phone').value, createdAt: new Date().toISOString() }; localStorage.setItem('rahisi-booking', JSON.stringify(data)); $('#booking-status').textContent = `Booking confirmed for ${data.name}: ${data.service} with ${data.stylist} on ${data.date} at ${data.time}.`; booking.reset(); selectedSlot = ''; setStep(1); renderSlots(); });
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
})();
