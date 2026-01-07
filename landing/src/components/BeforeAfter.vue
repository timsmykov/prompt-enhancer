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
/* ===================================
   MOBILE-FIRST CSS REDESIGN
   Base: 320px mobile devices
   Progressive: stacked → side-by-side
   Units: rem, em, %, clamp() only
   =================================== */

/* Root variables for consistency */
:root {
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 2.5rem;    /* 40px */
  --spacing-3xl: 3rem;      /* 48px - COMPACT design */

  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  --transition-base: 0.2s ease;
}

/* Section container - COMPACT padding */
.before-after {
  position: relative;
  padding: var(--spacing-3xl) var(--spacing-md);
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
  max-width: 80rem; /* 1280px */
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section header - centered, compact spacing */
.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem); /* 28px → 40px */
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem); /* 16px → 20px */
  color: #64748b;
  max-width: 43.75rem; /* 700px */
  margin: 0 auto;
  line-height: 1.6;
}

/* Category tabs - responsive grid */
.tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-3xl);
  width: 100%;
}

.tab {
  padding: var(--spacing-md) var(--spacing-lg);
  background: #f1f5f9;
  border: 0.125rem solid transparent;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.tab:hover {
  background: #e2e8f0;
  transform: translateY(-0.125rem);
}

.tab.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
  box-shadow: 0 0.25rem 0.75rem rgba(59, 130, 246, 0.2);
}

.tab:focus-visible {
  outline: 0.1875rem solid #3b82f6;
  outline-offset: 0.125rem;
}

/* Comparison layout - STACKED on mobile, SIDE-BY-SIDE on desktop */
.comparison-container {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: stacked */
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
  width: 100%;
}

.comparison-card {
  background: white;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 0.125rem solid #e2e8f0;
  transition: all var(--transition-base);
  position: relative;
}

.comparison-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-xl);
}

.before-card {
  border-color: #e2e8f0;
  border-left: 0.25rem solid #cbd5e1;
}

.after-card {
  border-color: #10b981;
  border-left: 0.25rem solid #10b981;
  box-shadow: 0 0.5rem 1.5rem -0.25rem rgba(16, 185, 129, 0.15);
}

/* Card header */
.card-header {
  padding: var(--spacing-lg) var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-bottom: 0.125rem solid #e2e8f0;
  background: #f8fafc;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.before-badge {
  background: #cbd5e1;
  color: #475569;
}

.after-badge {
  background: #10b981;
  color: white;
  box-shadow: 0 0.125rem 0.5rem rgba(16, 185, 129, 0.3);
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

/* Card content */
.card-content {
  flex: 1;
  padding: var(--spacing-xl);
  background: white;
}

.example-text {
  margin: 0;
  line-height: 1.6;
  color: #475569;
  font-size: 1rem;
}

/* Card footer with rating */
.card-footer {
  padding: var(--spacing-md) var(--spacing-xl);
  background: #f8fafc;
  border-top: 0.0625rem solid #e2e8f0;
}

.rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.rating-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #f59e0b;
  font-size: 1.125rem;
}

.star.empty {
  color: #cbd5e1;
}

/* Arrow container - HIDDEN on mobile, visible on tablet+ */
.arrow-container {
  display: none; /* Hidden on mobile */
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) 0;
}

.arrow-circle {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: var(--radius-full);
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
    box-shadow: 0 0.5rem 1.5rem -0.125rem rgba(59, 130, 246, 0.5);
  }
}

/* Improvement summary - responsive grid */
.improvement-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-3xl);
}

.summary-item {
  text-align: center;
  padding: var(--spacing-xl);
  background: #eff6ff;
  border-radius: var(--radius-2xl);
  border: 0.125rem solid #dbeafe;
  transition: all var(--transition-base);
}

.summary-item:hover {
  transform: translateY(-0.25rem);
  box-shadow: var(--shadow-lg);
  border-color: #bfdbfe;
}

.summary-number {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #1d4ed8;
  margin-bottom: var(--spacing-sm);
  line-height: 1.2;
}

.summary-text {
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ===================================
   TABLET BREAKPOINT (48rem / 768px)
   Show arrow, adjust spacing
   =================================== */
@media (min-width: 48rem) {
  .arrow-container {
    display: flex;
  }

  .comparison-container {
    grid-template-columns: 1fr;
  }
}

/* ===================================
   DESKTOP BREAKPOINT (64rem / 1024px)
   Side-by-side comparison layout
   =================================== */
@media (min-width: 64rem) {
  .comparison-container {
    grid-template-columns: 1fr auto 1fr;
    gap: var(--spacing-lg);
    align-items: stretch;
  }

  .tabs {
    grid-template-columns: repeat(4, 1fr);
  }

  .improvement-summary {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===================================
   LARGE DESKTOP (80rem / 1280px)
   Maximum refinement
   =================================== */
@media (min-width: 80rem) {
  .section-title {
    font-size: 2.5rem;
  }

  .section-subtitle {
    font-size: 1.25rem;
  }

  .comparison-card {
    min-height: 20rem;
  }
}
</style>
