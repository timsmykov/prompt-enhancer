<script setup>
import { ref, onUnmounted } from 'vue'
import { Wand2, Copy, Check, RotateCcw, AlertCircle, X } from 'lucide-vue-next'
import { validatePromptInput } from '../utils/validation'

const originalText = ref('')
const improvedText = ref('')
const isLoading = ref(false)
const isCopying = ref(false)
const error = ref(null)
const copyError = ref(null)
const isCancelled = ref(false)

const mockResponses = [
  "Can you help me with my project? → Transform into: 'Could you please assist me with my project? I need guidance on [specific aspect] and would appreciate your expertise in [relevant area].'",
  "I need data → Transform into: 'I require comprehensive data analysis including [specific metrics], timeframe: [duration], format: [preferred output], with focus on [key areas].'",
  "Write code → Transform into: 'Develop a well-documented, modular solution for [specific problem]. Include error handling, comments, and follow best practices for [language/framework].'"
]

const improvePrompt = async () => {
  // Clear previous errors
  error.value = null
  copyError.value = null
  isCancelled.value = false

  // Validate input
  const validation = validatePromptInput(originalText.value)
  if (!validation.valid) {
    error.value = validation.error
    return
  }

  isLoading.value = true

  try {
    // Simulate API call with cleanup tracking
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (!isCancelled.value) {
          const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
          improvedText.value = randomResponse
          resolve()
        } else {
          reject(new Error('Operation cancelled'))
        }
      }, 1500)

      // Store timeout ID for cleanup
      return () => clearTimeout(timeoutId)
    })
  } catch (err) {
    error.value = 'Failed to improve prompt. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  if (!improvedText.value) return

  copyError.value = null

  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(improvedText.value)
      isCopying.value = true
      setTimeout(() => {
        isCopying.value = false
      }, 2000)
    } else {
      // Fallback for older browsers
      throw new Error('Clipboard API not available')
    }
  } catch (err) {
    // Fallback copy method for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = improvedText.value
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        isCopying.value = true
        setTimeout(() => {
          isCopying.value = false
        }, 2000)
      } else {
        throw new Error('Copy command failed')
      }
    } catch (fallbackErr) {
      copyError.value = 'Copy not supported in this browser. Please copy manually.'
    }
  }
}

const resetDemo = () => {
  originalText.value = ''
  improvedText.value = ''
  error.value = null
  copyError.value = null
}

const dismissError = () => {
  error.value = null
}

const dismissCopyError = () => {
  copyError.value = null
}

// Cleanup on unmount
onUnmounted(() => {
  isCancelled.value = true
  isLoading.value = false
})
</script>

<template>
  <section id="demo" class="live-demo">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Try It Live</h2>
        <p class="section-subtitle">
          Experience the magic of prompt improvement right here
        </p>
      </div>

      <!-- Error alert -->
      <div v-if="error" class="error-alert" role="alert">
        <AlertCircle :size="20" />
        <span>{{ error }}</span>
        <button @click="dismissError" class="dismiss-button" aria-label="Dismiss error">
          <X :size="18" />
        </button>
      </div>

      <div class="demo-container">
        <div class="demo-box input-box">
          <div class="box-header">
            <h3>Your Original Text</h3>
            <span class="char-count">{{ originalText.length }} chars</span>
          </div>
          <textarea
            v-model="originalText"
            class="demo-textarea"
            placeholder="Enter any text you want to improve... (e.g., 'I need help with my presentation')"
            rows="6"
            aria-label="Enter your original text to improve"
          ></textarea>
        </div>

        <div class="action-area">
          <button
            @click="improvePrompt"
            :disabled="!originalText.trim() || isLoading"
            class="improve-button"
            :class="{ loading: isLoading }"
          >
            <Wand2 v-if="!isLoading" :size="20" />
            <span v-if="isLoading">Improving...</span>
            <span v-else>Improve Prompt</span>
          </button>
        </div>

        <div class="demo-box output-box">
          <div class="box-header">
            <h3>Improved Result</h3>
            <button
              v-if="improvedText"
              @click="copyToClipboard"
              class="icon-button"
              :class="{ copied: isCopying }"
              :aria-label="isCopying ? 'Copied to clipboard' : 'Copy improved text to clipboard'"
            >
              <Check v-if="isCopying" :size="18" />
              <Copy v-else :size="18" />
              {{ isCopying ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="output-content">
            <!-- Copy error alert -->
            <div v-if="copyError" class="copy-error-alert" role="alert">
              <AlertCircle :size="16" />
              <span>{{ copyError }}</span>
              <button @click="dismissCopyError" class="dismiss-button" aria-label="Dismiss error">
                <X :size="14" />
              </button>
            </div>

            <div v-if="isLoading" class="loading-state" role="status" aria-live="polite">
              <div class="spinner"></div>
              <p>AI is enhancing your prompt...</p>
            </div>
            <div v-else-if="improvedText" class="improved-text" role="status" aria-live="polite">
              {{ improvedText }}
            </div>
            <div v-else class="placeholder-text" aria-hidden="true">
              Your improved prompt will appear here...
            </div>
          </div>
        </div>

        <button
          v-if="improvedText"
          @click="resetDemo"
          class="reset-button"
        >
          <RotateCcw :size="16" />
          Try Another
        </button>
      </div>

      <div class="demo-note">
        <p>
          <strong>Note:</strong> This is a demo with mock responses.
          The actual extension uses advanced AI models for real improvements.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   MOBILE-FIRST LIVE DEMO STYLES
   Base: 320px+ (stacked, compact)
   Tablet: 48rem+ (side-by-side)
   Desktop: 64rem+ (enhanced spacing)
   ============================================ */

/* Base layer - section background */
.live-demo {
  position: relative;
  padding: 3rem 1rem;
  background: var(--color-bg);
  overflow: hidden;
}

/* Subtle background pattern */
.live-demo::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section header - compact */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: var(--tracking-tight);
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  max-width: 43.75rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Error alert - compact */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 0.125rem solid #f87171;
  border-radius: 0.5rem;
  color: #991b1b;
  margin-bottom: 1rem;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.error-alert svg {
  flex-shrink: 0;
}

.error-alert span {
  flex: 1;
  font-weight: var(--font-medium);
  font-size: 0.9375rem;
}

.dismiss-button {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: background 0.15s;
  opacity: 0.7;
}

.dismiss-button:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1;
}

/* Demo container - stacked on mobile, row on tablet */
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* Demo boxes - compact borders */
.demo-box {
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 0.125rem solid var(--color-border);
  transition: all 0.2s;
  position: relative;
  width: 100%;
  max-width: 100%;
}

.demo-box:hover {
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}

.demo-box.input-box {
  border-left: 0.25rem solid var(--color-primary);
}

.demo-box.output-box {
  border-left: 0.25rem solid var(--color-accent);
}

/* Subtle glow effect */
.demo-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.demo-box:hover::before {
  opacity: 0.5;
}

/* Box header - compact */
.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}

.box-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: var(--font-semibold);
  color: var(--color-text);
  letter-spacing: var(--tracking-wide);
}

.char-count {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  background: var(--color-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

/* Textarea - compact padding */
.demo-textarea {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 9.375rem;
  transition: background 0.2s;
}

.demo-textarea:focus {
  background: var(--color-bg-alt);
  box-shadow: 0 0 0 0.1875rem rgba(59, 130, 246, 0.1);
}

.demo-textarea:focus-visible {
  outline: none;
  box-shadow: 0 0 0 0.1875rem rgba(59, 130, 246, 0.2);
}

.demo-textarea::placeholder {
  color: var(--color-text-light);
}

/* Action area - centered */
.action-area {
  display: flex;
  justify-content: center;
  position: relative;
}

/* Glow behind button */
.action-area::before {
  content: '';
  position: absolute;
  width: 18.75rem;
  height: 18.75rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  inset: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Improve button - compact */
.improve-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-blue-purple);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-primary);
  letter-spacing: var(--tracking-wide);
  overflow: hidden;
  animation: gradientMove 8s ease infinite;
  z-index: 1;
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Shimmer effect on button */
.improve-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
}

.improve-button:hover::before {
  left: 100%;
}

.improve-button:hover:not(:disabled) {
  transform: translateY(-0.1875rem) scale(1.02);
  box-shadow: 0 0.9375rem 2.5rem -0.3125rem rgba(59, 130, 246, 0.5);
}

.improve-button:active:not(:disabled) {
  transform: translateY(-0.0625rem) scale(0.98);
}

.improve-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.improve-button:focus-visible {
  outline: 0.1875rem solid rgba(255, 255, 255, 0.8);
  outline-offset: 0.1875rem;
}

.improve-button.loading {
  animation: pulseSoft 1.5s infinite;
}

@keyframes pulseSoft {
  0%, 100% {
    transform: scale(1);
    box-shadow: var(--shadow-primary);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0.9375rem 2.5rem -0.3125rem rgba(59, 130, 246, 0.6);
  }
}

/* Icon button - compact */
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.icon-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-0.0625rem);
  box-shadow: var(--shadow-sm);
}

.icon-button.copied {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(16, 185, 129, 0.05);
}

/* Output content - compact */
.output-content {
  padding: 1rem;
  min-height: 12.5rem;
  position: relative;
}

/* Copy error alert - compact */
.copy-error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 0.375rem;
  color: #92400e;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.copy-error-alert .dismiss-button {
  padding: 0.25rem;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 0.25rem solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Improved text */
.improved-text {
  line-height: 1.8;
  color: var(--color-text);
  font-size: 1rem;
  white-space: pre-wrap;
}

/* Placeholder text */
.placeholder-text {
  color: var(--color-text-light);
  text-align: center;
  padding: 1.5rem;
  font-style: italic;
}

/* Reset button */
.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 0.125rem solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-50);
  transform: translateY(-0.125rem);
  box-shadow: var(--shadow-md);
}

/* Demo note - compact */
.demo-note {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #fbbf24;
  box-shadow: var(--shadow-sm);
}

.demo-note p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
  font-weight: var(--font-medium);
  line-height: 1.6;
}

/* ============================================
   MEDIA QUERIES (Mobile-First)
   ============================================ */

/* Tablet: 48rem (768px) - side-by-side layout */
@media (min-width: 48rem) {
  .live-demo {
    padding: 3.5rem 1rem;
  }

  .section-header {
    margin-bottom: 2.5rem;
  }

  .demo-container {
    flex-direction: row;
    align-items: stretch;
    gap: 1.5rem;
  }

  .demo-box {
    flex: 1;
    min-width: 0;
  }

  .action-area {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  .improve-button {
    padding: 1rem 2rem;
  }
}

/* Desktop: 64rem (1024px) - enhanced spacing */
@media (min-width: 64rem) {
  .live-demo {
    padding: 4rem 1rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .demo-textarea {
    padding: 1.25rem;
    min-height: 12.5rem;
  }

  .output-content {
    padding: 1.25rem;
    min-height: 15rem;
  }

  .box-header {
    padding: 1rem 1.25rem;
  }

  .demo-note {
    margin-top: 2rem;
    padding: 1rem;
  }
}

/* Large desktop: 80rem (1280px) - maximum spacing */
@media (min-width: 80rem) {
  .live-demo {
    padding: 4.5rem 1rem;
  }

  .demo-container {
    gap: 2rem;
  }

  .improve-button {
    padding: 1.25rem 2.5rem;
  }
}
</style>
