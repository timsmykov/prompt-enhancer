
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        if (!question.dataset.initialized) {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isOpen = faqItem.classList.contains('open');
                
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('open');
                });
                
                if (!isOpen) {
                    faqItem.classList.add('open');
                }
            });
            question.dataset.initialized = 'true';
        }
    });
}

document.addEventListener('componentsReady', initializeFAQ);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeFAQ();
}
