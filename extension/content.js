// Prompt Enhancer Extension - Clean Implementation
// Injects a single "Enhance" button into ChatGPT's toolbar

class PromptEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Try to inject immediately
        this.injectEnhanceButton();
        
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.injectEnhanceButton());
        }
        
        // Also try when page is fully loaded
        window.addEventListener('load', () => this.injectEnhanceButton());
        
        // Aggressive retry attempts for immediate visibility
        setTimeout(() => this.injectEnhanceButton(), 100);
        setTimeout(() => this.injectEnhanceButton(), 300);
        setTimeout(() => this.injectEnhanceButton(), 500);
        setTimeout(() => this.injectEnhanceButton(), 1000);
        setTimeout(() => this.injectEnhanceButton(), 2000);
        setTimeout(() => this.injectEnhanceButton(), 3000);

        // Watch for dynamic content changes
        this.observeChanges();
    }

    createEnhanceButton() {
        const button = document.createElement('button');
        button.className = 'enhance-btn';
        button.setAttribute('title', 'Enhance your prompt with AI');
        button.setAttribute('aria-label', 'Enhance prompt');
        button.type = 'button';
        
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <span>Enhance</span>
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleEnhance(button);
        });

        return button;
    }

    injectEnhanceButton() {
        // Check if button already exists
        if (document.querySelector('.enhance-btn')) {
            return;
        }

        // Look for the toolbar that contains microphone and send buttons
        const toolbar = this.findToolbar();
        if (!toolbar) {
            // Retry after a delay
            setTimeout(() => this.injectEnhanceButton(), 500);
            return;
        }

        const enhanceButton = this.createEnhanceButton();
        const hostname = window.location.hostname;
        
        try {
            // Platform-specific insertion logic
            if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
                // ChatGPT: Insert right after the Tools button
                const toolsButton = toolbar.querySelector('button[aria-label*="Tools"]') ||
                                   Array.from(toolbar.querySelectorAll('button')).find(btn => 
                                       btn.textContent?.includes('Tools')
                                   );
                
                if (toolsButton) {
                    // Insert right after the Tools button
                    toolsButton.insertAdjacentElement('afterend', enhanceButton);
                    console.log('ChatGPT: Enhance button inserted after Tools button');
                } else {
                    // Fallback: append to toolbar
                    toolbar.appendChild(enhanceButton);
                    console.log('ChatGPT: Enhance button appended to toolbar (fallback)');
                }
            } 
            else if (hostname.includes('grok') || hostname.includes('x.ai')) {
                // Grok: Look for voice button
                const micButton = toolbar.querySelector('button[aria-label*="voice"]') ||
                                 toolbar.querySelector('button[title*="voice"]');
                if (micButton) {
                    toolbar.insertBefore(enhanceButton, micButton);
                    console.log('Grok: Enhance button inserted before voice button');
                } else {
                    toolbar.appendChild(enhanceButton);
                    console.log('Grok: Enhance button appended to toolbar');
                }
            }
            else {
                // Universal: Try both types of microphone buttons
                const micButton = toolbar.querySelector('button[aria-label*="Dictate"]') ||
                                 toolbar.querySelector('button[aria-label*="voice"]') ||
                                 toolbar.querySelector('button[title*="voice"]');
                if (micButton) {
                    toolbar.insertBefore(enhanceButton, micButton);
                    console.log('Universal: Enhance button inserted before microphone button');
                } else {
                    toolbar.appendChild(enhanceButton);
                    console.log('Universal: Enhance button appended to toolbar');
                }
            }
        } catch (error) {
            console.error('Failed to insert button:', error);
            // Last resort: try to append somewhere
            try {
                toolbar.appendChild(enhanceButton);
                console.log('Fallback: Button appended after error');
            } catch (appendError) {
                console.error('Complete failure to insert button:', appendError);
            }
        }
    }

    findToolbar() {
        // Detect platform first
        const hostname = window.location.hostname;
        console.log('Platform detected:', hostname);
        
        // ChatGPT specific logic
        if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
            console.log('Using ChatGPT detection logic');
            
            // Strategy 1: Find the Tools button and use its parent container
            const toolsButton = document.querySelector('button[aria-label*="Tools"]') ||
                               Array.from(document.querySelectorAll('button')).find(btn => 
                                   btn.textContent?.includes('Tools')
                               );
            
            if (toolsButton) {
                console.log('Found ChatGPT Tools button, using its parent container');
                return toolsButton.parentElement;
            }
            
            // Strategy 2: Look for the left toolbar container
            const footerActions = document.querySelector('[data-testid="composer-footer-actions"]');
            if (footerActions) {
                console.log('Found ChatGPT footer actions container');
                return footerActions;
            }
            
            // Strategy 3: Find any container that has the Tools button
            const allContainers = document.querySelectorAll('div[class*="flex"]');
            for (const container of allContainers) {
                const hasTools = container.querySelector('button[aria-label*="Tools"]') ||
                                container.textContent?.includes('Tools');
                
                if (hasTools) {
                    console.log('Found ChatGPT container with Tools button');
                    return container;
                }
            }
        }
        
        // Grok specific logic (keep existing working logic)
        else if (hostname.includes('grok') || hostname.includes('x.ai')) {
            console.log('Using Grok detection logic');
            
            // For Grok, use the existing logic that works
            const micButton = document.querySelector('button[aria-label*="voice"]') ||
                              document.querySelector('button[title*="voice"]');
            if (micButton) {
                console.log('Found Grok microphone button');
                return micButton.parentElement;
            }
        }
        
        // Universal fallback for any platform
        console.log('Using universal fallback logic');
        
        // Look for any microphone button
        const anyMicButton = document.querySelector('button[aria-label*="voice"]') ||
                            document.querySelector('button[aria-label*="Dictate"]') ||
                            document.querySelector('button[title*="voice"]');
        if (anyMicButton) {
            console.log('Found microphone button via universal search');
            return anyMicButton.parentElement;
        }

        // Look for send button
        const anySendButton = document.querySelector('[data-testid="send-button"]') ||
                             document.querySelector('button[type="submit"]');
        if (anySendButton) {
            console.log('Found send button via universal search');
            return anySendButton.parentElement;
        }

        console.log('No toolbar found on any platform');
        return null;
    }

    // Removed findToolbar method as we're using a simpler approach

    async handleEnhance(button) {
        const textarea = this.findTextarea();
        if (!textarea) {
            console.error('Could not find textarea');
            return;
        }

        const originalText = this.getTextareaValue(textarea);
        if (!originalText.trim()) {
            alert('Please enter a prompt first');
            return;
        }

        // Set loading state
        button.classList.add('loading');
        button.disabled = true;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>Enhancing...</span>
        `;

        try {
            // Call enhancement API
            const enhancedText = await this.enhancePrompt(originalText);
            
            // Set the enhanced text
            this.setTextareaValue(textarea, enhancedText);
            
            // Show success state
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <span>Enhanced!</span>
            `;
            
            // Reset button state after 2 seconds
            setTimeout(() => {
                button.classList.remove('success');
                button.disabled = false;
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    <span>Enhance</span>
                `;
            }, 2000);

        } catch (error) {
            console.error('Enhancement failed:', error);
            button.classList.remove('loading');
            button.disabled = false;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                <span>Enhance</span>
            `;
            alert('Enhancement failed. Please try again.');
        }
    }

    findTextarea() {
        const hostname = window.location.hostname;
        
        // ChatGPT specific input detection
        if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
            console.log('Looking for ChatGPT input field');
            
            // ChatGPT uses ProseMirror contenteditable div
            const proseMirror = document.querySelector('.ProseMirror#prompt-textarea') ||
                               document.querySelector('div[contenteditable="true"]#prompt-textarea') ||
                               document.querySelector('.ProseMirror[contenteditable="true"]');
            
            if (proseMirror) {
                console.log('Found ChatGPT ProseMirror input');
                return proseMirror;
            }
            
            // Fallback: look for any contenteditable div
            const contentEditable = document.querySelector('div[contenteditable="true"]');
            if (contentEditable) {
                console.log('Found ChatGPT contenteditable fallback');
                return contentEditable;
            }
        }
        
        // Grok and other platforms - regular textarea
        else {
            console.log('Looking for regular textarea');
            const selectors = [
                'textarea[placeholder*="Message"]',
                'textarea[data-id="root"]',
                '#prompt-textarea',
                'textarea'
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.offsetHeight > 0) {
                    console.log('Found textarea:', selector);
                    return element;
                }
            }
        }

        console.log('No input field found');
        return null;
    }

    getTextareaValue(inputElement) {
        if (!inputElement) return '';
        
        const hostname = window.location.hostname;
        
        // ChatGPT uses contenteditable div
        if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
            if (inputElement.contentEditable === 'true') {
                // Get text content from ProseMirror/contenteditable
                const text = inputElement.textContent || inputElement.innerText || '';
                console.log('ChatGPT input text:', text);
                return text.trim();
            }
        }
        
        // Regular textarea (Grok and others)
        if (inputElement.tagName === 'TEXTAREA') {
            const text = inputElement.value || '';
            console.log('Textarea input text:', text);
            return text.trim();
        }
        
        // Fallback: try both methods
        const text = inputElement.value || inputElement.textContent || inputElement.innerText || '';
        console.log('Fallback input text:', text);
        return text.trim();
    }

    setTextareaValue(inputElement, value) {
        if (!inputElement) return;
        
        const hostname = window.location.hostname;
        
        // ChatGPT uses contenteditable div (ProseMirror)
        if (hostname.includes('chatgpt.com') || hostname.includes('chat.openai.com')) {
            if (inputElement.contentEditable === 'true') {
                // For ProseMirror, we need to set innerHTML with proper paragraph structure
                inputElement.innerHTML = `<p>${value}</p>`;
                
                // Trigger events that ChatGPT expects
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                
                // Focus the element
                inputElement.focus();
                
                console.log('ChatGPT input updated with enhanced text');
                return;
            }
        }
        
        // Regular textarea (Grok and others)
        if (inputElement.tagName === 'TEXTAREA') {
            inputElement.value = value;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            inputElement.focus();
            console.log('Textarea updated with enhanced text');
            return;
        }
        
        // Fallback: try both methods
        if (inputElement.value !== undefined) {
            inputElement.value = value;
        } else {
            inputElement.textContent = value;
        }
        
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        inputElement.focus();
        console.log('Fallback input updated with enhanced text');
    }

    async enhancePrompt(originalPrompt) {
        // Mock enhancement - replace with your actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const enhanced = `Please provide a comprehensive and detailed response to the following request:

${originalPrompt}

Include:
- Step-by-step explanations
- Relevant examples
- Best practices
- Common pitfalls to avoid

Make your response clear, actionable, and well-structured.`;
                resolve(enhanced);
            }, 1500);
        });
    }

    observeChanges() {
        const observer = new MutationObserver((mutations) => {
            // Check if button still exists
            if (!document.querySelector('.enhance-btn')) {
                // Try to inject immediately when DOM changes
                setTimeout(() => this.injectEnhanceButton(), 100);
            }
            
            // Also check if new elements were added that might contain the send button
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain a send button
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const sendButton = node.querySelector ? node.querySelector('[data-testid="send-button"]') : null;
                            if (sendButton || node.getAttribute?.('data-testid') === 'send-button') {
                                setTimeout(() => this.injectEnhanceButton(), 50);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also set up a periodic check every 2 seconds as backup
        setInterval(() => {
            if (!document.querySelector('.enhance-btn')) {
                this.injectEnhanceButton();
            }
        }, 2000);
    }
}

// Initialize when script loads
if (typeof window !== 'undefined') {
    new PromptEnhancer();
}