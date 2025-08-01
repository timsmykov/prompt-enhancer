class ComponentLoader {
    constructor() {
        this.components = [
            { id: 'header-section', file: 'components/header.html' },
            { id: 'hero-section', file: 'components/hero.html' },
            { id: 'demo-section', file: 'components/demo.html' },
            { id: 'social-proof-section', file: 'components/social-proof.html' },
            { id: 'testimonials-section', file: 'components/testimonials.html' },
            { id: 'before-after-section', file: 'components/before-after.html' },
            { id: 'benefits-section', file: 'components/benefits.html' },
            { id: 'how-it-works-section', file: 'components/how-it-works.html' },
            { id: 'pricing-section', file: 'components/pricing.html' },
            { id: 'faq-section', file: 'components/faq.html' },
            { id: 'waitlist-section', file: 'components/waitlist.html' },
            { id: 'footer-section', file: 'components/footer.html' },
            { id: 'scripts-section', file: 'components/scripts.html' }
        ];
        this.loaded = 0;
        this.total = this.components.length;
        this.isLiveServer = this.detectLiveServer();
        
        console.log(`🚀 Live Server Component Loader initialized (Port: ${window.location.port})`);
        console.log(`🔍 Live Server detected: ${this.isLiveServer ? 'Yes' : 'No'}`);
    }

    detectLiveServer() {
        // Check for common Live Server ports and indicators
        return (
            window.location.port === '5500' ||
            window.location.port === '5501' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === 'localhost' ||
            document.querySelector('script[src*="vscode"]') !== null ||
            navigator.userAgent.includes('vscode')
        );
    }

    async loadComponent(component) {
        try {
            console.log(`🔄 Loading: ${component.file}`);
            
            // Optimized for Live Server with cache busting
            const fetchUrl = `${component.file}?t=${Date.now()}&live=1`;
            const response = await fetch(fetchUrl, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let html = await response.text();
            
            // Debug: Save the raw HTML before cleaning for inspection
            if (component.file === 'components/hero.html') {
                console.log('🔍 RAW HTML from server (first 500 chars):', html.substring(0, 500));
                console.log('🔍 RAW HTML from server (last 500 chars):', html.substring(html.length - 500));
                console.log('🔍 RAW HTML contains "hero-platforms":', html.includes('hero-platforms'));
                console.log('🔍 RAW HTML contains "</section>":', html.includes('</section>'));
                console.log('🔍 RAW HTML contains "script":', html.includes('<script'));
            }
            
            // Clean Live Server injected content
            html = this.cleanLiveServerContent(html);
            
            // Debug: Check if hero-platforms exists in the HTML content
            if (component.file === 'components/hero.html') {
                const hasPlatforms = html.includes('hero-platforms');
                const platformsIndex = html.indexOf('hero-platforms');
                console.log(`🔍 Hero platforms debug:`, 
                    `hasPlatforms: ${hasPlatforms}`,
                    `platformsIndex: ${platformsIndex}`,
                    `contentLength: ${html.length}`,
                    `lastChars: ${html.slice(-200)}`
                );
            }
            
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
                
                // Debug: Check if hero-platforms exists after DOM parsing
                if (component.file === 'components/hero.html') {
                    const platformsInTemp = tempDiv.querySelector('.hero-platforms');
                    console.log(`🔍 Hero platforms after DOM parsing:`,
                        `platformsExists: ${!!platformsInTemp}`,
                        `tempDivChildren: ${tempDiv.children.length}`,
                        `tempDivHTML: ${tempDiv.innerHTML.length}`
                    );
                }
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
                
                // Debug: Check if hero-platforms exists after appending
                if (component.file === 'components/hero.html') {
                    const platformsInElement = element.querySelector('.hero-platforms');
                    console.log(`🔍 Hero platforms after appending:`,
                        `platformsExists: ${!!platformsInElement}`,
                        `elementChildren: ${element.children.length}`,
                        `elementHTML: ${element.innerHTML.length}`
                    );
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

            // Process inline scripts with Live Server filtering
            if (inlineScripts.length > 0) {
                // Filter out Live Server auto-reload and debugging scripts
                const nonLiveReloadScripts = inlineScripts.filter(script => {
                    const content = script.textContent.trim();
                    const liveServerPatterns = [
                        'WebSocket', 'refreshCSS', 'vscode', 'live-server',
                        'window.parent.postMessage', 'chrome-extension://', '__vscode_',
                        'LiveReload', 'livereload', 'ws://', 'socket.io'
                    ];
                    return !liveServerPatterns.some(pattern => content.includes(pattern));
                });
                
                if (nonLiveReloadScripts.length > 0) {
                    console.warn(`⚠️ Found ${nonLiveReloadScripts.length} actual inline scripts in ${component.file} - these should have been removed during refactoring`);
                    nonLiveReloadScripts.forEach((oldScript, index) => {
                        const scriptContent = oldScript.textContent.trim();
                        console.log(`📜 Inline script ${index} content:`, scriptContent.substring(0, 100) + '...');
                    });
                } else {
                    console.log(`📜 Filtered out ${inlineScripts.length} Live Server scripts in ${component.file}`);
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

    cleanLiveServerContent(html) {
        // Remove Live Server injected content and debugging scripts
        const liveServerPatterns = [
            /<script[^>]*vscode[^>]*>.*?<\/script>/gis,
            /<script[^>]*live-server[^>]*>.*?<\/script>/gis,
            /<script[^>]*livereload[^>]*>.*?<\/script>/gis,
            /<script[^>]*window\.parent\.postMessage[^>]*>.*?<\/script>/gis,
            /<script[^>]*WebSocket[^>]*>.*?<\/script>/gis,
            /<script[^>]*ws:\/\/[^>]*>.*?<\/script>/gis,
            /\/\*\s*vscode-fold-start\s*\*\/.*?\/\*\s*vscode-fold-end\s*\*\//gis,
            /<!-- Live Server injected script -->.*?<!-- End Live Server script -->/gis
        ];
        
        let cleanedHtml = html;
        liveServerPatterns.forEach(pattern => {
            cleanedHtml = cleanedHtml.replace(pattern, '');
        });
        
        console.log(`🧹 Cleaned Live Server content from HTML (${html.length} → ${cleanedHtml.length} chars)`);
        return cleanedHtml;
    }

    updateProgress() {
        const progress = (this.loaded / this.total) * 100;
        console.log(`📊 Loading progress: ${Math.round(progress)}%`);
    }

    async loadAll() {
        console.log('🚀 Starting Live Server optimized component loading...');
        
        try {
            // Load components sequentially for better Live Server compatibility
            console.log('🔄 Loading components sequentially for Live Server...');
            for (const component of this.components) {
                await this.loadComponent(component);
                // Small delay to prevent overwhelming Live Server
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            console.log('✨ All components processed with Live Server!');
            
            // Add content-loaded class to body for CSS overrides
            document.body.classList.add('content-loaded');
            
            // Hide loading overlay and show main content
            const loadingOverlay = document.getElementById('loading-overlay');
            const mainContent = document.getElementById('main-content');
            
            if (loadingOverlay) {
                console.log('👻 Hiding loading overlay...');
                loadingOverlay.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                loadingOverlay.classList.add('hidden');
                loadingOverlay.setAttribute('hidden', 'true');
                
                // Force reflow
                loadingOverlay.offsetHeight;
                
                // Remove after delay if still visible
                setTimeout(() => {
                    if (loadingOverlay.parentNode && getComputedStyle(loadingOverlay).display !== 'none') {
                        console.log('🔥 Forcing overlay removal for Live Server');
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
            
            // Dispatch event for component initialization
            document.dispatchEvent(new CustomEvent('componentsReady', {
                detail: { 
                    environment: 'live-server',
                    loadedCount: this.loaded,
                    totalCount: this.total
                }
            }));
            console.log('📡 Live Server components ready event dispatched');
            
            // Initialize global functions
            this.initializeGlobalFunctions();
            
            console.log('🎉 Live Server landing page is fully ready!');
            
        } catch (error) {
            console.error('💥 Critical error during Live Server component loading:', error);
            
            // Show error state
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.innerHTML = `
                    <div style="text-align: center; color: red; padding: 40px;">
                        <h2>❌ Live Server Loading Failed</h2>
                        <p>There was an error loading the components with Live Server.</p>
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
