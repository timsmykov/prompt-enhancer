// Pricing component functionality
function initializePricing() {
    // Add click handlers for pricing buttons
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', handlePricingClick);
    });
    
    // Add hover effects for pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

function handlePricingClick(event) {
    const button = event.target;
    const card = button.closest('.pricing-card');
    
    if (button.textContent.includes('Get Started Free')) {
        // Handle free plan selection
        console.log('📦 Free plan selected');
        scrollToWaitlist();
    } else if (button.textContent.includes('Upgrade to Premium')) {
        // Handle premium plan selection
        console.log('💎 Premium plan selected');
        scrollToWaitlist();
    }
}

// Initialize when components are ready
document.addEventListener('componentsReady', initializePricing);

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializePricing, 100);
}
