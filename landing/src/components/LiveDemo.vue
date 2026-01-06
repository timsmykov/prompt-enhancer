<script setup>
import { ref } from 'vue'
import { Wand2, Copy, Check, RotateCcw } from 'lucide-vue-next'

const originalText = ref('')
const improvedText = ref('')
const isLoading = ref(false)
const isCopying = ref(false)

const mockResponses = [
  "Can you help me with my project? → Transform into: 'Could you please assist me with my project? I need guidance on [specific aspect] and would appreciate your expertise in [relevant area].'",
  "I need data → Transform into: 'I require comprehensive data analysis including [specific metrics], timeframe: [duration], format: [preferred output], with focus on [key areas].'",
  "Write code → Transform into: 'Develop a well-documented, modular solution for [specific problem]. Include error handling, comments, and follow best practices for [language/framework].'"
]

const improvePrompt = () => {
  if (!originalText.value.trim()) return

  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    improvedText.value = randomResponse
    isLoading.value = false
  }, 1500)
}

const copyToClipboard = async () => {
  if (!improvedText.value) return

  try {
    await navigator.clipboard.writeText(improvedText.value)
    isCopying.value = true
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const resetDemo = () => {
  originalText.value = ''
  improvedText.value = ''
}
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
            >
              <Check v-if="isCopying" :size="18" />
              <Copy v-else :size="18" />
              {{ isCopying ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div class="output-content">
            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>AI is enhancing your prompt...</p>
            </div>
            <div v-else-if="improvedText" class="improved-text">
              {{ improvedText }}
            </div>
            <div v-else class="placeholder-text">
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
.live-demo {
  position: relative;
  padding: var(--space-4xl) var(--space-md);
  background: var(--color-bg);
  overflow: hidden;
}

/* Subtle background pattern */
.live-demo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.section-header {
  text-align: center;
  margin-bottom: var(--space-3xl);
}

.section-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-muted);
  max-width: 700px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}

.demo-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.demo-box {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 2px solid var(--color-border);
  transition: all var(--transition-base);
  position: relative;
}

.demo-box:hover {
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}

.demo-box.input-box {
  border-left: 4px solid var(--color-primary);
}

.demo-box.output-box {
  border-left: 4px solid var(--color-accent);
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
  transition: opacity var(--transition-base);
}

.demo-box:hover::before {
  opacity: 0.5;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}

.box-header h3 {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  letter-spacing: var(--tracking-wide);
}

.char-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  background: var(--color-bg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
}

.demo-textarea {
  width: 100%;
  padding: var(--space-lg);
  border: none;
  border-radius: 0;
  font-family: inherit;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  resize: vertical;
  outline: none;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 150px;
  transition: background var(--transition-base);
}

.demo-textarea:focus {
  background: var(--color-bg-alt);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.demo-textarea:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.demo-textarea::placeholder {
  color: var(--color-text-light);
}

.action-area {
  display: flex;
  justify-content: center;
  position: relative;
}

/* Glow behind button */
.action-area::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.improve-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-2xl);
  background: var(--gradient-blue-purple);
  background-size: 200% 200%;
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  cursor: pointer;
  transition: all var(--transition-base);
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
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 40px -5px rgba(59, 130, 246, 0.5);
}

.improve-button:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.improve-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.improve-button:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.8);
  outline-offset: 3px;
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
    box-shadow: 0 15px 40px -5px rgba(59, 130, 246, 0.6);
  }
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.icon-button.copied {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(16, 185, 129, 0.05);
}

.output-content {
  padding: var(--space-lg);
  min-height: 200px;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  color: var(--color-text-muted);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.improved-text {
  line-height: var(--leading-loose);
  color: var(--color-text);
  font-size: var(--text-base);
  white-space: pre-wrap;
}

.placeholder-text {
  color: var(--color-text-light);
  text-align: center;
  padding: var(--space-xl);
  font-style: italic;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0 auto;
  padding: var(--space-md) var(--space-xl);
  background: white;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-base);
}

.reset-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.demo-note {
  margin-top: var(--space-xl);
  padding: var(--space-md);
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid #fbbf24;
  box-shadow: var(--shadow-sm);
}

.demo-note p {
  margin: 0;
  color: #92400e;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-relaxed);
}

@media (max-width: 768px) {
  .live-demo {
    padding: var(--space-3xl) var(--space-md);
  }

  .section-title {
    font-size: var(--text-3xl);
  }

  .improve-button {
    width: 100%;
    justify-content: center;
    padding: var(--space-md) var(--space-xl);
  }

  .demo-box {
    border-radius: var(--radius-xl);
  }

  .box-header {
    padding: var(--space-sm) var(--space-md);
  }

  .demo-textarea {
    padding: var(--space-md);
    min-height: 120px;
  }

  .output-content {
    padding: var(--space-md);
    min-height: 150px;
  }
}

@media (max-width: 480px) {
  .section-subtitle {
    font-size: var(--text-lg);
  }

  .improve-button {
    font-size: var(--text-base);
  }
}
</style>
