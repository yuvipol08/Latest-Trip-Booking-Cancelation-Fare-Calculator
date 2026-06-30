/* ==================================================
   CHALO — profile.js
   Profile page render and interactions
   ================================================== */

function renderProfile() {
  // Sync display name / city
  const name = state.user.name || 'Traveller';
  document.getElementById('profileDisplayName').textContent = name;
  document.getElementById('profileDisplayCity').textContent = state.user.city || '—';
  const contactEl = document.getElementById('profileContact');
  if (contactEl) {
    const bits = [];
    if (state.user.mobile) bits.push('📱 +91 ' + state.user.mobile);
    if (state.user.email)  bits.push('✉️ ' + state.user.email);
    contactEl.textContent = bits.join('  ·  ');
  }
  document.getElementById('profileAvatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('headerGreeting').textContent = state.user.name ? `Hi, ${state.user.name.split(' ')[0]}` : '';

  // Form values
  document.getElementById('userName').value = state.user.name;
  document.getElementById('userCity').value = state.user.city;

  // Tab counts
  document.getElementById('bookingCount').textContent = state.bookings.length;
  document.getElementById('cancelCount').textContent = state.cancellations.length;

  // Bucket list
  const bucketEl = document.getElementById('bucketList');
  bucketEl.innerHTML = state.bucketList.length
    ? state.bucketList.map((d, i) => `
        <span class="chip">
          ${d}
          <button class="chip-remove" data-remove-bucket="${i}" aria-label="Remove ${d}">✕</button>
        </span>`).join('')
    : `<p style="color:var(--text-faint);font-size:13px;">Add your dream destinations above.</p>`;
  bucketEl.querySelectorAll('[data-remove-bucket]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.bucketList.splice(parseInt(btn.dataset.removeBucket, 10), 1);
      if (typeof persistData === 'function') persistData();
      renderProfile();
    });
  });

  // Booking history
  const histEl = document.getElementById('bookingHistory');
  histEl.innerHTML = state.bookings.length
    ? state.bookings.map(b => `
        <div class="history-item">
          <div>
            <div class="history-route">${b.from} → ${b.to}</div>
            <div class="history-sub">${b.id} · ${MODES[b.mode].icon} ${MODES[b.mode].label} · ${b.date} · ${formatCurrency(b.totalCost)}</div>
          </div>
          <div class="history-actions">
            <span class="pill pill-active">Active</span>
            <button class="btn btn-sm btn-secondary" data-cancel-id="${b.id}">Cancel</button>
          </div>
        </div>`).join('')
    : `<div class="empty-state">
        <span class="empty-icon">🗺️</span>
        <strong>No bookings yet</strong>
        No trips planned yet.
        <button class="empty-cta" data-nav="booking">Plan your first trip →</button>
      </div>`;

  histEl.querySelectorAll('[data-cancel-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Set the ID first, then navigate — renderCancelPageBookingList will auto-trigger the lookup
      document.getElementById('cancelBookingId').value = btn.dataset.cancelId;
      renderCancelPageBookingList();
      goToPage('cancellation');
    });
  });
  histEl.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => goToPage(b.dataset.nav)));

  // Cancellation history
  const cancelEl = document.getElementById('cancellationHistory');
  cancelEl.innerHTML = state.cancellations.length
    ? state.cancellations.map(c => `
        <div class="history-item">
          <div>
            <div class="history-route">${c.from} → ${c.to}</div>
            <div class="history-sub">${c.id} · Cancelled ${c.cancelledOn} · Refund: ${formatCurrency(c.refundAmount)} (${c.refundPercent}%)</div>
          </div>
          <span class="pill pill-cancelled">Cancelled</span>
        </div>`).join('')
    : `<div class="empty-state">
        <span class="empty-icon">✓</span>
        <strong>No cancellations</strong>
        All your trips are intact.
      </div>`;
}

function initProfilePage() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    state.user.name = document.getElementById('userName').value.trim();
    state.user.city = document.getElementById('userCity').value.trim();
    // Keep the stored account record in sync with profile edits
    if (state.user.email && typeof syncAccount === 'function') syncAccount();
    if (typeof persistData === 'function') persistData();
    renderProfile();
    if (typeof updateAuthHeader === 'function') updateAuthHeader();
    showToast('Profile saved ✓');
  });

  document.getElementById('bucketForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('bucketInput');
    const val = input.value.trim();
    if (val && !state.bucketList.includes(val)) {
      state.bucketList.push(val);
      if (typeof persistData === 'function') persistData();
      showToast(`${val} added to bucket list`);
    }
    input.value = '';
    renderProfile();
  });
}