
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
            const response = await fetch(component.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${component.file}: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(component.id);
            if (element) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const scripts = tempDiv.querySelectorAll('script');
                
                while (tempDiv.firstChild) {
                    if (tempDiv.firstChild.nodeName !== 'SCRIPT') {
                        element.appendChild(tempDiv.firstChild);
                    } else {
                        tempDiv.removeChild(tempDiv.firstChild);
                    }
                }

                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = oldScript.textContent;
                    document.head.appendChild(newScript);
                });

                if (element.innerHTML.trim() === 'Loading...') {
                   element.innerHTML = '';
                }
                
                console.log(`✅ Loaded: ${component.file}`);
                this.loaded++;
                this.updateProgress();
            }
        } catch (error) {
            console.error(`❌ Error loading ${component.file}:`, error);
            const element = document.getElementById(component.id);
            if (element) {
                element.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">Error loading component: ${component.file}</div>`;
            }
        }
    }

    updateProgress() {
        const progress = (this.loaded / this.total) * 100;
        console.log(`📊 Loading progress: ${Math.round(progress)}%`);
    }

    async loadAll() {
        console.log('🚀 Loading all components...');
        
        const promises = this.components.map(component => this.loadComponent(component));
        await Promise.all(promises);
        
        console.log('✨ All components loaded!');
        
        // Dispatch event for component initialization
        document.dispatchEvent(new CustomEvent('componentsReady'));
        
        // Initialize global functions that might be needed immediately
        this.initializeGlobalFunctions();
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
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new ComponentLoader();
    loader.loadAll();
});
