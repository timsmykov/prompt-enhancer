// Hero section functionality
console.log('🎯 Hero.js script loaded!');

function initializeHero() {
    console.log('🎯 Initializing hero...');

    // Initialize typing animation
    initializeTypingAnimation();

    // Initialize scroll to waitlist button
    const joinWaitlistBtn = document.querySelector('.hero .btn-primary');
    if (joinWaitlistBtn) {
        console.log('🎯 Found join waitlist button, adding click listener');
        joinWaitlistBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🎯 Join waitlist button clicked');
            scrollToWaitlist();
        });
    } else {
        console.log('❌ Join waitlist button not found');
    }

    // Initialize mockup enhance button
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    if (enhanceBtn) {
        console.log('🎯 Found enhance button, adding click listener');
        // Remove any existing listeners to prevent duplicates
        enhanceBtn.replaceWith(enhanceBtn.cloneNode(true));
        const newEnhanceBtn = document.getElementById('mockup-enhance-btn');
        newEnhanceBtn.addEventListener('click', enhanceMockupPrompt);
    } else {
        console.log('❌ Enhance button not found');
    }
}

// Ensure scrollToWaitlist function is available
function scrollToWaitlist() {
    console.log('🎯 scrollToWaitlist called');
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
        console.log('🎯 Found waitlist section, scrolling...');
        waitlistSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        console.log('❌ Waitlist section not found');
        // Try alternative selectors
        const waitlistAlt = document.querySelector('.waitlist') || document.querySelector('[id*="waitlist"]');
        if (waitlistAlt) {
            console.log('🎯 Found alternative waitlist element, scrolling...');
            waitlistAlt.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Super simple typing animation - no complex state
let typingTimer = null;

function initializeTypingAnimation() {
    console.log('🎯 Initializing simple typing animation...');

    const element = document.getElementById('typingText');
    if (!element) {
        console.log('❌ typingText element not found');
        return;
    }

    // Stop any existing animation
    stopTypingAnimation();

    const phrases = ['simple questions', 'basic requests', 'rough ideas', 'quick thoughts', 'unclear prompts'];
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    function updateText() {
        const phrase = phrases[currentPhrase];

        if (!isDeleting) {
            // Typing - 2x faster (50ms instead of 100ms)
            element.textContent = phrase.slice(0, currentChar);
            currentChar++;

            if (currentChar > phrase.length) {
                // Finished typing, start deleting after pause - 2x faster (1000ms instead of 2000ms)
                isDeleting = true;
                typingTimer = setTimeout(updateText, 1000);
                return;
            }

            typingTimer = setTimeout(updateText, 50);
        } else {
            // Deleting - 2x faster (25ms instead of 50ms)
            element.textContent = phrase.slice(0, currentChar);
            currentChar--;

            if (currentChar < 0) {
                // Finished deleting, move to next phrase - 2x faster (150ms instead of 300ms)
                isDeleting = false;
                currentChar = 0;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typingTimer = setTimeout(updateText, 150);
                return;
            }

            typingTimer = setTimeout(updateText, 25);
        }
    }

    // Start animation
    element.textContent = '';
    currentChar = 0;
    isDeleting = false;
    updateText();

    console.log('🎯 Simple typing animation started - 2x faster');
}

function stopTypingAnimation() {
    if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
        console.log('🎯 Typing animation stopped');
    }
}

// Expose stop function globally for debugging
window.stopTypingAnimation = stopTypingAnimation;

// Cleanup on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    console.log('🎯 Page unloading - cleaning up typing animation');
    stopTypingAnimation();
});

// Also cleanup if the hero component gets removed from DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const typingElementInNode = node.querySelector ? node.querySelector('#typingText') : null;
                    if (typingElementInNode || node.id === 'typingText') {
                        console.log('🎯 Typing element removed from DOM - stopping animation');
                        stopTypingAnimation();
                    }
                }
            });
        }
    });
});

// Start observing when document is ready
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

function enhanceMockupPrompt() {
    console.log('🎯 Enhance button clicked');
    const textarea = document.getElementById('mockup-textarea');
    const button = document.getElementById('mockup-enhance-btn');

    if (!textarea || !button) {
        console.log('❌ Textarea or button not found');
        return;
    }

    // Prevent multiple clicks during enhancement
    if (button.disabled || button.classList.contains('loading')) {
        console.log('❌ Enhancement already in progress');
        return;
    }

    const originalText = textarea.textContent.trim();

    // Don't enhance if already enhanced or empty
    if (originalText.length > 100 || !originalText) {
        console.log('❌ Text already enhanced or empty');
        return;
    }

    console.log('🎯 Starting enhancement process...');

    // Stage 1: Button transformation to loading state
    button.disabled = true;
    button.classList.add('loading');
    textarea.classList.add('enhancing');

    // Beautiful loading button with pulsing animation
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
                <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
            </path>
        </svg>
        <span>Analyzing...</span>
    `;

    // Stage 2: Show "processing" after 1 second
    setTimeout(() => {
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
                    <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="0.8s" repeatCount="indefinite"/>
                </path>
            </svg>
            <span>Enhancing...</span>
        `;
    }, 1000);

    // Stage 3: Show "writing" before typing starts
    setTimeout(() => {
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
                </path>
            </svg>
            <span>Writing...</span>
        `;

        // Remove enhancing class from textarea and start typing
        textarea.classList.remove('enhancing');

        // Get enhanced prompt
        const enhancedPrompt = getEnhancedPrompt(originalText);

        console.log('🎯 Starting typewriter effect...');
        typewriterEffect(textarea, enhancedPrompt, () => {
            console.log('🎯 Typewriter effect completed');

            // Stage 4: Success state
            button.classList.remove('loading');
            button.classList.add('success');
            textarea.classList.add('enhanced');

            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <span>Enhanced!</span>
            `;

            // Stage 5: Reset after delay
            setTimeout(() => {
                button.disabled = false;
                button.classList.remove('success');
                textarea.classList.remove('enhanced');

                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    <span>Enhance</span>
                `;
                console.log('🎯 Button reset complete');
            }, 4000);
        });
    }, 2200);
}

// Enhanced prompt generator
function getEnhancedPrompt(originalPrompt) {
    console.log('🎯 Getting enhanced prompt for:', originalPrompt);

    // Use the specific enhanced prompt from before-after section for pasta cooking
    if (originalPrompt.toLowerCase().includes('pasta') || originalPrompt.toLowerCase().includes('cook')) {
        return "Provide a complete pasta cooking guide. Include step-by-step instructions, cooking times for different types (spaghetti, penne, fettuccine), common mistakes to avoid, texture tips, and classic sauce pairings.";
    }

    // Enhancement examples mapping for other prompts
    const enhancementExamples = {
        'help me code': 'I need programming assistance. Please provide clear, well-commented code examples with explanations, best practices for the language/framework, error handling, and testing strategies.',
        'write an email': 'Help me compose a professional email. Include a clear subject line, appropriate greeting, well-structured body with specific details, and suitable closing that matches the recipient relationship.',
        'explain this concept': 'Provide a clear explanation of this concept. Break it into digestible sections, use relevant examples or analogies, explain practical applications, and highlight key nuances.',
        'create content': 'Help me create engaging content. Ensure it\'s well-structured with compelling headlines, natural keyword integration, consistent tone, and clear calls-to-action.',
        'solve this problem': 'Help me solve this systematically. Break down the issue into components, analyze root causes, suggest multiple approaches with pros/cons, and provide step-by-step guidance.',
        'analyze data': 'Help me analyze this data thoroughly. Identify key patterns and trends, highlight significant insights, explain methodology, discuss limitations, and suggest actionable recommendations.'
    };

    // Find matching example or create generic enhancement
    for (const [key, value] of Object.entries(enhancementExamples)) {
        if (originalPrompt.toLowerCase().includes(key) || key.includes(originalPrompt.toLowerCase())) {
            return value;
        }
    }

    // Generic enhancement if no match found
    return `Provide a comprehensive response about "${originalPrompt}". Include relevant context, specific examples, step-by-step guidance where applicable, practical tips, and ensure the information is accurate and actionable.`;
}

// Beautiful typewriter effect
function typewriterEffect(element, text, callback) {
    console.log('🎯 Starting typewriter effect for text length:', text.length);
    console.log('🎯 Target element:', element);
    console.log('🎯 Text to type:', text.substring(0, 50) + '...');

    // Check if element is already being typed into
    if (element.dataset.typing === 'true') {
        console.log('❌ Element is already being typed into, skipping');
        return;
    }

    // Mark element as being typed into
    element.dataset.typing = 'true';

    // Clear the element completely first
    element.textContent = '';
    element.innerHTML = '';

    // Add typing-active class to stop cursor blinking
    const cursorElement = element.classList.contains('typing') ? element : document.querySelector('.typing');
    if (cursorElement) {
        cursorElement.classList.add('typing-active');
    }

    // Add visual feedback to the textarea
    element.style.transition = 'all 0.3s ease';
    element.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    element.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.2)';

    let i = 0;
    const baseSpeed = 25; // 2x faster base typing speed (was 50)

    const typeChar = () => {
        // Check if we should continue typing
        if (element.dataset.typing !== 'true') {
            console.log('❌ Typing was cancelled');
            return;
        }

        if (i < text.length) {
            const char = text.charAt(i);

            // Clear and set the complete text up to current position
            // This prevents any duplication issues
            element.textContent = text.substring(0, i + 1);

            // Variable typing speed for more natural effect (all 2x faster)
            let speed = baseSpeed;
            if (char === ' ') speed = baseSpeed * 0.4; // Faster for spaces
            if (char === ',' || char === '.') speed = baseSpeed * 1.8; // Slower for punctuation
            if (char === '\n') speed = baseSpeed * 2.5; // Much slower for line breaks

            console.log('🎯 Typed char:', char, 'Position:', i + 1, '/', text.length);
            i++;
            setTimeout(typeChar, speed);
        } else {
            console.log('🎯 Typewriter effect finished successfully');

            // Mark typing as complete
            element.dataset.typing = 'false';

            // Remove typing-active class to resume cursor blinking
            if (cursorElement) {
                cursorElement.classList.remove('typing-active');
            }

            // Remove border effects
            setTimeout(() => {
                element.style.borderColor = '';
                element.style.boxShadow = '';
            }, 500);

            if (typeof callback === 'function') {
                callback();
            }
        }
    };

    // Small delay before starting to type for anticipation
    setTimeout(() => {
        console.log('🎯 Starting to type...');
        typeChar();
    }, 200);
}

// Make functions available globally
window.scrollToWaitlist = scrollToWaitlist;
window.typewriterEffect = typewriterEffect;
window.enhanceMockupPrompt = enhanceMockupPrompt;

// Initialize multiple ways to ensure it works
function tryInitializeHero() {
    console.log('🎯 Trying to initialize hero...');

    // Check if elements exist
    const typingText = document.getElementById('typingText');
    const joinBtn = document.querySelector('.hero .btn-primary');
    const enhanceBtn = document.getElementById('mockup-enhance-btn');

    console.log('🎯 Elements found:', {
        typingText: !!typingText,
        joinBtn: !!joinBtn,
        enhanceBtn: !!enhanceBtn
    });

    if (typingText || joinBtn || enhanceBtn) {
        console.log('🎯 Elements detected, initializing hero...');
        initializeHero();
        return true;
    }
    console.log('❌ No hero elements found yet');
    return false;
}

// Try immediately if DOM is ready
console.log('🎯 Setting up hero initialization...');
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🎯 DOM already ready, trying initialization');
    tryInitializeHero();
}

// Try when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Content Loaded - trying hero initialization');
    tryInitializeHero();
});

// Try when components are ready (if this event fires)
document.addEventListener('componentsReady', () => {
    console.log('🎯 Components Ready event received - trying hero initialization');
    tryInitializeHero();
});

// Aggressive fallback - keep trying every 500ms until successful
let initAttempts = 0;
const maxAttempts = 20; // 10 seconds max

function retryInitialization() {
    if (initAttempts >= maxAttempts) {
        console.log('❌ Max hero initialization attempts reached');
        return;
    }

    initAttempts++;
    console.log(`🎯 Hero initialization attempt ${initAttempts}`);

    if (!tryInitializeHero()) {
        setTimeout(retryInitialization, 500);
    } else {
        console.log('✅ Hero initialization successful!');
    }
}

// Start retry process
console.log('🎯 Starting hero retry process...');
setTimeout(retryInitialization, 100);
console.log('🔥 CACHE BUSTED - Hero.js loaded at', new Date().toLocaleString(), '- SIMPLIFIED TYPING ANIMATION');
