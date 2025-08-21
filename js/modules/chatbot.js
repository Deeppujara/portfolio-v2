// Chatbot: thread creation, message send, simple markdown→HTML + "typing" streamer
export function initChatbot({ chatEndpoint = './api/chat', logEndpoint = './api/log-question' } = {}) {
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

    // Headings (### )
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

    // Bold **x**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Lists (- or *)
    html = html.replace(/^\s*[-*] (.*)/gm, '<li>$1</li>');
    html = html.replace(/<\/li><li>/g, '</li>\n<li>');
    html = html.replace(/<li>/g, '<ul><li>');
    html = html.replace(/<\/li>/g, '</li></ul>');
    html = html.replace(/<\/ul>\s?<ul>/g, ''); // merge adjacent

    // Paragraphs
    html = html
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li')) return line;
        return `<p>${line}</p>`;
      })
      .join('');

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
    const res = await fetch(chatEndpoint, {
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

    // Fire-and-forget logging (won't block UI)
    try {
      fetch(logEndpoint, {
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
      const res = await fetch(chatEndpoint, {
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