// Debug script to test social proof section animation fix
setTimeout(() => {
    console.log('=== SOCIAL PROOF SECTION DEBUG ===');
    
    const statCards = document.querySelectorAll('.stat-card');
    console.log(`Found ${statCards.length} stat cards`);
    
    if (statCards.length === 0) {
        console.log('No stat cards found - checking if social proof component loaded...');
        const socialProofSection = document.querySelector('#social-proof, .social-proof');
        console.log('Social proof section:', socialProofSection);
        return;
    }
    
    statCards.forEach((card, index) => {
        const computedStyle = window.getComputedStyle(card);
        const hasAnimateClass = card.classList.contains('animate-in');
        
        console.log(`Stat Card ${index + 1}:`);
        console.log(`  - Opacity: ${computedStyle.opacity}`);
        console.log(`  - Transform: ${computedStyle.transform}`);
        console.log(`  - Has .animate-in class: ${hasAnimateClass}`);
        console.log(`  - Classes: ${card.className}`);
        
        // Force add animate-in class for testing
        if (!hasAnimateClass) {
            console.log(`  - Adding .animate-in class to card ${index + 1}`);
            card.classList.add('animate-in');
        }
    });
    
    // Check if intersection observers are set up
    console.log('\n=== INTERSECTION OBSERVER CHECK ===');
    const observedElements = document.querySelectorAll('[data-observed="true"]');
    console.log(`Elements being observed: ${observedElements.length}`);
    
}, 2000); // Wait 2 seconds for components to load
