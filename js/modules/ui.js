export function initUI() {
  initMarquees();
  skillToggle();
  mobileMenu();
  publicationsAccordion();
  citationCopyButtons();
  scrollSpy();
  educationObserver();
  ratingStarsHover();
  initRecommendationsMarquee();
  handleMobileFab();
}

function skillToggle() {
  const trigger = document.getElementById("python-skill-trigger");
  const target = document.getElementById("python-packages-category");
  if (!trigger || !target) return;
  trigger.addEventListener("click", () => {
    const show = target.classList.toggle("visible");
    trigger.classList.toggle("expanded", show);
  });
}

function mobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links a");
  if (!menuToggle || !navLinks) return;

  const closeMenu = () => navLinks.classList.remove("active");
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
  links.forEach(l => l.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    const clickInsideMenu = navLinks.contains(e.target);
    const clickToggle = menuToggle.contains(e.target);
    if (navLinks.classList.contains("active") && !clickInsideMenu && !clickToggle) closeMenu();
  });
}

function publicationsAccordion() {
  document.querySelectorAll(".publication-item").forEach(item => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".publication-actions")) return;
      const details = item.querySelector(".publication-details");
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".publication-item").forEach(it => {
        it.classList.remove("active");
        const d = it.querySelector(".publication-details");
        d && d.classList.remove("visible");
      });

      if (!isActive) {
        item.classList.add("active");
        details && details.classList.add("visible");
      }
    });
  });
}

function citationCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cite = btn.dataset.citation || '';
      navigator.clipboard.writeText(cite).then(() => {
        const prev = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = prev; }, 2000);
      });
    });
  });
}

function scrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a.nav-link, .nav-links a");
  if (!sections.length || !navItems.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('nav-link-active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('nav-link-active');
      });
    });
  }, { rootMargin: "-30% 0px -65% 0px" });

  sections.forEach(s => io.observe(s));
}

function educationObserver() {
  const items = document.querySelectorAll(".education-item");
  const nodes = document.querySelectorAll(".slider-node");
  if (!items.length || !nodes.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      items.forEach(i => i.classList.remove("active"));
      nodes.forEach(n => n.classList.remove("active"));
      entry.target.classList.add("active");
      const activeNode = document.querySelector(`.slider-node[data-target="${id}"]`);
      if (activeNode) activeNode.classList.add("active");
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0.5 });

  items.forEach(i => io.observe(i));
}

function ratingStarsHover() {
  const stars = document.querySelectorAll(".star");
  if (!stars.length) return;

  let hoverRating = 0;
  const updateUI = (rating, cls) => {
    stars.forEach(star => {
      star.classList.remove("hover");
      const val = parseInt(star.dataset.value);
      if (val <= rating) star.classList.add(cls);
    });
  };

  stars.forEach(star => {
    star.addEventListener("mouseover", () => { hoverRating = parseInt(star.dataset.value); updateUI(hoverRating, "hover"); });
    star.addEventListener("mouseout",  () => { stars.forEach(s => s.classList.remove("hover")); });
  });
}

/* NEW: duplicate recommendation cards once for seamless marquee */
function initRecommendationsMarquee() {
  const track = document.querySelector('.recommendation-track');
  if (!track || track.children.length === 0) return;

  // Avoid duplicating on hot reloads
  const alreadyCloned = track.dataset.cloned === 'true';
  if (alreadyCloned) return;

  const items = Array.from(track.children);
  items.forEach(item => track.appendChild(item.cloneNode(true)));
  track.dataset.cloned = 'true';
}

/* NEW: Generic marquee duplicator for seamless LTR loops */
function initMarquee(trackSelector) {
  const track = document.querySelector(trackSelector);
  if (!track || track.children.length === 0) return;
  if (track.dataset.cloned === 'true') return; // avoid duplicating on hot reloads

  const items = Array.from(track.children);
  items.forEach(item => track.appendChild(item.cloneNode(true)));
  track.dataset.cloned = 'true';
}

/* NEW: initialize both recommendation and beyond-work marquees */
function initMarquees() {
  initMarquee('.recommendation-track');
  initMarquee('.scroller-track');
}

function handleMobileFab() {
  const fab = document.getElementById("feedback-fab");
  if (!fab) return;

  const isMobile = window.innerWidth <= 992; 
  if (isMobile) {
    fab.classList.add("mobile-minimized");
  } else {
    fab.classList.remove("mobile-minimized");
  }
}

// Add event listeners to run the check
window.addEventListener("resize", handleMobileFab);
window.addEventListener("DOMContentLoaded", handleMobileFab);