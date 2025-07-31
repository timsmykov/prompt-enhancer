// Emergency hero debugging script
console.log('🚨 EMERGENCY HERO DEBUG SCRIPT LOADED');

// Test 1: Check if hero elements exist
function testHeroElements() {
    console.log('🔍 Testing hero elements...');
    
    const heroSection = document.querySelector('.hero');
    const typingText = document.getElementById('typingText');
    const joinBtn = document.querySelector('.hero .btn-primary');
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    const platformsSection = document.querySelector('.hero-platforms');
    const platformLogos = document.querySelectorAll('.platform-logo');
    
    console.log('Hero elements check:', {
        heroSection: !!heroSection,
        typingText: !!typingText,
        joinBtn: !!joinBtn,
        enhanceBtn: !!enhanceBtn,
        platformsSection: !!platformsSection,
        platformLogosCount: platformLogos.length
    });
    
    if (platformsSection) {
        const computedStyle = window.getComputedStyle(platformsSection);
        console.log('Platform section styles:', {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            height: computedStyle.height,
            marginTop: computedStyle.marginTop,
            position: computedStyle.position
        });
        
        // Check if images are loading
        const images = platformsSection.querySelectorAll('img');
        console.log('Platform images found:', images.length);
        images.forEach((img, index) => {
            console.log(`Image ${index}:`, {
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            });
        });
    } else {
        console.log('❌ Platform section not found in DOM');
    }
    
    return {
        heroSection,
        typingText,
        joinBtn,
        enhanceBtn,
        platformsSection,
        platformLogos
    };
}

// Test 2: Force initialize typing animation
function forceTypingAnimation() {
    console.log('🔥 FORCING typing animation...');
    const typingText = document.getElementById('typingText');
    if (!typingText) {
        console.log('❌ No typing text element found');
        return;
    }
    
    const phrases = ['simple questions', 'basic requests', 'rough ideas', 'quick thoughts', 'unclear prompts'];
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
    
    console.log('🔥 Starting forced typing animation');
    typeAnimation();
}

// Test 3: Force button functionality
function forceButtonFunctionality() {
    console.log('🔥 FORCING button functionality...');
    
    const joinBtn = document.querySelector('.hero .btn-primary');
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 Join button clicked!');
            const waitlistSection = document.getElementById('waitlist-section');
            if (waitlistSection) {
                waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log('🔥 Scrolled to waitlist');
            } else {
                console.log('❌ Waitlist section not found');
            }
        });
        console.log('🔥 Join button listener added');
    }
    
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    if (enhanceBtn) {
        enhanceBtn.addEventListener('click', function() {
            console.log('🔥 Enhance button clicked! Starting beautiful enhancement...');
            
            // Test the beautiful enhancement function
            if (typeof enhanceMockupPrompt === 'function') {
                enhanceMockupPrompt();
            } else {
                console.log('❌ enhanceMockupPrompt function not found, using fallback');
                const textarea = document.getElementById('mockup-textarea');
                if (textarea) {
                    textarea.textContent = 'Please provide a comprehensive guide to cooking pasta perfectly, including step-by-step instructions, optimal cooking times for different pasta types, common mistakes to avoid, and tips for achieving the ideal texture.';
                    console.log('🔥 Text enhanced with fallback');
                }
            }
        });
        console.log('🔥 Enhance button listener added');
    }
}

// Test 4: Force platform animation and visibility
function forcePlatformAnimation() {
    console.log('🔥 FORCING platform animation...');
    const platformsSection = document.querySelector('.hero-platforms');
    const platformsScroll = document.querySelector('.platforms-scroll');
    
    if (platformsSection) {
        // Force visibility
        platformsSection.style.display = 'block';
        platformsSection.style.visibility = 'visible';
        platformsSection.style.opacity = '1';
        platformsSection.style.height = 'auto';
        console.log('🔥 Platform section forced visible');
    }
    
    if (platformsScroll) {
        platformsScroll.style.animation = 'scroll 80s linear infinite';
        platformsScroll.style.display = 'flex';
        console.log('🔥 Platform animation forced');
    } else {
        console.log('❌ Platform scroll element not found');
    }
    
    // Check if images are broken
    const images = document.querySelectorAll('.platform-logo img');
    console.log('🔥 Found', images.length, 'platform images');
    
    images.forEach((img, index) => {
        img.onerror = function() {
            console.log(`❌ Image ${index} failed to load:`, img.src);
        };
        
        img.onload = function() {
            console.log(`✅ Image ${index} loaded successfully:`, img.src);
        };
        
        // Force reload
        if (!img.complete) {
            const src = img.src;
            img.src = '';
            img.src = src;
        }
    });
}

// Run all tests
function runAllTests() {
    console.log('🚨 RUNNING ALL EMERGENCY TESTS...');
    const elements = testHeroElements();
    forceTypingAnimation();
    forceButtonFunctionality();
    forcePlatformAnimation();
    console.log('🚨 EMERGENCY TESTS COMPLETE');
    return elements;
}

// Auto-run tests after a delay
setTimeout(runAllTests, 1000);

// Manual test functions for console debugging
function testTypewriterManually() {
    console.log('🧪 Testing typewriter effect manually...');
    const textarea = document.getElementById('mockup-textarea');
    if (textarea) {
        const testText = "This is a test of the typewriter effect. Each character should appear one by one.";
        
        // Use our own typewriter function if the global one isn't available
        if (typeof typewriterEffect === 'function') {
            typewriterEffect(textarea, testText, () => {
                console.log('🧪 Manual typewriter test completed!');
            });
        } else {
            console.log('🧪 Using fallback typewriter effect...');
            // Fallback typewriter effect
            textarea.textContent = '';
            let i = 0;
            const speed = 50;
            
            const typeChar = () => {
                if (i < testText.length) {
                    textarea.textContent += testText.charAt(i);
                    i++;
                    setTimeout(typeChar, speed);
                } else {
                    console.log('🧪 Fallback typewriter test completed!');
                }
            };
            
            typeChar();
        }
    } else {
        console.log('❌ Textarea not found for manual test');
    }
}

function testEnhanceButtonManually() {
    console.log('🧪 Testing enhance button manually...');
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    if (enhanceBtn) {
        enhanceBtn.click();
        console.log('🧪 Enhance button clicked manually');
    } else {
        console.log('❌ Enhance button not found for manual test');
    }
}

// Make functions available globally for manual testing
window.emergencyHeroDebug = {
    testHeroElements,
    forceTypingAnimation,
    forceButtonFunctionality,
    forcePlatformAnimation,
    runAllTests,
    testTypewriterManually,
    testEnhanceButtonManually
};
