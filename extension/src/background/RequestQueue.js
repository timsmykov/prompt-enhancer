/**
 * RequestQueue - Queue and process API requests sequentially
 * Manages concurrent requests, queue position, and cancellation
 */

(() => {
  if (window.RequestQueue) {
    return; // Already loaded
  }

  const RequestQueue = {
    // Queue state
    queue: [],
    processing: false,
    maxConcurrent: 1, // Process one request at a time

    /**
     * Add request to queue
     * @param {Object} request - Request object
     * @returns {string} Request ID
     */
    enqueue(request) {
      const requestId = request.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      this.queue.push({
        id: requestId,
        ...request,
        status: 'queued',
        timestamp: Date.now(),
        position: this.queue.length + 1
      });

      console.log(`[RequestQueue] Enqueued request ${requestId}, position: ${this.queue.length}`);

      // Start processing if not already processing
      if (!this.processing) {
        this.process();
      }

      return requestId;
    },

    /**
     * Process queue
     * @returns {Promise<void>}
     */
    async process() {
      if (this.processing || this.queue.length === 0) {
        return;
      }

      this.processing = true;

      while (this.queue.length > 0) {
        const request = this.queue.find(r => r.status === 'queued');

        if (!request) {
          break;
        }

        // Update request status
        request.status = 'processing';

        try {
          // Notify listeners about queue position
          await this.notifyQueueUpdate();

          // Execute request
          const result = await request.executor(request);

          // Mark as completed
          request.status = 'completed';
          request.result = result;

          // Resolve promise if exists
          if (request.resolve) {
            request.resolve(result);
          }

          console.log(`[RequestQueue] Completed request ${request.id}`);
        } catch (error) {
          // Mark as failed
          request.status = 'failed';
          request.error = error;

          // Reject promise if exists
          if (request.reject) {
            reject(error);
          }

          console.error(`[RequestQueue] Failed request ${request.id}:`, error);
        }

        // Remove from queue
        const index = this.queue.findIndex(r => r.id === request.id);
        if (index !== -1) {
          this.queue.splice(index, 1);
        }

        // Update positions
        this.queue.forEach((r, i) => {
          r.position = i + 1;
        });
      }

      this.processing = false;
    },

    /**
     * Add request to queue with promise
     * @param {Function} executor - Request executor function
     * @param {Object} metadata - Request metadata
     * @returns {Promise} Request promise
     */
    async add(executor, metadata = {}) {
      return new Promise((resolve, reject) => {
        const requestId = this.enqueue({
          executor,
          resolve,
          reject,
          ...metadata
        });

        console.log(`[RequestQueue] Added promise-based request ${requestId}`);
      });
    },

    /**
     * Cancel request
     * @param {string} requestId - Request ID to cancel
     * @returns {boolean} Success status
     */
    cancel(requestId) {
      const index = this.queue.findIndex(r => r.id === requestId);

      if (index === -1) {
        console.warn(`[RequestQueue] Request ${requestId} not found`);
        return false;
      }

      const request = this.queue[index];

      if (request.status === 'processing') {
        console.warn(`[RequestQueue] Cannot cancel processing request ${requestId}`);
        return false;
      }

      // Remove from queue
      this.queue.splice(index, 1);

      // Update positions
      this.queue.forEach((r, i) => {
        r.position = i + 1;
      });

      // Reject promise if exists
      if (request.reject) {
        request.reject(new Error('Request cancelled'));
      }

      console.log(`[RequestQueue] Cancelled request ${requestId}`);

      return true;
    },

    /**
     * Get queue position
     * @param {string} requestId - Request ID
     * @returns {number} Queue position or -1 if not found
     */
    getPosition(requestId) {
      const request = this.queue.find(r => r.id === requestId);
      return request ? request.position : -1;
    },

    /**
     * Get queue status
     * @returns {Object} Queue status
     */
    getStatus() {
      return {
        length: this.queue.length,
        processing: this.processing,
        queued: this.queue.filter(r => r.status === 'queued').length,
        processing: this.queue.filter(r => r.status === 'processing').length
      };
    },

    /**
     * Notify listeners about queue update
     * @returns {Promise<void>}
     */
    async notifyQueueUpdate() {
      // Send queue position updates to content scripts
      for (const request of this.queue) {
        if (request.tabId && request.status === 'queued') {
          try {
            if (typeof EventManager !== 'undefined') {
              await EventManager.sendToTab(request.tabId, {
                type: 'GET_QUEUE_POSITION',
                position: request.position,
                total: this.queue.length
              });
            }
          } catch (error) {
            console.error('[RequestQueue] Error notifying queue update:', error);
          }
        }
      }
    },

    /**
     * Clear queue
     * @returns {void}
     */
    clear() {
      // Reject all pending promises
      for (const request of this.queue) {
        if (request.status === 'queued' && request.reject) {
          request.reject(new Error('Queue cleared'));
        }
      }

      this.queue = [];
      console.log('[RequestQueue] Queue cleared');
    }
  };

  window.RequestQueue = RequestQueue;
})();
