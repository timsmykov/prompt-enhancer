// Main entry point for modular JavaScript
import { Config, Utils } from './core.js';
import { FormHandler } from './form-handler.js';
import { UIInteractions } from './ui-interactions.js';
import { HeroAnimation } from './hero-animation.js';
import { DragHandler } from './drag-handler.js';
import { Analytics } from './analytics.js';
import { ScrollEffects } from './scroll-effects.js';

export class PromptEnhancerApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        console.log('🚀 PromptEnhancerApp constructor called');
    }

    async init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        try {
            console.log('🚀 Initializing Prompt Enhancer Landing Page...');

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Wait for components to be ready
            if (!document.querySelector('.hero')) {
                await new Promise(resolve => {
                    document.addEventListener('componentsReady', resolve);
                });
                // Give components a bit more time to settle
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Initialize core modules
            this.initializeModules();

            // Initialize demo functionality
            this.initializeDemoFunctionality();

            // Set global functions for legacy support
            this.setupGlobalFunctions();

            this.isInitialized = true;
            console.log('✅ Prompt Enhancer Landing Page initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            Analytics.trackEvent('app_initialization_error', {
                error_message: error.message,
                stack: error.stack
            });
        }
    }

    initializeModules() {
        // Initialize analytics first (other modules depend on it)
        this.modules.analytics = new Analytics();

        // Initialize form handler
        this.modules.formHandler = new FormHandler();

        // Initialize UI interactions
        this.modules.uiInteractions = new UIInteractions();

        // Initialize hero animation
        this.modules.heroAnimation = new HeroAnimation();

        // Initialize drag handler
        this.modules.dragHandler = new DragHandler();

        // Initialize scroll effects
        this.modules.scrollEffects = new ScrollEffects();

        console.log('📦 All modules initialized:', Object.keys(this.modules));
    }

    initializeDemoFunctionality() {
        // Demo enhancement functionality
        const demoInput = document.getElementById('demo-input');
        const demoButton = document.getElementById('demo-enhance-btn');
        const demoResult = document.getElementById('demo-result');

        if (demoInput && demoButton && demoResult) {
            // Bind demo enhancement function
            window.enhanceDemo = () => this.handleDemoEnhancement();

            // Add enter key support for demo
            demoInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    this.handleDemoEnhancement();
                }
            });

            console.log('🎮 Demo functionality initialized');
        }

        // Mockup enhancement functionality
        const mockupButton = document.getElementById('mockup-enhance-btn');
        if (mockupButton) {
            window.enhanceMockupPrompt = () => this.handleMockupEnhancement();
            console.log('🖥️ Mockup functionality initialized');
        }
    }

    handleDemoEnhancement() {
        const input = document.getElementById('demo-input');
        const button = document.getElementById('demo-enhance-btn');
        const result = document.getElementById('demo-result');

        const userPrompt = input.value.trim().toLowerCase();

        if (!userPrompt) {
            // Add shake animation to input
            input.style.animation = 'shake 0.5s ease-in-out';
            input.focus();
            setTimeout(() => input.style.animation = '', 500);
            return;
        }

        // Track demo usage
        Analytics.trackEvent('demo_used', { 
            prompt_length: userPrompt.length,
            prompt_preview: userPrompt.substring(0, 50)
        });

        // Show loading state
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
                    <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
            Analyzing & Enhancing...
        `;

        // Simulate realistic processing delay
        setTimeout(() => {
            const enhancedPrompt = this.getEnhancedPrompt(userPrompt);
            
            // Show result
            result.style.display = 'block';
            result.innerHTML = `<strong>Enhanced Prompt:</strong><br>${enhancedPrompt}`;
            
            // Reset button
            button.disabled = false;
            button.style.background = '';
            button.innerHTML = 'Enhance Prompt';
            
            // Track enhancement completion
            Analytics.trackEvent('demo_enhancement_completed', {
                original_length: userPrompt.length,
                enhanced_length: enhancedPrompt.length
            });

        }, 2000 + Math.random() * 1000); // 2-3 seconds
    }

    handleMockupEnhancement() {
        const textarea = document.getElementById('mockup-textarea');
        const button = document.getElementById('mockup-enhance-btn');
        const originalText = textarea.textContent.trim();

        // Don't enhance if already enhanced or empty
        if (originalText.length > 100 || !originalText) {
            return;
        }

        // Set loading state
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none">
                    <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
            <span>Enhancing...</span>
        `;

        // Track mockup enhancement
        Analytics.trackEvent('mockup_enhancement_used', {
            original_prompt: originalText
        });

        // Simulate typing effect with enhanced prompt
        setTimeout(() => {
            const enhancedPrompt = this.getEnhancedPrompt(originalText);
            this.typewriterEffect(textarea, enhancedPrompt, () => {
                // Reset button to success state
                button.classList.remove('loading');
                button.classList.add('success');
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    <span>Enhanced!</span>
                `;

                // Reset after delay
                setTimeout(() => {
                    button.disabled = false;
                    button.classList.remove('success');
                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        </svg>
                        <span>Enhance</span>
                    `;
                }, 3000);
            });
        }, 1500);
    }

    getEnhancedPrompt(originalPrompt) {
        // Enhancement examples mapping
        const enhancementExamples = {
            'help me code': 'I need assistance with programming. Please provide clear, well-commented code examples with explanations of the logic and best practices. Include error handling where appropriate and suggest testing approaches.',
            'write an email': 'Please help me compose a professional email. Include a clear subject line, proper greeting, structured body paragraphs with specific details, and an appropriate closing. Ensure the tone matches the context and recipient.',
            'explain this concept': 'Please provide a comprehensive explanation of this concept. Break it down into digestible parts, use relevant examples or analogies, explain the practical applications, and highlight key takeaways or important nuances.',
            'create content': 'I need help creating engaging content. Please ensure it\'s well-structured, includes compelling headlines, incorporates relevant keywords naturally, maintains consistency in tone and style, and includes clear calls-to-action where appropriate.',
            'solve this problem': 'Please help me solve this problem systematically. Break down the issue into smaller components, analyze potential causes, suggest multiple solution approaches, weigh pros and cons, and provide step-by-step implementation guidance.',
            'analyze data': 'Please help me analyze this data thoroughly. Identify key patterns and trends, highlight significant insights, explain the methodology used, discuss potential limitations or biases, and suggest actionable recommendations based on the findings.'
        };

        // Find matching example or create generic enhancement
        let enhancedPrompt = '';

        // Check for exact or partial matches
        for (const [key, value] of Object.entries(enhancementExamples)) {
            if (originalPrompt.includes(key) || key.includes(originalPrompt)) {
                enhancedPrompt = value;
                break;
            }
        }

        // Generic enhancement if no match found
        if (!enhancedPrompt) {
            enhancedPrompt = `Please provide a comprehensive and detailed response to: "${originalPrompt}". Include relevant context, specific examples, step-by-step guidance where applicable, and ensure the information is accurate and actionable. Consider potential follow-up questions and provide additional resources if helpful.`;
        }

        return enhancedPrompt;
    }

    typewriterEffect(element, text, callback) {
        element.textContent = '';
        let i = 0;
        const speed = 30; // Typing speed

        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        };

        typeChar();
    }

    setupGlobalFunctions() {
        // Legacy support for global functions
        window.scrollToWaitlist = () => {
            Utils.scrollToElement('#waitlist');
            Analytics.trackEvent('scroll_to_waitlist', { trigger: 'button_click' });
        };

        // Expose modules for debugging
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.PromptEnhancerApp = this;
            window.Analytics = Analytics;
            console.log('🔧 Debug mode: App instance available at window.PromptEnhancerApp');
        }
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    isReady() {
        return this.isInitialized;
    }

    destroy() {
        // Cleanup method for testing or page unload
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
        console.log('🧹 App destroyed and cleaned up');
    }

// Export the class for module imports
export { PromptEnhancerApp };

// Initialize the app if this script is loaded directly (not as a module)
if (typeof window !== 'undefined' && !window.moduleLoading) {
    const app = new PromptEnhancerApp();
    app.init();
}
