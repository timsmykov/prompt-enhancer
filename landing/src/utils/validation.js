/**
 * Validation utilities for input sanitization and safety
 */

/**
 * Maximum allowed characters for prompt input
 */
const MAX_PROMPT_CHARS = 4000

/**
 * Suspicious patterns that might indicate injection attempts
 */
const SUSPICIOUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=
  /<iframe[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<object[^>]*>/gi
]

/**
 * Validate prompt input for safety and constraints
 * @param {string} text - Input text to validate
 * @returns {Object} Validation result with valid flag and optional error message
 */
export function validatePromptInput(text) {
  // Check if text exists
  if (!text || typeof text !== 'string') {
    return {
      valid: false,
      error: 'Please enter some text to improve.'
    }
  }

  const trimmed = text.trim()

  // Check if empty after trimming
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Please enter some text to improve.'
    }
  }

  // Check minimum length
  if (trimmed.length < 3) {
    return {
      valid: false,
      error: 'Text is too short. Please enter at least 3 characters.'
    }
  }

  // Check maximum length
  if (trimmed.length > MAX_PROMPT_CHARS) {
    return {
      valid: false,
      error: `Text is too long. Please keep it under ${MAX_PROMPT_CHARS} characters.`
    }
  }

  // Check for suspicious patterns (XSS prevention)
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        valid: false,
        error: 'Invalid text detected. Please remove any HTML or script tags.'
      }
    }
  }

  return {
    valid: true
  }
}

/**
 * Safely access array elements with default fallback
 * @param {Array} array - Array to access
 * @param {number} index - Index to access
 * @param {*} defaultValue - Default value if index is out of bounds (default: null)
 * @returns {*} Array element or default value
 */
export function safeArrayAccess(array, index, defaultValue = null) {
  if (!Array.isArray(array) || index < 0 || index >= array.length) {
    return defaultValue
  }
  return array[index]
}

/**
 * Sanitize text by escaping HTML entities
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') {
    return ''
  }

  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Truncate text to maximum length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (typeof text !== 'string') {
    return ''
  }

  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength - 3) + '...'
}
