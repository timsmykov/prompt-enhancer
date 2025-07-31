// landing-page/js/header.js
import { Utils } from './core.js'; // Assuming utils are in a separate file

export function initializeHeader() {
    const howItWorksBtn = document.querySelector('.btn[href="#how-it-works"]');
    if (howItWorksBtn) {
        howItWorksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.scrollToElement('#how-it-works-section');
        });
    }

    const joinWaitlistBtn = document.querySelector('.btn-primary');
    if (joinWaitlistBtn) {
        joinWaitlistBtn.addEventListener('click', () => {
            Utils.scrollToElement('#waitlist-section');
        });
    }
}
