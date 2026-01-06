<script setup>
import { ref, onMounted } from 'vue'
import { Sparkles, Download, ArrowRight } from 'lucide-vue-next'

const animationText = ref('')
const fullText = 'Select text → Improve → Get better results'
let currentIndex = 0

onMounted(() => {
  const typeInterval = setInterval(() => {
    if (currentIndex < fullText.length) {
      animationText.value += fullText[currentIndex]
      currentIndex++
    } else {
      clearInterval(typeInterval)
      setTimeout(() => {
        animationText.value = ''
        currentIndex = 0
        typeInterval()
      }, 2000)
    }
  }, 100)

  return () => clearInterval(typeInterval)
})
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="badge">
          <Sparkles :size="16" />
          <span>Free Chrome Extension</span>
        </div>

        <h1 class="hero-title">
          Improve Your Prompts in
          <span class="gradient-text">One Click</span>
        </h1>

        <p class="hero-description">
          Transform your text into powerful, effective prompts with AI.
          Simply select any text, click "Improve prompt", and watch the magic happen.
        </p>

        <div class="animation-box">
          <code class="typing-animation">{{ animationText }}<span class="cursor">|</span></code>
        </div>

        <div class="cta-buttons">
          <a href="#download" class="btn btn-primary">
            <Download :size="20" />
            Add to Chrome - Free
          </a>
          <a href="#demo" class="btn btn-secondary">
            Try Live Demo
            <ArrowRight :size="20" />
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">10K+</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat">
            <div class="stat-number">4.8★</div>
            <div class="stat-label">Average Rating</div>
          </div>
          <div class="stat">
            <div class="stat-number">100%</div>
            <div class="stat-label">Privacy First</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 6rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  color: #0f172a;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.animation-box {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.typing-animation {
  color: #10b981;
  font-family: 'Courier New', monospace;
  font-size: 1.125rem;
  display: block;
}

.cursor {
  animation: blink 1s infinite;
  -webkit-animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -1px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #1e293b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
