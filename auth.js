(() => {
  const $ = selector => document.querySelector(selector);
  const tabs = [...document.querySelectorAll('.auth-tab')];
  const form = $('#auth-form');
  const signupFields = document.querySelector('.auth-signup-only');
  const title = $('#auth-title');
  const intro = $('#auth-intro');
  const submit = $('#auth-submit');
  const status = $('#auth-status');
  let mode = 'login';

  const setMode = nextMode => {
    mode = nextMode;
    const signup = mode === 'signup';
    tabs.forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    signupFields.hidden = !signup;
    $('#business').required = signup;
    title.textContent = signup ? 'Create your workspace' : 'Welcome back';
    intro.textContent = signup ? 'Set up your salon workspace in less than two minutes.' : 'Sign in to continue to your salon dashboard.';
    submit.innerHTML = signup ? 'Create account <i class="ti ti-arrow-right"></i>' : 'Sign in <i class="ti ti-arrow-right"></i>';
    $('#password').autocomplete = signup ? 'new-password' : 'current-password';
    status.textContent = '';
  };

  tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const account = JSON.parse(localStorage.getItem('rahisi-account') || 'null');

    if (mode === 'signup') {
      localStorage.setItem('rahisi-account', JSON.stringify({ business: data.business, email: data.email, createdAt: new Date().toISOString() }));
      localStorage.setItem('rahisi-session', JSON.stringify({ email: data.email, business: data.business, signedInAt: new Date().toISOString() }));
      status.textContent = 'Account created. Opening your dashboard…';
    } else if (!account || account.email !== data.email) {
      status.textContent = 'No demo account matches that email. Create an account first.';
      return;
    } else {
      localStorage.setItem('rahisi-session', JSON.stringify({ email: account.email, business: account.business, signedInAt: new Date().toISOString() }));
      status.textContent = 'Signed in. Opening your dashboard…';
    }
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 500);
  });
})();
