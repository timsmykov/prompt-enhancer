/**
 * APIHandler - Handle OpenRouter API calls with retry logic
 * Implements exponential backoff, error mapping, and timeout handling
 */

(() => {
  if (window.APIHandler) {
    return; // Already loaded
  }

  const APIHandler = {
    // API configuration
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    DEFAULT_MODEL: 'openrouter/auto',
    DEFAULT_SYSTEM_PROMPT:
      'You are a helpful prompt improver. Rewrite the text to be clearer, concise, and actionable without changing intent.',
    REQUEST_TIMEOUT_MS: 15000,
    MAX_PROMPT_CHARS: 4000,
    MAX_RETRIES: 3,
    BASE_DELAY_MS: 1000, // Starting delay for exponential backoff
    MAX_DELAY_MS: 10000, // Maximum delay between retries

    // Retryable status codes
    RETRYABLE_STATUS: new Set([408, 429, 500, 502, 503, 504]),

    // Error messages mapping
    ERROR_MESSAGES: {
      400: 'Invalid request. Check your prompt.',
      401: 'Invalid API key.',
      403: 'Access forbidden. Check your API key permissions.',
      404: 'Model not found.',
      429: 'Rate limit exceeded. Please wait.',
      500: 'API server error. Try again.',
      502: 'API gateway error. Try again.',
      503: 'API unavailable. Try again.',
      504: 'API timeout. Try again.',
      timeout: 'Request timed out.',
      network: 'Network error. Check your connection.',
      parse: 'Failed to parse API response.',
      empty: 'No response content returned.',
      unknown: 'Unknown error occurred.'
    },

    /**
     * Build API request payload
     * @param {string} text - User prompt
     * @param {Object} settings - API settings
     * @returns {Object} Request payload
     */
    buildPayload(text, settings) {
      const systemPrompt = settings.systemPrompt || this.DEFAULT_SYSTEM_PROMPT;
      return {
        model: settings.model || this.DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ]
      };
    },

    /**
     * Validate user prompt
     * @param {string} text - User prompt
     * @returns {Object} Validation result
     */
    validatePrompt(text) {
      const value = typeof text === 'string' ? text.trim() : '';

      if (!value) {
        return { valid: false, error: 'No text selected.' };
      }

      if (value.length > this.MAX_PROMPT_CHARS) {
        return {
          valid: false,
          error: `Selected text is too long. Max ${this.MAX_PROMPT_CHARS} characters.`
        };
      }

      return { valid: true, value };
    },

    /**
     * Compress payload if large
     * @param {Object} payload - Request payload
     * @returns {Object} Compressed or original payload
     */
    compressPayload(payload) {
      const jsonStr = JSON.stringify(payload);

      // If payload is small, return as-is
      if (jsonStr.length < 1000) {
        return payload;
      }

      // TODO: Implement compression if needed
      // For now, just log large payloads
      console.log(`[APIHandler] Large payload: ${jsonStr.length} bytes`);

      return payload;
    },

    /**
     * Calculate exponential backoff delay
     * @param {number} attempt - Current attempt number
     * @returns {number} Delay in milliseconds
     */
    calculateBackoff(attempt) {
      const delay = Math.min(
        this.BASE_DELAY_MS * Math.pow(2, attempt),
        this.MAX_DELAY_MS
      );
      // Add jitter to avoid thundering herd
      return delay + Math.random() * 1000;
    },

    /**
     * Map HTTP status to user-friendly error message
     * @param {number} status - HTTP status code
     * @param {string} detail - Error detail
     * @returns {string} User-friendly error message
     */
    mapError(status, detail = '') {
      const MAX_ERROR_DETAIL_CHARS = 500;

      const baseMessage = this.ERROR_MESSAGES[status] || this.ERROR_MESSAGES.unknown;

      if (!detail) {
        return baseMessage;
      }

      // Truncate detail if too long
      const truncated = detail.length > MAX_ERROR_DETAIL_CHARS
        ? `${detail.substring(0, MAX_ERROR_DETAIL_CHARS)}...`
        : detail;

      return `${baseMessage} ${truncated}`.trim();
    },

    /**
     * Extract error detail from response
     * @param {Response} response - Fetch response object
     * @returns {Promise<string>} Error detail
     */
    async extractErrorDetail(response) {
      try {
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          return json.error?.message || json.error || text;
        } catch {
          return text;
        }
      } catch {
        return '';
      }
    },

    /**
     * Call OpenRouter API with retry logic
     * @param {string} text - User prompt
     * @param {Object} settings - API settings
     * @param {Object} metadata - Request metadata
     * @returns {Promise<Object>} API response
     */
    async call(text, settings, metadata = {}) {
      // Validate API key
      if (!settings.apiKey) {
        return {
          error: this.ERROR_MESSAGES[401],
          errorType: 'auth'
        };
      }

      // Validate prompt
      const validated = this.validatePrompt(text);
      if (!validated.valid) {
        return {
          error: validated.error,
          errorType: 'validation'
        };
      }

      // Check cache first
      if (typeof CacheManager !== 'undefined') {
        const cached = CacheManager.get(validated.value, settings);
        if (cached) {
          console.log('[APIHandler] Returning cached response');
          return cached;
        }
      }

      const startTime = Date.now();

      // Retry loop with exponential backoff
      for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          const delay = this.calculateBackoff(attempt - 1);
          console.log(`[APIHandler] Retry ${attempt}/${this.MAX_RETRIES} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

        try {
          // Build and compress payload
          const payload = this.compressPayload(
            this.buildPayload(validated.value, settings)
          );

          // Make API request
          const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${settings.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': chrome.runtime.getURL(''),
              'X-Title': 'Prompt Improver Extension'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          // Handle non-OK responses
          if (!response.ok) {
            const isRetryable = this.RETRYABLE_STATUS.has(response.status);

            if (isRetryable && attempt < this.MAX_RETRIES) {
              console.log(`[APIHandler] Retryable status ${response.status}, retrying...`);
              continue;
            }

            const detail = await this.extractErrorDetail(response);
            return {
              error: this.mapError(response.status, detail),
              errorType: 'api',
              statusCode: response.status
            };
          }

          // Parse successful response
          try {
            const data = await response.json();
            const result = data?.choices?.[0]?.message?.content?.trim();

            if (!result) {
              return {
                error: this.ERROR_MESSAGES.empty,
                errorType: 'parse'
              };
            }

            const responseTime = Date.now() - startTime;
            const responseObj = { result, responseTime };

            // Cache the response
            if (typeof CacheManager !== 'undefined') {
              CacheManager.set(validated.value, settings, responseObj);
            }

            return responseObj;
          } catch (parseError) {
            return {
              error: this.ERROR_MESSAGES.parse,
              errorType: 'parse',
              detail: parseError.message
            };
          }

        } catch (error) {
          clearTimeout(timeoutId);

          // Handle abort (timeout)
          if (error.name === 'AbortError') {
            if (attempt < this.MAX_RETRIES) {
              console.log('[APIHandler] Timeout, retrying...');
              continue;
            }
            return {
              error: this.ERROR_MESSAGES.timeout,
              errorType: 'timeout'
            };
          }

          // Handle network errors
          if (attempt < this.MAX_RETRIES) {
            console.log('[APIHandler] Network error, retrying...', error.message);
            continue;
          }

          return {
            error: this.ERROR_MESSAGES.network,
            errorType: 'network',
            detail: error.message
          };
        }
      }

      // All retries exhausted
      return {
        error: 'Request failed after multiple attempts.',
        errorType: 'exhausted'
      };
    }
  };

  window.APIHandler = APIHandler;
})();
