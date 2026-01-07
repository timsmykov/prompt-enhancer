/**
 * EventManager - Centralized event listener management
 * Prevents memory leaks by tracking and cleaning up event listeners
 */

(() => {
  if (window.EventManager) {
    return; // Already loaded
  }

  class EventManager {
    constructor() {
      this.listeners = new Map(); // element -> Map(event -> [handler, options])
      this.cleanupCallbacks = [];
      this.isActive = true;
    }

    /**
     * Add an event listener with tracking
     */
    add(element, event, handler, options = null) {
      if (!this.isActive) {
        console.warn('[EventManager] Attempting to add listener to inactive manager');
        return;
      }

      if (!element || !event || typeof handler !== 'function') {
        console.error('[EventManager] Invalid add() parameters');
        return;
      }

      // Store the listener
      if (!this.listeners.has(element)) {
        this.listeners.set(element, new Map());
      }

      const elementListeners = this.listeners.get(element);

      if (!elementListeners.has(event)) {
        elementListeners.set(event, []);
      }

      elementListeners.get(event).push({ handler, options });

      // Add the actual listener
      element.addEventListener(event, handler, options);
    }

    /**
     * Add a one-time event listener
     */
    once(element, event, handler) {
      const wrapper = (...args) => {
        handler(...args);
        this.remove(element, event, wrapper);
      };

      this.add(element, event, wrapper, { once: true });
    }

    /**
     * Remove a specific event listener
     */
    remove(element, event, handler) {
      if (!this.listeners.has(element)) {
        return;
      }

      const elementListeners = this.listeners.get(element);

      if (!elementListeners.has(event)) {
        return;
      }

      const handlers = elementListeners.get(event);
      const index = handlers.findIndex(h => h.handler === handler);

      if (index !== -1) {
        const { handler: actualHandler, options } = handlers[index];
        element.removeEventListener(event, actualHandler, options);
        handlers.splice(index, 1);

        // Clean up if no more handlers for this event
        if (handlers.length === 0) {
          elementListeners.delete(event);
        }
      }

      // Clean up if no more events for this element
      if (elementListeners.size === 0) {
        this.listeners.delete(element);
      }
    }

    /**
     * Remove all event listeners for a specific element
     */
    removeElementListeners(element) {
      if (!this.listeners.has(element)) {
        return;
      }

      const elementListeners = this.listeners.get(element);

      for (const [event, handlers] of elementListeners.entries()) {
        for (const { handler, options } of handlers) {
          element.removeEventListener(event, handler, options);
        }
      }

      this.listeners.delete(element);
    }

    /**
     * Remove all event listeners for a specific event on an element
     */
    removeEventListeners(element, event) {
      if (!this.listeners.has(element)) {
        return;
      }

      const elementListeners = this.listeners.get(element);

      if (!elementListeners.has(event)) {
        return;
      }

      const handlers = elementListeners.get(event);

      for (const { handler, options } of handlers) {
        element.removeEventListener(event, handler, options);
      }

      elementListeners.delete(event);

      if (elementListeners.size === 0) {
        this.listeners.delete(element);
      }
    }

    /**
     * Remove all tracked event listeners
     */
    removeAll() {
      for (const [element, elementListeners] of this.listeners.entries()) {
        for (const [event, handlers] of elementListeners.entries()) {
          for (const { handler, options } of handlers) {
            try {
              element.removeEventListener(event, handler, options);
            } catch (e) {
              // Element might be disconnected, ignore
            }
          }
        }
      }

      this.listeners.clear();
    }

    /**
     * Add a cleanup callback to be called on cleanup()
     */
    addCleanupCallback(callback) {
      if (typeof callback === 'function') {
        this.cleanupCallbacks.push(callback);
      }
    }

    /**
     * Clean up all listeners and run cleanup callbacks
     */
    cleanup() {
      if (!this.isActive) {
        return;
      }

      this.isActive = false;

      // Remove all event listeners
      this.removeAll();

      // Run cleanup callbacks
      for (const callback of this.cleanupCallbacks) {
        try {
          callback();
        } catch (error) {
          console.error('[EventManager] Cleanup callback error:', error);
        }
      }

      this.cleanupCallbacks = [];
    }

    /**
     * Get count of tracked listeners (for debugging)
     */
    getListenerCount() {
      let count = 0;
      for (const [, elementListeners] of this.listeners.entries()) {
        for (const [, handlers] of elementListeners.entries()) {
          count += handlers.length;
        }
      }
      return count;
    }

    /**
     * Check if manager is active
     */
    isManagerActive() {
      return this.isActive;
    }
  }

  // Create a singleton instance
  const eventManager = new EventManager();

  window.EventManager = EventManager;
  window.eventManager = eventManager;
})();
