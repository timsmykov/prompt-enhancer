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
/* ============================================
   MOBILE-FIRST CSS GRID REDESIGN
   Base: 320px mobile, progressive enhancement
   Units: rem only (no px except border-radius)
   ============================================ */

/* Section Container - Compact 3rem (48px) padding */
.features {
  position: relative;
  padding: 3rem 1rem;
  background: var(--color-bg-alt);
  overflow: hidden;
}

/* Ambient gradient background */
.features::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section Header - Centered, compact spacing */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  max-width: 43.75rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* ============================================
   RESPONSIVE CSS GRID - Mobile-First
   Mobile: 1 column (320px+)
   Tablet: 2 columns (48rem+)
   Desktop: Auto-fit (64rem+)
   ============================================ */
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
  width: 100%;
}

/* Tablet: 2 columns */
@media (min-width: 48rem) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* Desktop: Auto-fit with minmax */
@media (min-width: 64rem) {
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    gap: 1.5rem;
  }
}

/* ============================================
   FEATURE CARD - Modern Glass Design
   ============================================ */
.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 0.0625rem solid var(--color-border);
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
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.feature-card:hover::before {
  opacity: 0.05;
}

.feature-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.75rem 1.5rem -0.25rem rgba(0, 0, 0, 0.1);
  border-color: var(--feature-color, #3b82f6);
}

/* ============================================
   ICON CONTAINER - Gradient + Shadow
   ============================================ */
.icon-container {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--feature-color, #3b82f6) 0%, var(--feature-color, #3b82f6)dd 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0.75rem 1.5rem -0.25rem var(--feature-color, rgba(59, 130, 246, 0.3));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.feature-card:hover .icon-container {
  transform: scale(1.05) rotate(3deg);
  box-shadow: 0 1rem 2rem -0.25rem var(--feature-color, rgba(59, 130, 246, 0.4));
}

/* ============================================
   TYPOGRAPHY - Fluid Sizes
   ============================================ */
.feature-title {
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  position: relative;
  z-index: 1;
}

.feature-description {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* ============================================
   HIGHLIGHT SECTION - Gradient CTA
   ============================================ */
.feature-highlight {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.5rem;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 1rem 2rem -0.5rem rgba(59, 130, 246, 0.3);
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
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-1.25rem) translateY(-1.25rem);
  }
}

.highlight-content {
  position: relative;
  z-index: 1;
}

.highlight-content h3 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: white;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.025em;
  text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1);
}

.highlight-content p {
  font-size: clamp(0.9375rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

/* ============================================
   RESPONSIVE ADJUSTMENTS
   ============================================ */

/* Small mobile (320px-375px) */
@media (max-width: 23.4375rem) {
  .features {
    padding: 2.5rem 0.75rem;
  }

  .feature-card {
    padding: 1.25rem;
  }

  .icon-container {
    width: 3rem;
    height: 3rem;
  }

  .feature-highlight {
    padding: 1.75rem 1.25rem;
  }
}

/* Large mobile (375px-48rem) */
@media (min-width: 23.4375rem) and (max-width: 48rem) {
  .features {
    padding: 3rem 1.25rem;
  }
}

/* Tablet (48rem-64rem) */
@media (min-width: 48rem) {
  .features {
    padding: 3rem 2rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .feature-card {
    padding: 1.75rem;
  }

  .feature-highlight {
    padding: 2.5rem 2rem;
  }
}

/* Desktop (64rem+) */
@media (min-width: 64rem) {
  .features {
    padding: 3rem 2.5rem;
  }

  .section-header {
    margin-bottom: 3.5rem;
  }

  .features-grid {
    margin-bottom: 3rem;
  }

  .feature-card {
    padding: 2rem;
  }

  .icon-container {
    width: 4rem;
    height: 4rem;
  }

  .feature-highlight {
    padding: 3rem 2.5rem;
  }
}

/* Large desktop (80rem+) */
@media (min-width: 80rem) {
  .features {
    padding: 3.5rem 3rem;
  }
}
</style>
