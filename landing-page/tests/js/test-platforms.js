// Platform section testing and debugging functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Platform test page loaded');
    
    // Test if elements exist
    const platformsSection = document.querySelector('.hero-platforms');
    const platformLogos = document.querySelectorAll('.platform-logo');
    const images = document.querySelectorAll('.platform-logo img');
    
    console.log('Elements found:', {
        platformsSection: !!platformsSection,
        platformLogosCount: platformLogos.length,
        imagesCount: images.length
    });
    
    // Check image loading
    images.forEach((img, index) => {
        console.log(`Image ${index}:`, {
            src: img.src,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
        });
    });
});
