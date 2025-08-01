// Loading overlay and page initialization
function initializePageLoading() {
    // Loading overlay is now handled by loader.js
    console.log('Page loading initialized - overlay handled by loader.js');
}

// Sticky CTA visibility control
function initializeStickyCTA() {
    const stickyCta = document.querySelector('.sticky-cta');
    if (!stickyCta) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.id === 'waitlist') {
                if (entry.isIntersecting) {
                    stickyCta.classList.remove('visible');
                } else {
                    stickyCta.classList.add('visible');
                }
            }
        });
    });
    
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        observer.observe(waitlistSection);
    }
    
    // Show sticky CTA after scrolling past hero section
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > heroHeight * 0.9) { // Show when 90% past hero
                stickyCta.classList.add('visible');
            }
        }
    });
}

// Platform logos scrolling animation
function initializePlatformScroll() {
    const scrollContainer = document.querySelector('.platforms-scroll');
    if (!scrollContainer) return;
    
    // Clone logos for seamless infinite scroll
    const logos = scrollContainer.innerHTML;
    scrollContainer.innerHTML = logos + logos;
}

// Initialize all page features
function initializePageFeatures() {
    initializePageLoading();
    initializeStickyCTA();
    initializePlatformScroll();
}

// Initialize when components are ready
document.addEventListener('componentsReady', initializePageFeatures);

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializePageFeatures, 100);
}
