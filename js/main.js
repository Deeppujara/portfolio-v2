/**
 * =================================================================================
 * DEEP PUJARA | PORTFOLIO JAVASCRIPT
 * =================================================================================
 * This single file contains all the necessary JavaScript logic for the portfolio.
 * It has been consolidated from the modular structure to ensure maximum
 * compatibility and eliminate module-loading errors.
 *
 * Contents:
 * 1. Analytics Initialization
 * 2. tsParticles Background & Typewriter Effect
 * 3. UI Initializers (Modals, Menus, Accordions, ScrollSpy, etc.)
 * 4. Form Handlers (Contact & Feedback)
 * 5. Chatbot Logic
 * 6. Main DOMContentLoaded Event Listener to start everything.
 * =================================================================================
 */

// --- SECTION 1: ANALYTICS ---

function initAnalytics(measurementId) {
  if (!measurementId) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', measurementId);
}

// --- SECTION 2: PARTICLES & TYPEWRITER ---

function initParticles() {
  if (!window.tsParticles) {
    console.error("tsParticles library not found.");
    return;
  }
  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: { color: { value: "#ffffff00" } }, // Transparent background
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: "#6a6a6a" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false },
      size: { value: { min: 1, max: 5 }, random: true },
      links: { enable: true, distance: 150, color: "#6a6a6a", opacity: 0.3, width: 1 },
      move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

function initTypewriter(elementId, text) {
  const el = document.getElementById(elementId);
  if (!el || !text) return;
  let i = 0;
  let typing = true;
  const type = () => {
    if (typing) {
      if (i <= text.length) {
        el.innerHTML = `<span class="company-color">${text.slice(0, i++)}</span>`;
        setTimeout(type, 90);
      } else {
        typing = false;
        setTimeout(type, 1200);
      }
    } else {
      if (i > 0) {
        el.innerHTML = `<span class="company-color">${text.slice(0, --i)}</span>`;
        setTimeout(type, 40);
      } else {
        typing = true;
        setTimeout(type, 500);
      }
    }
  };
  type();
}

// --- SECTION 3: UI INITIALIZERS ---

function initUI() {
  initMarquees();
  skillToggle();
  mobileMenu();
  publicationsAccordion();
  citationCopyButtons();
  scrollSpy();
  educationObserver();
  initFabObserver();
}

function skillToggle() {
  const trigger = document.getElementById("python-skill-trigger");
  const target = document.getElementById("python-packages-category");
  if (!trigger || !target) return;
  trigger.addEventListener("click", () => {
    const isVisible = target.classList.toggle("visible");
    trigger.classList.toggle("expanded", isVisible);
  });
}

function mobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");
  if (!menuToggle || !navLinks) return;

  const closeMenu = () => navLinks.classList.remove("active");
  
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });
  
  links.forEach(l => l.addEventListener("click", closeMenu));
  
  document.addEventListener("click", (e) => {
    const isClickInside = navLinks.contains(e.target) || menuToggle.contains(e.target);
    if (navLinks.classList.contains("active") && !isClickInside) {
      closeMenu();
    }
  });
}

function publicationsAccordion() {
  const items = document.querySelectorAll(".publication-item");
  items.forEach(item => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".publication-actions")) return;
      
      const details = item.querySelector(".publication-details");
      const isActive = item.classList.contains("active");

      items.forEach(i => {
          i.classList.remove("active");
          i.querySelector(".publication-details")?.classList.remove("visible");
      });

      if (!isActive) {
        item.classList.add("active");
        details?.classList.add("visible");
      }
    });
  });
}

function citationCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const citation = btn.dataset.citation || '';
      navigator.clipboard.writeText(citation).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      });
    });
  });
}

function scrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-link-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-link-active');
          }
        });
      }
    });
  }, { rootMargin: "-30% 0px -65% 0px" });

  sections.forEach(section => observer.observe(section));
}

function educationObserver() {
  const items = document.querySelectorAll(".education-item");
  const nodes = document.querySelectorAll(".slider-node");
  if (!items.length || !nodes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(item => item.classList.toggle("active", item.id === id));
        nodes.forEach(node => node.classList.toggle("active", node.dataset.target === id));
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0.5 });

  items.forEach(item => observer.observe(item));
}

function initMarquees() {
  const initMarquee = (trackSelector) => {
    const track = document.querySelector(trackSelector);
    if (!track || track.children.length === 0 || track.dataset.cloned) return;
    
    const items = Array.from(track.children);
    items.forEach(item => track.appendChild(item.cloneNode(true)));
    track.dataset.cloned = 'true';
  };
  initMarquee('.recommendation-track');
  initMarquee('.scroller-track');
}

function initFabObserver() {
    const fab = document.getElementById("feedback-fab");
    const footer = document.getElementById("page-footer");
    if (!fab || !footer) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            fab.classList.toggle('minimized', entry.isIntersecting);
        });
    }, { 
        rootMargin: '0px', 
        threshold: 0.1 
    });
    observer.observe(footer);
}

// --- SECTION 4: FORM HANDLERS ---

function initForms(endpoints) {
  initContactForm(endpoints.contactEndpoint);
  initFeedbackForm(endpoints.feedbackEndpoint);
  initModals();
}

function initContactForm(endpoint) {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name?.value || '',
          email: form.email?.value || '',
          message: form.message?.value || ''
        })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      alert('Thank you! Your message has been sent.');
      form.reset();
    } catch (err) {
      console.error("Contact form error:", err);
      alert('Sorry, there was an error sending your message.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

function initFeedbackForm(endpoint) {
  const form = document.getElementById("feedback-form");
  const submitBtn = document.getElementById("feedback-submit-btn");
  const textArea = document.getElementById("feedback-text");
  const contentWrapper = document.querySelector(".feedback-content-wrapper");
  const thankYou = document.getElementById("feedback-thank-you");
  const stars = document.querySelectorAll(".star-rating .star");

  if (!form || !submitBtn || !stars.length) return;

  let currentRating = 0;

  const updateStarsUI = () => {
    stars.forEach(star => {
      star.classList.toggle('selected', parseInt(star.dataset.value) <= currentRating);
    });
  };

  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      updateStarsUI();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (currentRating === 0) {
      alert('Please select a star rating.');
      return;
    }
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: currentRating, feedback: textArea?.value || '' })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      if (contentWrapper && thankYou) {
        contentWrapper.style.display = "none";
        thankYou.style.display = "block";
        setTimeout(() => {
          document.getElementById("feedback-modal-overlay")?.classList.remove('visible');
          setTimeout(() => {
            contentWrapper.style.display = "block";
            thankYou.style.display = "none";
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
            currentRating = 0;
            updateStarsUI();
            if (textArea) textArea.value = '';
          }, 500);
        }, 2500);
      }
    } catch (err) {
      console.error("Feedback form error:", err);
      alert('Sorry, there was an issue submitting your feedback.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

function initModals() {
  const modalConfigs = [
    { triggerId: "feedback-fab", overlayId: "feedback-modal-overlay", closeId: "close-feedback-modal" },
    { triggerId: "privacy-policy-link", overlayId: "privacy-modal-overlay", closeId: "close-privacy-modal" }
  ];
  modalConfigs.forEach(config => {
    const trigger = document.getElementById(config.triggerId);
    const overlay = document.getElementById(config.overlayId);
    const closeBtn = document.getElementById(config.closeId);
    if (!trigger || !overlay || !closeBtn) return;
    const openModal = (e) => {
      e.preventDefault();
      overlay.classList.add("visible");
    };
    const closeModal = (e) => {
      if (e) e.preventDefault();
      overlay.classList.remove("visible");
    };
    trigger.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(null);
    });
  });
}

// --- SECTION 5: CHATBOT ---

function initChatbot(endpoints) {
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const body = document.getElementById('chatbot-body');
  const messages = document.getElementById('chatbot-messages');
  const intro = document.getElementById('chatbot-intro');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const starterBtns = document.querySelectorAll('.starter-btn');

  if (!form || !input || !messages) return;

  let userSession = { threadId: null };

  const startConversation = () => {
    if (intro && !intro.classList.contains('hidden')) {
      intro.classList.add('hidden');
      messages.classList.add('active');
    }
  };

  const addMessage = (sender, text = '') => {
    const el = document.createElement('div');
    el.classList.add('chat-message', `${sender}-message`);
    if (sender === 'user') el.textContent = text;
    messages.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  };

  const addTypingIndicator = () => {
    if (document.querySelector('.typing-indicator')) return;
    const ind = document.createElement('div');
    ind.classList.add('chat-message', 'bot-message', 'typing-indicator');
    ind.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(ind);
    body.scrollTop = body.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const ind = document.querySelector('.typing-indicator');
    if (ind) ind.remove();
  };

  function markdownToHTML(text) {
    let html = text;
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/^\s*[-*] (.*)/gm, '<li>$1</li>');
    html = html.replace(/<\/li><li>/g, '</li>\n<li>');
    html = html.replace(/<li>/g, '<ul><li>');
    html = html.replace(/<\/li>/g, '</li></ul>');
    html = html.replace(/<\/ul>\s?<ul>/g, '');
    html = html.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li')) return line;
        return `<p>${line}</p>`;
      }).join('');
    return html;
  }

  async function streamMessage(text, messageElement) {
    messageElement.innerHTML = '';
    const formatted = markdownToHTML(text);
    let i = 0;
    const interval = 15;
    (function type() {
      if (i < formatted.length) {
        if (formatted[i] === '<') {
          const end = formatted.indexOf('>', i);
          messageElement.innerHTML += formatted.substring(i, end + 1);
          i = end + 1;
        } else {
          messageElement.innerHTML += formatted[i++];
        }
        body.scrollTop = body.scrollHeight;
        setTimeout(type, interval);
      }
    })();
  }

  async function ensureThread() {
    if (userSession.threadId) return userSession.threadId;
    const res = await fetch(endpoints.chatEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_thread' })
    });
    if (!res.ok) throw new Error('Failed to create thread');
    const data = await res.json();
    userSession.threadId = data.threadId;
    return userSession.threadId;
  }

  async function handleSendMessage(messageText) {
    if (!messageText.trim()) return;
    try {
      fetch(endpoints.logEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      });
    } catch (_) { /* ignore */ }
    try {
      await ensureThread();
    } catch (_err) {
      addMessage('bot', "Sorry, I couldn't start a conversation right now. Please try again later.");
      return;
    }
    startConversation();
    addMessage('user', messageText);
    input.value = '';
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.classList.add('loading');
    }
    addTypingIndicator();
    try {
      const res = await fetch(endpoints.chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_message', threadId: userSession.threadId, message: messageText })
      });
      if (!res.ok) throw new Error('Response from server was not ok.');
      const data = await res.json();
      removeTypingIndicator();
      const botEl = addMessage('bot');
      await streamMessage(data.reply, botEl);
    } catch (err) {
      removeTypingIndicator();
      addMessage('bot', "I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage(input.value);
  });

  starterBtns.forEach(btn => {
    btn.addEventListener('click', () => handleSendMessage(btn.dataset.question || ''));
  });
}

// --- SECTION 6: MAIN EXECUTION ---

window.addEventListener('DOMContentLoaded', () => {
  // Initialize everything
  initAnalytics('G-N80KQQCR7S');
  initParticles();
  initTypewriter("typewriter-company", "Arizona State University");
  initUI();
  initForms({ 
    contactEndpoint: './api/contact', 
    feedbackEndpoint: './api/feedback' 
  });
  initChatbot({ 
    chatEndpoint: './api/chat', 
    logEndpoint: './api/log-question' 
  });
});