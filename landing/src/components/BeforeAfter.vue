<script setup>
import { ref } from 'vue'
import { ArrowRight, TrendingUp } from 'lucide-vue-next'
import { safeArrayAccess } from '../utils/validation'

const examples = ref([
  {
    before: "I need a presentation",
    after: "Could you help me create a compelling presentation on [topic]? I'm targeting [audience], aiming to [objective], and would like to include [key points]. The presentation should be approximately [duration] minutes.",
    category: "Business"
  },
  {
    before: "Write blog post",
    after: "Craft an engaging 1000-word blog post about [topic]. Target audience: [demographic]. Tone: [professional/casual/inspiring]. Include: [specific points], SEO keywords for [focus area], and a compelling call-to-action for [desired outcome].",
    category: "Content"
  },
  {
    before: "Fix my code",
    after: "Please review and optimize my [language] code. Current issues: [specific problems]. Goals: improve performance, enhance readability, add error handling. Context: this is for [use case/project].",
    category: "Technical"
  },
  {
    before: "Email my boss",
    after: "Draft a professional email to my boss regarding [subject]. Include: current status update, [specific achievements], any blockers, and proposed next steps. Tone: respectful but confident. Timeline: [urgency].",
    category: "Communication"
  }
])

const activeIndex = ref(0)

const setActive = (index) => {
  activeIndex.value = index
}

// Safely access active example with fallback
const activeExample = () => safeArrayAccess(examples.value, activeIndex.value, examples.value[0])
</script>

<template>
  <section class="before-after">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Real Results</h2>
        <p class="section-subtitle">
          See the transformation from basic prompts to powerful, specific requests
        </p>
      </div>

      <div class="tabs">
        <button
          v-for="(example, index) in examples"
          :key="index"
          @click="setActive(index)"
          class="tab"
          :class="{ active: activeIndex === index }"
        >
          {{ example.category }}
        </button>
      </div>

      <div class="comparison-container">
        <div class="comparison-card before-card">
          <div class="card-header">
            <span class="badge before-badge">Before</span>
            <h3>Basic Prompt</h3>
          </div>
          <div class="card-content">
            <p class="example-text">{{ activeExample().before }}</p>
          </div>
          <div class="card-footer">
            <div class="rating">
              <span class="rating-label">Clarity:</span>
              <div class="stars">
                <span v-for="i in 2" :key="i" class="star">★</span>
                <span v-for="i in 3" :key="i" class="star empty">★</span>
              </div>
            </div>
          </div>
        </div>

        <div class="arrow-container">
          <div class="arrow-circle">
            <ArrowRight :size="32" />
          </div>
        </div>

        <div class="comparison-card after-card">
          <div class="card-header">
            <span class="badge after-badge">
              <TrendingUp :size="16" />
              After
            </span>
            <h3>Improved Prompt</h3>
          </div>
          <div class="card-content">
            <p class="example-text">{{ activeExample().after }}</p>
          </div>
          <div class="card-footer">
            <div class="rating">
              <span class="rating-label">Clarity:</span>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="improvement-summary">
        <div class="summary-item">
          <div class="summary-number">3x</div>
          <div class="summary-text">More Detailed</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">5x</div>
          <div class="summary-text">More Specific</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">10x</div>
          <div class="summary-text">Better Results</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.before-after {
  position: relative;
  padding: var(--space-3xl) var(--space-md);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

/* Subtle background pattern */
.before-after::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: var(--container-xl);
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

.tabs {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-3xl);
}

.tab {
  padding: var(--space-md) var(--space-xl);
  background: var(--color-bg-alt);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.tab:hover {
  background: var(--color-bg-alt-2);
  transform: translateY(-2px);
}

.tab.active {
  background: var(--color-primary-50);
  border-color: var(--color-primary);
  color: var(--color-primary-700);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.tab:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-lg);
  align-items: stretch;
  margin-bottom: var(--space-3xl);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 968px) {
  .comparison-container {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .arrow-container {
    order: -1;
    transform: rotate(90deg);
    margin: var(--space-md) auto;
  }
}

@media (max-width: 768px) {
  .before-after {
    padding: var(--space-4xl) var(--space-md);
  }

  /* Already handled above - removed duplicate */
}

.comparison-card {
  background: white;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-border);
  transition: all var(--transition-base);
  position: relative;
}

.comparison-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.before-card {
  border-color: var(--color-border);
  border-left: 4px solid #cbd5e1;
}

.after-card {
  border-color: var(--color-accent);
  border-left: 4px solid var(--color-accent);
  box-shadow: 0 8px 24px -4px rgba(16, 185, 129, 0.15);
}

.card-header {
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  border-bottom: 2px solid var(--color-border);
  background: var(--color-bg-alt);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.before-badge {
  background: #cbd5e1;
  color: #475569;
}

.after-badge {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.card-header h3 {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text);
}

.card-content {
  flex: 1;
  padding: var(--space-xl);
  background: white;
}

.example-text {
  margin: 0;
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.card-footer {
  padding: var(--space-md) var(--space-xl);
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
}

.rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.rating-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: var(--color-warm);
  font-size: var(--text-lg);
}

.star.empty {
  color: var(--color-border);
}

.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg) 0;
}

.arrow-circle {
  width: 4rem;
  height: 4rem;
  background: var(--gradient-blue-purple);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-primary);
  animation: arrowPulse 2s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: var(--shadow-primary);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 24px -5px rgba(59, 130, 246, 0.5);
  }
}

.improvement-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-3xl);
}

.summary-item {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--color-primary-50);
  border-radius: var(--radius-2xl);
  border: 2px solid var(--color-primary-100);
  transition: all var(--transition-base);
}

.summary-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-200);
}

.summary-number {
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
  color: var(--color-primary-700);
  margin-bottom: var(--space-sm);
  line-height: var(--leading-tight);
}

.summary-text {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-primary-600);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

@media (max-width: 968px) {
  /* Already handled above - removed duplicate */

  .tabs {
    flex-direction: column;
    width: 100%;
  }

  .tab {
    width: 100%;
  }
}
</style>
