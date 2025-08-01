// Live Server Optimized ComponentLoader
class EnhancedComponentLoader {
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
        this.loadedScripts = new Set(); // Track loaded scripts
        
        console.log('🚀 Live Server Enhanced Component Loader initialized');
    }

    async loadComponent(component) {
        const startTime = Date.now();
        
        try {
            console.log(`🔄 Loading: ${component.file}`);
            
            // Enhanced fetch with cache busting for Live Server
            const fetchUrl = this.isLiveServer 
                ? `${component.file}?t=${Date.now()}&nocache=1`
                : component.file;
                
            const response = await fetch(fetchUrl, {
                method: 'GET',
                cache: this.isLiveServer ? 'no-cache' : 'default',
                headers: this.isLiveServer ? {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                } : {}
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let html = await response.text();
            const element = document.getElementById(component.id);
            
            if (!element) {
                throw new Error(`Target element #${component.id} not found`);
            }

            // Live Server specific processing
            if (this.isLiveServer) {
                html = this.cleanLiveServerContent(html);
            }

            // Clear the loading text
            element.innerHTML = '';
            
            // Create temporary container for parsing HTML
            const tempDiv = document.createElement('div');
            
            try {
                tempDiv.innerHTML = html;
            } catch (parseError) {
                throw new Error(`HTML parsing failed: ${parseError.message}`);
            }

            // Handle scripts with enhanced Live Server detection
            const scripts = tempDiv.querySelectorAll('script');
            const scriptElements = Array.from(scripts);
            
            // Remove scripts from HTML content before appending
            scriptElements.forEach(script => script.remove());
            
            // Append all non-script content
            try {
                while (tempDiv.firstChild) {
                    element.appendChild(tempDiv.firstChild);
                }
            } catch (appendError) {
                throw new Error(`Failed to append content: ${appendError.message}`);
            }

            // Process scripts with enhanced filtering
            await this.processScripts(scriptElements, component);
            
            const loadTime = Date.now() - startTime;
            console.log(`✅ Successfully loaded: ${component.file} (${loadTime}ms)`);
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
                        Error: ${error.message}<br>
                        Environment: ${this.isLiveServer ? 'Live Server' : 'Standard Server'}
                    </div>
                `;
            }
            this.loaded++;
            this.updateProgress();
        }
    }

    cleanLiveServerContent(html) {
        // Remove Live Server injected content
        const liveServerPatterns = [
            /<script[^>]*vscode[^>]*>.*?<\/script>/gis,
            /<script[^>]*live-server[^>]*>.*?<\/script>/gis,
            /<script[^>]*window\.parent\.postMessage[^>]*>.*?<\/script>/gis,
            /\/\*\s*vscode-fold-start\s*\*\/.*?\/\*\s*vscode-fold-end\s*\*\//gis
        ];
        
        let cleanedHtml = html;
        liveServerPatterns.forEach(pattern => {
            cleanedHtml = cleanedHtml.replace(pattern, '');
        });
        
        return cleanedHtml;
    }

    async processScripts(scriptElements, component) {
        const externalScripts = scriptElements.filter(script => script.hasAttribute('src'));
        const inlineScripts = scriptElements.filter(script => !script.hasAttribute('src') && script.textContent && script.textContent.trim());
        
        // Load external scripts with duplicate checking
        for (const oldScript of externalScripts) {
            try {
                const scriptSrc = oldScript.getAttribute('src');
                
                // Check if script is already loaded
                if (this.loadedScripts.has(scriptSrc)) {
                    console.log(`📜 Script already loaded: ${scriptSrc}`);
                    continue;
                }
                
                const newScript = document.createElement('script');
                newScript.src = scriptSrc;
                
                // Copy other attributes
                Array.from(oldScript.attributes).forEach(attr => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Add script loading promise
                await new Promise((resolve, reject) => {
                    newScript.onload = resolve;
                    newScript.onerror = reject;
                    document.head.appendChild(newScript);
                    
                    // Timeout for script loading
                    setTimeout(reject, 5000);
                });
                
                this.loadedScripts.add(scriptSrc);
                console.log(`📜 Loaded external script: ${scriptSrc}`);
                
            } catch (scriptError) {
                console.warn(`⚠️ External script failed to load in ${component.file}:`, scriptError);
            }
        }

        // Process inline scripts with enhanced Live Server filtering
        if (inlineScripts.length > 0) {
            const filteredScripts = inlineScripts.filter(script => {
                const content = script.textContent.trim();
                
                // Enhanced Live Server detection patterns
                const liveServerPatterns = [
                    'WebSocket',
                    'refreshCSS',
                    'vscode',
                    'live-server',
                    'window.parent.postMessage',
                    'chrome-extension://',
                    '__vscode_'
                ];
                
                return !liveServerPatterns.some(pattern => content.includes(pattern));
            });
            
            if (filteredScripts.length > 0) {
                console.warn(`⚠️ Found ${filteredScripts.length} non-Live Server inline scripts in ${component.file}`);
                filteredScripts.forEach((script, index) => {
                    const content = script.textContent.trim();
                    console.log(`📜 Inline script ${index}:`, content.substring(0, 100) + '...');
                    
                    // Execute inline script if safe
                    try {
                        const scriptElement = document.createElement('script');
                        scriptElement.textContent = content;
                        document.head.appendChild(scriptElement);
                        document.head.removeChild(scriptElement);
                    } catch (execError) {
                        console.warn(`⚠️ Failed to execute inline script:`, execError);
                    }
                });
            } else {
                console.log(`📜 Filtered out ${inlineScripts.length} Live Server scripts in ${component.file}`);
            }
        }
    }

    updateProgress() {
        const progress = (this.loaded / this.total) * 100;
        console.log(`📊 Loading progress: ${Math.round(progress)}% (${this.loaded}/${this.total})`);
        
        // Update any progress indicators on the page
        const progressElement = document.querySelector('.loading-progress, #loading-progress');
        if (progressElement) {
            progressElement.textContent = `Loading... ${Math.round(progress)}%`;
        }
    }

    async loadAll() {
        console.log('🚀 Starting enhanced component loading...');
        console.log(`🔧 Environment: ${this.isLiveServer ? 'Live Server (Enhanced Mode)' : 'Standard Server'}`);
        
        try {
            // Load components sequentially for better error handling
            if (this.isLiveServer) {
                console.log('🔄 Loading components sequentially for Live Server compatibility...');
                for (const component of this.components) {
                    await this.loadComponent(component);
                }
            } else {
                console.log('🔄 Loading components in parallel...');
                const promises = this.components.map(component => this.loadComponent(component));
                await Promise.all(promises);
            }
            
            console.log('✨ All components processed!');
            
            // Add content-loaded class for CSS overrides
            document.body.classList.add('content-loaded');
            
            // Handle loading overlay
            await this.hideLoadingOverlay();
            
            // Dispatch ready event
            document.dispatchEvent(new CustomEvent('componentsReady', {
                detail: { 
                    environment: this.isLiveServer ? 'live-server' : 'standard',
                    loadedCount: this.loaded,
                    totalCount: this.total
                }
            }));
            
            console.log('📡 Components ready event dispatched');
            
            // Initialize global functions
            this.initializeGlobalFunctions();
            
            console.log('🎉 Enhanced landing page is fully ready!');
            
        } catch (error) {
            console.error('💥 Critical error during enhanced component loading:', error);
            this.showErrorState(error);
        }
    }

    async hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const mainContent = document.getElementById('main-content');
        
        if (loadingOverlay) {
            console.log('👻 Hiding loading overlay...');
            
            // Multiple approaches for hiding overlay
            loadingOverlay.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            loadingOverlay.classList.add('hidden');
            loadingOverlay.setAttribute('hidden', 'true');
            
            // Force reflow
            loadingOverlay.offsetHeight;
            
            // Remove after delay if still visible
            setTimeout(() => {
                if (loadingOverlay.parentNode && getComputedStyle(loadingOverlay).display !== 'none') {
                    console.log('🔥 Forcing overlay removal');
                    loadingOverlay.remove();
                }
            }, 100);
        }
        
        if (mainContent) {
            console.log('📱 Showing main content...');
            mainContent.style.display = 'block';
            mainContent.style.visibility = 'visible';
            mainContent.classList.add('visible');
        }
    }

    showErrorState(error) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: red; padding: 40px;">
                    <h2>❌ Enhanced Loading Failed</h2>
                    <p>There was an error loading the components.</p>
                    <p><strong>Environment:</strong> ${this.isLiveServer ? 'Live Server' : 'Standard Server'}</p>
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

        // Add environment-specific initializations
        if (this.isLiveServer) {
            console.log('🔧 Initializing Live Server specific functions...');
            // Add any Live Server specific initialization here
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded - Initializing Enhanced ComponentLoader...');
    
    try {
        const loader = new EnhancedComponentLoader();
        loader.loadAll().catch(error => {
            console.error('🔥 Fatal error in enhanced component loading:', error);
        });
    } catch (error) {
        console.error('💀 Failed to initialize Enhanced ComponentLoader:', error);
        
        // Fallback error display
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: red; padding: 40px;">
                    <h2>❌ Enhanced Initialization Failed</h2>
                    <p>The enhanced component loader failed to start.</p>
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
