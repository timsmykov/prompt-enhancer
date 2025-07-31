
function scrollToWaitlist() {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        stickyCta.addEventListener('click', scrollToWaitlist);
    }
});
