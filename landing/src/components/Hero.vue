<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Sparkles, Download, ArrowRight } from 'lucide-vue-next'

// Multi-stage typing animation
const prompts = [
  "Improve Your Prompts in One Click",
  "Better Prompts, Better Results",
  "AI-Powered Prompt Enhancement",
  "Transform Your Writing Instantly"
]

const animationText = ref('')
const currentPromptIndex = ref(0)
const isDeleting = ref(false)
const isPaused = ref(false)
const charIndex = ref(0)
const showCursor = ref(true)

// Animation timing
const TYPE_SPEED = 80
const DELETE_SPEED = 40
const PAUSE_DURATION = 2000
const PROMPT_SWITCH_DELAY = 500

let animationTimeout = null

// Random variance for natural typing feel
const getRandomVariance = () => Math.random() * 50 - 25

const animateText = () => {
  const currentPrompt = prompts[currentPromptIndex.value]

  if (isPaused.value) {
    // Paused state - will resume after pauseDuration
    return
  }

  if (isDeleting.value) {
    // Delete stage
    if (charIndex.value > 0) {
      animationText.value = currentPrompt.slice(0, charIndex.value - 1)
      charIndex.value--
      animationTimeout = setTimeout(
        animateText,
        DELETE_SPEED + getRandomVariance()
      )
    } else {
      // Finished deleting - switch to next prompt
      isDeleting.value = false
      currentPromptIndex.value = (currentPromptIndex.value + 1) % prompts.length
      isPaused.value = true
      showCursor.value = false

      animationTimeout = setTimeout(() => {
        isPaused.value = false
        showCursor.value = true
        animateText()
      }, PROMPT_SWITCH_DELAY)
    }
  } else {
    // Typing stage
    if (charIndex.value < currentPrompt.length) {
      animationText.value = currentPrompt.slice(0, charIndex.value + 1)
      charIndex.value++
      animationTimeout = setTimeout(
        animateText,
        TYPE_SPEED + getRandomVariance()
      )
    } else {
      // Finished typing - pause then delete
      isPaused.value = true

      animationTimeout = setTimeout(() => {
        isPaused.value = false
        isDeleting.value = true
        animateText()
      }, PAUSE_DURATION)
    }
  }
}

// Particle effect state
const particles = ref([])
let particleInterval = null

const createParticle = () => {
  if (isPaused.value && !isDeleting.value) return

  const particle = {
    id: Date.now() + Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 1000 + 500,
    delay: Math.random() * 200
  }

  particles.value.push(particle)

  // Remove particle after animation
  setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
  }, particle.duration + particle.delay)
}

onMounted(() => {
  // Start typing animation
  animationTimeout = setTimeout(animateText, 500)

  // Start particle effect
  particleInterval = setInterval(createParticle, 300)
})

onUnmounted(() => {
  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }
  if (particleInterval) {
    clearInterval(particleInterval)
  }
})

// Computed cursor color based on state
const cursorColor = computed(() => {
  return isDeleting.value ? '#f472b6' : '#10b981'
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg-pattern"></div>
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
          <!-- Particle effects -->
          <div class="particles-container">
            <div
              v-for="particle in particles"
              :key="particle.id"
              class="particle"
              :style="{
                left: particle.x + '%',
                top: particle.y + '%',
                width: particle.size + 'px',
                height: particle.size + 'px',
                animationDuration: particle.duration + 'ms',
                animationDelay: particle.delay + 'ms'
              }"
            ></div>
          </div>

          <div class="typing-container">
            <span class="animated-text" :data-text="animationText">
              {{ animationText }}
            </span>
            <span
              v-if="showCursor"
              class="typing-cursor"
              :style="{ background: cursorColor }"
            ></span>
          </div>
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
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5xl) var(--space-md);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  overflow: hidden;
  text-align: center;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animated Background Orbs */
.hero::before,
.hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.hero::before {
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.4);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.hero::after {
  width: 350px;
  height: 350px;
  background: rgba(139, 92, 246, 0.4);
  bottom: -100px;
  right: -100px;
  animation-delay: -4s;
}

/* Grid Pattern Overlay */
.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-xl) 0;
  color: white;
  letter-spacing: var(--tracking-tight);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(
    90deg,
    #fff 0%,
    #fbbf24 25%,
    #f472b6 50%,
    #fbbf24 75%,
    #fff 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textGradient 4s linear infinite;
}

@keyframes textGradient {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.hero-description {
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.95);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-2xl) 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  letter-spacing: var(--tracking-wide);
}

.animation-box {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  margin: var(--space-2xl) auto;
  max-width: 650px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
  position: relative;
  overflow: hidden;
}

/* Glowing border effect */
.animation-box::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    45deg,
    #3b82f6,
    #8b5cf6,
    #ec4899,
    #fbbf24,
    #3b82f6
  );
  background-size: 400% 400%;
  border-radius: var(--radius-xl);
  z-index: -1;
  animation: borderGlow 6s ease infinite;
  opacity: 0.5;
}

@keyframes borderGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Particle effects container */
.particles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleFloat 1.5s ease-out forwards;
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(var(--tx, 0), var(--ty, -50px)) scale(0);
    opacity: 0;
  }
}

/* Typing container */
.typing-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: var(--text-lg);
  letter-spacing: 0.05em;
  z-index: 1;
}

/* Animated text with gradient and glow */
.animated-text {
  background: linear-gradient(
    135deg,
    #10b981 0%,
    #3b82f6 25%,
    #8b5cf6 50%,
    #ec4899 75%,
    #10b981 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textGradient 4s ease infinite;
  display: inline;
  position: relative;
  text-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
}

/* Character reveal animation */
.animated-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(
    135deg,
    #10b981 0%,
    #3b82f6 25%,
    #8b5cf6 50%,
    #ec4899 75%,
    #10b981 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: textGradient 4s ease infinite;
  opacity: 0.3;
  filter: blur(8px);
  z-index: -1;
}

@keyframes textGradient {
  0%, 100% {
    background-position: 0% 50%;
    filter: hue-rotate(0deg);
  }
  50% {
    background-position: 100% 50%;
    filter: hue-rotate(30deg);
  }
}

/* Enhanced cursor with multiple effects */
.typing-cursor {
  display: inline-block;
  width: 4px;
  height: 1.2em;
  margin-left: 6px;
  vertical-align: middle;
  border-radius: 2px;
  position: relative;
  transition: background 0.3s ease;

  animation:
    cursorBlink 1s step-end infinite,
    cursorGlow 2s ease-in-out infinite alternate,
    cursorPulse 1.5s ease-in-out infinite;
}

@keyframes cursorBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes cursorGlow {
  0% {
    box-shadow: 0 0 5px currentColor,
                0 0 10px currentColor,
                0 0 15px currentColor;
  }
  100% {
    box-shadow: 0 0 10px currentColor,
                0 0 20px currentColor,
                0 0 30px currentColor,
                0 0 40px currentColor;
  }
}

@keyframes cursorPulse {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.1);
  }
}

.cta-buttons {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  margin: var(--space-2xl) 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: var(--tracking-wide);
}

.btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
              0 0 0 0 rgba(255, 255, 255, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
                0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
                0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
                0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: translateY(-1px) scale(0.98);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-3xl);
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: white;
  margin-bottom: var(--space-xs);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.9);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .hero {
    padding: var(--space-3xl) var(--space-md);
    min-height: auto;
  }

  .hero::before,
  .hero::after {
    width: 250px;
    height: 250px;
  }

  .hero-title {
    font-size: var(--text-4xl);
  }

  .hero-description {
    font-size: var(--text-lg);
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .animation-box {
    padding: var(--space-md);
  }

  .typing-container {
    font-size: var(--text-base);
  }

  .particles-container {
    display: none;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: var(--text-3xl);
  }

  .stat-number {
    font-size: var(--text-2xl);
  }
}
</style>
