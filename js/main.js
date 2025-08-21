import { initAnalytics } from './js/modules/analytics.js';
import { initParticles, initTypewriter } from './js/modules/particles.js';
import { initUI } from './js/modules/ui.js';
import { initForms } from './js/modules/forms.js';
import { initChatbot } from './js/modules/chatbot.js';

window.addEventListener('DOMContentLoaded', () => {
  initAnalytics('G-N80KQQCR7S');
  initParticles();
  initTypewriter("typewriter-company", "Arizona State University (ASU)");
  initUI();
  initForms({ contactEndpoint: './api/contact', feedbackEndpoint: './api/feedback' });
  initChatbot({ chatEndpoint: './api/chat', logEndpoint: './api/log-question' });
});