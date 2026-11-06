// ==========================================================================
// RIYAZ INSURANCE - Core JavaScript Engine
// Pure Vanilla JavaScript (ES6+) - 100% Client-Side Functionality
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initQuoteCalculator();
  initClaimsTracker();
  initChatbot();
  initSavingsChart();
  initModals();
  initContactForm();
  initCustomerPortal();
  initBlogSystem();
  initBranchLocator();
  initPhotoPreview();
});

// --------------------------------------------------------------------------
// 1. Toast Notification System
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-24 right-5 z-50 flex flex-col gap-3 max-w-sm pointer-events-auto';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : type === 'warning' ? 'bg-amber-600' : 'bg-sky-600';
  
  toast.className = `${bgClass} text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 toast-enter border border-white/20 backdrop-blur-md`;
  
  const iconName = type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-triangle' : type === 'warning' ? 'alert-circle' : 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span class="font-medium text-xs leading-snug">${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

// --------------------------------------------------------------------------
// 2. Dark & Light Theme Controller
// --------------------------------------------------------------------------
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  const savedTheme = localStorage.getItem('riyaz_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', 'sun');
      themeIcon.className = 'w-4 h-4 text-amber-400';
    }
  } else {
    document.body.classList.remove('light-mode');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', 'moon');
      themeIcon.className = 'w-4 h-4 text-sky-400';
    }
  }
  if (window.lucide) lucide.createIcons();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('riyaz_theme', isLight ? 'light' : 'dark');
      
      if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isLight ? 'sun' : 'moon');
        themeIcon.className = isLight ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-sky-400';
      }
      if (window.lucide) lucide.createIcons();
      showToast(`Switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'info');
    });
  }
}

// --------------------------------------------------------------------------
// 3. Dynamic Quote Calculator Engine (INR - Indian Rupees)
// --------------------------------------------------------------------------
let quoteState = {
  category: 'health',
  age: 32,
  sumInsured: 2500000, // ₹25 Lakhs default
  tier: 'gold', // silver, gold, diamond
  members: 1,
  addons: ['cashless', 'critical']
};

function formatINR(val) {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 1);
    return `₹${cr} Crore`;
  } else if (val >= 100000) {
    const lk = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 1);
    return `₹${lk} Lakhs`;
  }
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

function initQuoteCalculator() {
  const categoryBtns = document.querySelectorAll('.quote-category-btn, .quote-type-btn');
  const ageSlider = document.getElementById('quoteAge');
  const ageValue = document.getElementById('quoteAgeValue');
  const sumSliderAlt = document.getElementById('quoteInsured');
  const sumValueAlt = document.getElementById('quoteInsuredValue');
  const tierBtns = document.querySelectorAll('.quote-tier-btn');
  const memberSelect = document.getElementById('quoteMembers');
  const addonCheckboxes = document.querySelectorAll('.quote-addon');
  
  const monthlyDisplay = document.getElementById('monthlyPremium');
  const annualDisplay = document.getElementById('annualPremium');
  const saveQuoteBtn = document.getElementById('saveQuoteBtn');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('promoCodeInput');

  let promoDiscount = 0;

  // Category Switcher
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white', 'border-sky-500');
        b.classList.add('bg-slate-900', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.remove('bg-slate-900', 'text-slate-300', 'border-slate-800');
      btn.classList.add('bg-sky-600', 'text-white', 'border-sky-500');
      quoteState.category = btn.dataset.type || btn.dataset.category || 'health';
      updateQuoteMath();
    });
  });

  // Tier Selector (Silver, Gold, Diamond)
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('ring-2', 'ring-sky-400', 'border-sky-400'));
      btn.classList.add('ring-2', 'ring-sky-400', 'border-sky-400');
      quoteState.tier = btn.dataset.tier || 'gold';
      updateQuoteMath();
    });
  });

  // Age slider
  if (ageSlider) {
    ageSlider.addEventListener('input', (e) => {
      quoteState.age = parseInt(e.target.value);
      if (ageValue) ageValue.textContent = `${quoteState.age} Yrs`;
      updateQuoteMath();
    });
  }

  // Coverage amount slider
  const targetSumInput = sumSliderAlt || document.getElementById('quoteSumInsured');
  const targetSumVal = sumValueAlt || document.getElementById('quoteSumValue');
  if (targetSumInput) {
    targetSumInput.addEventListener('input', (e) => {
      quoteState.sumInsured = parseInt(e.target.value);
      if (targetSumVal) targetSumVal.textContent = formatINR(quoteState.sumInsured);
      updateQuoteMath();
    });
  }

  // Members count
  if (memberSelect) {
    memberSelect.addEventListener('change', (e) => {
      quoteState.members = parseInt(e.target.value);
      updateQuoteMath();
    });
  }

  // Add-on Riders
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      quoteState.addons = Array.from(addonCheckboxes).filter(c => c.checked).map(c => c.value);
      updateQuoteMath();
    });
  });

  // Promo Code
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'RIYAZ20' || code === 'RIYAZ2026') {
        promoDiscount = 0.20;
        showToast('Promo code applied! 20% Extra Discount unlocked.', 'success');
      } else if (code === 'SHAIK10') {
        promoDiscount = 0.10;
        showToast('Promo code applied! 10% Founder Discount unlocked.', 'success');
      } else if (code === '') {
        showToast('Please enter a valid promo code', 'warning');
      } else {
        showToast('Invalid promo code. Try "RIYAZ20" for 20% off.', 'error');
      }
      updateQuoteMath();
    });
  }

  function updateQuoteMath() {
    let base = 499; // default monthly base in Indian Rupees (₹)
    if (quoteState.category === 'auto') base = 799;
    if (quoteState.category === 'life') base = 649;
    if (quoteState.category === 'home') base = 399;
    if (quoteState.category === 'business') base = 2499;
    if (quoteState.category === 'travel') base = 349;

    // Age factor
    const ageFactor = quoteState.age < 25 ? 1.1 : quoteState.age > 50 ? 1.45 : 1.0;

    // Coverage multiplier
    const coverageFactor = (quoteState.sumInsured || 2500000) / 2500000;

    // Tier factor
    const tierFactor = quoteState.tier === 'diamond' ? 1.35 : quoteState.tier === 'silver' ? 0.75 : 1.0;

    // Members factor
    const membersFactor = 1 + (quoteState.members - 1) * 0.35;

    // Addons cost in Rupees
    const addonCost = quoteState.addons.length * 149;

    let monthly = Math.round(((base * ageFactor * coverageFactor * tierFactor * membersFactor) + addonCost) * (1 - promoDiscount));
    let annual = Math.round(monthly * 12 * 0.90); // 10% annual bundle discount

    if (monthlyDisplay) monthlyDisplay.textContent = `₹${monthly.toLocaleString('en-IN')}`;
    if (annualDisplay) annualDisplay.textContent = `₹${annual.toLocaleString('en-IN')}`;

    // Update quote preview in card if present
    const summaryBreakdown = document.getElementById('calcSummaryBreakdown');
    if (summaryBreakdown) {
      summaryBreakdown.innerHTML = `
        <div class="flex justify-between py-1 border-b border-slate-800 text-xs">
          <span class="text-slate-400">Base Plan (${quoteState.category.toUpperCase()})</span>
          <span class="text-white font-semibold">₹${Math.round(base * coverageFactor * tierFactor).toLocaleString('en-IN')}/mo</span>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800 text-xs">
          <span class="text-slate-400">Active Riders (${quoteState.addons.length})</span>
          <span class="text-emerald-400">+₹${addonCost.toLocaleString('en-IN')}/mo</span>
        </div>
        ${promoDiscount > 0 ? `
        <div class="flex justify-between py-1 border-b border-slate-800 text-xs">
          <span class="text-amber-400">Special Promo Discount</span>
          <span class="text-amber-400 font-bold">-${Math.round(promoDiscount * 100)}%</span>
        </div>` : ''}
        <div class="flex justify-between py-1 text-xs font-bold text-sky-400 pt-2">
          <span>Annual Savings Bundle</span>
          <span>Save 10% Instant</span>
        </div>
      `;
    }
  }

  // Save & Download Proposal Modal
  if (saveQuoteBtn) {
    saveQuoteBtn.addEventListener('click', () => {
      const quoteRef = 'RIQ-' + Math.floor(100000 + Math.random() * 900000);
      const savedQuotes = JSON.parse(localStorage.getItem('riyaz_saved_quotes') || '[]');
      
      const newQuoteRecord = {
        ref: quoteRef,
        date: new Date().toLocaleDateString('en-IN'),
        category: quoteState.category,
        tier: quoteState.tier,
        sumInsured: formatINR(quoteState.sumInsured),
        monthly: monthlyDisplay ? monthlyDisplay.textContent : '₹799',
        annual: annualDisplay ? annualDisplay.textContent : '₹8,629'
      };

      savedQuotes.unshift(newQuoteRecord);
      localStorage.setItem('riyaz_saved_quotes', JSON.stringify(savedQuotes));

      showToast(`Quote Proposal Generated! Ref: ${quoteRef}`, 'success');

      // Populate & Open Modal
      const modal = document.getElementById('quoteSummaryModal');
      const refEl = document.getElementById('modalQuoteRef');
      const detailsEl = document.getElementById('modalQuoteDetails');
      
      if (modal && detailsEl) {
        if (refEl) refEl.textContent = quoteRef;
        detailsEl.innerHTML = `
          <div class="space-y-3 text-xs text-slate-300">
            <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div class="flex justify-between"><span>Reference ID:</span> <strong class="text-sky-400 font-mono">${quoteRef}</strong></div>
              <div class="flex justify-between"><span>Category:</span> <strong class="text-white capitalize">${quoteState.category} Insurance</strong></div>
              <div class="flex justify-between"><span>Tier Level:</span> <strong class="text-amber-400 uppercase font-bold">${quoteState.tier} Plan</strong></div>
              <div class="flex justify-between"><span>Applicant Age:</span> <strong class="text-white">${quoteState.age} Years</strong></div>
              <div class="flex justify-between"><span>Coverage Amount:</span> <strong class="text-emerald-400 font-bold">${formatINR(quoteState.sumInsured)}</strong></div>
              <div class="flex justify-between"><span>Covered Individuals:</span> <strong class="text-white">${quoteState.members} Member(s)</strong></div>
            </div>
            <div class="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/60 to-emerald-950/60 border border-sky-500/30 space-y-1.5">
              <div class="flex justify-between text-xs"><span>Monthly Premium:</span> <strong class="text-white text-sm font-bold">${monthlyDisplay ? monthlyDisplay.textContent : '₹799'}</strong></div>
              <div class="flex justify-between text-xs"><span>Annual Premium (10% Off):</span> <strong class="text-emerald-400 text-sm font-bold">${annualDisplay ? annualDisplay.textContent : '₹8,629'}</strong></div>
              <div class="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">Includes 24/7 emergency dispatch, cashless hospital access across 10,000+ centers & digital policy issuance.</div>
            </div>
          </div>
        `;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    });
  }

  // Trigger initial calculation
  updateQuoteMath();
}

// --------------------------------------------------------------------------
// 4. Claims Filing & Live Real-Time Tracker System (INR)
// --------------------------------------------------------------------------
const preloadedClaims = {
  'CLM-883921': {
    id: 'CLM-883921',
    policyId: 'RI-HLT-992014',
    type: 'Health Cashless Admission',
    date: '2026-08-10',
    hospital: 'Apollo Multi-Specialty Hospital, Hyderabad',
    amount: '₹2,84,500',
    stage: 4, // 1: Submitted, 2: Under Review, 3: AI Assessed, 4: Disbursed
    stageName: 'Disbursed to Hospital Account',
    notes: 'Pre-authorization verified via biometric e-KYC. Zero out-of-pocket payment required.'
  },
  'CLM-100201': {
    id: 'CLM-100201',
    policyId: 'RI-AUT-441829',
    type: 'Motor Bumper Damage & Paint',
    date: '2026-08-14',
    hospital: 'Authorized Tata EV / Hyundai Service Hub',
    amount: '₹64,200',
    stage: 3,
    stageName: 'AI Damage Assessment Approved',
    notes: 'Digital photo analysis confirmed front bumper scratch & sensor alignment. Workshop repair underway.'
  },
  'CLM-492019': {
    id: 'CLM-492019',
    policyId: 'RI-HOM-771920',
    type: 'Water Pipe Leakage Property Claim',
    date: '2026-08-17',
    hospital: 'Residential Surveyor Inspection',
    amount: '₹1,25,000',
    stage: 2,
    stageName: 'Under Digital Review',
    notes: 'Plumbing contractor invoices received. Actuary verification scheduled within 4 hours.'
  }
};

function initClaimsTracker() {
  const fileClaimForm = document.getElementById('fileClaimForm');
  const trackClaimForm = document.getElementById('trackClaimForm');
  const searchInput = document.getElementById('searchClaimId');
  const claimResultContainer = document.getElementById('claimStatusResult');

  // Claim Filing wizard
  if (fileClaimForm) {
    fileClaimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const policyId = document.getElementById('claimPolicyId')?.value || 'RI-POL-AUTO';
      const claimType = document.getElementById('claimTypeSelect')?.value || 'Health Medical Claim';
      const incidentDate = document.getElementById('claimDate')?.value || new Date().toISOString().split('T')[0];
      const amountEst = document.getElementById('claimAmountEst')?.value || '₹75,000';
      const desc = document.getElementById('claimDesc')?.value || 'Standard incident claim submission';

      const newClaimId = 'CLM-' + Math.floor(100000 + Math.random() * 900000);
      
      const newClaimObj = {
        id: newClaimId,
        policyId: policyId,
        type: claimType,
        date: incidentDate,
        hospital: 'Designated Network Partner Desk',
        amount: amountEst.startsWith('$') ? amountEst : `$${amountEst}`,
        stage: 2,
        stageName: 'Submitted & Digital Review in Progress',
        notes: desc
      };

      // Save to localStorage
      const userClaims = JSON.parse(localStorage.getItem('riyaz_user_claims') || '{}');
      userClaims[newClaimId] = newClaimObj;
      localStorage.setItem('riyaz_user_claims', JSON.stringify(userClaims));

      showToast(`Claim successfully submitted! Reference Code: ${newClaimId}`, 'success');
      
      // Auto-render into tracker
      renderClaimDetails(newClaimObj);
      fileClaimForm.reset();
      
      const previewBox = document.getElementById('fileUploadPreview');
      if (previewBox) previewBox.classList.add('hidden');
    });
  }

  // Track Claim by ID
  if (trackClaimForm) {
    trackClaimForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const queryId = searchInput.value.trim().toUpperCase();
      if (!queryId) {
        showToast('Please enter a valid Claim ID (e.g. CLM-883921)', 'warning');
        return;
      }

      const userClaims = JSON.parse(localStorage.getItem('riyaz_user_claims') || '{}');
      const foundClaim = userClaims[queryId] || preloadedClaims[queryId];

      if (foundClaim) {
        renderClaimDetails(foundClaim);
        showToast(`Claim records retrieved for ${queryId}`, 'success');
      } else {
        showToast(`No active claim found for ID "${queryId}". Try demo ID "CLM-883921" or "CLM-100201".`, 'error');
      }
    });
  }

  function renderClaimDetails(claim) {
    if (!claimResultContainer) return;
    claimResultContainer.classList.remove('hidden');

    const idEl = document.getElementById('trackedClaimId');
    const policyEl = document.getElementById('trackedPolicyId');
    const typeEl = document.getElementById('trackedType');
    const dateEl = document.getElementById('trackedDate');
    const amountEl = document.getElementById('trackedAmount');
    const stageEl = document.getElementById('trackedStage');
    const notesEl = document.getElementById('trackedNotes');
    const progressBar = document.getElementById('claimProgressBar');

    if (idEl) idEl.textContent = claim.id;
    if (policyEl) policyEl.textContent = claim.policyId;
    if (typeEl) typeEl.textContent = claim.type;
    if (dateEl) dateEl.textContent = claim.date;
    if (amountEl) amountEl.textContent = claim.amount;
    if (stageEl) stageEl.textContent = claim.stageName;
    if (notesEl) notesEl.textContent = claim.notes;

    // Timeline step pills
    const step1 = document.getElementById('claimStep1');
    const step2 = document.getElementById('claimStep2');
    const step3 = document.getElementById('claimStep3');
    const step4 = document.getElementById('claimStep4');

    const steps = [step1, step2, step3, step4];
    steps.forEach((st, idx) => {
      if (!st) return;
      if (idx + 1 <= claim.stage) {
        st.classList.add('bg-emerald-500', 'text-slate-950', 'border-emerald-400');
        st.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-700');
      } else {
        st.classList.remove('bg-emerald-500', 'text-slate-950', 'border-emerald-400');
        st.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700');
      }
    });

    if (progressBar) {
      const percentage = (claim.stage / 4) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    claimResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// --------------------------------------------------------------------------
// 5. Image / Photo Upload Simulation Preview
// --------------------------------------------------------------------------
function initPhotoPreview() {
  const photoInput = document.getElementById('claimDocumentUpload');
  const previewBox = document.getElementById('fileUploadPreview');
  const previewImg = document.getElementById('filePreviewImg');
  const previewName = document.getElementById('filePreviewName');

  if (photoInput && previewBox && previewImg) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          previewImg.src = evt.target.result;
          if (previewName) previewName.textContent = file.name;
          previewBox.classList.remove('hidden');
          showToast(`Photo attachment "${file.name}" uploaded successfully`, 'success');
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// --------------------------------------------------------------------------
// 6. Intelligent 24/7 AI Assistant ("Riyaz AI Bot")
// --------------------------------------------------------------------------
function initChatbot() {
  const toggleBtn = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('closeChatbot');
  const chatForm = document.getElementById('chatbotForm');
  const chatInput = document.getElementById('chatbotInput');
  const chatMessages = document.getElementById('chatbotMessages');
  const chimeToggle = document.getElementById('botSoundToggle');

  let soundEnabled = true;

  // Synthesized Web Audio soft chime (zero external assets needed)
  function playSoftChime() {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio context may be restricted by autoplay policy until interaction
    }
  }

  if (chimeToggle) {
    chimeToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      chimeToggle.innerHTML = soundEnabled ? '<i data-lucide="volume-2" class="w-3.5 h-3.5 text-emerald-400"></i>' : '<i data-lucide="volume-x" class="w-3.5 h-3.5 text-slate-500"></i>';
      if (window.lucide) lucide.createIcons();
      showToast(`Chat chime sound ${soundEnabled ? 'Enabled' : 'Muted'}`, 'info');
    });
  }

  if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      if (!chatWindow.classList.contains('hidden') && chatInput) {
        chatInput.focus();
        playSoftChime();
      }
    });
  }

  if (closeBtn && chatWindow) {
    closeBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));
  }

  // Quick Chips Inside Chat
  document.addEventListener('click', (e) => {
    if (e.target.closest('.chat-quick-chip')) {
      const chip = e.target.closest('.chat-quick-chip');
      const query = chip.dataset.query || chip.textContent.trim();
      if (chatInput) {
        chatInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  const knowledgeBase = [
    {
      keywords: ['quote', 'price', 'cost', 'premium', 'estimate', 'calculate'],
      reply: "You can calculate instant quote estimates in 60 seconds with our interactive Calculator! Health plans start from ₹499/mo, Auto from ₹799/mo, Term Life from ₹499/mo, and bundled multi-plans offer up to 20% annual savings. Click <a href='quote.html' class='text-sky-400 underline font-semibold'>here to calculate now</a>."
    },
    {
      keywords: ['claim', 'track', 'status', 'file', 'reimbursement', 'cashless'],
      reply: "Riyaz Insurance boasts a 99.8% claim approval ratio with instant cashless settlement across 10,000+ hospitals. You can file or track a claim in under 2 minutes at our <a href='claims.html' class='text-emerald-400 underline font-semibold'>Claims Center</a>. Try searching ID 'CLM-883921' to test!"
    },
    {
      keywords: ['health', 'medical', 'hospital', 'doctor', 'illness', 'maternity'],
      reply: "Our Comprehensive Health Shield includes cashless admission across premier hospitals in India, zero copay, critical illness lump-sum payout, and pre/post-hospitalization care. View all tiers on our <a href='products.html#health' class='text-sky-400 underline font-semibold'>Products Page</a>."
    },
    {
      keywords: ['auto', 'car', 'vehicle', 'bike', 'motor', 'accident'],
      reply: "Riyaz Motor Auto & EV Protection covers zero-depreciation repair, battery surge cover, 24/7 roadside assistance, and instant digital surveyor payout within 3 hours!"
    },
    {
      keywords: ['shaik', 'riyaz', 'founder', 'ceo', 'leadership', 'about'],
      reply: "Riyaz is the visionary Founder & CEO of SecureLife Insurance / Riyaz Insurance Co. He founded the company with a tech-first philosophy: 100% digital assurance, zero paper friction, and compassionate claims support."
    },
    {
      keywords: ['contact', 'call', 'phone', 'support', 'number', 'helpline', 'email'],
      reply: "Our 24/7 Helpline is active at <strong>+91 (40) 6699-RIYAZ</strong> or Toll-Free <strong>1800-555-RIYAZ</strong>. You can also email <code>support@riyazinsurance.com</code> or visit our <a href='contact.html' class='text-sky-400 underline font-semibold'>Contact Page</a>."
    },
    {
      keywords: ['portal', 'login', 'id card', 'card', 'policy number', 'download'],
      reply: "You can view your active insurance policies, flip your 3D digital ID card, pay renewal premiums, and download 80D tax certificates in the <a href='portal.html' class='text-purple-400 underline font-semibold'>Customer Portal</a>."
    }
  ];

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      appendChatMessage(userText, 'user');
      chatInput.value = '';

      // Typing indicator
      const typingId = 'typingIndicator_' + Date.now();
      const typingEl = document.createElement('div');
      typingEl.id = typingId;
      typingEl.className = 'flex justify-start mb-3';
      typingEl.innerHTML = `
        <div class="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style="animation-delay:0.2s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style="animation-delay:0.4s"></span>
          <span class="ml-1 text-[11px] text-slate-400">Riyaz AI is thinking...</span>
        </div>
      `;
      chatMessages.appendChild(typingEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        const foundTyping = document.getElementById(typingId);
        if (foundTyping) foundTyping.remove();

        let matchedReply = "Thanks for reaching out! As your Riyaz AI Assistant, I can assist you with quote calculations in Rupees (₹), claim filings, hospital networks, and policy renewals. How may I help you?";
        const lower = userText.toLowerCase();

        for (const item of knowledgeBase) {
          if (item.keywords.some(kw => lower.includes(kw))) {
            matchedReply = item.reply;
            break;
          }
        }

        appendChatMessage(matchedReply, 'bot');
        playSoftChime();
      }, 550);
    });
  }

  function appendChatMessage(htmlText, sender) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;
    
    msgDiv.innerHTML = `
      <div class="${sender === 'user' ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl rounded-tl-none'} px-4 py-3 max-w-[85%] text-xs shadow-lg leading-relaxed">
        ${sender === 'bot' ? '<div class="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Riyaz AI Assistant</div>' : ''}
        <div>${htmlText}</div>
        <div class="text-[9px] text-slate-400 mt-1 text-right">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// --------------------------------------------------------------------------
// 7. Member Customer Portal & Digital ID Card Controller
// --------------------------------------------------------------------------
function initCustomerPortal() {
  const loginForm = document.getElementById('portalLoginForm');
  const loginGate = document.getElementById('portalLoginCard');
  const portalDashboard = document.getElementById('portalDashboard');
  const logoutBtn = document.getElementById('portalLogoutBtn');
  const demoLoginBtn = document.getElementById('demoLoginBtn');

  // Digital ID Card Flip
  const flipCardTrigger = document.getElementById('flipCardBtn');
  const digitalCardContainer = document.getElementById('digitalInsuranceCard');

  if (flipCardTrigger && digitalCardContainer) {
    flipCardTrigger.addEventListener('click', () => {
      digitalCardContainer.classList.toggle('is-flipped');
    });
  }

  // Print Digital ID Card
  const printCardBtn = document.getElementById('printCardBtn');
  if (printCardBtn) {
    printCardBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Authentication simulation
  function performLogin(name = 'Shaik Riyaz', email = 'shaik.riyaz@riyazinsurance.com') {
    if (loginGate) loginGate.classList.add('hidden');
    if (portalDashboard) portalDashboard.classList.remove('hidden');
    
    const userNameEl = document.getElementById('portalMemberName');
    const userEmailEl = document.getElementById('portalMemberEmail');
    if (userNameEl) userNameEl.textContent = name;
    if (userEmailEl) userEmailEl.textContent = email;

    showToast(`Welcome back, ${name}! Policy dashboard active.`, 'success');
  }

  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => performLogin());
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value || 'shaik.riyaz@riyazinsurance.com';
      performLogin('Shaik Riyaz', email);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (portalDashboard) portalDashboard.classList.add('hidden');
      if (loginGate) loginGate.classList.remove('hidden');
      showToast('Logged out of Customer Portal successfully', 'info');
    });
  }

  // Portal Sub-Tab Switching
  const portalTabBtns = document.querySelectorAll('.portal-tab-btn');
  const portalTabPanes = document.querySelectorAll('.portal-tab-pane');

  portalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      portalTabBtns.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-400');
      });
      btn.classList.add('bg-sky-600', 'text-white');
      btn.classList.remove('bg-slate-900', 'text-slate-400');

      portalTabPanes.forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
    });
  });

  // Premium Payment Modal Simulation
  const payPremiumBtns = document.querySelectorAll('.pay-premium-btn');
  const paymentModal = document.getElementById('paymentModal');
  const closePayModal = document.getElementById('closePaymentModal');
  const paymentForm = document.getElementById('paymentCheckoutForm');

  payPremiumBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const policyName = btn.dataset.policy || 'Motor Auto EV Zero-Dep Shield';
      const amount = btn.dataset.amount || '₹999.00';
      
      const modalPolicy = document.getElementById('payModalPolicyName');
      const modalAmount = document.getElementById('payModalAmount');
      if (modalPolicy) modalPolicy.textContent = policyName;
      if (modalAmount) modalAmount.textContent = amount;

      if (paymentModal) {
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
      }
    });
  });

  if (closePayModal && paymentModal) {
    closePayModal.addEventListener('click', () => {
      paymentModal.classList.add('hidden');
      paymentModal.classList.remove('flex');
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const receiptNo = 'RCP-' + Math.floor(100000 + Math.random() * 900000);
      if (paymentModal) {
        paymentModal.classList.add('hidden');
        paymentModal.classList.remove('flex');
      }
      showToast(`Payment of ₹999 Successful! Receipt generated: ${receiptNo}. Policy renewed for 1 year.`, 'success');
    });
  }

  // Endorsement Update Nominee / Details
  const endorseForm = document.getElementById('endorsementForm');
  if (endorseForm) {
    endorseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nomineeName = document.getElementById('endorseNomineeName')?.value;
      showToast(`Policy records updated! Nominee set to ${nomineeName}.`, 'success');
      endorseForm.reset();
    });
  }
}

// --------------------------------------------------------------------------
// 8. Chart.js Multi-Policy Bundle Savings Visualizer (INR)
// --------------------------------------------------------------------------
function initSavingsChart() {
  const canvas = document.getElementById('savingsChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const savingsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Health + Auto EV', 'Health + Home', 'All-In-One Triple Bundle', 'Enterprise Corporate Shield'],
      datasets: [
        {
          label: 'Traditional Provider (₹/yr)',
          data: [42000, 36000, 68000, 115000],
          backgroundColor: 'rgba(244, 63, 94, 0.75)',
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 8
        },
        {
          label: 'Riyaz Unified Bundle (₹/yr)',
          data: [26500, 22800, 43900, 78000],
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#38bdf8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        y: {
          ticks: { 
            color: '#94a3b8', 
            callback: (val) => val >= 100000 ? `₹${val/100000}L` : `₹${val/1000}k` 
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      }
    }
  });

  // Tenure switcher (1-Year, 3-Year, 5-Year)
  const tenureBtns = document.querySelectorAll('.savings-tenure-btn');
  tenureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tenureBtns.forEach(b => b.classList.remove('bg-sky-600', 'text-white'));
      btn.classList.add('bg-sky-600', 'text-white');
      
      const multiplier = parseInt(btn.dataset.years || '1');
      savingsChartInstance.data.datasets[0].data = [42000 * multiplier, 36000 * multiplier, 68000 * multiplier, 115000 * multiplier];
      savingsChartInstance.data.datasets[1].data = [26500 * multiplier, 22800 * multiplier, 43900 * multiplier, 78000 * multiplier];
      savingsChartInstance.update();
      
      showToast(`Visualizing ${multiplier}-Year cumulative savings comparison in Rupees (₹)`, 'info');
    });
  });
}

// --------------------------------------------------------------------------
// 9. Knowledge Base & Insurance Blog System
// --------------------------------------------------------------------------
const blogArticlesData = {
  'article-1': {
    title: 'Top 7 Things You Must Know Before Choosing a Family Health Plan in 2026',
    author: 'Dr. Ayesha Khan (Chief Medical Underwriting Officer)',
    date: 'August 18, 2026',
    readTime: '5 min read',
    category: 'Health Protection',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
    content: `
      <p class="leading-relaxed mb-4">When choosing family health protection in India, evaluating hospital network depth and cashless claim settlement velocity is far more crucial than simply hunting for the lowest monthly premium.</p>
      <h4 class="text-base font-bold text-white mb-2">1. Look for Zero Sub-limits on Room Rent</h4>
      <p class="leading-relaxed mb-4">Many conventional insurers impose a 1% daily room rent cap, causing proportionate deductions across surgery, doctor fees, and ICU expenses. At Riyaz Insurance, all Gold and Diamond tiers provide single-private room eligibility with zero proportionate deductions.</p>
      <h4 class="text-base font-bold text-white mb-2">2. Check Restoration of Sum Insured</h4>
      <p class="leading-relaxed mb-4">If multiple family members get hospitalized in a single policy year, automatic 100% restoration ensures your coverage never runs out mid-treatment.</p>
      <h4 class="text-base font-bold text-white mb-2">3. Digital Cashless Pre-Authorizations</h4>
      <p class="leading-relaxed mb-4">With Shaik Riyaz Assurance biometric e-KYC desk, admissions are approved directly through our mobile portal in under 15 minutes without paying cash deposits.</p>
    `
  },
  'article-2': {
    title: 'Electric Vehicles & Battery Insurance: Complete Protection Guide',
    author: 'Rajesh Varma (VP Automotive & Mobility Underwriting)',
    date: 'August 14, 2026',
    readTime: '4 min read',
    category: 'Motor Auto',
    image: 'https://images.unsplash.com/photo-1558441719-ef048974a9bd?auto=format&fit=crop&w=1000&q=80',
    content: `
      <p class="leading-relaxed mb-4">Electric vehicles require distinct insurance consideration compared to internal combustion engines. Over 60% of an EV's valuation resides in its high-voltage lithium battery pack and sensor computing suite.</p>
      <h4 class="text-base font-bold text-white mb-2">1. Specialized Battery Pack Add-On</h4>
      <p class="leading-relaxed mb-4">Ensure water ingress and consequential battery surge damage are explicitly covered under your zero-depreciation rider.</p>
      <h4 class="text-base font-bold text-white mb-2">2. Portable Charging Cable & Home Wallbox Protection</h4>
      <p class="leading-relaxed mb-4">Riyaz Auto Elite covers theft and short-circuit damage to your wallbox charger and roadside fast-charging cables.</p>
    `
  },
  'article-3': {
    title: 'How Founder Riyaz Built AI-Powered Claim Approvals Under 15 Minutes',
    author: 'Editorial Tech Desk',
    date: 'August 10, 2026',
    readTime: '6 min read',
    category: 'Technology & AI',
    image: 'riyaz_founder.jpg',
    content: `
      <p class="leading-relaxed mb-4">"Insurance was originally invented as a safety net of mutual human trust, but bureaucratic paperwork turned it into a stressful barrier," explains Riyaz, founder of SecureLife / Riyaz Insurance.</p>
      <p class="leading-relaxed mb-4">By employing computer vision algorithms that assess vehicle collision photos and optical character recognition for hospital billing records, over 82% of standard retail claims are verified and authorized within minutes.</p>
    `
  }
};

function initBlogSystem() {
  const searchInput = document.getElementById('blogSearchInput');
  const blogCards = document.querySelectorAll('.blog-card');
  const categoryChips = document.querySelectorAll('.blog-category-chip');
  const articleModal = document.getElementById('articleModal');
  const closeArticleBtn = document.getElementById('closeArticleModal');
  const modalContentEl = document.getElementById('modalArticleBody');
  const modalTitleEl = document.getElementById('modalArticleTitle');
  const modalMetaEl = document.getElementById('modalArticleMeta');
  const modalImgEl = document.getElementById('modalArticleImg');

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      blogCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        const cat = card.dataset.category?.toLowerCase() || '';
        if (title.includes(q) || desc.includes(q) || cat.includes(q)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // Category filter
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => {
        c.classList.remove('bg-sky-600', 'text-white');
        c.classList.add('bg-slate-900', 'text-slate-400');
      });
      chip.classList.add('bg-sky-600', 'text-white');
      chip.classList.remove('bg-slate-900', 'text-slate-400');

      const selectedCat = chip.dataset.category;
      blogCards.forEach(card => {
        if (selectedCat === 'all' || card.dataset.category === selectedCat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Open Full Article Modal
  document.addEventListener('click', (e) => {
    const readBtn = e.target.closest('.read-article-btn');
    if (readBtn && articleModal) {
      const articleKey = readBtn.dataset.article || 'article-1';
      const article = blogArticlesData[articleKey] || blogArticlesData['article-1'];

      if (modalTitleEl) modalTitleEl.textContent = article.title;
      if (modalMetaEl) modalMetaEl.textContent = `${article.author} • ${article.date} • ${article.readTime}`;
      if (modalImgEl) modalImgEl.src = article.image;
      if (modalContentEl) modalContentEl.innerHTML = article.content;

      articleModal.classList.remove('hidden');
      articleModal.classList.add('flex');
    }
  });

  if (closeArticleBtn && articleModal) {
    closeArticleBtn.addEventListener('click', () => {
      articleModal.classList.add('hidden');
      articleModal.classList.remove('flex');
    });
  }

  // Bookmark article
  document.addEventListener('click', (e) => {
    const bmBtn = e.target.closest('.bookmark-article-btn');
    if (bmBtn) {
      bmBtn.classList.toggle('text-amber-400');
      const isSaved = bmBtn.classList.contains('text-amber-400');
      showToast(isSaved ? 'Article saved to your reading bookmarks' : 'Article removed from bookmarks', 'info');
    }
  });
}

// --------------------------------------------------------------------------
// 10. Interactive Branch Office Locator
// --------------------------------------------------------------------------
const branchOffices = {
  hyderabad: {
    city: 'Hyderabad Global Headquarters',
    address: 'SecureLife & Riyaz Assurance Tower, Financial District, Gachibowli, Hyderabad 500032',
    phone: '+91 (40) 6699-RIYAZ (74929)',
    head: 'Riyaz (CEO & Founder)',
    headPhoto: 'riyaz_founder.jpg',
    officePhoto: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM IST (Emergency 24/7 Desk)'
  },
  mumbai: {
    city: 'Mumbai Financial Services Hub',
    address: 'Bandra Kurla Complex (BKC), One International Centre, Mumbai 400051',
    phone: '+91 22 555-RIYAZ',
    head: 'Sarah Jenkins (VP Commercial Underwriting)',
    headPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    officePhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    hours: 'Mon - Fri: 9:30 AM - 6:30 PM IST'
  },
  dubai: {
    city: 'Dubai International Center (MENA Hub)',
    address: 'DIFC Gate Tower 4, Sheikh Zayed Road, Dubai, UAE',
    phone: '+971 4 555-RIYAZ',
    head: 'Tariq Al-Mansoor (Director MENA Claims)',
    headPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    officePhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    hours: 'Mon - Fri: 8:00 AM - 6:00 PM GST'
  },
  london: {
    city: 'London European Operations',
    address: '30 St Mary Axe (The Gherkin), City of London, EC3A 8EP, UK',
    phone: '+44 20 7946 0912',
    head: 'David Sterling (Head of Actuarial Risk)',
    headPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    officePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    hours: 'Mon - Fri: 8:30 AM - 5:30 PM GMT'
  }
};

function initBranchLocator() {
  const branchBtns = document.querySelectorAll('.branch-selector-btn');
  const cityEl = document.getElementById('branchCityName');
  const addressEl = document.getElementById('branchAddress');
  const phoneEl = document.getElementById('branchPhone');
  const headNameEl = document.getElementById('branchHeadName');
  const headPhotoEl = document.getElementById('branchHeadPhoto');
  const officePhotoEl = document.getElementById('branchOfficePhoto');
  const hoursEl = document.getElementById('branchHours');

  branchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const branchKey = btn.dataset.branch || 'hyderabad';
      const branch = branchOffices[branchKey] || branchOffices.hyderabad;

      branchBtns.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white', 'border-sky-500');
        b.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      });
      btn.classList.add('bg-sky-600', 'text-white', 'border-sky-500');
      btn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');

      if (cityEl) cityEl.textContent = branch.city;
      if (addressEl) addressEl.textContent = branch.address;
      if (phoneEl) phoneEl.textContent = branch.phone;
      if (headNameEl) headNameEl.textContent = branch.head;
      if (headPhotoEl) headPhotoEl.src = branch.headPhoto;
      if (officePhotoEl) officePhotoEl.src = branch.officePhoto;
      if (hoursEl) hoursEl.textContent = branch.hours;

      showToast(`Loaded details for ${branch.city}`, 'info');
    });
  });
}

// --------------------------------------------------------------------------
// 11. Modals Global Escape & Click-Outside Handler
// --------------------------------------------------------------------------
function initModals() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.fixed.z-50:not(.hidden)');
      openModals.forEach(m => {
        if (m.id !== 'chatbotWindow' && m.id !== 'toastContainer') {
          m.classList.add('hidden');
          m.classList.remove('flex');
        }
      });
    }
  });

  const closeQuoteModal = document.getElementById('closeQuoteModal');
  const quoteModal = document.getElementById('quoteSummaryModal');
  if (closeQuoteModal && quoteModal) {
    closeQuoteModal.addEventListener('click', () => {
      quoteModal.classList.add('hidden');
      quoteModal.classList.remove('flex');
    });
  }
}

// --------------------------------------------------------------------------
// 12. Contact Form & Appointment Scheduler
// --------------------------------------------------------------------------
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const callbackForm = document.getElementById('callbackSchedulerForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || 'Valued Customer';
      const email = document.getElementById('contactEmail')?.value || '';
      showToast(`Thank you, ${name}! Your inquiry has been routed to the Shaik Riyaz advisory desk. We will respond to ${email} within 15 minutes.`, 'success');
      contactForm.reset();
    });
  }

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const timeSlot = document.getElementById('callbackTimeSlot')?.value || 'Immediate 10-Min Call';
      showToast(`Priority Callback Booked for ${timeSlot}! An insurance specialist will contact you.`, 'success');
      callbackForm.reset();
    });
  }
}
