/**
 * CacheManager - Cache API responses for identical prompts
 * Reduces redundant API calls and improves response time
 */

(() => {
  if (window.CacheManager) {
    return; // Already loaded
  }

  const CacheManager = {
    // Cache storage
    cache: new Map(),
    maxCacheSize: 100,
    defaultTTL: 3600000, // 1 hour in milliseconds

    /**
     * Generate cache key from prompt and settings
     * @param {string} prompt - User prompt
     * @param {Object} settings - API settings
     * @returns {string} Cache key
     */
    generateKey(prompt, settings) {
      const normalizedPrompt = prompt.trim().toLowerCase();
      const model = settings.model || 'openrouter/auto';
      const systemPrompt = settings.systemPrompt || '';
      return `${model}:${systemPrompt}:${normalizedPrompt}`;
    },

    /**
     * Hash string for cache key
     * @param {string} str - String to hash
     * @returns {string} Hashed string
     */
    hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString(36);
    },

    /**
     * Get cached response
     * @param {string} prompt - User prompt
     * @param {Object} settings - API settings
     * @returns {Object|null} Cached response or null
     */
    get(prompt, settings) {
      const key = this.generateKey(prompt, settings);
      const cached = this.cache.get(key);

      if (!cached) {
        return null;
      }

      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
        return null;
      }

      console.log(`[CacheManager] Cache hit for key: ${this.hashString(key)}`);
      return cached.data;
    },

    /**
     * Set cached response
     * @param {string} prompt - User prompt
     * @param {Object} settings - API settings
     * @param {Object} data - Response data
     * @param {number} ttl - Time to live in milliseconds
     * @returns {void}
     */
    set(prompt, settings, data, ttl = this.defaultTTL) {
      const key = this.generateKey(prompt, settings);

      // Implement LRU eviction if cache is full
      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });

      console.log(`[CacheManager] Cached response for key: ${this.hashString(key)}`);
    },

    /**
     * Invalidate cache entry
     * @param {string} prompt - User prompt
     * @param {Object} settings - API settings
     * @returns {boolean} Success status
     */
    invalidate(prompt, settings) {
      const key = this.generateKey(prompt, settings);
      const deleted = this.cache.delete(key);
      if (deleted) {
        console.log(`[CacheManager] Invalidated cache for key: ${this.hashString(key)}`);
      }
      return deleted;
    },

    /**
     * Clear all cache
     * @returns {void}
     */
    clear() {
      this.cache.clear();
      console.log('[CacheManager] Cache cleared');
    },

    /**
     * Get cache statistics
     * @returns {Object} Cache stats
     */
    getStats() {
      return {
        size: this.cache.size,
        maxSize: this.maxCacheSize,
        utilization: (this.cache.size / this.maxCacheSize) * 100
      };
    },

    /**
     * Clean expired entries
     * @returns {number} Number of entries cleaned
     */
    cleanExpired() {
      let cleaned = 0;
      const now = Date.now();

      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > value.ttl) {
          this.cache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`[CacheManager] Cleaned ${cleaned} expired entries`);
      }

      return cleaned;
    }
  };

  // Clean expired entries every 5 minutes
  setInterval(() => {
    CacheManager.cleanExpired();
  }, 300000);

  window.CacheManager = CacheManager;
})();
