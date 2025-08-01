// Social proof component loader and test functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load the social proof component
    fetch('components/social-proof.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('social-proof').innerHTML = html;
            
            // Dispatch componentsReady event after component loads
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('componentsReady'));
                console.log('Social proof component loaded and animations initialized');
                
                // Check initial stat card visibility
                const statCards = document.querySelectorAll('.stat-card');
                console.log('Found stat cards:', statCards.length);
                statCards.forEach((card, index) => {
                    const computedStyle = window.getComputedStyle(card);
                    console.log(`Stat card ${index + 1} opacity:`, computedStyle.opacity);
                    console.log(`Stat card ${index + 1} has animate-in class:`, card.classList.contains('animate-in'));
                });
            }, 100);
        })
        .catch(error => {
            console.error('Error loading social proof component:', error);
        });
});
