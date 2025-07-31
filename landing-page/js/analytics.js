// Analytics and event tracking module
import { Utils } from './core.js';

export class Analytics {
    constructor() {
        this.maxScrollDepth = 0;
        this.init();
    }

    init() {
        this.trackPageView();
        this.initScrollTracking();
        this.initPerformanceMonitoring();
        this.initErrorTracking();
        this.initLinkTracking();
    }

    // Core tracking function
    static trackEvent(eventName, properties = {}) {
        // In a real implementation, you would send this to your analytics service
        // For now, we'll just log to console and could integrate with Google Analytics, etc.
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            user_agent: navigator.userAgent,
            ...properties
        };

        console.log('Analytics Event:', eventData);

        // Store events locally for debugging
        Utils.storage.set(`analytics_${Date.now()}`, eventData);

        // Send to analytics service (placeholder)
        // this.sendToAnalytics(eventData);
    }

    trackPageView() {
        Analytics.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            referrer: document.referrer
        });
    }

    initScrollTracking() {
        const debouncedScrollTracker = Utils.debounce(() => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollDepth > this.maxScrollDepth) {
                this.maxScrollDepth = scrollDepth;
                
                // Track milestone scroll depths
                if (this.maxScrollDepth >= 25 && this.maxScrollDepth < 50) {
                    Analytics.trackEvent('scroll_depth', { depth: '25%' });
                } else if (this.maxScrollDepth >= 50 && this.maxScrollDepth < 75) {
                    Analytics.trackEvent('scroll_depth', { depth: '50%' });
                } else if (this.maxScrollDepth >= 75 && this.maxScrollDepth < 90) {
                    Analytics.trackEvent('scroll_depth', { depth: '75%' });
                } else if (this.maxScrollDepth >= 90) {
                    Analytics.trackEvent('scroll_depth', { depth: '90%' });
                }
            }
        }, 500);

        window.addEventListener('scroll', debouncedScrollTracker);
    }

    initPerformanceMonitoring() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            Analytics.trackEvent('page_load_time', {
                load_time: loadTime,
                load_time_seconds: Math.round(loadTime / 1000)
            });

            // Track Core Web Vitals if available
            if ('PerformanceObserver' in window) {
                try {
                    // Largest Contentful Paint
                    new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        Analytics.trackEvent('web_vital_lcp', {
                            value: Math.round(lastEntry.startTime)
                        });
                    }).observe({ entryTypes: ['largest-contentful-paint'] });

                    // First Input Delay
                    new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                            Analytics.trackEvent('web_vital_fid', {
                                value: Math.round(entry.processingStart - entry.startTime)
                            });
                        });
                    }).observe({ entryTypes: ['first-input'] });
                } catch (e) {
                    console.warn('Performance Observer not fully supported:', e);
                }
            }
        });
    }

    initErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (e) => {
            Analytics.trackEvent('javascript_error', {
                error_message: e.message,
                error_filename: e.filename,
                error_line: e.lineno,
                error_column: e.colno,
                stack: e.error ? e.error.stack : null
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            Analytics.trackEvent('unhandled_promise_rejection', {
                error_message: e.reason ? e.reason.toString() : 'Unknown error',
                stack: e.reason && e.reason.stack ? e.reason.stack : null
            });
        });
    }

    initLinkTracking() {
        // Track clicks on external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && (link.hostname !== window.location.hostname || link.target === '_blank')) {
                Analytics.trackEvent('external_link_click', {
                    link_url: link.href,
                    link_text: link.textContent.trim(),
                    link_hostname: link.hostname
                });
            }
        });
    }

    // Track custom events for specific features
    static trackFormSubmission(formType, success, data = {}) {
        Analytics.trackEvent('form_submission', {
            form_type: formType,
            success: success,
            ...data
        });
    }

    static trackFeatureUsage(featureName, data = {}) {
        Analytics.trackEvent('feature_usage', {
            feature: featureName,
            ...data
        });
    }

    static trackButtonClick(buttonName, data = {}) {
        Analytics.trackEvent('button_click', {
            button_name: buttonName,
            ...data
        });
    }

    // Send events to analytics service (placeholder for real implementation)
    static sendToAnalytics(eventData) {
        // This is where you would integrate with your analytics service
        // Examples: Google Analytics 4, Mixpanel, Amplitude, etc.
        
        // Google Analytics 4 example:
        if (typeof gtag !== 'undefined') {
            gtag('event', eventData.event, {
                custom_parameter_1: eventData.custom_parameter_1,
                // ... other parameters
            });
        }

        // Custom analytics endpoint example:
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(eventData)
        // }).catch(err => console.warn('Analytics error:', err));
    }
}
