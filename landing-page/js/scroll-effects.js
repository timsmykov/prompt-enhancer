// Scroll effects module - sticky CTA, parallax, and scroll tracking
import { Analytics } from './analytics.js';
import { Utils } from './core.js';

export class ScrollEffects {
    constructor() {
        this.hasScrolledPastHero = false;
        this.stickyCta = null;
        this.heroSection = null;
        this.heroImage = null;
        this.waitlistSection = null;
        
        this.init();
    }

    init() {
        this.initElements();
        this.initStickyCta();
        this.initParallaxEffects();
        this.initScrollAnimations();
    }

    initElements() {
        // Sticky CTA removed - using header CTA only
        this.heroSection = document.querySelector('.hero');
        this.heroImage = document.querySelector('.hero-image');
        this.waitlistSection = document.getElementById('waitlist');
    }

    initStickyCta() {
        // Sticky CTA removed - using header CTA only
        console.log('Sticky CTA functionality removed');
    }

    handleStickyCta() {
        // Sticky CTA removed - using header CTA only
    }

    initParallaxEffects() {
        if (!this.heroImage) {
            console.warn('Hero image not found for parallax effect');
            return;
        }

        const debouncedParallax = Utils.debounce(() => {
            this.handleParallax();
        }, 16); // ~60fps

        window.addEventListener('scroll', debouncedParallax);
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        
        // Add subtle parallax effect to hero section
        if (this.heroImage && scrolled < window.innerHeight) {
            this.heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }

    initScrollAnimations() {
        // Intersection Observer for entrance animations
        const observeElements = document.querySelectorAll('.benefit-card, .step, .testimonial-card, .faq-item, .stat-card');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        entry.target.style.animation = 'slideInFromBottom 0.6s ease forwards';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Track animation trigger
                        Analytics.trackEvent('scroll_animation_triggered', {
                            element_class: entry.target.className,
                            element_index: index
                        });
                    }, index * 100); // Stagger animations
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px' // Trigger slightly before/after visible area
        });

        // Set initial state and observe elements
        observeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            animationObserver.observe(el);
        });

        // Additional scroll-triggered animations for other elements
        this.initElementAnimations();
    }

    initElementAnimations() {
        // Animate stats when they come into view
        const statsElements = document.querySelectorAll('.stat-number');
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    this.animateNumber(entry.target);
                    entry.target.setAttribute('data-animated', 'true');
                }
            });
        }, { threshold: 0.5 });

        statsElements.forEach(stat => statsObserver.observe(stat));

        // Animate progress bars
        const progressBars = document.querySelectorAll('.chart-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    this.animateProgressBar(entry.target);
                    entry.target.setAttribute('data-animated', 'true');
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    animateNumber(element) {
        const finalValue = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        if (isNaN(finalValue)) return;

        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        const originalText = element.textContent;
        const suffix = originalText.replace(/[0-9]/g, '');

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(finalValue * easeOutCubic);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText; // Ensure final value is exact
            }
        };

        animate();
    }

    animateProgressBar(element) {
        const targetHeight = element.getAttribute('data-value') || '70';
        element.style.height = '0%';
        element.style.transition = 'height 1.5s ease-out';
        
        // Trigger animation after a small delay
        setTimeout(() => {
            element.style.height = targetHeight + '%';
        }, 100);
    }

    // Method to manually trigger scroll to specific section
    scrollToSection(sectionId, behavior = 'smooth') {
        Utils.scrollToElement(`#${sectionId}`, behavior);
        
        Analytics.trackEvent('scroll_to_section', {
            section_id: sectionId,
            trigger: 'manual'
        });
    }

    // Method to get current scroll progress
    getScrollProgress() {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        return Math.round((currentScroll / totalHeight) * 100);
    }

    // Method to check if element is in viewport
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}
