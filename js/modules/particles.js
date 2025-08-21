// tsParticles background + small typewriter helper

export function initParticles() {
  if (!window.tsParticles) return;
  window.tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    background: { color: "#ffffff00" },
    particles: {
      number: { value: 50 },
      color: { value: "#6a6a6a" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 5 } },
      move: { enable: true, speed: 1.5, direction: "none", outModes: "bounce" },
      links: { enable: true, distance: 150, color: "#6a6a6a", opacity: 0.3, width: 1 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
      modes: { repulse: { distance: 100 }, push: { quantity: 4 } }
    }
  });
}

/**
 * Typewriter that types and backspaces the given text forever.
 * @param {string} elementId - The span/div id to render into
 * @param {string} text - The text to type (e.g. "Arizona State University (ASU)")
 */
export function initTypewriter(elementId, text) {
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
