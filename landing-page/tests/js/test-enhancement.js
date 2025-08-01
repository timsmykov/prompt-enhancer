// Enhancement functionality testing and logging
let logs = [];

// Capture console logs
const originalLog = console.log;
console.log = function(...args) {
    logs.push(new Date().toLocaleTimeString() + ': ' + args.join(' '));
    updateLogsDisplay();
    originalLog.apply(console, arguments);
};

function updateLogsDisplay() {
    const logsEl = document.getElementById('logs');
    if (logsEl) {
        logsEl.textContent = logs.slice(-20).join('\n'); // Show last 20 logs
        logsEl.scrollTop = logsEl.scrollHeight;
    }
}

function clearLogs() {
    logs = [];
    updateLogsDisplay();
}

function testManualEnhancement() {
    console.log('🧪 Manual enhancement test started');
    const textarea = document.getElementById('mockup-textarea');
    const button = document.getElementById('mockup-enhance-btn');
    
    if (!textarea || !button) {
        console.log('❌ Elements not found');
        return;
    }
    
    // Set test text
    textarea.textContent = 'cook pasta';
    console.log('🧪 Set test text: cook pasta');
    
    // Trigger enhancement
    if (window.enhanceMockupPrompt) {
        window.enhanceMockupPrompt();
        console.log('🧪 Called enhanceMockupPrompt function');
    } else {
        console.log('❌ enhanceMockupPrompt function not found');
        // Try clicking the button
        button.click();
        console.log('🧪 Clicked button instead');
    }
}

function testTypewriter() {
    const testEl = document.getElementById('typewriter-test');
    testEl.textContent = '';
    
    if (window.typewriterEffect) {
        console.log('🧪 Testing typewriter effect');
        window.typewriterEffect(testEl, 'This is a test of the typewriter effect. It should type character by character.', () => {
            console.log('🧪 Typewriter test completed');
        });
    } else {
        console.log('❌ typewriterEffect function not found');
    }
}

function testButtonStates() {
    const button = document.getElementById('mockup-enhance-btn');
    const textarea = document.getElementById('mockup-textarea');
    
    console.log('🧪 Testing button states...');
    
    // Test loading state
    button.classList.add('loading');
    textarea.classList.add('enhancing');
    console.log('🧪 Added loading state');
    
    setTimeout(() => {
        // Test success state
        button.classList.remove('loading');
        button.classList.add('success');
        textarea.classList.remove('enhancing');
        textarea.classList.add('enhanced');
        console.log('🧪 Added success state');
        
        setTimeout(() => {
            // Reset
            button.classList.remove('success');
            textarea.classList.remove('enhanced');
            console.log('🧪 Reset button states');
        }, 2000);
    }, 2000);
}

// Check functionality on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Test page loaded');
    
    setTimeout(() => {
        const status = document.getElementById('status');
        const checks = [];
        
        // Check if functions exist
        checks.push(window.typewriterEffect ? '✅ typewriterEffect function found' : '❌ typewriterEffect function missing');
        checks.push(window.enhanceMockupPrompt ? '✅ enhanceMockupPrompt function found' : '❌ enhanceMockupPrompt function missing');
        
        // Check if elements exist
        const textarea = document.getElementById('mockup-textarea');
        const button = document.getElementById('mockup-enhance-btn');
        checks.push(textarea ? '✅ Textarea found' : '❌ Textarea missing');
        checks.push(button ? '✅ Button found' : '❌ Button missing');
        
        if (status) {
            status.innerHTML = checks.join('<br>');
        }
        
        console.log('🧪 Status check completed');
        checks.forEach(check => console.log(check));
        
    }, 1000);
});

// Expose functions globally for onclick handlers
window.clearLogs = clearLogs;
window.testManualEnhancement = testManualEnhancement;
window.testTypewriter = testTypewriter;
window.testButtonStates = testButtonStates;
