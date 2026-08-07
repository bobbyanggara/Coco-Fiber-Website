// CV Kreasi Asa Indonesia — site scripts

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

// Contact form submission (demo only — no backend wired up)
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

// Product image slider
(function initProductSlider() {
   const track = document.getElementById('productTrack');
   const prevBtn = document.getElementById('prodPrev');
   const nextBtn = document.getElementById('prodNext');
   const dotsWrap = document.getElementById('prodDots');
   if (!track || !dotsWrap) return;

   const cards = Array.from(track.children);

   // Build dots
   cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
         cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
   });
   const dots = Array.from(dotsWrap.children);

   function updateDots() {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
         const cardCenter = card.offsetLeft + card.offsetWidth / 2;
         const dist = Math.abs(cardCenter - trackCenter);
         if (dist < closestDist) {
            closestDist = dist;
            closest = i;
         }
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === closest));
   }

   function scrollByCard(direction) {
      const cardWidth = cards[0].getBoundingClientRect().width + 16; // + gap
      track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
   }

   if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
   if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

   let scrollTimeout;
   track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateDots, 80);
   });

   window.addEventListener('resize', updateDots);
   updateDots();

   // ---------- Auto-scroll (mobile only) ----------
   // Only runs where the product cards are shown as a horizontal slider
   // (desktop shows all cards side-by-side, so no auto-scroll needed there).
   const mobileSliderQuery = window.matchMedia('(max-width:1023px)');
   const AUTO_SCROLL_DELAY = 3500; // ms between slides
   const RESUME_DELAY = 5000; // ms of inactivity before auto-scroll resumes
   let autoScrollInterval = null;
   let resumeTimeout = null;

   function getCurrentIndex() {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
         const cardCenter = card.offsetLeft + card.offsetWidth / 2;
         const dist = Math.abs(cardCenter - trackCenter);
         if (dist < closestDist) {
            closestDist = dist;
            closest = i;
         }
      });
      return closest;
   }

   function autoScrollNext() {
      const current = getCurrentIndex();
      if (current >= cards.length - 1) {
         track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
         scrollByCard(1);
      }
   }

   function startAutoScroll() {
      if (autoScrollInterval || cards.length < 2 || !mobileSliderQuery.matches) return;
      autoScrollInterval = setInterval(autoScrollNext, AUTO_SCROLL_DELAY);
   }

   function stopAutoScroll() {
      if (autoScrollInterval) {
         clearInterval(autoScrollInterval);
         autoScrollInterval = null;
      }
   }

   function pauseThenResume() {
      stopAutoScroll();
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(startAutoScroll, RESUME_DELAY);
   }

   // Pause on manual interaction, resume automatically after a short pause
   ['pointerdown', 'touchstart', 'wheel'].forEach((evt) => {
      track.addEventListener(evt, pauseThenResume, { passive: true });
   });
   [prevBtn, nextBtn].forEach((btn) => {
      if (btn) btn.addEventListener('click', pauseThenResume);
   });
   dots.forEach((dot) => dot.addEventListener('click', pauseThenResume));

   // Pause while the tab is hidden, resume when it's visible again
   document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
         stopAutoScroll();
      } else {
         startAutoScroll();
      }
   });

   // Switch auto-scroll on/off if the viewport crosses the mobile breakpoint
   mobileSliderQuery.addEventListener('change', (e) => {
      if (e.matches) {
         startAutoScroll();
      } else {
         stopAutoScroll();
      }
   });

   startAutoScroll();
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
