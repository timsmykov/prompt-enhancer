// Basic test functionality
document.addEventListener('DOMContentLoaded', function() {
    // CSS Loading Test
    const cssTest = document.getElementById('css-test');
    if (cssTest) {
        const computedStyle = window.getComputedStyle(cssTest);
        if (computedStyle.color !== 'rgba(0, 0, 0, 0)') {
            cssTest.innerHTML = '✅ CSS is loading correctly';
            cssTest.classList.add('test-success');
        } else {
            cssTest.innerHTML = '❌ CSS loading failed';
            cssTest.classList.add('test-error');
        }
    }

    // Component Loading Test
    async function testComponentLoading() {
        const testDiv = document.getElementById('component-test');
        if (!testDiv) return;
        
        try {
            const response = await fetch('components/hero.html');
            if (response.ok) {
                testDiv.innerHTML = '✅ Components can be fetched';
                testDiv.classList.add('test-success');
            } else {
                testDiv.innerHTML = `❌ Component fetch failed: ${response.status}`;
                testDiv.classList.add('test-error');
            }
        } catch (error) {
            testDiv.innerHTML = `❌ Component fetch error: ${error.message}`;
            testDiv.classList.add('test-error');
        }
    }

    // JavaScript Loading Test
    async function testJSLoading() {
        const testDiv = document.getElementById('js-test');
        if (!testDiv) return;
        
        try {
            const response = await fetch('js/loader.js');
            if (response.ok) {
                testDiv.innerHTML = '✅ JavaScript files can be accessed';
                testDiv.classList.add('test-success');
            } else {
                testDiv.innerHTML = `❌ JavaScript fetch failed: ${response.status}`;
                testDiv.classList.add('test-error');
            }
        } catch (error) {
            testDiv.innerHTML = `❌ JavaScript fetch error: ${error.message}`;
            testDiv.classList.add('test-error');
        }
    }

    testComponentLoading();
    testJSLoading();
});
