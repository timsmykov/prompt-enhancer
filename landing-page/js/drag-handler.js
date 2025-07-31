// Drag functionality for platform logos carousel
import { Analytics } from './analytics.js';

export class DragHandler {
    constructor() {
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.transformValue = 0;
        this.platformsScroll = null;
        this.platformsContainer = null;
        
        this.init();
    }

    init() {
        this.platformsScroll = document.querySelector('.platforms-scroll');
        this.platformsContainer = document.querySelector('.platforms-scroll-container');
        
        if (this.platformsScroll && this.platformsContainer) {
            this.setupDragFunctionality();
            console.log('Drag functionality initialized');
        }
    }

    setupDragFunctionality() {
        // Prevent any interference from child elements
        this.platformsScroll.style.pointerEvents = 'auto';
        
        // Mouse events on the container (larger hit area)
        this.platformsContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDrag(e.clientX);
        });

        // Global mouse events for smooth tracking
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.doDrag(e.clientX);
            }
        });

        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Touch events for mobile
        this.platformsContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e.touches[0].clientX);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.doDrag(e.touches[0].clientX);
            }
        }, { passive: false });

        document.addEventListener('touchend', () => this.stopDrag());

        // Set initial cursor styles
        this.platformsScroll.style.cursor = 'grab';
        this.platformsContainer.style.cursor = 'grab';
        
        // Prevent text selection
        this.platformsScroll.style.userSelect = 'none';
        this.platformsContainer.style.userSelect = 'none';
    }

    startDrag(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        
        // Get current transform position
        const computedStyle = window.getComputedStyle(this.platformsScroll);
        const matrix = computedStyle.transform;
        if (matrix !== 'none') {
            const matrixArray = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
            this.transformValue = parseFloat(matrixArray[4]) || 0;
        } else {
            this.transformValue = 0;
        }
        
        // Stop CSS animation during drag
        this.platformsScroll.style.animationPlayState = 'paused';
        this.platformsScroll.style.cursor = 'grabbing';
        this.platformsContainer.style.cursor = 'grabbing';
        this.platformsScroll.classList.add('dragging');
        
        // Track drag start
        Analytics.trackEvent('platform_drag_start', {
            start_position: this.transformValue
        });
        
        console.log('Drag started at:', clientX);
    }

    doDrag(clientX) {
        if (!this.isDragging) return;
        
        const deltaX = clientX - this.startX;
        const newTransform = this.transformValue + deltaX;
        
        // Apply transform immediately for instant feedback
        this.platformsScroll.style.transform = `translateX(${newTransform}px)`;
        
        console.log('Dragging to:', newTransform);
    }

    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.platformsScroll.style.cursor = 'grab';
        this.platformsContainer.style.cursor = 'grab';
        this.platformsScroll.classList.remove('dragging');
        
        // Track drag end
        Analytics.trackEvent('platform_drag_end', {
            final_position: this.transformValue
        });
        
        // Resume animation after a delay
        setTimeout(() => {
            this.platformsScroll.style.animationPlayState = 'running';
            // Clear manual transform to let animation take over
            setTimeout(() => {
                this.platformsScroll.style.transform = '';
            }, 200);
        }, 1000);
        
        console.log('Drag stopped');
    }
}
