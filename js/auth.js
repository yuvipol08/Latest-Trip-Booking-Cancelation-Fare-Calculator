/* ==================================================
   TravelEase — auth.js
   Login / sign-up gate. Pure validators + UI wiring.
   ================================================== */

/* ---------- Pure validators (no DOM) ---------- */
function validateName(v) {
  if (!v || v.trim().length < 2) return 'Enter your name (at least 2 characters).';
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v.trim())) return 'Name can only contain letters, spaces, . \' and -.';
  return '';
}

// Strip non-digits and an optional +91 country code or leading 0.
function normalizeMobile(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0'))  d = d.slice(1);
  return d;
}

// Indian mobile: exactly 10 digits, must start with 6/7/8/9
// (i.e. NOT starting with 0,1,2,3,4,5).
function validateMobile(v) {
  const digits = normalizeMobile(v);
  if (digits.length !== 10) return 'Mobile number must be exactly 10 digits.';
  if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers must start with 6, 7, 8 or 9.';
  return '';
}

function validateEmail(v) {
  if (!v || !v.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address.';
  return '';
}

// Returns an object of which rules pass — used for the live checklist.
function passwordChecks(v) {
  const s = v || '';
  return {
    len:     s.length >= 8,
    upper:   /[A-Z]/.test(s),
    lower:   /[a-z]/.test(s),
    num:     /\d/.test(s),
    special: /[^A-Za-z0-9]/.test(s),
  };
}

function validatePassword(v) {
  const c = passwordChecks(v || '');
  if (Object.values(c).every(Boolean)) return '';
  return 'Password must be 8+ characters with an uppercase, lowercase, number and special character.';
}

/* ---------- UI wiring ---------- */
let authMode = 'login'; // 'login' | 'signup'

function setFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || '';
}

function clearAuthErrors() {
  ['errName', 'errMobile', 'errEmail', 'errPassword', 'errConfirm'].forEach(id => setFieldError(id, ''));
  setFieldError('authFormError', '');
}

function setAuthMode(mode) {
  authMode = mode;
  const card = document.getElementById('authCard');
  card.classList.toggle('mode-login', mode === 'login');
  card.classList.toggle('mode-signup', mode === 'signup');
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.authMode === mode)
  );
  document.getElementById('authSubmit').textContent = mode === 'login' ? 'Sign in →' : 'Create account →';
  clearAuthErrors();
}

function renderPwChecklist(value) {
  const checks = passwordChecks(value);
  document.querySelectorAll('#pwChecklist li').forEach(li => {
    li.classList.toggle('ok', !!checks[li.dataset.rule]);
  });
}

function showAuth() {
  const overlay = document.getElementById('authOverlay');
  overlay.hidden = false;
  document.body.classList.add('auth-locked');
  setAuthMode('login');
  ['authName', 'authMobile', 'authEmail', 'authPassword', 'authConfirm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderPwChecklist('');
}

function hideAuth() {
  document.getElementById('authOverlay').hidden = true;
  document.body.classList.remove('auth-locked');
}

function handleSignup() {
  const name     = document.getElementById('authName').value;
  const mobileRaw = document.getElementById('authMobile').value;
  const email    = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const confirm  = document.getElementById('authConfirm').value;

  const errs = {
    errName:     validateName(name),
    errMobile:   validateMobile(mobileRaw),
    errEmail:    validateEmail(email),
    errPassword: validatePassword(password),
    errConfirm:  password === confirm ? '' : 'Passwords do not match.',
  };
  Object.entries(errs).forEach(([id, msg]) => setFieldError(id, msg));
  if (Object.values(errs).some(Boolean)) return;

  const mobile = normalizeMobile(mobileRaw);
  if (findUserByEmail(email)) {
    setFieldError('authFormError', 'An account with this email already exists. Please sign in.');
    return;
  }
  if (findUserByMobile(mobile)) {
    setFieldError('authFormError', 'An account with this mobile number already exists. Please sign in.');
    return;
  }

  const user = { name: name.trim(), mobile, email: email.trim().toLowerCase(), password, city: '' };
  saveUserAccount(user);
  setSession(user.email);
  onAuthSuccess(user);
}

function handleLogin() {
  const email    = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  const emailErr = validateEmail(email);
  setFieldError('errEmail', emailErr);
  setFieldError('errPassword', password ? '' : 'Enter your password.');
  if (emailErr || !password) return;

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    setFieldError('authFormError', 'Incorrect email or password.');
    return;
  }
  setSession(user.email);
  onAuthSuccess(user);
}

function initAuth() {
  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
  });

  // Mobile: digits only, drop a pasted +91 / leading 0, capped at 10
  const mobileInput = document.getElementById('authMobile');
  mobileInput.addEventListener('input', () => {
    mobileInput.value = normalizeMobile(mobileInput.value).slice(0, 10);
  });

  // Live password checklist
  document.getElementById('authPassword').addEventListener('input', e => {
    if (authMode === 'signup') renderPwChecklist(e.target.value);
  });

  // Show/hide password
  document.getElementById('pwToggle').addEventListener('click', () => {
    const pw = document.getElementById('authPassword');
    pw.type = pw.type === 'password' ? 'text' : 'password';
  });

  // Submit
  document.getElementById('authForm').addEventListener('submit', e => {
    e.preventDefault();
    if (authMode === 'signup') handleSignup();
    else handleLogin();
  });

  setAuthMode('login');
}
