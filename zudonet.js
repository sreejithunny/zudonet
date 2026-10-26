
/* ==========================================================
   WAV AUDIO ENGINE & LOGO VIDEO CONTROLLER
   ========================================================== */
class ZudonetWavAudioEngine {
  constructor() {
    this.clickSoundSrc = 'website.wav';
    this.chimeSoundSrc = 'web2.wav';
    this.isMuted = false;
    this.audioPool = [];
    this.poolSize = 6;
    this.initPool();
  }

  initPool() {
    for (let i = 0; i < this.poolSize; i++) {
      const a = new Audio(this.clickSoundSrc);
      a.preload = 'auto';
      this.audioPool.push(a);
    }
    this.chimeAudio = new Audio(this.chimeSoundSrc);
    this.chimeAudio.preload = 'auto';
  }

  playClick() {
    if (this.isMuted) return;
    try {
      // Find an available audio element or create clone
      let audio = this.audioPool.find(a => a.paused || a.ended);
      if (!audio) {
        audio = new Audio(this.clickSoundSrc);
      }
      audio.currentTime = 0;
      audio.volume = 0.65;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }

  playChime() {
    if (this.isMuted) return;
    try {
      const chime = new Audio(this.chimeSoundSrc);
      chime.volume = 0.75;
      const p = chime.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }
}

const zudoWav = new ZudonetWavAudioEngine();

// Global click sound on ALL interactive options
document.addEventListener('click', (e) => {
  const interactiveTarget = e.target.closest('a, button, input[type="submit"], .filter-tab-btn, .faq-question, .faq-item, .brand-logo, .btn, .nav-links a, .service-deepdive-item, .showcase-item-extended, .process-step-card, .frame-mini-card');
  if (interactiveTarget) {
    zudoWav.playClick();
  }
}, true);

/* Intro Video Controller */
const zudonetIntroController = {
  hasPlayedThisSession: false,

  init() {
    const overlay = document.getElementById('zudonetIntroOverlay');
    const video = document.getElementById('zudonetIntroVideo');
    if (!overlay || !video) return;

    // Check if user already skipped or watched in this session
    const seen = sessionStorage.getItem('zudo_intro_seen');
    if (seen) {
      overlay.style.display = 'none';
      return;
    }

    // Play intro video on open
    overlay.style.display = 'flex';
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Autoplay policy fallback: show with play button
        const playBtn = document.getElementById('introPlayPrompt');
        if (playBtn) playBtn.style.display = 'inline-flex';
      });
    }

    // When video ends, smoothly dismiss
    video.onended = () => {
      this.closeIntro();
    };
  },

  closeIntro() {
    const overlay = document.getElementById('zudonetIntroOverlay');
    const video = document.getElementById('zudonetIntroVideo');
    if (overlay) {
      overlay.classList.add('intro-fade-out');
      setTimeout(() => {
        overlay.style.display = 'none';
        sessionStorage.setItem('zudo_intro_seen', 'true');
        zudoWav.playChime();
      }, 500);
    }
    if (video) {
      video.pause();
    }
  },

  replayIntro() {
    const overlay = document.getElementById('zudonetIntroOverlay');
    const video = document.getElementById('zudonetIntroVideo');
    if (!overlay || !video) return;
    overlay.classList.remove('intro-fade-out');
    overlay.style.display = 'flex';
    video.currentTime = 0;
    video.play().catch(() => {});
    zudoWav.playClick();
  }
};

window.addEventListener('DOMContentLoaded', () => {
  zudonetIntroController.init();
});

/* ==========================================================
   ZUDONET TECHNOLOGIES - SHARED CORE SCRIPT
   - Modern Robotic Audio Synthesizer (Web Audio API)
   - Advanced Cybernetic Cursor (Tracking Ring + Dot + Shockwave)
   - Direct WhatsApp Integration (+91 9072103103)
   - Book Appointment & Lead Form to Google Sheets
   - Studio Admin Portal (Ctrl+Shift+A)
   ========================================================== */

// Global Configuration
const ZUDONET_CONFIG = {
  brandName: 'Zudonet',
  domain: 'www.zudonet.com',
  ownerWhatsApp: '919072103103',
  ownerEmail: 'sreejithu@gmail.com',
  googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbx4fKGnM4lZ94hRpzMEQi7isHmB5PbLaT0choAl9mFJe0MZbOKiTtydlqDUQqJCardQnA/exec',
  leadsStorageKey: 'zudonet_leads'
};

/* ==========================================================
   1. MODERN ROBOTIC AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================================== */
class ZudonetMusicalAudio {
  constructor() {
    this.ctx = null;
    this.isUnlocked = false;
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  // Modern Futuristic Robotic UI Click Sound (Dual Oscillator FM chirp + metal transient)
  playRoboticClick() {
    this.unlock();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Primary metallic robotic click (FM swept square/sawtooth)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1480, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.042);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(680, now + 0.042);
      filter.Q.value = 4.2;

      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.052);

      // 2. High-Frequency Cyber Sub-Pulse (Transistor digital snap)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(2600, now + 0.008);
      osc2.frequency.setValueAtTime(1850, now + 0.022);

      gain2.gain.setValueAtTime(0.04, now + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.008);
      osc2.stop(now + 0.045);
    } catch (e) {}
  }

  // Melodic Arpeggio when clicking key highlights
  playOptionMusic() {
    zudoWav.playClick();
  }

  // Navigation Chime
  playNavChime() {
    zudoWav.playClick();
  }

  // Accordion Toggle
  playAccordionMusic() {
    zudoWav.playClick();
  }

  // Standard Click
  playAIClick() {
    zudoWav.playClick();
  }

  // Success Fanfare for booked appointment & ticket generation
  playSuccessFanfare() {
    this.unlock();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.06));

        gain.gain.setValueAtTime(0.08, now + (idx * 0.06));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.06) + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + (idx * 0.06));
        osc.stop(now + (idx * 0.06) + 0.48);
      });
    } catch (e) {}
  }
}

const zudoAudio = new ZudonetMusicalAudio();

/* ==========================================================
   2. ADVANCED CYBERNETIC CURSOR (RING + LASER DOT + SHOCKWAVE)
   ========================================================== */
class ZudonetTechCursor {
  constructor() {
    this.dot = null;
    this.ring = null;
    this.mouseX = -200;
    this.mouseY = -200;
    this.ringX = -200;
    this.ringY = -200;
    this.rafId = null;
    this.init();
  }

  init() {
    // Only initialize on desktop/fine-pointer devices. Mobile touch stays native.
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      return;
    }

    this.dot = document.createElement('div');
    this.dot.className = 'tech-cursor-dot';
    this.ring = document.createElement('div');
    this.ring.className = 'tech-cursor-ring';

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);

    // Track mouse coordinates with passive listener
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
    }, { passive: true });

    // Interactive element hover tracking
    const targetSelectors = 'a, button, input, textarea, select, .btn, .service-card, .model-card, .faq-item, .filter-tab-btn, .showcase-item-extended, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(targetSelectors)) {
        this.ring.classList.add('hovered');
        this.dot.classList.add('hovered');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(targetSelectors)) {
        this.ring.classList.remove('hovered');
        this.dot.classList.remove('hovered');
      }
    });

    // Robotic shockwave wave on click
    document.addEventListener('mousedown', (e) => {
      this.ring.classList.add('clicking');
      this.createShockwave(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
      this.ring.classList.remove('clicking');
    });

    // Smooth fluid physics loop (lerp)
    const tick = () => {
      const ease = 0.18;
      this.ringX += (this.mouseX - this.ringX) * ease;
      this.ringY += (this.mouseY - this.ringY) * ease;
      this.ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
      this.rafId = requestAnimationFrame(tick);
    };
    tick();
  }

  createShockwave(x, y) {
    const wave = document.createElement('div');
    wave.className = 'tech-click-wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 550);
  }
}

/* ==========================================================
   3. WHATSAPP DIRECT (CLEAN 1-CLICK LAUNCHER)
   ========================================================== */
class ZudonetWhatsAppPlugin {
  constructor() {
    this.phone = ZUDONET_CONFIG.ownerWhatsApp || '919072103103';
  }

  launchDirectWA(customText) {
    zudoAudio.playRoboticClick();
    const defaultMsg = 'Hello Sreejith, I would like to discuss a project with Zudonet.';
    const encoded = encodeURIComponent(customText || defaultMsg);
    const waUrl = `https://api.whatsapp.com/send?phone=${this.phone}&text=${encoded}`;
    window.open(waUrl, '_blank');
  }
}

const whatsappWidget = new ZudonetWhatsAppPlugin();

/* ==========================================================
   4. HIDDEN STUDIO ADMIN PORTAL (Ctrl+Shift+A or 5 Logo Clicks)
   ========================================================== */
class ZudonetAdminPortal {
  constructor() {
    this.logoClicks = 0;
    this.clickTimer = null;
    this.failedAttempts = parseInt(localStorage.getItem('zudo_adm_fails') || '0', 10);
    this.lockoutUntil = parseInt(localStorage.getItem('zudo_adm_lockout') || '0', 10);
    // SHA-256 hashes for authorized keys: 'admin123' and 'zudonet2026'
    this.validHashes = [
      '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
      'fefc55feb3694eb6c20dfe583e6a16f952fd7a6294623cb449a32ffb0fe85888'  // zudonet2026
    ];
    this.initKeyboardShortcut();
  }

  initKeyboardShortcut() {
    window.addEventListener('keydown', (e) => {
      // Secret developer shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        this.openPortal();
      }
    });
  }

  handleLogoClick() {
    this.logoClicks++;
    clearTimeout(this.clickTimer);
    if (this.logoClicks >= 5) {
      this.logoClicks = 0;
      this.openPortal();
    } else {
      this.clickTimer = setTimeout(() => {
        this.logoClicks = 0;
      }, 1500);
    }
  }

  openPortal() {
    if (typeof zudoWav !== 'undefined') zudoWav.playClick();
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('adminPasscode');
      const errorMsg = document.getElementById('adminLoginError');
      if (errorMsg) errorMsg.style.display = 'none';

      // Check brute force lockout
      const now = Date.now();
      if (this.lockoutUntil && now < this.lockoutUntil) {
        const remainingMinutes = Math.ceil((this.lockoutUntil - now) / 60000);
        if (errorMsg) {
          errorMsg.style.display = 'block';
          errorMsg.textContent = `Security lockout active. Try again in ${remainingMinutes} minute(s).`;
        }
        if (input) input.disabled = true;
      } else {
        if (input) {
          input.disabled = false;
          input.value = '';
          setTimeout(() => input.focus(), 150);
        }
      }
    }
  }

  closePortal() {
    if (typeof zudoWav !== 'undefined') zudoWav.playClick();
    const loginModal = document.getElementById('adminLoginModal');
    const dashModal = document.getElementById('adminDashboardModal');
    if (loginModal) loginModal.classList.remove('active');
    if (dashModal) dashModal.classList.remove('active');
  }

  async sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async verifyPasscode() {
    const input = document.getElementById('adminPasscode');
    const errorMsg = document.getElementById('adminLoginError');
    const now = Date.now();

    if (this.lockoutUntil && now < this.lockoutUntil) {
      const remainingMinutes = Math.ceil((this.lockoutUntil - now) / 60000);
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = `Security lockout active. Please wait ${remainingMinutes} minute(s).`;
      }
      return;
    }

    const code = input ? input.value.trim() : '';
    if (!code) return;

    try {
      const inputHash = await this.sha256(code);
      if (this.validHashes.includes(inputHash)) {
        // Successful authentication
        this.failedAttempts = 0;
        localStorage.removeItem('zudo_adm_fails');
        localStorage.removeItem('zudo_adm_lockout');

        if (typeof zudoWav !== 'undefined') zudoWav.playWeb2();
        if (errorMsg) errorMsg.style.display = 'none';

        const loginModal = document.getElementById('adminLoginModal');
        const dashModal = document.getElementById('adminDashboardModal');
        if (loginModal) loginModal.classList.remove('active');
        if (dashModal) dashModal.classList.add('active');
        this.renderLeads();
      } else {
        // Failed attempt with progressive penalty
        this.failedAttempts++;
        localStorage.setItem('zudo_adm_fails', this.failedAttempts.toString());

        if (typeof zudoWav !== 'undefined') zudoWav.playClick();
        if (errorMsg) {
          errorMsg.style.display = 'block';
          if (this.failedAttempts >= 4) {
            this.lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 min lockout
            localStorage.setItem('zudo_adm_lockout', this.lockoutUntil.toString());
            errorMsg.textContent = 'Too many failed attempts. Security lockout active for 15 minutes.';
            if (input) input.disabled = true;
          } else {
            const left = 4 - this.failedAttempts;
            errorMsg.textContent = `Access denied. Incorrect passcode. (${left} attempt(s) remaining)`;
          }
        }
        if (input && !input.disabled) {
          input.value = '';
          input.focus();
        }
      }
    } catch (e) {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Cryptographic verification unavailable.';
      }
    }
  }

  getLeads() {
    try {
      const stored = localStorage.getItem(ZUDONET_CONFIG.leadsStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  renderLeads() {
    const tbody = document.getElementById('adminLeadsBody');
    const countBadge = document.getElementById('adminLeadCount');
    if (!tbody) return;

    const leads = this.getLeads();
    if (countBadge) countBadge.textContent = `${leads.length} Inquiries`;

    if (leads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 36px;">No recorded client inquiries yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    leads.forEach((lead, idx) => {
      const tr = document.createElement('tr');
      // Secure XSS-safe text nodes
      const tdTicket = document.createElement('td');
      tdTicket.innerHTML = `<span class="ticket-pill">${this.sanitize(lead.ticketId || '#APT-' + idx)}</span>`;
      
      const tdName = document.createElement('td');
      tdName.textContent = lead.name || 'Anonymous';

      const tdEmail = document.createElement('td');
      tdEmail.textContent = lead.email || '—';

      const tdPhone = document.createElement('td');
      tdPhone.textContent = lead.contact_number || '—';

      const tdScope = document.createElement('td');
      tdScope.style.maxWidth = '240px';
      tdScope.textContent = (lead.message || '').substring(0, 75) + ((lead.message || '').length > 75 ? '...' : '');

      const tdDate = document.createElement('td');
      tdDate.style.fontSize = '0.8rem';
      tdDate.textContent = lead.timestamp || '—';

      const tdAction = document.createElement('td');
      if (lead.contact_number) {
        const cleanPhone = (lead.contact_number || '').replace(/[^0-9]/g, '');
        const waLink = document.createElement('a');
        waLink.href = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=Hello%20${encodeURIComponent(lead.name || '')},%20following%20up%20on%20your%20Zudonet%20appointment%20request%20${encodeURIComponent(lead.ticketId || '')}.`;
        waLink.target = '_blank';
        waLink.className = 'btn btn-secondary';
        waLink.style.cssText = 'padding: 4px 10px; font-size: 0.78rem; gap: 4px;';
        waLink.innerHTML = '<i class="fa-brands fa-whatsapp" style="color:#10b981;"></i> Reply';
        tdAction.appendChild(waLink);
      } else {
        tdAction.textContent = '—';
      }

      tr.appendChild(tdTicket);
      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdPhone);
      tr.appendChild(tdScope);
      tr.appendChild(tdDate);
      tr.appendChild(tdAction);
      tbody.appendChild(tr);
    });
  }

  sanitize(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  exportCSV() {
    const leads = this.getLeads();
    if (leads.length === 0) {
      alert('No inquiries available to export.');
      return;
    }
    const headers = ['Ticket ID', 'Name', 'Email', 'Contact Number', 'Preferred Time', 'Message', 'Timestamp'];
    const rows = leads.map(l => [
      `"${(l.ticketId || '').replace(/"/g, '""')}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.contact_number || '').replace(/"/g, '""')}"`,
      `"${(l.preferred_time || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.timestamp || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zudonet_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const adminPortal = new ZudonetAdminPortal();

/* ==========================================================
   5. BOOK APPOINTMENT & LEAD CONTROLLER (TRANSFERS TO GOOGLE SHEETS)
   ========================================================== */
class ZudonetLeadController {
  constructor() {
    this.form = document.getElementById('submit-to-google-sheet') || document.getElementById('appointmentForm') || document.getElementById('projectInquiryForm');
    this.btn = document.getElementById('submitBtn') || (this.form ? this.form.querySelector('button[type="submit"]') : null);
    this.btnText = document.getElementById('btnText');
    this.successBox = document.getElementById('formSuccessBox');
    this.lastSubmitTime = 0;
    this.init();
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  sanitize(str) {
    if (!str) return '';
    return String(str)
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (typeof zudoWav !== 'undefined') zudoWav.playClick();

    // 1. Anti-Bot Honeypot Trap
    const honeypot = this.form.elements['b_trap_val'] || document.getElementById('b_trap_val');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Bot submission blocked.');
      // Silently pretend success to confuse automated scrapers
      if (this.successBox) {
        if (this.form) this.form.style.display = 'none';
        this.successBox.style.display = 'block';
      }
      return;
    }

    // 2. Client-Side Rate-Limiting (Prevents rapid submission spamming)
    const now = Date.now();
    if (now - this.lastSubmitTime < 25000) {
      alert('Please wait a few seconds before submitting another request.');
      return;
    }

    // Extract & sanitize all fields
    const nameEl = this.form.elements['name'] || document.getElementById('name') || document.getElementById('clientName');
    const emailEl = this.form.elements['email'] || document.getElementById('email') || document.getElementById('clientEmail');
    const phoneEl = this.form.elements['contact_number'] || document.getElementById('contact_number') || document.getElementById('contactNumber');
    const timeEl = this.form.elements['preferred_time'] || document.getElementById('preferred_time');
    const msgEl = this.form.elements['message'] || document.getElementById('message') || document.getElementById('projectScope');
    const exEl = this.form.elements['ex'] || document.getElementById('ex') || document.getElementById('termsCheck');

    const name = this.sanitize(nameEl ? nameEl.value : '');
    const email = this.sanitize(emailEl ? emailEl.value : '');
    const contactNumber = this.sanitize(phoneEl ? phoneEl.value : '');
    const preferredTime = this.sanitize(timeEl ? timeEl.value : 'As soon as possible');
    const message = this.sanitize(msgEl ? msgEl.value : '');

    if (!name || !message) {
      if (typeof swal !== 'undefined') {
        swal('Required Fields', 'Please enter your name and project details.', 'warning');
      } else {
        alert('Please fill in your name and project details.');
      }
      return;
    }

    this.lastSubmitTime = now;
    if (this.btnText) this.btnText.textContent = 'Submitting...';
    if (this.btn) this.btn.disabled = true;

    const ticketId = '#APT-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toLocaleString();

    // Build FormData for backend submission ONLY
    const formData = new FormData();
    formData.append('ticketId', ticketId);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contact_number', contactNumber);
    formData.append('preferred_time', preferredTime);
    formData.append('message', message);
    formData.append('timestamp', timestamp);
    formData.append('ex', (exEl && exEl.checked) ? 'Yes' : 'No');

    // Save sanitized lead to LocalStorage
    try {
      const existing = localStorage.getItem(ZUDONET_CONFIG.leadsStorageKey);
      const leads = existing ? JSON.parse(existing) : [];
      leads.unshift({ ticketId, name, email, contact_number: contactNumber, preferred_time: preferredTime, message, timestamp });
      localStorage.setItem(ZUDONET_CONFIG.leadsStorageKey, JSON.stringify(leads.slice(0, 100)));
    } catch (err) {}

    // Transmit securely to Google Apps Script backend
    try {
      await fetch(ZUDONET_CONFIG.googleAppsScriptUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
    } catch (err) {}

    if (typeof zudoWav !== 'undefined') zudoWav.playWeb2();

    // Show confirmation
    if (typeof swal !== 'undefined') {
      swal({
        title: "Thank You!",
        text: "Thank you for your interest, our team will call you for more details.",
        type: "success",
        confirmButtonText: "Done",
        confirmButtonColor: "#4f46e5"
      });
    }

    if (this.successBox) {
      if (this.form) this.form.style.display = 'none';
      this.successBox.style.display = 'block';
      const ticketDisplay = document.getElementById('successTicketId');
      if (ticketDisplay) ticketDisplay.textContent = ticketId;
    }
  }

  resetForm() {
    if (this.form) {
      this.form.reset();
      this.form.style.display = 'block';
    }
    if (this.successBox) {
      this.successBox.style.display = 'none';
    }
    if (this.btn) this.btn.disabled = false;
    if (this.btnText) this.btnText.textContent = 'Book Appointment';
  }
}

// Mobile Navigation Toggle// Mobile Navigation Toggle
function toggleMobileNav() {
  zudoAudio.playRoboticClick();
  const navLinks = document.querySelector('.nav-links');
  const toggleBtn = document.getElementById('mobileNavToggle');
  if (navLinks) {
    navLinks.classList.toggle('mobile-active');
  }
  if (toggleBtn) {
    toggleBtn.classList.toggle('active');
  }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Form Controller
  new ZudonetLeadController();

  // 2. Initialize Advanced Cybernetic Cursor
  new ZudonetTechCursor();

  // 3. Attach Robotic Click sound to all clickable elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, select, textarea, .btn, .service-card, .model-card, .faq-item, .filter-tab-btn, [role="button"]')) {
      zudoAudio.playRoboticClick();
    }
  }, true);
});


/* ==========================================================
   SMOOTH BUTTON NAVIGATION & WEB2.WAV AUDIO ENGINE
   ========================================================== */
const zudoNavAnimator = {
  init() {
    const navContainer = document.querySelector('.nav-links');
    if (!navContainer) return;

    let slider = document.getElementById('navSliderBackdrop');
    if (!slider) {
      slider = document.createElement('div');
      slider.id = 'navSliderBackdrop';
      slider.className = 'nav-slider-backdrop';
      navContainer.prepend(slider);
    }

    const navLinks = navContainer.querySelectorAll('a');
    const activeLink = navContainer.querySelector('a.active');

    const moveTo = (elem, isHover = false) => {
      if (window.innerWidth <= 980) {
        slider.style.opacity = '0';
        return;
      }
      if (!elem) return;
      const navRect = navContainer.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();
      const left = elemRect.left - navRect.left;
      const top = elemRect.top - navRect.top;
      const width = elemRect.width;
      const height = elemRect.height;

      slider.style.opacity = '1';
      slider.style.transform = `translate(${left}px, ${top}px)`;
      slider.style.width = `${width}px`;
      slider.style.height = `${height}px`;

      if (isHover) {
        slider.classList.add('hovering');
      } else {
        slider.classList.remove('hovering');
      }
    };

    // Position immediately on active link
    if (activeLink) {
      setTimeout(() => moveTo(activeLink, false), 60);
    }

    navLinks.forEach(link => {
      // Hover event: smooth glide + web2.wav audio trigger
      link.addEventListener('mouseenter', () => {
        moveTo(link, true);
        zudoWav.playWeb2Hover();
      });

      // Click event: web2.wav full audio
      link.addEventListener('click', (e) => {
        zudoWav.playWeb2();
        moveTo(link, false);
      });
    });

    navContainer.addEventListener('mouseleave', () => {
      if (activeLink) {
        moveTo(activeLink, false);
      } else {
        slider.style.opacity = '0';
      }
    });

    window.addEventListener('resize', () => {
      const cur = navContainer.querySelector('a.active');
      if (cur) moveTo(cur, false);
    });
  }
};

// Extend ZudonetWavAudioEngine with web2.wav dedicated methods
if (typeof ZudonetWavAudioEngine !== 'undefined') {
  ZudonetWavAudioEngine.prototype.playWeb2 = function() {
    try {
      const sound = new Audio('web2.wav');
      sound.volume = 0.85;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch (e) {}
  };

  ZudonetWavAudioEngine.prototype.playWeb2Hover = function() {
    try {
      const sound = new Audio('web2.wav');
      sound.volume = 0.35;
      sound.currentTime = 0.05;
      const p = sound.play();
      setTimeout(() => {
        try { sound.pause(); } catch(e) {}
      }, 300);
    } catch (e) {}
  };
}

window.addEventListener('DOMContentLoaded', () => {
  zudoNavAnimator.init();
});
