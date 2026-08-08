// CV Kreasi Asa Indonesia: site scripts

// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
   mobileMenu.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('active', isOpen);
      mobileMenu.setAttribute('aria-expanded', String(isOpen));
   });

   // Close mobile menu after tapping a link
   navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
         navLinks.classList.remove('active');
         mobileMenu.classList.remove('active');
         mobileMenu.setAttribute('aria-expanded', 'false');
      });
   });
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
         e.preventDefault();
         target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
   });
});

// Active nav link on scroll
function updateActiveMenu() {
   const sections = document.querySelectorAll('section[id]');
   const links = document.querySelectorAll('.nav-links a');
   let current = 'home';

   sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
         current = section.getAttribute('id');
      }
   });

   links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
   });
}
window.addEventListener('scroll', updateActiveMenu);
document.addEventListener('DOMContentLoaded', updateActiveMenu);

// Scroll-triggered fade-ins + counters
const revealTargets = document.querySelectorAll(
   '.section-head, .p-card, .g-item, .cert-chip, .about-text, .about-stats, .a-stat, .art-card, .t-card, .contact-info, .contact-form, .export-strip'
);
revealTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
   entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
         setTimeout(() => {
            entry.target.classList.add('animate');
            const counter = entry.target.querySelector('.counter');
            if (counter) animateCounter(counter);
         }, i * 80);
         observer.unobserve(entry.target);
      }
   });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => observer.observe(el));

function animateCounter(el) {
   if (el.dataset.done) return;
   el.dataset.done = 'true';

   const target = parseInt(el.getAttribute('data-count'), 10);
   const duration = 900;
   const start = performance.now();

   function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
         requestAnimationFrame(tick);
      } else {
         el.textContent = target;
      }
   }
   requestAnimationFrame(tick);
}

// ---------- Language switch (ID / EN) ----------
const langSwitch = document.getElementById('langSwitch');
let currentLang = localStorage.getItem('kreasiasa_lang') || 'id';

const submitLabels = {
   idle: { id: 'Kirim Pesan', en: 'Send Message' },
   sending: { id: 'Mengirim...', en: 'Sending...' },
   sent: { id: 'Pesan Terkirim ✓', en: 'Message Sent ✓' }
};

function applyLanguage(lang) {
   currentLang = lang;
   document.documentElement.lang = lang;
   localStorage.setItem('kreasiasa_lang', lang);

   if (langSwitch) {
      langSwitch.setAttribute('data-lang', lang);
      const nextLang = lang === 'id' ? 'en' : 'id';
      const nextLabel = nextLang === 'en' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia';
      langSwitch.setAttribute('aria-label', nextLabel);
      langSwitch.setAttribute('title', nextLabel);
   }

   // Plain text / HTML swap
   document.querySelectorAll('[data-en]').forEach(el => {
      if (!el.dataset.idStore) {
         el.dataset.idStore = el.classList.contains('i18n-html') ? el.innerHTML : el.textContent;
      }
      if (el.classList.contains('i18n-html')) {
         el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.dataset.idStore;
      } else {
         el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.dataset.idStore;
      }
   });

   // Placeholder swap
   document.querySelectorAll('[data-en-placeholder]').forEach(el => {
      if (!el.dataset.idPlaceholder) {
         el.dataset.idPlaceholder = el.getAttribute('placeholder');
      }
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-placeholder') : el.dataset.idPlaceholder);
   });

   // Reset submit button label to current idle state in the right language
   const submitBtn = document.querySelector('.contact-form .btn');
   if (submitBtn && !submitBtn.disabled) {
      submitBtn.textContent = submitLabels.idle[lang];
   }
}

if (langSwitch) {
   langSwitch.addEventListener('click', () => {
      const nextLang = langSwitch.getAttribute('data-lang') === 'id' ? 'en' : 'id';
      applyLanguage(nextLang);
   });
}

document.addEventListener('DOMContentLoaded', () => applyLanguage(currentLang));

// ---------- Rotating hero headline ----------
(function initHeroRotator() {
   const rotator = document.getElementById('heroRotator');
   if (!rotator) return;
   const items = Array.from(rotator.querySelectorAll('.hero-rotator-item'));
   if (items.length < 2) return;

   let index = items.findIndex(el => el.classList.contains('is-active'));
   if (index === -1) index = 0;

   setInterval(() => {
      const current = items[index];
      index = (index + 1) % items.length;
      const next = items[index];

      current.classList.remove('is-active');
      next.classList.add('is-active');
   }, 3000);
})();

// Contact form submission (demo only, no backend wired up)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
   contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');

      btn.textContent = submitLabels.sending[currentLang];
      btn.disabled = true;

      setTimeout(() => {
         btn.textContent = submitLabels.sent[currentLang];
         setTimeout(() => {
            btn.textContent = submitLabels.idle[currentLang];
            btn.disabled = false;
            contactForm.reset();
         }, 2200);
      }, 900);
   });
}

// Product card "Lihat Spesifikasi & Harga" toggle (collapsed by default, per card)
(function initProductDetailsToggle() {
   const toggles = document.querySelectorAll('.p-card-more-toggle');
   if (!toggles.length) return;

   function getLang() {
      return document.documentElement.lang === 'en' ? 'en' : 'id';
   }

   function renderLabel(toggle) {
      const label = toggle.querySelector('.p-card-more-label');
      if (!label) return;
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const lang = getLang();
      label.textContent = expanded
         ? (lang === 'en' ? label.dataset.enHide : label.dataset.hide)
         : (lang === 'en' ? label.dataset.enShow : label.dataset.show);
   }

   toggles.forEach(toggle => {
      const details = toggle.nextElementSibling;
      if (!details || !details.classList.contains('p-card-details')) return;

      toggle.addEventListener('click', () => {
         const expanded = details.classList.toggle('is-open');
         toggle.setAttribute('aria-expanded', String(expanded));
         renderLabel(toggle);

         if (!expanded) {
            toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         }
      });

      renderLabel(toggle);
   });

   // Keep labels in sync when language switch is used
   const langSwitchBtn = document.getElementById('langSwitch');
   if (langSwitchBtn) {
      langSwitchBtn.addEventListener('click', () => {
         setTimeout(() => toggles.forEach(renderLabel), 0);
      });
   }
})();

// FAQ accordion (article pages)
(function initFaqAccordion() {
   const items = document.querySelectorAll('.faq-item');
   if (!items.length) return;

   items.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
         const isOpen = item.classList.toggle('is-open');
         trigger.setAttribute('aria-expanded', String(isOpen));
      });
   });
})();

// Floating contact button (WhatsApp / Email chooser)
(function initFabContact() {
   const fab = document.getElementById('fabContact');
   const fabMain = document.getElementById('fabMain');
   if (!fab || !fabMain) return;

   function closeFab() {
      fab.classList.remove('open');
      fabMain.setAttribute('aria-expanded', 'false');
   }

   fabMain.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = fab.classList.toggle('open');
      fabMain.setAttribute('aria-expanded', String(isOpen));
   });

   document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) closeFab();
   });

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFab();
   });

   fab.querySelectorAll('.fab-option').forEach(opt => {
      opt.addEventListener('click', closeFab);
   });
})();

// Image lightbox
function openLightbox(src, alt) {
   const overlay = document.getElementById('image-lightbox');
   const img = document.getElementById('lightbox-img');
   img.src = src;
   img.alt = alt || '';
   overlay.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
   if (e.target.id === 'image-lightbox' || e.target.classList.contains('lightbox-close')) {
      document.getElementById('image-lightbox').classList.remove('active');
      document.body.style.overflow = '';
   }
}

document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
      document.getElementById('image-lightbox').classList.remove('active');
      document.body.style.overflow = '';
   }
});

// ---------- Scroll progress bar ----------
(function initScrollProgress() {
   const bar = document.getElementById('scrollProgress');
   if (!bar) return;

   function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
   }

   window.addEventListener('scroll', update, { passive: true });
   window.addEventListener('resize', update);
   update();
})();

// ---------- Navbar "scrolled" state ----------
(function initNavbarScroll() {
   const navbar = document.querySelector('.navbar');
   if (!navbar) return;

   function update() {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
   }

   window.addEventListener('scroll', update, { passive: true });
   update();
})();

// ---------- Parallax scroll effects ----------
// Depth-layered movement across sections: hero background/content move at
// different speeds, and key image blocks drift gently as they cross the
// viewport. Fully skipped for prefers-reduced-motion.
(function initParallax() {
   const heroBg = document.getElementById('heroBg');
   const heroInner = document.getElementById('heroInner');

   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (reduceMotion) return;

   // Collect floating layers: { el, strength }. Positive strength drifts
   // with scroll direction, negative drifts against it (creates separation
   // between overlapping elements like the about photo + its floating badge).
   const floaters = [];
   function addFloaters(selector, baseStrength, alternate) {
      document.querySelectorAll(selector).forEach((el, i) => {
         const strength = alternate ? (i % 2 === 0 ? baseStrength : -baseStrength) : baseStrength;
         floaters.push({ el, strength });
      });
   }
   addFloaters('.about-visual-frame', 0.05, false);
   addFloaters('.about-visual-badge', -0.09, false);
   addFloaters('.g-item', 0.045, true);
   addFloaters('.art-thumb', 0.05, true);
   addFloaters('.p-card-img', 0.035, true);

   // Lighter movement on narrow viewports keeps things calm on mobile
   const isNarrow = window.innerWidth < 640;
   const heroBgFactor = isNarrow ? 0.16 : 0.28;
   const heroInnerFactor = isNarrow ? 0.06 : 0.12;
   const floatCap = isNarrow ? 14 : 26;

   let viewportH = window.innerHeight;
   let ticking = false;

   function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

   function update() {
      const scrollY = window.scrollY;

      if (heroBg) {
         heroBg.style.transform = `translate3d(0, ${scrollY * heroBgFactor}px, 0)`;
      }
      if (heroInner) {
         const fade = clamp(1 - scrollY / (viewportH * 0.85), 0, 1);
         heroInner.style.transform = `translate3d(0, ${scrollY * heroInnerFactor}px, 0)`;
         heroInner.style.opacity = fade;
      }

      floaters.forEach(({ el, strength }) => {
         const rect = el.getBoundingClientRect();
         if (rect.bottom < -150 || rect.top > viewportH + 150) return; // skip offscreen
         const centerOffset = (rect.top + rect.height / 2) - viewportH / 2;
         const move = clamp(centerOffset * strength, -floatCap, floatCap);
         el.style.transform = `translate3d(0, ${move}px, 0)`;
      });

      ticking = false;
   }

   window.addEventListener('scroll', () => {
      if (!ticking) {
         requestAnimationFrame(update);
         ticking = true;
      }
   }, { passive: true });

   window.addEventListener('resize', () => {
      viewportH = window.innerHeight;
      update();
   });

   update();
})();

// ---------- AI Chat Widget ----------
(function initAiChat() {
   const openBtn = document.getElementById('fabAiOpen');
   const chatWindow = document.getElementById('aiChatWindow');
   const closeBtn = document.getElementById('aiChatClose');
   const chatBody = document.getElementById('aiChatBody');
   const chatForm = document.getElementById('aiChatForm');
   const chatInput = document.getElementById('aiChatInput');
   const sendBtn = document.getElementById('aiChatSend');
   const suggestions = document.getElementById('aiChatSuggestions');
   const fab = document.getElementById('fabContact');

   if (!openBtn || !chatWindow || !chatForm) return;

   const history = []; // { role: 'user' | 'assistant', content: string }

   function getLang() {
      return document.documentElement.lang === 'en' ? 'en' : 'id';
   }

   function scrollToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
   }

   function addMessage(role, text) {
      const msg = document.createElement('div');
      msg.className = role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-bot';
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
   }

   function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'ai-msg-typing';
      typing.id = 'aiTypingIndicator';
      typing.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(typing);
      scrollToBottom();
   }

   function hideTyping() {
      const typing = document.getElementById('aiTypingIndicator');
      if (typing) typing.remove();
   }

   async function sendMessage(text) {
      if (!text.trim()) return;

      // Hide suggestion chips after first message
      if (suggestions) suggestions.style.display = 'none';

      addMessage('user', text);
      history.push({ role: 'user', content: text });

      chatInput.value = '';
      sendBtn.disabled = true;
      showTyping();

      try {
         const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history }),
         });

         const data = await res.json();
         hideTyping();

         if (!res.ok) {
            throw new Error(data.error || 'Request failed');
         }

         addMessage('assistant', data.reply);
         history.push({ role: 'assistant', content: data.reply });
      } catch (err) {
         hideTyping();
         const lang = getLang();
         const errorMsg = lang === 'en'
            ? "Sorry, I'm having trouble connecting right now. Please contact us via WhatsApp."
            : 'Maaf, sedang ada gangguan koneksi. Silakan hubungi kami lewat WhatsApp.';
         addMessage('assistant', errorMsg);
      } finally {
         sendBtn.disabled = false;
         chatInput.focus();
      }
   }

   function openChat() {
      chatWindow.classList.add('open');
      if (fab) fab.classList.remove('open');
      chatInput.focus();
   }

   function closeChat() {
      chatWindow.classList.remove('open');
   }

   openBtn.addEventListener('click', openChat);
   if (closeBtn) closeBtn.addEventListener('click', closeChat);

   chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage(chatInput.value);
   });

   if (suggestions) {
      suggestions.querySelectorAll('.ai-suggestion-chip').forEach((chip) => {
         chip.addEventListener('click', () => {
            const lang = getLang();
            const question = lang === 'en' ? chip.dataset.qEn : chip.dataset.qId;
            sendMessage(question || chip.textContent);
         });
      });
   }

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('open')) closeChat();
   });
})();
