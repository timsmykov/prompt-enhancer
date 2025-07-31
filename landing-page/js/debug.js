// Debug and Error Handling Script
(function() {
    'use strict';

    // Show detailed error information
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });

    // Debug loading
    console.log('🚀 Page loaded, starting component loader...');

    // Add global function to reload page
    window.reloadPage = function() {
        location.reload();
    };

    // Fallback timeout - check if overlay is still visible
    setTimeout(() => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay && !overlay.classList.contains('hidden') && getComputedStyle(overlay).display !== 'none') {
            console.error('❌ Components failed to load within 10 seconds');
            console.log('💡 Loading overlay is still visible, showing error message');
            showLoadingError();
        } else {
            console.log('✅ Loading completed successfully within timeout period');
        }
    }, 10000);

    // Function to show loading error
    function showLoadingError() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="loading-error">
                    <h2>❌ Loading Failed</h2>
                    <p>Components failed to load. Check the browser console for errors.</p>
                    <button onclick="reloadPage()">
                        🔄 Reload Page
                    </button>
                </div>
            `;
        }
    }

    // Make function available globally for potential use
    window.showLoadingError = showLoadingError;

})();
