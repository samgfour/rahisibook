(() => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const demoBookings = [
    { id: 'demo-1', date: isoToday, time: '09:00', name: 'Amina W.', phone: '0712 000 001', service: 'Braids', stylist: 'Amina', price: 1500, status: 'confirmed' },
    { id: 'demo-2', date: isoToday, time: '10:30', name: 'Njeri K.', phone: '0722 000 002', service: 'Gel manicure', stylist: 'Joy', price: 1200, status: 'pending' },
    { id: 'demo-3', date: isoToday, time: '13:00', name: 'Faith M.', phone: '0733 000 003', service: 'Haircut', stylist: 'Wanjiku', price: 800, status: 'confirmed' },
    { id: 'demo-4', date: isoToday, time: '15:00', name: 'Lydia O.', phone: '0744 000 004', service: 'Braids', stylist: 'Amina', price: 1500, status: 'confirmed' }
  ];
  const stored = JSON.parse(localStorage.getItem('rahisi-bookings') || '[]');
  const singleBooking = JSON.parse(localStorage.getItem('rahisi-booking') || 'null');
  let bookings = [...demoBookings, ...stored];
  if (singleBooking && !bookings.some(item => item.createdAt === singleBooking.createdAt)) bookings.push({ ...singleBooking, id: `local-${Date.now()}`, status: 'pending' });
  const toast = message => { $('#toast').textContent = message; $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 2600); };
  $('#dashboard-date').textContent = new Intl.DateTimeFormat('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(today);
  const money = value => `KES ${Number(value).toLocaleString('en-KE')}`;
  const filtered = () => { const query = $('#search').value.trim().toLowerCase(); const status = $('#status-filter').value; return bookings.filter(item => item.date === isoToday && (status === 'all' || item.status === status) && (!query || item.name.toLowerCase().includes(query) || item.service.toLowerCase().includes(query))); };
  const renderMetrics = () => { const todayBookings = bookings.filter(item => item.date === isoToday && item.status !== 'cancelled'); $('#metric-bookings').textContent = todayBookings.length; $('#metric-revenue').textContent = money(todayBookings.reduce((sum, item) => sum + Number(item.price || 0), 0)); $('#metric-pending').textContent = bookings.filter(item => item.date === isoToday && item.status === 'pending').length; };
  const renderList = () => { const list = $('#appointment-list'); const items = filtered().sort((a, b) => a.time.localeCompare(b.time)); if (!items.length) { list.innerHTML = '<div class="empty-state"><i class="ti ti-calendar-off"></i><br>No appointments match your filters.</div>'; return; } list.innerHTML = items.map(item => `<article class="appointment"><time class="appointment-time">${item.time}</time><span class="appointment-details"><b>${item.name}</b><small>${item.service} · ${item.stylist || 'Any stylist'} · ${money(item.price)}</small></span><span class="appointment-actions"><span class="status status-${item.status}">${item.status}</span><button class="icon-action" type="button" data-action="toggle" data-id="${item.id}" aria-label="Update ${item.name}"><i class="ti ti-edit"></i></button></span></article>`).join(''); };
  const renderChart = () => { const values = [4200, 5600, 3900, 7200, 6100, 8400, 6800]; const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; const max = Math.max(...values); $('#revenue-chart').innerHTML = values.map((value, index) => `<div class="bar" style="height:${Math.round(value / max * 145)}px" title="${money(value)}"><span>${labels[index]}</span></div>`).join(''); };
  const render = () => { renderMetrics(); renderList(); renderChart(); };
  $('#search').addEventListener('input', renderList); $('#status-filter').addEventListener('change', renderList);
  $('#appointment-list').addEventListener('click', event => { const button = event.target.closest('[data-action="toggle"]'); if (!button) return; const item = bookings.find(booking => booking.id === button.dataset.id); if (!item) return; item.status = item.status === 'confirmed' ? 'cancelled' : 'confirmed'; localStorage.setItem('rahisi-bookings', JSON.stringify(bookings.filter(booking => !booking.id.startsWith('demo-')))); toast(`${item.name} is now ${item.status}.`); render(); });
  $('#new-booking').addEventListener('click', () => { window.location.href = 'index.html#demo'; });
  $('#export-btn').addEventListener('click', () => { const rows = [['Date', 'Time', 'Client', 'Phone', 'Service', 'Stylist', 'Price', 'Status'], ...bookings.map(item => [item.date, item.time, item.name, item.phone || '', item.service, item.stylist || '', item.price, item.status])]; const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `rahisibook-bookings-${isoToday}.csv`; link.click(); URL.revokeObjectURL(link.href); toast('Bookings exported.'); });
  render();
})();
