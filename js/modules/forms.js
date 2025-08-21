// Handles Contact + Feedback form submissions (JSON POST) and rating selection
export function initForms({ contactEndpoint = './api/contact', feedbackEndpoint = './api/feedback' } = {}) {
  initContactForm(contactEndpoint);
  initFeedbackForm(feedbackEndpoint);
  initModals();
}

function initContactForm(endpoint) {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';

    try {
      const body = JSON.stringify({
        name: form.name?.value || '',
        email: form.email?.value || '',
        message: form.message?.value || ''
      });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!res.ok) throw new Error('Server error');
      alert('Thank you! Your message has been sent.');
      form.reset();
    } catch (err) {
      alert('Sorry, there was an error sending your message.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

function initFeedbackForm(endpoint) {
  const modalOverlay = document.getElementById("feedback-modal-overlay");
  const form = document.getElementById("feedback-form");
  const submitBtn = document.getElementById("feedback-submit-btn");
  const textArea = document.getElementById("feedback-text");
  const contentWrapper = document.querySelector(".feedback-content-wrapper");
  const thankYou = document.getElementById("feedback-thank-you");
  const stars = document.querySelectorAll(".star");

  if (!form || !submitBtn) return;

  // Selection state for rating
  let currentRating = 0;

  const updateStarsUI = (rating, cls = 'selected') => {
    stars.forEach(star => {
      star.classList.remove('hover', 'selected');
      const val = parseInt(star.dataset.value);
      if (val <= rating) star.classList.add(cls);
    });
  };

  // Click to select rating
  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      updateStarsUI(currentRating, 'selected');
    });
    // Hover effects
    star.addEventListener('mouseover', () => updateStarsUI(parseInt(star.dataset.value), 'hover'));
    star.addEventListener('mouseout', () => updateStarsUI(currentRating, 'selected'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (currentRating === 0) {
      alert('Please select a star rating.');
      return;
    }

    submitBtn.disabled = true;
    const prev = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: currentRating, feedback: textArea?.value || '' })
      });
      if (!res.ok) throw new Error('Server error');

      // success UI: swap to thank-you then reset
      if (contentWrapper && thankYou) {
        contentWrapper.style.display = "none";
        thankYou.style.display = "block";
        setTimeout(() => {
          if (modalOverlay) modalOverlay.classList.remove('visible');
          setTimeout(() => {
            contentWrapper.style.display = "block";
            thankYou.style.display = "none";
            submitBtn.disabled = false;
            submitBtn.textContent = prev;
            currentRating = 0;
            updateStarsUI(0, 'selected');
            if (textArea) textArea.value = '';
          }, 500);
        }, 2500);
      } else {
        // Fallback if modal DOM not present
        alert('Thanks for your feedback!');
        submitBtn.disabled = false;
        submitBtn.textContent = prev;
        currentRating = 0;
        updateStarsUI(0, 'selected');
        if (textArea) textArea.value = '';
      }
    } catch (err) {
      alert('Sorry, there was an issue submitting your feedback.');
      submitBtn.disabled = false;
      submitBtn.textContent = prev;
    }
  });
}

function initModals() {
    const feedbackFab = document.getElementById("feedback-fab");
    const feedbackModalOverlay = document.getElementById("feedback-modal-overlay");
    const closeFeedbackBtn = document.getElementById("close-feedback-modal");

    const privacyLink = document.getElementById("privacy-policy-link");
    const privacyModalOverlay = document.getElementById("privacy-modal-overlay");
    const closePrivacyBtn = document.getElementById("close-privacy-modal");

    if (feedbackFab && feedbackModalOverlay && closeFeedbackBtn) {
        feedbackFab.addEventListener("click", () => feedbackModalOverlay.classList.add("visible"));
        closeFeedbackBtn.addEventListener("click", () => feedbackModalOverlay.classList.remove("visible"));
        feedbackModalOverlay.addEventListener("click", (e) => {
            if (e.target === feedbackModalOverlay) {
                feedbackModalOverlay.classList.remove("visible");
            }
        });
    }

    if (privacyLink && privacyModalOverlay && closePrivacyBtn) {
        privacyLink.addEventListener("click", (e) => {
            e.preventDefault();
            privacyModalOverlay.classList.add("visible");
        });
        closePrivacyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            privacyModalOverlay.classList.remove("visible");
        });
        privacyModalOverlay.addEventListener("click", (e) => {
            if (e.target === privacyModalOverlay) {
                privacyModalOverlay.classList.remove("visible");
            }
        });
    }
}