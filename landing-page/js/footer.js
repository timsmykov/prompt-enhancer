function initializeFooter() {
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        // Check if the event listener is already attached to prevent duplicates
        if (!stickyCta.dataset.footerInitialized) {
            stickyCta.addEventListener('click', window.scrollToWaitlist);
            stickyCta.dataset.footerInitialized = 'true';
        }
    }
}

// Initialize when components are ready
document.addEventListener('componentsReady', initializeFooter);

// Fallback for cases where the script loads after the event has already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // A small timeout to ensure all components are rendered
    setTimeout(initializeFooter, 100);
}
