<script setup>
import { ref, computed } from 'vue'

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
  <section class="before-after">
    <div class="container">
      <div class="section-header">
        <h2>Real Results</h2>
        <p>See the transformation from basic to powerful</p>
      </div>

      <div class="tabs">
        <button
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category"
          class="tab"
          :class="{ active: activeCategory === category }"
        >
          {{ category }}
        </button>
      </div>

      <div class="comparison">
        <div class="comparison-side before">
          <div class="side-label">Before</div>
          <p class="comparison-text">{{ activeExample.before }}</p>
        </div>

        <div class="divider-vertical"></div>

        <div class="comparison-side after">
          <div class="side-label">After</div>
          <p class="comparison-text">{{ activeExample.after }}</p>
        </div>
      </div>

      <div class="metrics">
        <div class="metric">
          <div class="metric-number">3x</div>
          <div class="metric-label">More Detailed</div>
        </div>
        <div class="metric">
          <div class="metric-number">5x</div>
          <div class="metric-label">More Specific</div>
        </div>
        <div class="metric">
          <div class="metric-number">10x</div>
          <div class="metric-label">Better Results</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Slate Grayscale Color Palette */
:root {
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
}

/* Section Base */
.before-after {
  padding: 4rem 1rem;
  background: white;
}

.container {
  max-width: 64rem;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.section-header p {
  font-size: 1.125rem;
  color: var(--slate-500);
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Category Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--slate-200);
  color: var(--slate-600);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tab:hover {
  background: var(--slate-50);
}

.tab.active {
  background: var(--slate-900);
  border-color: var(--slate-900);
  color: white;
}

.tab:focus-visible {
  outline: 2px solid var(--slate-900);
  outline-offset: 2px;
}

/* Comparison Layout */
.comparison {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
}

.comparison-side {
  display: flex;
  flex-direction: column;
}

.side-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--slate-400);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--slate-200);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.comparison-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--slate-700);
  white-space: pre-line;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.divider-vertical {
  background: var(--slate-200);
  width: 1px;
}

/* Metrics */
.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid var(--slate-200);
}

.metric {
  text-align: center;
}

.metric-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--slate-900);
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--slate-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .comparison {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1px auto;
    gap: 2rem;
  }

  .metrics {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .section-header p {
    font-size: 1rem;
  }
}
</style>
