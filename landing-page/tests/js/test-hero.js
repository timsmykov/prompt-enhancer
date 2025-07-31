// Simple test script to verify hero functionality
console.log('=== HERO FUNCTIONALITY TEST ===');

// Test 1: Check if elements exist
setTimeout(() => {
    console.log('Testing elements after 2 seconds...');
    
    const typingText = document.getElementById('typingText');
    const joinBtn = document.querySelector('.hero .btn-primary');
    const enhanceBtn = document.getElementById('mockup-enhance-btn');
    
    console.log('Elements found:');
    console.log('- typingText:', !!typingText, typingText);
    console.log('- joinBtn:', !!joinBtn, joinBtn);
    console.log('- enhanceBtn:', !!enhanceBtn, enhanceBtn);
    
    // Test 2: Check if typing animation is working
    if (typingText) {
        console.log('Typing text content:', '"' + typingText.textContent + '"');
        if (typingText.textContent.length === 0) {
            console.warn('⚠️ Typing animation might not be working');
        } else {
            console.log('✅ Typing animation appears to be working');
        }
    }
    
    // Test 3: Check if scrollToWaitlist function exists
    console.log('scrollToWaitlist function:', typeof window.scrollToWaitlist);
    
    // Test 4: Try to trigger functions manually
    if (joinBtn) {
        console.log('Join button click test...');
        joinBtn.addEventListener('click', () => {
            console.log('🎯 Join button clicked successfully!');
        });
    }
    
    if (enhanceBtn) {
        console.log('Enhance button click test...');
        enhanceBtn.addEventListener('click', () => {
            console.log('🎯 Enhance button clicked successfully!');
        });
    }
    
}, 2000);

// Test 5: Monitor typing text changes
let lastTypingContent = '';
setInterval(() => {
    const typingText = document.getElementById('typingText');
    if (typingText && typingText.textContent !== lastTypingContent) {
        console.log('🔄 Typing text changed to:', '"' + typingText.textContent + '"');
        lastTypingContent = typingText.textContent;
    }
}, 500);
