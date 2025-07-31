// Testimonials component functionality
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Add subtle hover animations
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-3px) scale(1.02)';
            card.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
    
    // Add rotation effect for testimonials (optional)
    if (testimonialCards.length > 3) {
        startTestimonialRotation(testimonialCards);
    }
}

function startTestimonialRotation(cards) {
    let currentIndex = 0;
    const rotationInterval = 8000; // 8 seconds
    
    setInterval(() => {
        // Add subtle highlight to current testimonial
        cards.forEach((card, index) => {
            card.style.opacity = index === currentIndex ? '1' : '0.8';
        });
        
        currentIndex = (currentIndex + 1) % cards.length;
    }, rotationInterval);
}

// Initialize when components are ready
document.addEventListener('componentsReady', initializeTestimonials);

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeTestimonials, 100);
}
