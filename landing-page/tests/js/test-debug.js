// Debug page functionality
let consoleLog = [];

// Capture console output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
    consoleLog.push({ type: 'log', message: args.join(' '), time: new Date().toLocaleTimeString() });
    updateConsoleDisplay();
    originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
    consoleLog.push({ type: 'error', message: args.join(' '), time: new Date().toLocaleTimeString() });
    updateConsoleDisplay();
    originalConsoleError.apply(console, args);
};

function updateConsoleDisplay() {
    const output = document.getElementById('consoleOutput');
    if (output) {
        output.innerHTML = consoleLog.map(entry => 
            `<div style="color: ${entry.type === 'error' ? 'red' : 'black'}">
                [${entry.time}] ${entry.type.toUpperCase()}: ${entry.message}
            </div>`
        ).join('');
        output.scrollTop = output.scrollHeight;
    }
}

function clearConsole() {
    consoleLog = [];
    updateConsoleDisplay();
}

async function checkResources() {
    const diagnostics = document.getElementById('diagnostics');
    if (!diagnostics) return;
    
    diagnostics.innerHTML = '<p>Checking resources...</p>';
    
    const resources = [
        './css/index.css',
        './js/loader.js',
        './components/hero.html',
        './components/faq.html',
        './components/footer.html'
    ];

    let results = [];
    
    for (const resource of resources) {
        try {
            const response = await fetch(resource);
            results.push({
                resource,
                status: response.ok ? 'OK' : 'ERROR',
                code: response.status,
                size: response.headers.get('content-length') || 'unknown'
            });
        } catch (error) {
            results.push({
                resource,
                status: 'FAILED',
                code: 'N/A',
                error: error.message
            });
        }
    }

    diagnostics.innerHTML = `
        <h4>Resource Check Results:</h4>
        ${results.map(r => `
            <div class="debug-box ${r.status === 'OK' ? 'success' : 'error'}">
                <strong>${r.resource}</strong><br>
                Status: ${r.status} (${r.code})<br>
                ${r.size ? `Size: ${r.size} bytes` : ''}
                ${r.error ? `Error: ${r.error}` : ''}
            </div>
        `).join('')}
        
        <h4>Current Page Info:</h4>
        <div class="debug-box">
            <strong>URL:</strong> ${window.location.href}<br>
            <strong>Protocol:</strong> ${window.location.protocol}<br>
            <strong>Host:</strong> ${window.location.host}<br>
            <strong>Pathname:</strong> ${window.location.pathname}
        </div>
    `;
}

// Run initial diagnostics
window.addEventListener('load', () => {
    setTimeout(checkResources, 1000);
});

// Expose functions globally
window.checkResources = checkResources;
window.clearConsole = clearConsole;
