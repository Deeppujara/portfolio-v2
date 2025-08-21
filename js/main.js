import { initAnalytics } from './modules/analytics.js';
import { initParticles, initTypewriter } from './modules/particles.js';
import { initUI } from './modules/ui.js';
import { initForms } from './modules/forms.js';
import { initChatbot } from './modules/chatbot.js';

window.addEventListener('DOMContentLoaded', () => {
  initAnalytics('G-N80KQQCR7S');
  initParticles();
  initTypewriter("typewriter-company", "Arizona State University (ASU)");
  initUI();
  initForms({ contactEndpoint: './api/contact', feedbackEndpoint: './api/feedback' });
  initChatbot({ chatEndpoint: './api/chat', logEndpoint: './api/log-question' });
});