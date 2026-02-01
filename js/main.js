/**
 * Professional Portfolio - Main JavaScript
 * Deep Pujara - Ph.D. Researcher
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================
    // Mobile Menu Toggle
    // ====================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // ====================================
    // Smooth Scrolling for Navigation
    // ====================================
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ====================================
    // Active Section Highlighting with Progress Indicator
    // ====================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link');
    
    function updateSectionProgress() {
        const scrollPosition = window.pageYOffset + 100;
        
        let currentSection = null;
        let nextSection = null;
        let progress = 0;
        
        // Find current and next sections
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
                nextSection = sections[index + 1] || null;
                
                // Calculate progress within current section
                const sectionProgress = (scrollPosition - sectionTop) / section.offsetHeight;
                progress = Math.min(Math.max(sectionProgress, 0), 1);
            }
        });
        
        // Update nav links with progress indicator
        navLinksForHighlight.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            link.classList.remove('active', 'transitioning');
            
            // Remove any existing progress indicators
            const existingIndicator = link.querySelector('.progress-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            if (currentSection && currentSection.id === linkTarget) {
                if (progress < 0.9) {
                    // Show progress circle
                    link.classList.add('transitioning');
                    const indicator = document.createElement('span');
                    indicator.className = 'progress-indicator';
                    indicator.style.setProperty('--progress', progress);
                    link.appendChild(indicator);
                } else {
                    // Show full underline at section start/end
                    link.classList.add('active');
                }
            }
        });
    }
    
    // ====================================
    // Header Shadow on Scroll
    // ====================================
    const header = document.querySelector('.site-header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateSectionProgress();
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ====================================
    // View All Publications Toggle
    // ====================================
    const viewAllBtn = document.getElementById('viewAllPublicationsBtn');
    const allPublicationsContainer = document.getElementById('allPublicationsContainer');
    
    if (viewAllBtn && allPublicationsContainer) {
        viewAllBtn.addEventListener('click', function() {
            const isVisible = allPublicationsContainer.style.display !== 'none';
            
            if (isVisible) {
                // Hide publications
                allPublicationsContainer.style.display = 'none';
                viewAllBtn.textContent = 'View All Publications (11 total)';
                
                // Scroll back to the featured publications
                setTimeout(() => {
                    const featuredSection = document.querySelector('.publications-list h3');
                    if (featuredSection) {
                        featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                // Show publications
                allPublicationsContainer.style.display = 'block';
                viewAllBtn.textContent = 'Hide Additional Publications';
                
                // Smooth scroll to show new content
                setTimeout(() => {
                    allPublicationsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }
    
    // ====================================
    // Contact Form Handling
    // ====================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    // If the server returned an error (4xx or 5xx)
                    throw new Error(`Server error: ${response.statusText}`);
                }

                // This only runs on a successful submission
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();

            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('Sorry, there was an issue sending your message. Please contact me directly via email.');
            } finally {
                // This always runs, whether it succeeded or failed
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    // ====================================
    // Lazy Loading Images
    // ====================================
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ====================================
    // Scroll Reveal Animation
    // ====================================
    const observeElements = document.querySelectorAll('.metric-card, .publication-item, .timeline-item, .presentation-card, .recommendation-card, .review-card');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }
    
    // ====================================
    // Copy Email on Click (Optional Feature)
    // ====================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const email = this.textContent;
            
            // Try to copy to clipboard
            if (navigator.clipboard) {
                e.preventDefault();
                navigator.clipboard.writeText(email).then(() => {
                    // Show a temporary tooltip
                    const tooltip = document.createElement('span');
                    tooltip.textContent = 'Email copied!';
                    tooltip.style.cssText = 'position: absolute; background: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.875rem; margin-left: 10px; animation: fadeInOut 2s ease;';
                    
                    this.parentElement.style.position = 'relative';
                    this.parentElement.appendChild(tooltip);
                    
                    setTimeout(() => tooltip.remove(), 2000);
                    
                    // After showing tooltip, open email client
                    setTimeout(() => {
                        window.location.href = this.href;
                    }, 1000);
                });
            }
        });
    });
    
    // ====================================
    // Keyboard Navigation Support
    // ====================================
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // ====================================
    // Print Button (Optional)
    // ====================================
    // Add this if you want a print resume button
    const printButtons = document.querySelectorAll('.print-resume');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });
    
    // ====================================
    // Performance Monitoring
    // ====================================
    // Log page load time for optimization
    window.addEventListener('load', function() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            console.log('Page loaded in ' + loadTime + 'ms');
        }
    });
    
});

// ====================================
// Utility Functions
// ====================================

/**
 * Debounce function for scroll events
 */
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add fade animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(0); }
        10% { opacity: 1; transform: translateX(0); }
        90% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(10px); }
    }
    
    /* Progress Indicator Styles */
    .nav-link {
        position: relative;
    }
    
    .nav-link.transitioning .progress-indicator {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: conic-gradient(
            var(--primary-blue) calc(var(--progress) * 360deg),
            var(--border-color) calc(var(--progress) * 360deg)
        );
        transition: all 0.1s ease;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--primary-blue);
        border-radius: 2px;
    }
    
    /* View All Publications Button */
    .view-all-publications-wrapper {
        text-align: center;
        margin: 2rem 0;
    }
    
    .view-all-btn {
        padding: 0.875rem 2rem;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .view-all-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
    
    .all-publications-container {
        animation: slideDown 0.4s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Conference Review Section Enhancement */
    .conference-review-section {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 2px solid var(--border-color);
    }
    
    .conference-review-title {
        color: var(--primary-blue);
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
        position: relative;
        padding-left: 1rem;
    }
    
    .conference-review-title::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 100%;
        background: var(--primary-blue);
        border-radius: 2px;
    }
    
    .review-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
    }
    
    .review-card {
        background: var(--background-white);
        border: 2px solid var(--primary-blue);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;
    }
    
    .review-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary-blue-dark);
    }
    
    .review-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .review-icon {
        width: 48px;
        height: 48px;
        object-fit: contain;
    }
    
    .review-journal {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-dark);
        margin: 0;
    }
    
    .review-publisher {
        font-size: 0.875rem;
        color: var(--text-gray);
        margin: 0;
    }
    
    .review-role {
        font-size: 0.95rem;
        color: var(--text-dark);
        margin: 0.5rem 0;
    }
    
    .review-org {
        font-size: 0.875rem;
        color: var(--text-gray);
        margin: 0;
    }
`;
document.head.appendChild(style);