// Modern Typing Animation - Fresh Implementation
console.log('🎯 New typing animation loaded');

// Prevent multiple instances and conflicts
if (window.typingAnimationInstance) {
    console.log('🎯 Stopping existing typing animation instance');
    window.typingAnimationInstance.stop();
    window.typingAnimationInstance = null;
}

class TypingAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.phrases = options.phrases || ['simple questions', 'basic requests', 'rough ideas', 'quick thoughts', 'unclear prompts'];
        this.typeSpeed = options.typeSpeed || 80;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseAfterType = options.pauseAfterType || 1500;
        this.pauseAfterDelete = options.pauseAfterDelete || 300;
        
        this.currentPhraseIndex = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.timer = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        if (!this.element) {
            console.warn('Typing animation: Element not found');
            return;
        }
        
        // Add cursor
        this.element.style.position = 'relative';
        this.addCursor();
        
        // Start animation
        this.start();
    }
    
    addCursor() {
        // Add cursor via CSS pseudo-element
        const style = document.createElement('style');
        style.textContent = `
            .typing-animated::after {
                content: '|';
                color: #10b981;
                animation: cursor-blink 1s infinite;
                margin-left: 2px;
            }
            
            .typing-animated.typing-active::after {
                animation: none;
                opacity: 1;
            }
            
            @keyframes cursor-blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        this.element.classList.add('typing-animated');
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.currentPhraseIndex = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    stop() {
        this.isRunning = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.element.classList.remove('typing-active');
    }
    
    type() {
        if (!this.isRunning) return;
        
        const currentPhrase = this.phrases[this.currentPhraseIndex];
        
        // Add typing-active class to stop cursor blinking
        this.element.classList.add('typing-active');
        
        if (!this.isDeleting) {
            // Typing
            this.element.textContent = currentPhrase.slice(0, this.currentChar + 1);
            this.currentChar++;
            
            if (this.currentChar === currentPhrase.length) {
                // Finished typing current phrase
                this.element.classList.remove('typing-active');
                this.timer = setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pauseAfterType);
                return;
            }
            
            this.timer = setTimeout(() => this.type(), this.typeSpeed);
        } else {
            // Deleting
            this.element.textContent = currentPhrase.slice(0, this.currentChar);
            this.currentChar--;
            
            if (this.currentChar < 0) {
                // Finished deleting
                this.isDeleting = false;
                this.currentChar = 0;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
                
                this.timer = setTimeout(() => this.type(), this.pauseAfterDelete);
                return;
            }
            
            this.timer = setTimeout(() => this.type(), this.deleteSpeed);
        }
    }
}

// Initialize typing animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed for typing animation.');

    const typingElement = document.getElementById('typingText');
    
    if (typingElement) {
        const options = {
            phrases: [
                'simple questions', 
                'basic requests', 
                'rough ideas', 
                'quick thoughts', 
                'unclear prompts'
            ],
            typeSpeed: 80,
            deleteSpeed: 50,
            pauseAfterType: 1800,
            pauseAfterDelete: 300,
        };
        
        // Ensure only one instance is running
        if (!window.typingAnimationInstance) {
            console.log('🚀 Initializing new typing animation');
            window.typingAnimationInstance = new TypingAnimation(typingElement, options);
        } else {
            console.log('🔄 Typing animation instance already exists.');
        }
    } else {
        console.warn('Typing animation target element #typingText not found.');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.typingAnimation) {
        window.typingAnimation.stop();
    }
});

// Export for manual initialization
window.TypingAnimation = TypingAnimation;
window.initializeNewTypingAnimation = initializeNewTypingAnimation;
