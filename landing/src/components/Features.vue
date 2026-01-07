<script setup>
import { Zap, Shield, Globe, Settings } from 'lucide-vue-next'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get improved prompts in seconds. No waiting, no delays - just instant AI-powered enhancement.',
    color: '#fbbf24',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays on your device. We don\'t store or share your prompts with anyone.',
    color: '#10b981',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Use it in Gmail, Google Docs, LinkedIn, Twitter, or any website.',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Choose your AI model, adjust system prompts, and set your preferred typing speed.',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500'
  }
]
</script>

<template>
  <section class="features" aria-labelledby="features-title">
    <!-- Animated background -->
    <div class="bg-pattern" aria-hidden="true"></div>

    <div class="container">
      <div class="section-header">
        <div class="badge">
          <Zap :size="16" aria-hidden="true" />
          <span>Powerful Features</span>
        </div>
        <h2 id="features-title" class="section-title">
          Why Choose <span class="gradient-text">Prompt Improver?</span>
        </h2>
        <p class="section-subtitle">
          Powerful features designed to make your communication more effective
        </p>
      </div>

      <div class="features-grid" role="list" aria-label="Key features">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card"
          :style="{ '--feature-color': feature.color, '--feature-gradient': feature.gradient }"
          role="listitem"
          :aria-label="`${feature.title}: ${feature.description}`"
        >
          <!-- Icon with glow -->
          <div class="icon-container" aria-hidden="true">
            <div class="icon-glow"></div>
            <component :is="feature.icon" :size="36" class="feature-icon" />
          </div>

          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>

          <!-- Hover indicator -->
          <div class="hover-indicator" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Gradient CTA Box -->
      <div class="feature-cta" role="region" aria-label="Free Forever Announcement">
        <div class="cta-content">
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
   HERO STYLE - Gradients, Glassmorphism, Animation
   ============================================ */

.features {
  position: relative;
  padding: 4rem 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

/* Animated Background Pattern */
.bg-pattern {
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

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  color: #1d4ed8;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 0.0625rem solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 0.25rem 0.75rem rgba(59, 130, 246, 0.1);
}

.section-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #64748b;
  max-width: 43.75rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Feature Card with Glassmorphism */
.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1.25rem);
  -webkit-backdrop-filter: blur(1.25rem);
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  border: 0.125rem solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 1.25rem 2.5rem rgba(0, 0, 0, 0.1),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.1),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

/* Gradient overlay on hover */
.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--feature-color, #3b82f6) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.feature-card:hover::before {
  opacity: 0.05;
}

.feature-card:hover {
  transform: translateY(-0.5rem);
  box-shadow:
    0 1.875rem 3.75rem rgba(0, 0, 0, 0.15),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.2),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 1);
  border-color: var(--feature-color, #3b82f6);
}

/* Icon Container with Glow */
.icon-container {
  position: relative;
  width: 4rem;
  height: 4rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--feature-color, #3b82f6) 0%, var(--feature-color, #3b82f6)dd 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0.75rem 1.5rem -0.25rem var(--feature-color, rgba(59, 130, 246, 0.3));
  transition: all 0.3s ease;
  z-index: 1;
}

.icon-glow {
  position: absolute;
  inset: -0.5rem;
  background: radial-gradient(circle, var(--feature-color, #3b82f6) 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(1rem);
  animation: iconGlow 2s ease-in-out infinite alternate;
}

@keyframes iconGlow {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}

.feature-icon {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.25rem);
  }
}

.feature-card:hover .icon-container {
  transform: scale(1.05) rotate(3deg);
  box-shadow: 0 1rem 2rem -0.25rem var(--feature-color, rgba(59, 130, 246, 0.4));
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

/* Typography */
.feature-title {
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  position: relative;
  z-index: 1;
}

.feature-description {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  position: relative;
  z-index: 1;
}

/* Hover Indicator */
.hover-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0.1875rem;
  background: var(--feature-color, #3b82f6);
  transition: width 0.3s ease;
  border-radius: 9999px 9999px 0 0;
}

.feature-card:hover .hover-indicator {
  width: 60%;
}

/* Gradient CTA Box */
.feature-cta {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2rem 4rem -1rem rgba(59, 130, 246, 0.4);
  position: relative;
  overflow: hidden;
}

/* Animated background pattern */
.feature-cta::before {
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

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-content h3 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
  text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1);
}

.cta-content p {
  font-size: clamp(0.9375rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

/* Responsive Design */
@media (min-width: 48rem) {
  .features {
    padding: 4rem 2rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .section-header {
    margin-bottom: 4rem;
  }
}

@media (min-width: 64rem) {
  .features {
    padding: 4rem 2.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .feature-card {
    padding: 2.5rem 2rem;
  }

  .icon-container {
    width: 4.5rem;
    height: 4.5rem;
  }
}

@media (min-width: 80rem) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 23.4375rem) {
  .features {
    padding: 3rem 0.75rem;
  }

  .feature-card {
    padding: 1.5rem 1.25rem;
  }
}
</style>
