<script setup>
import { ref, onMounted } from 'vue'
import { MousePointer, Sparkles, CheckCircle, ArrowRight } from 'lucide-vue-next'

const steps = ref([
  {
    icon: MousePointer,
    title: 'Select Your Text',
    description: 'Highlight any text you want to improve - a prompt, question, or message.',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0
  },
  {
    icon: Sparkles,
    title: 'Click "Improve Prompt"',
    description: 'Right-click and select "Improve prompt" from the context menu.',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500',
    delay: 200
  },
  {
    icon: CheckCircle,
    title: 'Get Enhanced Result',
    description: 'Instantly see an AI-improved version. Replace or copy with one click.',
    color: '#10b981',
    gradient: 'from-green-500 to-emerald-500',
    delay: 400
  }
])

const activeStep = ref(0)

// Auto-rotate through steps
onMounted(() => {
  setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.value.length
  }, 3000)
})
</script>

<template>
  <section class="how-it-works">
    <!-- Animated background -->
    <div class="bg-pattern"></div>
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>

    <div class="container">
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

      <!-- 3D Steps Display -->
      <div class="steps-container">
        <div class="steps-track">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-card-wrapper"
            :class="{ active: activeStep === index }"
            @click="activeStep = index"
          >
            <!-- Step Card -->
            <div class="step-card">
              <!-- Glowing number badge -->
              <div class="step-number" :style="{ '--step-color': step.color }">
                {{ index + 1 }}
              </div>

              <!-- 3D Icon with glow -->
              <div
                class="icon-wrapper"
                :style="{ '--step-color': step.color }"
              >
                <div class="icon-glow"></div>
                <component :is="step.icon" :size="48" class="step-icon" />
              </div>

              <!-- Content -->
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>

              <!-- Hover indicator -->
              <div class="hover-indicator"></div>
            </div>

            <!-- Connector arrow (except last) -->
            <div v-if="index < steps.length - 1" class="connector">
              <div class="connector-line"></div>
              <div class="connector-arrow">
                <ArrowRight :size="24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress indicator -->
      <div class="progress-indicator">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="progress-dot"
          :class="{ active: activeStep === index }"
          @click="activeStep = index"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   DRAMATIC TRANSFORMATION - How It Works
   Complete visual overhaul with 3D effects,
   glassmorphism, and animations
   ============================================ */

.how-it-works {
  position: relative;
  padding: var(--space-5xl) var(--space-md);
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
  filter: blur(80px);
  opacity: 0.4;
  animation: floatOrb 20s ease-in-out infinite;
  pointer-events: none;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.3);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: rgba(139, 92, 246, 0.3);
  top: 50%;
  right: -100px;
  animation-delay: -7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(16, 185, 129, 0.3);
  bottom: -100px;
  left: 30%;
  animation-delay: -14s;
}

@keyframes floatOrb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.container {
  max-width: var(--container-2xl);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section Header with Badge */
.section-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.section-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.gradient-text {
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}

/* 3D Steps Container */
.steps-container {
  perspective: 1500px;
  margin-bottom: var(--space-3xl);
}

.steps-track {
  display: flex;
  gap: var(--space-xl);
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
}

.step-card-wrapper {
  flex: 1;
  min-width: 280px;
  max-width: 380px;
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-slow);
  overflow: hidden;
}

.step-card-wrapper.active {
  transform: scale(1.05);
}

/* 3D Step Card */
.step-card {
  position: relative;
  flex: 1;
  padding: var(--space-3xl) var(--space-xl);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-3xl);
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform-style: preserve-3d;
  transition: all var(--transition-slow);
  cursor: pointer;
  overflow: hidden;
  max-width: 100%;
}

/* Hover effects */
.step-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
  border-radius: var(--radius-3xl);
}

.step-card:hover::before {
  opacity: 1;
}

.step-card:hover {
  transform: translateY(-12px) rotateX(5deg);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

.step-card-wrapper.active .step-card {
  border-color: var(--step-color, #3b82f6);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.12),
    0 0 0 3px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

/* Glowing Number Badge */
.step-number {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--step-color, #3b82f6) 0%, var(--step-color, #3b82f6)dd 100%);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-extrabold);
  font-size: var(--text-2xl);
  box-shadow:
    0 10px 30px var(--step-color, rgba(59, 130, 246, 0.4)),
    0 0 0 4px rgba(255, 255, 255, 0.5);
  z-index: 10;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow:
      0 10px 30px var(--step-color, rgba(59, 130, 246, 0.4)),
      0 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow:
      0 10px 40px var(--step-color, rgba(59, 130, 246, 0.6)),
      0 0 0 8px rgba(255, 255, 255, 0.3);
  }
}

/* 3D Icon Wrapper */
.icon-wrapper {
  position: relative;
  width: 7rem;
  height: 7rem;
  margin: 0 auto var(--space-xl) auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, var(--step-color, #3b82f6) 0%, transparent 70%);
  opacity: 0.3;
  filter: blur(20px);
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
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: all var(--transition-base);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(5deg);
  }
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(10deg);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15));
}

/* Typography */
.step-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
}

.step-description {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Hover Indicator */
.hover-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: var(--step-color, #3b82f6);
  transition: width var(--transition-base);
  border-radius: var(--radius-full) var(--radius-full) 0 0;
}

.step-card:hover .hover-indicator {
  width: 60%;
}

/* Connector Arrow */
.connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.connector-line {
  width: 3px;
  height: 100%;
  background: linear-gradient(
    180deg,
    var(--color-border-light) 0%,
    var(--color-border) 50%,
    var(--color-border-light) 100%
  );
  position: relative;
  overflow: hidden;
}

/* Animated flow in connector */
.connector-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--color-primary) 50%,
    transparent 100%
  );
  animation: flowDown 2s ease-in-out infinite;
}

@keyframes flowDown {
  0% {
    top: -30%;
  }
  100% {
    top: 100%;
  }
}

.connector-arrow {
  width: 3rem;
  height: 3rem;
  background: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  animation: arrowPulse 2s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.step-card-wrapper:hover + .step-card-wrapper .connector-arrow {
  background: var(--gradient-blue-purple);
  color: white;
  transform: scale(1.1);
}

/* Progress Indicator */
.progress-indicator {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.progress-dot {
  width: 12px;
  height: 12px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.progress-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  transition: all var(--transition-base);
}

.progress-dot.active {
  background: var(--color-primary);
  transform: scale(1.3);
}

.progress-dot.active::after {
  border-color: var(--color-primary);
  opacity: 0.3;
}

.progress-dot:hover {
  transform: scale(1.2);
  background: var(--color-primary-light);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .steps-container {
    perspective: none;
  }

  .steps-track {
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .step-card-wrapper {
    max-width: 100%;
    width: 100%;
    flex-direction: column;
  }

  .connector {
    transform: rotate(90deg);
    min-width: 60px;
    min-height: 60px;
  }

  .connector-line {
    width: 100%;
    height: 3px;
  }

  .connector-line::after {
    animation: flowRight 2s ease-in-out infinite;
  }

  @keyframes flowRight {
    0% {
      left: -30%;
    }
    100% {
      left: 100%;
    }
  }

  .step-card:hover {
    transform: translateY(-8px);
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: var(--space-4xl) var(--space-md);
  }

  .section-title {
    font-size: var(--text-4xl);
  }

  .step-card {
    padding: var(--space-2xl) var(--space-lg);
  }

  .step-number {
    width: 3rem;
    height: 3rem;
    font-size: var(--text-xl);
  }

  .icon-wrapper {
    width: 5rem;
    height: 5rem;
  }

  .step-icon {
    width: 40px;
    height: 40px;
  }

  .step-title {
    font-size: var(--text-xl);
  }

  .bg-orb {
    display: none;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--text-3xl);
  }

  .step-card {
    padding: var(--space-xl) var(--space-md);
  }
}
</style>
