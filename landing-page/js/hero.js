// Hero section functionality
function initializeHero() {
    // Initialize typing animation
    initializeTypingAnimation();
    
    // Initialize scroll to waitlist button
    const joinWaitlistBtn = document.querySelector('.hero .btn-primary');
    if (joinWaitlistBtn) {
        joinWaitlistBtn.addEventListener('click', scrollToWaitlist);
    }
    
    // Initialize mockup enhance button
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    if (enhanceBtn) {
        enhanceBtn.addEventListener('click', enhanceMockupPrompt);
    }
}

function initializeTypingAnimation() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    
    const phrases = [
        'simple questions',
        'basic requests',
        'rough ideas',
        'quick thoughts',
        'unclear prompts'
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    
    function typeAnimation() {
        const current = phrases[currentPhrase];
        
        if (isDeleting) {
            typingText.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            typingText.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && currentChar === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeAnimation, typeSpeed);
    }
    
    typeAnimation();
}

function enhanceMockupPrompt() {
    const textarea = document.getElementById('mockup-textarea');
    if (!textarea) return;
    
    const originalText = textarea.textContent;
    const enhancedText = `Please provide a comprehensive guide on cooking pasta, including:

1. Types of pasta and their best uses
2. Step-by-step cooking instructions
3. Proper timing for different pasta shapes
4. Tips for achieving perfect texture (al dente)
5. Common mistakes to avoid
6. Sauce pairing recommendations

Please include specific measurements, cooking times, and any professional chef tips you can share.`;
    
    // Animate the text change
    textarea.style.opacity = '0.5';
    setTimeout(() => {
        textarea.textContent = enhancedText;
        textarea.style.opacity = '1';
        
        // Add a brief highlight effect
        textarea.style.background = 'rgba(16, 185, 129, 0.1)';
        setTimeout(() => {
            textarea.style.background = '';
        }, 1000);
    }, 300);
}

// Initialize when component is ready
document.addEventListener('componentsReady', initializeHero);

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeHero, 100);
}
