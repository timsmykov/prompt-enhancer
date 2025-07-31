// Prompt Enhancer Landing Page JavaScript
(function() {
    'use strict';

    // DOM Elements
    const waitlistForm = document.getElementById('waitlist-form');
    const formSuccess = document.getElementById('form-success');
    const faqItems = document.querySelectorAll('.faq-item');

    // Smooth scroll to waitlist section
    window.scrollToWaitlist = function() {
        document.getElementById('waitlist').scrollIntoView({
            behavior: 'smooth'
        });
    };

    // FAQ Toggle functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Waitlist form submission
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(waitlistForm);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Basic validation
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show loading state
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Sending...';
        submitBtn.disabled = true;

        try {
            // Using Formspree for form submission (free service)
            const response = await fetch('https://formspree.io/f/xpznvqko', {
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
                // Show success message
                waitlistForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Track conversion (you can replace with your analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
                    });
                }
                
                // Store in localStorage for analytics
                localStorage.setItem('prompt_enhancer_waitlist', JSON.stringify({
                    name: name,
                    email: email,
                    timestamp: new Date().toISOString()
                }));
                
            } else {
                throw new Error('Form submission error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback: try to open email client
            const subject = encodeURIComponent('Prompt Enhancer Waitlist Request');
            const body = encodeURIComponent(`Hello!\n\nMy name is ${name}, and I want to join the waitlist for Prompt Enhancer.\n\nMy email: ${email}\n\nThank you!`);
            const mailtoLink = `mailto:timofeysmykov@gmail.com?subject=${subject}&body=${body}`;
            
            if (confirm('Could not submit form automatically. Open email client to send request?')) {
                window.location.href = mailtoLink;
                // Show success message anyway
                waitlistForm.style.display = 'none';
                formSuccess.style.display = 'block';
            } else {
                alert('Please try again or email us at timofeysmykov@gmail.com');
            }
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.benefit-card, .step, .faq-item');
    animatedElements.forEach(el => observer.observe(el));

    // Add some interactive effects
    document.addEventListener('DOMContentLoaded', () => {
        // Add hover effect to benefit cards
        const benefitCards = document.querySelectorAll('.benefit-card');
        benefitCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                // Add subtle glow effect
                card.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });

        // Add entrance animations
        const observeElements = document.querySelectorAll('.benefit-card, .step, .testimonial-card');
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = 'slideInFromBottom 0.6s ease forwards';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        observeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            animationObserver.observe(el);
        });

        // Add click tracking for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Hero Typing Animation
        const typingText = document.getElementById('typingText');
        if (!typingText) return; // Safety check
        
        const phrases = [
            '"help me code"',
            '"write an email"',
            '"explain this concept"',
            '"create content"',
            '"solve this problem"',
            '"analyze data"'
        ];
        
        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        function typeEffect() {
            const current = phrases[currentPhrase];
            
            if (isWaiting) {
                setTimeout(typeEffect, 1500); // Wait before starting to delete
                isWaiting = false;
                isDeleting = true;
                return;
            }
            
            if (isDeleting) {
                typingText.textContent = current.substring(0, currentChar - 1);
                currentChar--;
                
                if (currentChar === 0) {
                    isDeleting = false;
                    currentPhrase = (currentPhrase + 1) % phrases.length;
                }
            } else {
                typingText.textContent = current.substring(0, currentChar + 1);
                currentChar++;
                
                if (currentChar === current.length) {
                    isWaiting = true;
                }
            }
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }
        
        // Start the typing effect
        typeEffect();
    });

    // Simple analytics tracking
    function trackEvent(eventName, properties = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        console.log('Event tracked:', eventName, properties);
        
        // You can add other analytics services here
        // Example: Mixpanel, Amplitude, etc.
    }

    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                trackEvent('scroll_depth', { depth: '25%' });
            } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                trackEvent('scroll_depth', { depth: '50%' });
            } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
                trackEvent('scroll_depth', { depth: '75%' });
            } else if (maxScrollDepth >= 90) {
                trackEvent('scroll_depth', { depth: '90%' });
            }
        }
    });

    // Sticky CTA functionality
    const stickyCta = document.getElementById('sticky-cta');
    let hasScrolledPastHero = false;

    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;

        // Only show sticky CTA when user has scrolled past the entire hero section
        if (scrollPosition > heroBottom && !hasScrolledPastHero) {
            hasScrolledPastHero = true;
            stickyCta.classList.add('visible');
            trackEvent('sticky_cta_shown');
        } else if (scrollPosition <= heroBottom && hasScrolledPastHero) {
            hasScrolledPastHero = false;
            stickyCta.classList.remove('visible');
        }

        // Hide sticky CTA when near waitlist section
        const waitlistSection = document.getElementById('waitlist');
        const waitlistTop = waitlistSection.offsetTop;
        const distanceToWaitlist = waitlistTop - scrollPosition;

        if (distanceToWaitlist < window.innerHeight) {
            stickyCta.style.opacity = '0';
            stickyCta.style.pointerEvents = 'none';
        } else if (hasScrolledPastHero) {
            stickyCta.style.opacity = '1';
            stickyCta.style.pointerEvents = 'auto';
        }
    });

    // Track clicks on external links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && (link.hostname !== window.location.hostname || link.target === '_blank')) {
            trackEvent('external_link_click', {
                link_url: link.href,
                link_text: link.textContent.trim()
            });
        }
    });

    // Performance monitoring
    window.addEventListener('load', () => {
        // Track page load time
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', {
            load_time: loadTime,
            load_time_seconds: Math.round(loadTime / 1000)
        });
    });

    // Error tracking
    window.addEventListener('error', (e) => {
        trackEvent('javascript_error', {
            error_message: e.message,
            error_filename: e.filename,
            error_line: e.lineno
        });
    });

    // Manual drag functionality for platforms scroll
    const platformsScroll = document.querySelector('.platforms-scroll');
    const platformsContainer = document.querySelector('.platforms-scroll-container');
    
    if (platformsScroll && platformsContainer) {
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let transformValue = 0;

        // Prevent any interference from child elements
        platformsScroll.style.pointerEvents = 'auto';
        
        // Mouse down - start dragging
        const startDrag = (clientX) => {
            isDragging = true;
            startX = clientX;
            
            // Get current transform position
            const computedStyle = window.getComputedStyle(platformsScroll);
            const matrix = computedStyle.transform;
            if (matrix !== 'none') {
                const matrixArray = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
                transformValue = parseFloat(matrixArray[4]) || 0;
            } else {
                transformValue = 0;
            }
            
            // Stop CSS animation during drag
            platformsScroll.style.animationPlayState = 'paused';
            platformsScroll.style.cursor = 'grabbing';
            platformsContainer.style.cursor = 'grabbing';
            platformsScroll.classList.add('dragging');
            
            console.log('Drag started at:', clientX);
        };

        // Mouse move - drag element
        const doDrag = (clientX) => {
            if (!isDragging) return;
            
            const deltaX = clientX - startX;
            const newTransform = transformValue + deltaX;
            
            // Apply transform immediately for instant feedback
            platformsScroll.style.transform = `translateX(${newTransform}px)`;
            
            console.log('Dragging to:', newTransform);
        };

        // Mouse up - stop dragging
        const stopDrag = () => {
            if (!isDragging) return;
            
            isDragging = false;
            platformsScroll.style.cursor = 'grab';
            platformsContainer.style.cursor = 'grab';
            platformsScroll.classList.remove('dragging');
            
            // Resume animation after a delay
            setTimeout(() => {
                platformsScroll.style.animationPlayState = 'running';
                // Clear manual transform to let animation take over
                setTimeout(() => {
                    platformsScroll.style.transform = '';
                }, 200);
            }, 1000);
            
            console.log('Drag stopped');
        };

        // Mouse events on the container (larger hit area)
        platformsContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX);
        });

        // Global mouse events for smooth tracking
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                doDrag(e.clientX);
            }
        });

        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        platformsContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(e.touches[0].clientX);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                doDrag(e.touches[0].clientX);
            }
        }, { passive: false });

        document.addEventListener('touchend', stopDrag);

        // Set initial cursor
        platformsScroll.style.cursor = 'grab';
        platformsContainer.style.cursor = 'grab';
        
        // Prevent text selection
        platformsScroll.style.userSelect = 'none';
        platformsContainer.style.userSelect = 'none';
        
        console.log('Drag functionality initialized');
    }

})();