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
  position: relative;
  padding: var(--space-4xl) var(--space-md);
  background: var(--color-bg-alt);
  overflow: hidden;
}

.features::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: var(--container-2xl);
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

/* Modern Bento Grid Layout */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

/* Large feature card spans 2 columns */
.feature-card:nth-child(1) {
  grid-column: span 2;
  grid-row: span 2;
}

.feature-card {
  background: white;
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  text-align: left;
  transition: all var(--transition-base);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Subtle gradient overlay on hover */
.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--feature-color, #3b82f6) 0%, transparent 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.feature-card:hover::before {
  opacity: 0.05;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--feature-color, #3b82f6);
}

.feature-card:nth-child(1):hover {
  transform: translateY(-12px) scale(1.02);
}

/* Special styling for large feature card */
.feature-card:nth-child(1) {
  padding: var(--space-2xl);
  background: linear-gradient(135deg, #ffffff 0%, var(--color-bg-alt) 100%);
}

.feature-card:nth-child(1) .icon-container {
  width: 6rem;
  height: 6rem;
  margin: 0 0 var(--space-lg) 0;
}

.feature-card:nth-child(1) .feature-title {
  font-size: var(--text-3xl);
}

.feature-card:nth-child(1) .feature-description {
  font-size: var(--text-lg);
}

.icon-container {
  width: 4rem;
  height: 4rem;
  margin: 0 auto var(--space-md) 0;
  background: linear-gradient(135deg, var(--feature-color, #3b82f6) 0%, var(--feature-color, #3b82f6)dd 100%);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 12px 24px -4px var(--feature-color, rgba(59, 130, 246, 0.3));
  transition: all var(--transition-base);
  position: relative;
  z-index: 1;
}

.feature-card:hover .icon-container {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 16px 32px -4px var(--feature-color, rgba(59, 130, 246, 0.4));
}

.feature-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-snug);
  position: relative;
  z-index: 1;
}

.feature-description {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  margin: 0;
  position: relative;
  z-index: 1;
}

/* Enhanced highlight section */
.feature-highlight {
  background: var(--gradient-blue-purple);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  text-align: center;
  box-shadow: var(--shadow-primary);
  position: relative;
  overflow: hidden;
}

/* Animated background pattern */
.feature-highlight::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: patternMove 20s linear infinite;
}

@keyframes patternMove {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-20px) translateY(-20px); }
}

.highlight-content {
  position: relative;
  z-index: 1;
}

.highlight-content h3 {
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
  color: white;
  margin: 0 0 var(--space-md) 0;
  letter-spacing: var(--tracking-tight);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.highlight-content p {
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.95);
  line-height: var(--leading-relaxed);
  margin: 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Badge for highlight */
.feature-highlight-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: white;
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-card:nth-child(1) {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .features {
    padding: var(--space-3xl) var(--space-md);
  }

  .features-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: var(--space-md);
  }

  .feature-card,
  .feature-card:nth-child(1) {
    grid-column: span 1;
    grid-row: span 1;
    padding: var(--space-lg);
  }

  .feature-card:nth-child(1) .icon-container {
    width: 4.5rem;
    height: 4.5rem;
  }

  .feature-card:nth-child(1) .feature-title {
    font-size: var(--text-2xl);
  }

  .feature-card:nth-child(1) .feature-description {
    font-size: var(--text-base);
  }

  .feature-highlight {
    padding: var(--space-xl);
  }

  .highlight-content h3 {
    font-size: var(--text-2xl);
  }

  .highlight-content p {
    font-size: var(--text-lg);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--text-3xl);
  }

  .feature-card {
    padding: var(--space-md);
  }

  .icon-container {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>
