
function initializeForms() {
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm && !waitlistForm.dataset.initialized) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            console.log('📧 Waitlist signup:', email);
            
            const successDiv = document.getElementById('form-success');
            if (successDiv) {
                successDiv.style.display = 'block';
                waitlistForm.style.display = 'none';
            } else {
                alert('Thanks for joining the waitlist! 🎉');
            }
        });
        waitlistForm.dataset.initialized = 'true';
    }
}

document.addEventListener('componentsReady', initializeForms);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeForms();
}
