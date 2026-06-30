/* ==================================================
   TravelEase — storage.js
   Lightweight localStorage layer for accounts + per-user
   data. Note: this is a front-end-only demo. Passwords are
   stored in the browser and are NOT secured — do not reuse a
   real password here.
   ================================================== */

const STORE_KEYS = {
  USERS:       'travelease_users',
  SESSION:     'travelease_session',
  DATA_PREFIX: 'travelease_data_',
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage full / unavailable — fail silently in this demo */
  }
}

/* ---------- Accounts ---------- */
function getUsers() {
  return readJSON(STORE_KEYS.USERS, {});
}

function saveUserAccount(user) {
  const users = getUsers();
  users[user.email.toLowerCase()] = user;
  writeJSON(STORE_KEYS.USERS, users);
}

function findUserByEmail(email) {
  if (!email) return null;
  return getUsers()[String(email).toLowerCase()] || null;
}

function findUserByMobile(mobile) {
  if (!mobile) return null;
  return Object.values(getUsers()).find(u => u.mobile === mobile) || null;
}

/* ---------- Session ---------- */
function setSession(email) {
  if (email) localStorage.setItem(STORE_KEYS.SESSION, email.toLowerCase());
  else       localStorage.removeItem(STORE_KEYS.SESSION);
}

function getSession() {
  return localStorage.getItem(STORE_KEYS.SESSION);
}

/* ---------- Per-user app data ---------- */
function dataKey(email) {
  return STORE_KEYS.DATA_PREFIX + String(email).toLowerCase();
}

function loadUserData(email) {
  return readJSON(dataKey(email), null);
}

function saveUserData(email, data) {
  writeJSON(dataKey(email), data);
}
