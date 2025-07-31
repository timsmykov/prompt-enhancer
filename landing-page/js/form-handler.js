import { Config, Utils } from './core.js';
import { Analytics } from './analytics.js';

export class FormHandler {
    constructor() {
        this.waitlistForm = document.getElementById('waitlist-form');
        this.formSuccess = document.getElementById('form-success');
        this.init();
    }

    init() {
        if (!this.waitlistForm) return;
        
        this.waitlistForm.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.waitlistForm);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Basic validation
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!Utils.isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show loading state
        const submitBtn = this.waitlistForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(Config.FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: `New Prompt Enhancer waitlist signup from ${name} (${email})`
                })
            });

            if (response.ok) {
                this.showSuccess();
                this.trackConversion(name, email);
            } else {
                throw new Error('Form submission error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError(name, email);
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccess() {
        this.waitlistForm.style.display = 'none';
        this.formSuccess.style.display = 'block';
    }

    handleSubmissionError(name, email) {
        // Fallback: try to open email client
        const subject = encodeURIComponent('Prompt Enhancer Waitlist Request');
        const body = encodeURIComponent(`Hello!\n\nMy name is ${name}, and I want to join the waitlist for Prompt Enhancer.\n\nMy email: ${email}\n\nThank you!`);
        const mailtoLink = `mailto:${Config.SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
        
        if (confirm('Could not submit form automatically. Open email client to send request?')) {
            window.location.href = mailtoLink;
            this.showSuccess();
        } else {
            alert(`Please try again or email us at ${Config.SUPPORT_EMAIL}`);
        }
    }

    trackConversion(name, email) {
        // Track with analytics
        Analytics.trackEvent('waitlist_signup', {
            name: name,
            email: email
        });
        
        // Google Analytics conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
            });
        }
        
        // Store in localStorage
        Utils.storage.set('prompt_enhancer_waitlist', {
            name: name,
            email: email,
            timestamp: new Date().toISOString()
        });
    }
}
