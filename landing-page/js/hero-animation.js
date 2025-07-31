export class HeroAnimation {
    constructor() {
        this.typingText = document.getElementById('typingText');
        this.phrases = [
            '"help me code"',
            '"write an email"',
            '"explain this concept"',
            '"create content"',
            '"solve this problem"',
            '"analyze data"'
        ];
        
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.isWaiting = false;
        
        this.init();
    }

    init() {
        if (!this.typingText) {
            console.warn('Typing text element not found');
            return;
        }
        
        this.startTyping();
    }

    typeEffect() {
        const current = this.phrases[this.currentPhrase];
        
        if (this.isWaiting) {
            setTimeout(() => this.typeEffect(), 1500); // Wait before starting to delete
            this.isWaiting = false;
            this.isDeleting = true;
            return;
        }
        
        if (this.isDeleting) {
            this.typingText.textContent = current.substring(0, this.currentChar - 1);
            this.currentChar--;
            
            if (this.currentChar === 0) {
                this.isDeleting = false;
                this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            }
        } else {
            this.typingText.textContent = current.substring(0, this.currentChar + 1);
            this.currentChar++;
            
            if (this.currentChar === current.length) {
                this.isWaiting = true;
            }
        }
        
        const speed = this.isDeleting ? 50 : 100;
        setTimeout(() => this.typeEffect(), speed);
    }
    
    startTyping() {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.typeEffect();
        }, 500);
    }

    // Method to add custom phrases
    addPhrase(phrase) {
        this.phrases.push(phrase);
    }

    // Method to pause/resume typing
    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
        this.typeEffect();
    }
}
