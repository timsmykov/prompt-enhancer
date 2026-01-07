/**
 * TelemetryManager - Track and analyze usage metrics
 * Monitors requests, success rates, response times, and token usage
 */

(() => {
  if (window.TelemetryManager) {
    return; // Already loaded
  }

  const TelemetryManager = {
    // Storage key for telemetry data
    STORAGE_KEY: 'promptImprover_telemetry',

    // Default telemetry state
    defaultState: {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0,
      totalTokensUsed: 0,
      lastRequestTime: null,
      requestHistory: [], // Last 100 requests
      errorsByType: {}, // Error type counts
      dailyStats: {} // Stats by date (YYYY-MM-DD)
    },

    /**
     * Initialize telemetry
     * @returns {Promise<Object>} Current telemetry data
     */
    async init() {
      if (typeof StorageManager === 'undefined') {
        console.error('[TelemetryManager] StorageManager not available');
        return this.defaultState;
      }

      const data = await StorageManager.get(this.STORAGE_KEY);
      return data[this.STORAGE_KEY] || { ...this.defaultState };
    },

    /**
     * Get current telemetry data
     * @returns {Promise<Object>} Telemetry data
     */
    async getData() {
      return this.init();
    },

    /**
     * Record a request start
     * @param {string} requestId - Request identifier
     * @param {Object} metadata - Request metadata
     * @returns {Promise<void>}
     */
    async recordRequestStart(requestId, metadata = {}) {
      const telemetry = await this.init();

      telemetry.totalRequests += 1;
      telemetry.lastRequestTime = Date.now();

      await StorageManager.set({
        [this.STORAGE_KEY]: telemetry
      });
    },

    /**
     * Record a successful request
     * @param {string} requestId - Request identifier
     * @param {Object} metadata - Response metadata
     * @returns {Promise<void>}
     */
    async recordSuccess(requestId, metadata = {}) {
      const telemetry = await this.init();
      const responseTime = metadata.responseTime || 0;
      const tokensUsed = metadata.tokensUsed || 0;

      telemetry.successfulRequests += 1;
      telemetry.totalResponseTime += responseTime;
      telemetry.totalTokensUsed += tokensUsed;
      telemetry.lastRequestTime = Date.now();

      // Add to history (keep last 100)
      telemetry.requestHistory.push({
        requestId,
        timestamp: Date.now(),
        status: 'success',
        responseTime,
        tokensUsed,
        model: metadata.model
      });

      if (telemetry.requestHistory.length > 100) {
        telemetry.requestHistory.shift();
      }

      // Update daily stats
      await this.updateDailyStats(telemetry, 'success', responseTime, tokensUsed);

      await StorageManager.set({
        [this.STORAGE_KEY]: telemetry
      });
    },

    /**
     * Record a failed request
     * @param {string} requestId - Request identifier
     * @param {Object} metadata - Error metadata
     * @returns {Promise<void>}
     */
    async recordError(requestId, metadata = {}) {
      const telemetry = await this.init();
      const errorType = metadata.errorType || 'unknown';

      telemetry.failedRequests += 1;
      telemetry.lastRequestTime = Date.now();

      // Track errors by type
      telemetry.errorsByType[errorType] = (telemetry.errorsByType[errorType] || 0) + 1;

      // Add to history
      telemetry.requestHistory.push({
        requestId,
        timestamp: Date.now(),
        status: 'error',
        errorType,
        errorMessage: metadata.errorMessage
      });

      if (telemetry.requestHistory.length > 100) {
        telemetry.requestHistory.shift();
      }

      // Update daily stats
      await this.updateDailyStats(telemetry, 'error', 0, 0);

      await StorageManager.set({
        [this.STORAGE_KEY]: telemetry
      });
    },

    /**
     * Update daily statistics
     * @param {Object} telemetry - Telemetry data object
     * @param {string} status - Request status ('success' or 'error')
     * @param {number} responseTime - Response time in ms
     * @param {number} tokensUsed - Tokens consumed
     * @returns {Promise<void>}
     */
    async updateDailyStats(telemetry, status, responseTime, tokensUsed) {
      const today = new Date().toISOString().split('T')[0];

      if (!telemetry.dailyStats[today]) {
        telemetry.dailyStats[today] = {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          totalResponseTime: 0,
          totalTokensUsed: 0
        };
      }

      const daily = telemetry.dailyStats[today];
      daily.totalRequests += 1;

      if (status === 'success') {
        daily.successfulRequests += 1;
        daily.totalResponseTime += responseTime;
        daily.totalTokensUsed += tokensUsed;
      } else {
        daily.failedRequests += 1;
      }
    },

    /**
     * Calculate success rate
     * @returns {Promise<number>} Success rate (0-100)
     */
    async getSuccessRate() {
      const telemetry = await this.init();
      if (telemetry.totalRequests === 0) return 0;
      return (telemetry.successfulRequests / telemetry.totalRequests) * 100;
    },

    /**
     * Calculate average response time
     * @returns {Promise<number>} Average response time in ms
     */
    async getAverageResponseTime() {
      const telemetry = await this.init();
      if (telemetry.successfulRequests === 0) return 0;
      return telemetry.totalResponseTime / telemetry.successfulRequests;
    },

    /**
     * Get statistics for specific date range
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     * @returns {Promise<Object>} Aggregated statistics
     */
    async getDateRangeStats(startDate, endDate) {
      const telemetry = await this.init();
      const stats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalResponseTime: 0,
        totalTokensUsed: 0
      };

      for (const date in telemetry.dailyStats) {
        if (date >= startDate && date <= endDate) {
          const dayStats = telemetry.dailyStats[date];
          stats.totalRequests += dayStats.totalRequests;
          stats.successfulRequests += dayStats.successfulRequests;
          stats.failedRequests += dayStats.failedRequests;
          stats.totalResponseTime += dayStats.totalResponseTime;
          stats.totalTokensUsed += dayStats.totalTokensUsed;
        }
      }

      return stats;
    },

    /**
     * Reset telemetry data
     * @returns {Promise<void>}
     */
    async reset() {
      await StorageManager.set({
        [this.STORAGE_KEY]: { ...this.defaultState }
      });
    }
  };

  window.TelemetryManager = TelemetryManager;
})();
