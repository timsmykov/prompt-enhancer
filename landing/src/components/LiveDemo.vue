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
  padding: 6rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
}

.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.demo-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.box-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.char-count {
  font-size: 0.875rem;
  color: #64748b;
}

.demo-textarea {
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 0;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.demo-textarea::placeholder {
  color: #94a3b8;
}

.action-area {
  display: flex;
  justify-content: center;
}

.improve-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.4);
}

.improve-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(59, 130, 246, 0.5);
}

.improve-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.improve-button.loading {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.icon-button.copied {
  border-color: #10b981;
  color: #10b981;
}

.output-content {
  padding: 1.5rem;
  min-height: 200px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.improved-text {
  line-height: 1.8;
  color: #0f172a;
  font-size: 1rem;
}

.placeholder-text {
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.demo-note {
  margin-top: 2rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
  text-align: center;
}

.demo-note p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .live-demo {
    padding: 4rem 1rem;
  }

  .improve-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
