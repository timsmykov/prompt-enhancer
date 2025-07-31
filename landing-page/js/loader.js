
class ComponentLoader {
    constructor() {
        this.components = [
            { id: 'hero-section', file: 'components/hero.html' },
            { id: 'social-proof-section', file: 'components/social-proof.html' },
            { id: 'testimonials-section', file: 'components/testimonials.html' },
            { id: 'before-after-section', file: 'components/before-after.html' },
            { id: 'benefits-section', file: 'components/benefits.html' },
            { id: 'pricing-section', file: 'components/pricing.html' },
            { id: 'how-it-works-section', file: 'components/how-it-works.html' },
            { id: 'waitlist-section', file: 'components/waitlist.html' },
            { id: 'faq-section', file: 'components/faq.html' },
            { id: 'footer-section', file: 'components/footer.html' },
            { id: 'scripts-section', file: 'components/scripts.html' }
        ];
        this.loaded = 0;
        this.total = this.components.length;
    }

    async loadComponent(component) {
        try {
            console.log(`🔄 Loading: ${component.file}`);
            const response = await fetch(component.file);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const html = await response.text();
            const element = document.getElementById(component.id);
            
            if (!element) {
                throw new Error(`Target element #${component.id} not found`);
            }

            // Clear the "Loading..." text
            element.innerHTML = '';
            
            // Create a temporary container for parsing HTML
            const tempDiv = document.createElement('div');
            
            try {
                tempDiv.innerHTML = html;
            } catch (parseError) {
                throw new Error(`HTML parsing failed: ${parseError.message}`);
            }

            // Extract and handle scripts separately
            const scripts = tempDiv.querySelectorAll('script');
            const scriptElements = Array.from(scripts);
            
            // Remove scripts from the HTML content before appending
            scriptElements.forEach(script => script.remove());
            
            // Append all non-script content
            try {
                while (tempDiv.firstChild) {
                    element.appendChild(tempDiv.firstChild);
                }
            } catch (appendError) {
                throw new Error(`Failed to append content: ${appendError.message}`);
            }

            // Handle external scripts (with src attribute) by loading them properly
            const externalScripts = scriptElements.filter(script => script.hasAttribute('src'));
            const inlineScripts = scriptElements.filter(script => !script.hasAttribute('src') && script.textContent && script.textContent.trim());
            
            // Load external scripts
            externalScripts.forEach((oldScript, index) => {
                try {
                    const scriptSrc = oldScript.getAttribute('src');
                    
                    // Check if script is already loaded to avoid duplicates
                    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
                    if (existingScript) {
                        console.log(`📜 Script already loaded: ${scriptSrc}`);
                        return;
                    }
                    
                    const newScript = document.createElement('script');
                    newScript.src = scriptSrc;
                    
                    // Copy other attributes
                    Array.from(oldScript.attributes).forEach(attr => {
                        if (attr.name !== 'src') {
                            newScript.setAttribute(attr.name, attr.value);
                        }
                    });
                    
                    document.head.appendChild(newScript);
                    console.log(`📜 Loaded external script: ${scriptSrc}`);
                } catch (scriptError) {
                    console.warn(`⚠️ External script ${index} in ${component.file} failed to load:`, scriptError);
                }
            });

            // Process inline scripts (should be minimal since we've removed most)
            if (inlineScripts.length > 0) {
                // Filter out Live Server auto-reload scripts
                const nonLiveReloadScripts = inlineScripts.filter(script => {
                    const content = script.textContent.trim();
                    return !content.includes('WebSocket') && !content.includes('refreshCSS');
                });
                
                if (nonLiveReloadScripts.length > 0) {
                    console.warn(`⚠️ Found ${nonLiveReloadScripts.length} actual inline scripts in ${component.file} - these should have been removed during refactoring`);
                    nonLiveReloadScripts.forEach((oldScript, index) => {
                        const scriptContent = oldScript.textContent.trim();
                        console.log(`📜 Inline script ${index} content:`, scriptContent.substring(0, 100) + '...');
                    });
                } else {
                    console.log(`📜 Skipped ${inlineScripts.length} Live Server auto-reload scripts in ${component.file}`);
                }
            }
                
            console.log(`✅ Successfully loaded: ${component.file}`);
            this.loaded++;
            this.updateProgress();
            
        } catch (error) {
            console.error(`❌ Error loading ${component.file}:`, error);
            const element = document.getElementById(component.id);
            if (element) {
                element.innerHTML = `
                    <div style="color: red; padding: 20px; text-align: center; border: 2px solid red; margin: 10px; border-radius: 5px;">
                        <strong>⚠️ Component Load Error</strong><br>
                        File: ${component.file}<br>
                        Error: ${error.message}
                    </div>
                `;
            }
            // Continue loading other components even if one fails
            this.loaded++;
            this.updateProgress();
        }
    }

    updateProgress() {
        const progress = (this.loaded / this.total) * 100;
        console.log(`📊 Loading progress: ${Math.round(progress)}%`);
    }

    async loadAll() {
        console.log('🚀 Starting to load all components...');
        
        try {
            const promises = this.components.map(component => this.loadComponent(component));
            await Promise.all(promises);
            
            console.log('✨ All components processed!');
            
            // Add content-loaded class to body for CSS overrides
            document.body.classList.add('content-loaded');
            
            // Hide loading overlay and show main content
            const loadingOverlay = document.getElementById('loading-overlay');
            const mainContent = document.getElementById('main-content');
            
            if (loadingOverlay) {
                // Debug: Check current state
                console.log('🔍 Before hiding - Overlay display:', getComputedStyle(loadingOverlay).display);
                console.log('🔍 Before hiding - Overlay visibility:', getComputedStyle(loadingOverlay).visibility);
                
                // Force removal using multiple approaches
                loadingOverlay.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                loadingOverlay.classList.add('hidden');
                loadingOverlay.setAttribute('hidden', 'true');
                
                // Force a reflow to ensure changes are applied
                loadingOverlay.offsetHeight;
                
                // Debug: Check state after hiding
                console.log('🔍 After hiding - Overlay display:', getComputedStyle(loadingOverlay).display);
                console.log('🔍 After hiding - Overlay visibility:', getComputedStyle(loadingOverlay).visibility);
                console.log('🔍 After hiding - Has hidden class:', loadingOverlay.classList.contains('hidden'));
                
                // As a nuclear option, remove the element after a brief delay
                setTimeout(() => {
                    const overlayCheck = document.getElementById('loading-overlay');
                    if (overlayCheck && getComputedStyle(overlayCheck).display !== 'none') {
                        console.log('🔥 Nuclear option: Removing overlay element from DOM');
                        overlayCheck.remove();
                    }
                }, 100);
                
                console.log('👻 Loading overlay hidden');
            }
            
            if (mainContent) {
                // Debug: Check main content state
                console.log('🔍 Before showing - Main content display:', getComputedStyle(mainContent).display);
                
                mainContent.style.display = 'block';
                mainContent.style.visibility = 'visible';
                mainContent.classList.add('visible');
                
                // Force a reflow to ensure changes are applied
                mainContent.offsetHeight;
                
                // Debug: Check state after showing
                console.log('🔍 After showing - Main content display:', getComputedStyle(mainContent).display);
                console.log('🔍 After showing - Main content visibility:', getComputedStyle(mainContent).visibility);
                console.log('🔍 After showing - Has visible class:', mainContent.classList.contains('visible'));
                
                console.log('📱 Main content displayed');
            }
            
            // Dispatch event for component initialization
            document.dispatchEvent(new CustomEvent('componentsReady'));
            console.log('📡 Components ready event dispatched');
            
            // Initialize global functions
            this.initializeGlobalFunctions();
            
            console.log('🎉 Landing page is fully ready!');
            
        } catch (error) {
            console.error('💥 Critical error during component loading:', error);
            
            // Show error state
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.innerHTML = `
                    <div style="text-align: center; color: red; padding: 40px;">
                        <h2>❌ Loading Failed</h2>
                        <p>There was an error loading the components.</p>
                        <p style="font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                            ${error.message}
                        </p>
                        <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
                            🔄 Reload Page
                        </button>
                    </div>
                `;
            }
        }
    }

    initializeGlobalFunctions() {
        // Ensure scroll functions are available globally
        if (!window.scrollToWaitlist) {
            window.scrollToWaitlist = function() {
                const waitlistSection = document.getElementById('waitlist-section') || document.getElementById('waitlist');
                if (waitlistSection) {
                    waitlistSection.scrollIntoView({ behavior: 'smooth' });
                }
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded - Initializing ComponentLoader...');
    
    try {
        const loader = new ComponentLoader();
        loader.loadAll().catch(error => {
            console.error('🔥 Fatal error in component loading:', error);
        });
    } catch (error) {
        console.error('💀 Failed to initialize ComponentLoader:', error);
        
        // Fallback: show error message
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: red; padding: 40px;">
                    <h2>❌ Initialization Failed</h2>
                    <p>The component loader failed to start.</p>
                    <p style="font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                        ${error.message}
                    </p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
                        🔄 Reload Page
                    </button>
                </div>
            `;
        }
    }
});
