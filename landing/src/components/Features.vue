<script setup>
import { Zap, Shield, Puzzle, Settings } from 'lucide-vue-next'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get improved prompts in seconds. No waiting, no delays - just instant AI-powered enhancement.',
    color: '#fbbf24'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays on your device. We don\'t store or share your prompts with anyone. Complete privacy guaranteed.',
    color: '#10b981'
  },
  {
    icon: Puzzle,
    title: 'Works Everywhere',
    description: 'Use it in Gmail, Google Docs, LinkedIn, Twitter, or any website. Select text and improve it instantly.',
    color: '#3b82f6'
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Choose your AI model, adjust system prompts, and set your preferred typing speed. Make it yours.',
    color: '#8b5cf6'
  }
]
</script>

<template>
  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Why Choose Prompt Improver?</h2>
        <p class="section-subtitle">
          Powerful features designed to make your communication more effective
        </p>
      </div>

      <div class="features-grid">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card"
        >
          <div
            class="icon-container"
            :style="{ '--feature-color': feature.color }"
          >
            <component :is="feature.icon" :size="36" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>

      <div class="feature-highlight">
        <div class="highlight-content">
          <h3>Free Forever</h3>
          <p>
            No subscriptions, no hidden costs. Use Prompt Improver as much as you want,
            completely free. Bring your own OpenRouter API key and unlock unlimited improvements.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 6rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  border-color: var(--feature-color, #3b82f6);
}

.icon-container {
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--feature-color, #3b82f6) 0%, var(--feature-color, #3b82f6)dd 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px -4px var(--feature-color, rgba(59, 130, 246, 0.3));
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.feature-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.feature-highlight {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 12px 24px -10px rgba(59, 130, 246, 0.4);
}

.highlight-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
}

.highlight-content p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  margin: 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .features {
    padding: 4rem 1rem;
  }

  .feature-highlight {
    padding: 2rem;
  }

  .highlight-content h3 {
    font-size: 1.5rem;
  }

  .highlight-content p {
    font-size: 1rem;
  }
}
</style>
