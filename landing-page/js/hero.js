// Hero section functionality
console.log('🎯 Hero.js script loaded!');

function initializeHero() {
    console.log('🎯 Initializing hero...');

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

/**
 * Types out the given text into an element with a blinking cursor effect.
 * @param {HTMLElement} element The element to type into.
 * @param {string} text The text to type.
 * @param {function} callback Function to call when typing is complete.
 */
function typeText(element, text, callback) {
    const typeSpeed = 20; // Speed of typing in milliseconds
    let i = 0;
    element.textContent = '';
    element.classList.add('is-typing'); // Add for cursor

    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, typeSpeed);
        } else {
            element.classList.remove('is-typing');
            if (callback) {
                callback();
            }
        }
    }
    typing();
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
    textarea.textContent = ''; // Clear text area for typing
    textarea.blur(); // Remove focus to avoid system cursor

    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
                <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
            </path>
        </svg>
        <span>Enhancing...</span>
    `;

    // Stage 2: Simulate enhancement and start typing
    setTimeout(() => {
        const enhancedText = `Provide a comprehensive guide to cooking pasta for a beginner. Include water-to-pasta ratio, salting water, preventing sticking, checking for 'al dente', and using pasta water.`.trim();

        textarea.classList.remove('enhancing');

        typeText(textarea, enhancedText, () => {
            // Stage 3: Enhancement complete, update button to success state
            button.classList.remove('loading');
            button.classList.add('success');
            textarea.classList.add('enhanced');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
                <span>Enhanced!</span>
            `;
            // Keep the enhanced state, do not reset
        });

    }, 1500); // Start typing after 1.5s
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

// Make functions available globally
window.scrollToWaitlist = scrollToWaitlist;
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
