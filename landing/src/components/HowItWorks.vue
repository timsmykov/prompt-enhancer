<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MousePointer, Sparkles, CheckCircle, ArrowRight } from 'lucide-vue-next'

const steps = ref([
  {
    icon: MousePointer,
    title: 'Select Your Text',
    description: 'Highlight any text you want to improve - a prompt, question, or message.',
    color: '#3b82f6'
  },
  {
    icon: Sparkles,
    title: 'Click "Improve Prompt"',
    description: 'Right-click and select "Improve prompt" from the context menu.',
    color: '#8b5cf6'
  },
  {
    icon: CheckCircle,
    title: 'Get Enhanced Result',
    description: 'Instantly see an AI-improved version. Replace or copy with one click.',
    color: '#10b981'
  }
])

const activeStep = ref(0)
let stepInterval = null

onMounted(() => {
  stepInterval = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.value.length
  }, 3000)
})

onUnmounted(() => {
  if (stepInterval) {
    clearInterval(stepInterval)
    stepInterval = null
  }
})

const setActiveStep = (index) => {
  activeStep.value = index
}
</script>

<template>
  <section class="how-it-works">
    <!-- Animated Background -->
    <div class="bg-pattern"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>

    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <div class="badge">
          <Sparkles :size="16" />
          <span>Simple Process</span>
        </div>
        <h2 class="section-title">
          How It <span class="gradient-text">Works</span>
        </h2>
        <p class="section-subtitle">
          Transform your prompts in three simple steps
        </p>
      </div>

      <!-- Steps Display -->
      <div class="steps-display">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-card"
          :class="{ active: activeStep === index }"
          @click="setActiveStep(index)"
        >
          <!-- Step Number Badge -->
          <div class="step-number" :style="{ '--step-color': step.color }">
            {{ index + 1 }}
          </div>

          <!-- Icon with Glow -->
          <div class="icon-wrapper" :style="{ '--step-color': step.color }">
            <div class="icon-glow"></div>
            <component :is="step.icon" :size="48" class="step-icon" />
          </div>

          <!-- Content -->
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-description">{{ step.description }}</p>

          <!-- Connector Arrow (not on last) -->
          <div v-if="index < steps.length - 1" class="connector-arrow">
            <ArrowRight :size="24" />
          </div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div class="progress-indicator">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="progress-dot"
          :class="{ active: activeStep === index }"
          @click="setActiveStep(index)"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how-it-works {
  position: relative;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
}

/* Animated Background Pattern */
.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* Animated Orbs */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(5rem);
  opacity: 0.4;
  animation: floatOrb 20s ease-in-out infinite;
  pointer-events: none;
  display: none;
}

.orb-1 {
  width: 25rem;
  height: 25rem;
  background: rgba(59, 130, 246, 0.3);
  top: -6.25rem;
  left: -6.25rem;
  animation-delay: 0s;
}

.orb-2 {
  width: 21.875rem;
  height: 21.875rem;
  background: rgba(139, 92, 246, 0.3);
  bottom: -6.25rem;
  right: -6.25rem;
  animation-delay: -10s;
}

@keyframes floatOrb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(1.875rem, -1.875rem) scale(1.1);
  }
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
  font-size: clamp(2rem, 5vw, 3rem);
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
  max-width: 37.5rem;
  margin: 0 auto;
  line-height: 1.75;
}

/* Steps Display */
.steps-display {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Step Card with Glassmorphism */
.step-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1.25rem);
  -webkit-backdrop-filter: blur(1.25rem);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  text-align: center;
  border: 0.125rem solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 1.25rem 2.5rem rgba(0, 0, 0, 0.1),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.1),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--step-color, #3b82f6) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 1.5rem;
}

.step-card:hover::before,
.step-card.active::before {
  opacity: 0.08;
}

.step-card:hover,
.step-card.active {
  transform: translateY(-0.5rem);
  box-shadow:
    0 1.875rem 3.75rem rgba(0, 0, 0, 0.15),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.2),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 1);
  border-color: var(--step-color, #3b82f6);
}

/* Step Number Badge */
.step-number {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--step-color, #3b82f6) 0%, var(--step-color, #3b82f6)dd 100%);
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  box-shadow:
    0 0.625rem 1.875rem var(--step-color, rgba(59, 130, 246, 0.4)),
    0 0 0 0.25rem rgba(255, 255, 255, 0.5);
  z-index: 10;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow:
      0 0.625rem 1.875rem var(--step-color, rgba(59, 130, 246, 0.4)),
      0 0 0 0.25rem rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow:
      0 0.625rem 2.5rem var(--step-color, rgba(59, 130, 246, 0.6)),
      0 0 0 0.5rem rgba(255, 255, 255, 0.3);
  }
}

/* Icon Wrapper */
.icon-wrapper {
  position: relative;
  width: 7rem;
  height: 7rem;
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-glow {
  position: absolute;
  inset: -0.625rem;
  background: radial-gradient(circle, var(--step-color, #3b82f6) 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(1.25rem);
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

.step-icon {
  color: var(--step-color, #3b82f6);
  filter: drop-shadow(0 0.25rem 0.5rem rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-0.5rem) rotate(5deg);
  }
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(10deg);
  filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.15));
}

/* Typography */
.step-title {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  letter-spacing: -0.025em;
}

.step-description {
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #64748b;
  line-height: 1.75;
  margin: 0;
}

/* Connector Arrow */
.connector-arrow {
  display: none;
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  background: white;
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
  color: #64748b;
  box-shadow: 0 0.375rem 0.75rem rgba(0, 0, 0, 0.1);
  animation: arrowPulse 2s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% {
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-50%) scale(1.1);
  }
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.progress-dot {
  width: 0.75rem;
  height: 0.75rem;
  background: #cbd5e1;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.progress-dot::after {
  content: '';
  position: absolute;
  inset: -0.25rem;
  border-radius: 9999px;
  border: 0.125rem solid transparent;
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: #3b82f6;
  transform: scale(1.3);
}

.progress-dot.active::after {
  border-color: #3b82f6;
  opacity: 0.3;
}

.progress-dot:hover {
  transform: scale(1.2);
  background: #60a5fa;
}

/* Tablet */
@media (min-width: 48rem) {
  .how-it-works {
    padding: 3rem 2rem;
  }

  .section-header {
    margin-bottom: 4rem;
  }

  .bg-orb {
    display: block;
  }
}

/* Desktop */
@media (min-width: 64rem) {
  .how-it-works {
    padding: 3rem;
  }

  .steps-display {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    align-items: stretch;
  }

  .step-card {
    padding: 3rem 2.5rem;
  }

  .connector-arrow {
    display: flex;
  }
}

/* Large Desktop */
@media (min-width: 80rem) {
  .steps-display {
    gap: 2.5rem;
  }
}
</style>
