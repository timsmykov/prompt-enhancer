<script setup>
import { ref, computed } from 'vue'
import { TrendingUp, ArrowRight } from 'lucide-vue-next'

const categories = ['Business', 'Content', 'Technical', 'Communication']
const activeCategory = ref('Business')

const examples = {
  Business: {
    before: "I need a presentation",
    after: "Could you help me create a compelling presentation on [topic]? I'm targeting [audience], aiming to [objective], and would like to include [key points]."
  },
  Content: {
    before: "Write blog post",
    after: "Craft an engaging 1000-word blog post about [topic]. Target audience: [demographic]. Tone: [professional/casual]. Include: [specific points], SEO keywords, and CTA."
  },
  Technical: {
    before: "Fix my code",
    after: "Please review and optimize my [language] code. Current issues: [specific problems]. Goals: improve performance, enhance readability, add error handling."
  },
  Communication: {
    before: "Email my boss",
    after: "Draft a professional email to my boss regarding [subject]. Include: status update, achievements, blockers, next steps. Tone: respectful but confident."
  }
}

const activeExample = computed(() => examples[activeCategory.value])
</script>

<template>
  <section class="before-after" aria-labelledby="before-after-title">
    <!-- Animated background -->
    <div class="bg-pattern" aria-hidden="true"></div>
    <div class="bg-orb orb-1" aria-hidden="true"></div>
    <div class="bg-orb orb-2" aria-hidden="true"></div>

    <div class="container">
      <div class="section-header">
        <div class="badge">
          <TrendingUp :size="16" aria-hidden="true" />
          <span>Real Results</span>
        </div>
        <h2 id="before-after-title" class="section-title">
          See the <span class="gradient-text">Transformation</span>
        </h2>
        <p class="section-subtitle">
          From basic prompts to powerful, specific requests
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="tabs" role="tablist" aria-label="Select example category">
        <button
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category"
          class="tab"
          :class="{ active: activeCategory === category }"
          :aria-selected="activeCategory === category"
          :tabindex="activeCategory === category ? 0 : -1"
          role="tab"
          :aria-label="`View ${category} examples`"
        >
          {{ category }}
        </button>
      </div>

      <!-- Comparison Cards -->
      <div class="comparison" role="region" :aria-label="`Comparison example for ${activeCategory} category`">
        <!-- Before Card -->
        <div class="comparison-card before-card" role="article" aria-labelledby="before-heading">
          <div class="card-header">
            <div class="icon-badge before-icon" aria-hidden="true">→</div>
            <h3 id="before-heading">Before</h3>
          </div>
          <p class="comparison-text">{{ activeExample.before }}</p>
          <div class="card-footer">
            <div class="rating" :aria-label="`Rating: 2 out of 5 stars - ${activeCategory} quality`">
              <span class="stars" aria-hidden="true">★★</span>
              <span class="rating-label">Basic</span>
            </div>
          </div>
        </div>

        <!-- Arrow -->
        <div class="arrow-container" aria-hidden="true">
          <div class="arrow-circle">
            <ArrowRight :size="32" />
          </div>
        </div>

        <!-- After Card -->
        <div class="comparison-card after-card" role="article" aria-labelledby="after-heading">
          <div class="card-header">
            <div class="icon-badge after-icon" aria-hidden="true">✓</div>
            <h3 id="after-heading">After</h3>
          </div>
          <p class="comparison-text">{{ activeExample.after }}</p>
          <div class="card-footer">
            <div class="rating" :aria-label="`Rating: 5 out of 5 stars - Excellent ${activeCategory} quality`">
              <span class="stars" aria-hidden="true">★★★★★</span>
              <span class="rating-label">Enhanced</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="metrics" role="list" aria-label="Improvement metrics">
        <div class="metric-card" role="listitem">
          <div class="metric-number">3x</div>
          <div class="metric-label">More Detailed</div>
        </div>
        <div class="metric-card" role="listitem">
          <div class="metric-number">5x</div>
          <div class="metric-label">More Specific</div>
        </div>
        <div class="metric-card" role="listitem">
          <div class="metric-number">10x</div>
          <div class="metric-label">Better Results</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   HERO STYLE - Gradients, Glassmorphism, Animation
   ============================================ */

.before-after {
  position: relative;
  padding: 4rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
}

/* Animated Background Pattern */
.bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
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
  background: rgba(16, 185, 129, 0.3);
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
  max-width: 43.75rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Category Tabs */
.tabs {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  border: 0.125rem solid rgba(59, 130, 246, 0.2);
  color: #64748b;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 9999px;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05);
}

.tab:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-0.125rem);
}

.tab.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 0.5rem 1.5rem rgba(59, 130, 246, 0.3);
}

/* Comparison Layout */
.comparison {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
}

/* Glassmorphism Comparison Cards */
.comparison-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1.25rem);
  -webkit-backdrop-filter: blur(1.25rem);
  border-radius: 1.5rem;
  border: 0.125rem solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 1.25rem 2.5rem rgba(0, 0, 0, 0.1),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.1),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.comparison-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 1.5rem;
}

.before-card::before {
  background: linear-gradient(135deg, rgba(203, 213, 225, 0.2) 0%, transparent 100%);
}

.after-card::before {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, transparent 100%);
}

.comparison-card:hover::before {
  opacity: 1;
}

.comparison-card:hover {
  transform: translateY(-0.5rem);
  box-shadow:
    0 1.875rem 3.75rem rgba(0, 0, 0, 0.15),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.2),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 1);
}

.before-card {
  border-left: 0.25rem solid #cbd5e1;
}

.after-card {
  border-left: 0.25rem solid #10b981;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 0.125rem solid rgba(226, 232, 240, 0.8);
}

.icon-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 800;
  flex-shrink: 0;
}

.before-icon {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  color: white;
  box-shadow: 0 0.5rem 1rem rgba(203, 213, 225, 0.3);
}

.after-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 0.5rem 1rem rgba(16, 185, 129, 0.3);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0.5rem 1rem rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0.5rem 1.5rem rgba(16, 185, 129, 0.5);
  }
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Comparison Text */
.comparison-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #475569;
  margin: 0 0 1.5rem 0;
  flex: 1;
  white-space: pre-line;
}

/* Card Footer with Rating */
.card-footer {
  padding-top: 1rem;
  border-top: 0.0625rem solid rgba(226, 232, 240, 0.8);
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars {
  font-size: 1.125rem;
  color: #fbbf24;
}

.rating-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Arrow Container */
.arrow-container {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.arrow-circle {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0.5rem 1rem rgba(59, 130, 246, 0.3);
  animation: arrowPulse 2s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0.5rem 1rem rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0.5rem 1.5rem rgba(59, 130, 246, 0.5);
  }
}

/* Metrics */
.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}

.metric-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1.25rem);
  -webkit-backdrop-filter: blur(1.25rem);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  border: 0.125rem solid rgba(59, 130, 246, 0.2);
  box-shadow:
    0 0.5rem 1rem rgba(0, 0, 0, 0.05),
    0 0 0 0.0625rem rgba(255, 255, 255, 0.1),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-0.25rem);
  box-shadow:
    0 0.75rem 1.5rem rgba(59, 130, 246, 0.15),
    0 0 0 0.0625rem rgba(59, 130, 246, 0.2),
    inset 0 0.0625rem 0 rgba(255, 255, 255, 1);
  border-color: rgba(59, 130, 246, 0.4);
}

.metric-number {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.metric-label {
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Responsive Design */
@media (min-width: 48rem) {
  .before-after {
    padding: 4rem 2rem;
  }

  .arrow-container {
    display: flex;
  }

  .bg-orb {
    display: block;
  }
}

@media (min-width: 64rem) {
  .comparison {
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
  }

  .comparison-card {
    padding: 2.5rem 2rem;
  }
}

@media (min-width: 80rem) {
  .comparison-card {
    padding: 3rem 2.5rem;
  }

  .arrow-container {
    padding: 2rem 0;
  }
}
</style>
