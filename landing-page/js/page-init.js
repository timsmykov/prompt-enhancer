// Loading overlay and page initialization
function initializePageLoading() {
    // Loading overlay is now handled by loader.js
    console.log('Page loading initialized - overlay handled by loader.js');
}

// Sticky CTA removed - using header CTA only
function initializeStickyCTA() {
    console.log('✨ Sticky CTA removed - using header CTA button only');
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
