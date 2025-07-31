// Core utilities and shared functions

// Attach Config and Utils to the window object to make them globally accessible
window.Config = {
    FORMSPREE_ENDPOINT: 'https://formspree.io/f/xpznvqko',
    SUPPORT_EMAIL: 'timofeysmykov@gmail.com',
    ANIMATION_DURATION: 300,
    SCROLL_DEBOUNCE: 100
};

window.Utils = {
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Smooth scroll to element
    scrollToElement(selector, behavior = 'smooth') {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior });
        }
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available:', e);
            }
        },
        
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage read error:', e);
                return null;
            }
        }
    }
};

// Global scroll to waitlist function (legacy support)
window.scrollToWaitlist = function() {
    // Now references window.Utils
    window.Utils.scrollToElement('#waitlist-section');
};
