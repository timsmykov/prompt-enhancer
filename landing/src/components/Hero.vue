<script setup>
import { ref, onMounted, computed } from 'vue'
import { Sparkles, Download, ArrowRight } from 'lucide-vue-next'
import { useTypewriter } from '../composables/useTypewriter'
import { useParticles } from '../composables/useParticles'

// Multi-stage typing animation
const prompts = [
  "Improve Your Prompts in One Click",
  "Better Prompts, Better Results",
  "AI-Powered Prompt Enhancement",
  "Transform Your Writing Instantly"
]

// Use typewriter composable for animation
const {
  currentText: animationText,
  isDeleting,
  isPaused,
  showCursor,
  start: startTypewriter
} = useTypewriter(prompts, {
  typeSpeed: 80,
  deleteSpeed: 40,
  pauseDuration: 2000,
  switchDelay: 500
})

// Use particles composable for particle effects
const {
  particles,
  startCreating: startParticles
} = useParticles({
  interval: 300,
  maxParticles: 20,
  shouldCreate: () => !isPaused.value || isDeleting.value
})

onMounted(() => {
  // Start typing animation
  startTypewriter(500)

  // Start particle effect
  startParticles()
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
/* ============================================
   MOBILE-FIRST HERO CSS - 100vh GUARANTEED
   Relative units only (rem, em, vh, vw, %)
   Compact design with 3-4rem padding
   ============================================ */

/* CSS Custom Properties */
.hero {
  --hero-padding-y: 3rem;
  --hero-padding-x: 1rem;
  --gradient-1: #667eea;
  --gradient-2: #764ba2;
  --gradient-3: #f093fb;
  --orb-1-color: rgba(59, 130, 246, 0.4);
  --orb-2-color: rgba(139, 92, 246, 0.4);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.95);
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.2);
  --animation-box-bg: rgba(15, 23, 42, 0.95);
}

/* Base hero - Mobile first (320px+) */
.hero {
  position: relative;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--hero-padding-y) var(--hero-padding-x);
  background: linear-gradient(135deg,
    var(--gradient-1) 0%,
    var(--gradient-2) 25%,
    var(--gradient-3) 50%,
    var(--gradient-1) 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  overflow: hidden;
  text-align: center;
}

/* Background pattern overlay */
.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 3.75rem 3.75rem;
  pointer-events: none;
}

/* Animated background orbs */
.hero::before,
.hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(5rem);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.hero::before {
  width: 25rem;
  height: 25rem;
  background: var(--orb-1-color);
  top: -6.25rem;
  left: -6.25rem;
  animation-delay: 0s;
}

.hero::after {
  width: 21.875rem;
  height: 21.875rem;
  background: var(--orb-2-color);
  bottom: -6.25rem;
  right: -6.25rem;
  animation-delay: -4s;
}

/* Container */
.container {
  max-width: 75rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
}

/* Hero content wrapper */
.hero-content {
  max-width: 56.25rem;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  color: var(--text-primary);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  border: 0.0625rem solid var(--glass-border);
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

/* Hero title - Fluid typography */
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  text-shadow:
    0 0.25rem 1.25rem rgba(0, 0, 0, 0.7),
    0 0.125rem 0.5rem rgba(0, 0, 0, 0.5);
}

/* Gradient text animation */
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

/* Hero description - Fluid typography */
.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.75;
  margin: 0 0 1.5rem 0;
  max-width: 43.75rem;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  letter-spacing: 0.025em;
  text-shadow:
    0 0.125rem 0.75rem rgba(0, 0, 0, 0.6),
    0 0.0625rem 0.25rem rgba(0, 0, 0, 0.4);
}

/* Animation box */
.animation-box {
  background: var(--animation-box-bg);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1.5rem auto;
  max-width: 40.625rem;
  width: 100%;
  border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 1.25rem 3.75rem rgba(0, 0, 0, 0.3),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.1);
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
  inset: -0.125rem;
  background: linear-gradient(
    45deg,
    #3b82f6,
    #8b5cf6,
    #ec4899,
    #fbbf24,
    #3b82f6
  );
  background-size: 400% 400%;
  border-radius: 0.75rem;
  z-index: -1;
  animation: borderGlow 6s ease infinite;
  opacity: 0.5;
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

/* Typing container */
.typing-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  letter-spacing: 0.05em;
  z-index: 1;
}

/* Animated text */
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
  text-shadow: 0 0 1.875rem rgba(16, 185, 129, 0.5);
  filter: drop-shadow(0 0 0.625rem rgba(16, 185, 129, 0.3));
}

/* Text glow effect */
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
  filter: blur(0.5rem);
  z-index: -1;
}

/* Typing cursor */
.typing-cursor {
  display: inline-block;
  width: 0.25rem;
  height: 1.2em;
  margin-left: 0.375rem;
  vertical-align: middle;
  border-radius: 0.125rem;
  position: relative;
  transition: background 0.3s ease;
  animation:
    cursorBlink 1s step-end infinite,
    cursorGlow 2s ease-in-out infinite alternate,
    cursorPulse 1.5s ease-in-out infinite;
}

/* CTA buttons container */
.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1.5rem 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
  width: 100%;
}

/* Button base styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.025em;
  min-width: 0;
}

/* Primary button */
.btn-primary {
  background: white;
  color: #667eea;
  box-shadow:
    0 0.625rem 1.875rem rgba(0, 0, 0, 0.2),
    0 0 0 0 rgba(255, 255, 255, 0.7);
  animation: pulse 2s infinite;
}

/* Secondary button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  color: white;
  border: 0.125rem solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-0.1875rem);
  box-shadow: 0 0.9375rem 2.5rem rgba(0, 0, 0, 0.2);
}

.btn-secondary:focus-visible {
  outline: 0.1875rem solid rgba(255, 255, 255, 0.8);
  outline-offset: 0.1875rem;
}

/* Stats grid */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 0.0625rem solid rgba(255, 255, 255, 0.2);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
  width: 100%;
  max-width: 40.625rem;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  text-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

/* ============================================
   MIN-WIDTH MEDIA QUERIES (Progressive Enhancement)
   ============================================ */

/* Small tablets (481px+) */
@media (min-width: 30em) {
  .hero {
    --hero-padding-x: 1.5rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }
}

/* Tablets (769px+) */
@media (min-width: 48em) {
  .hero {
    --hero-padding-y: 3.5rem;
    --hero-padding-x: 2rem;
  }

  .badge {
    margin-bottom: 1.5rem;
  }

  .hero-title {
    margin-bottom: 1.5rem;
  }

  .hero-description {
    margin-bottom: 2rem;
  }

  .animation-box {
    padding: 1.25rem;
    margin: 2rem auto;
  }

  .cta-buttons {
    margin: 2rem 0;
  }

  .hero-stats {
    margin-top: 2.5rem;
    gap: 2rem;
  }
}

/* Small laptops (1025px+) */
@media (min-width: 64em) {
  .hero {
    --hero-padding-y: 4rem;
    --hero-padding-x: 2.5rem;
  }

  .badge {
    padding: 0.75rem 1.5rem;
  }

  .btn {
    padding: 1rem 1.5rem;
  }

  .animation-box {
    padding: 1.5rem;
  }
}

/* Desktops (1281px+) */
@media (min-width: 80em) {
  .hero {
    --hero-padding-y: 4rem;
  }

  .hero-content {
    max-width: 60rem;
  }
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.875rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2rem) rotate(5deg);
  }
}

@keyframes textGradient {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 200% center;
  }
}

@keyframes borderGlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
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
    transform: translate(var(--tx, 0), var(--ty, -3.125rem)) scale(0);
    opacity: 0;
  }
}

@keyframes cursorBlink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes cursorGlow {
  0% {
    box-shadow:
      0 0 0.3125rem currentColor,
      0 0 0.625rem currentColor,
      0 0 0.9375rem currentColor;
  }
  100% {
    box-shadow:
      0 0 0.625rem currentColor,
      0 0 1.25rem currentColor,
      0 0 1.875rem currentColor,
      0 0 2.5rem currentColor;
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

@keyframes pulse {
  0% {
    box-shadow:
      0 0.625rem 1.875rem rgba(0, 0, 0, 0.2),
      0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow:
      0 0.625rem 1.875rem rgba(0, 0, 0, 0.2),
      0 0 0 0.625rem rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow:
      0 0.625rem 1.875rem rgba(0, 0, 0, 0.2),
      0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
