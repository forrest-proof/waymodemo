const state = {
  asset: null,
  assetLabel: null,
};

const totalSteps = 6;
let currentStep = 1;

const stepEls = Array.from(document.querySelectorAll('.step[data-step]'));
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const navRow = document.querySelector('.nav-row');

function showStep(step) {
  stepEls.forEach(el => {
    el.classList.toggle('active', el.dataset.step === String(step));
  });
  currentStep = step;

  if (step === 'confirm') {
    navRow.style.display = 'none';
    return;
  }
  navRow.style.display = 'flex';

  progressFill.style.width = `${(step / totalSteps) * 100}%`;
  stepLabel.textContent = `Step ${step} of ${totalSteps}`;
  backBtn.disabled = step === 1;
  nextBtn.textContent = step === totalSteps ? 'Review' : 'Next';
  nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';

  if (step === totalSteps) {
    renderReview();
  }
}

function validateStep(step) {
  if (step === 1) {
    if (!state.asset) {
      alert('Please select an activation asset to continue.');
      return false;
    }
  }
  if (step === 3) {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    if (!start || !end) {
      alert('Please provide both a start and end date.');
      return false;
    }
    if (new Date(end) < new Date(start)) {
      alert('End date must be on or after the start date.');
      return false;
    }
  }
  if (step === 5) {
    const email = document.getElementById('reqEmail').value.trim();
    const name = document.getElementById('reqName').value.trim();
    if (!name || !email) {
      alert('Please provide at least your name and email.');
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  }
});

backBtn.addEventListener('click', () => {
  if (currentStep > 1) showStep(currentStep - 1);
});

function applyTierVisibility() {
  document.querySelectorAll('[data-tier]').forEach(el => {
    const tiers = el.dataset.tier.split(' ');
    el.hidden = !state.asset || !tiers.includes(state.asset);
  });
}

// Asset selection
document.querySelectorAll('.asset-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.asset-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.asset = card.dataset.asset;
    state.assetLabel = card.dataset.label;
    applyTierVisibility();
  });
});

// Union sub-fields reveal
document.querySelectorAll('input[name="union"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('unionSubfields').hidden = radio.value !== 'Yes';
  });
});

function daysBetween(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffMs = end - start;
  return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

function renderReview() {
  const venueName = document.getElementById('venueName').value || 'Not provided';
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const zoneLabel = document.getElementById('shippingZone').selectedOptions[0].textContent;
  const reqName = document.getElementById('reqName').value || '—';
  const reqEmail = document.getElementById('reqEmail').value || '—';

  const days = daysBetween(startDate, endDate);

  document.getElementById('rvAsset').textContent = state.assetLabel || '—';
  document.getElementById('rvVenue').textContent = venueName;
  document.getElementById('rvDates').textContent = `${startDate} → ${endDate}`;
  document.getElementById('rvDuration').textContent = `${days} day${days > 1 ? 's' : ''}`;
  document.getElementById('rvZone').textContent = zoneLabel;
  document.getElementById('rvContact').textContent = `${reqName} (${reqEmail})`;
}

document.getElementById('submitBtn').addEventListener('click', () => {
  const email = document.getElementById('reqEmail').value || 'your email';
  document.getElementById('confirmEmail').textContent = email;
  showStep('confirm');
});

showStep(1);
