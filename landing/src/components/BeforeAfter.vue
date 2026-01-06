<script setup>
import { ref } from 'vue'
import { ArrowRight, TrendingUp } from 'lucide-vue-next'

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
            <p class="example-text">{{ examples[activeIndex].before }}</p>
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
            <p class="example-text">{{ examples[activeIndex].after }}</p>
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
  padding: 6rem 1rem;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: #e2e8f0;
}

.tab.active {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: stretch;
  margin-bottom: 3rem;
}

.comparison-card {
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid #e2e8f0;
}

.before-card {
  border-color: #cbd5e1;
}

.after-card {
  border-color: #10b981;
  box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.2);
}

.card-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.before-badge {
  background: #cbd5e1;
  color: #475569;
}

.after-badge {
  background: #10b981;
  color: white;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.card-content {
  flex: 1;
  padding: 1.5rem;
}

.example-text {
  margin: 0;
  line-height: 1.8;
  color: #334155;
}

.card-footer {
  padding: 1rem 1.25rem;
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  color: #fbbf24;
}

.star.empty {
  color: #cbd5e1;
}

.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.arrow-circle {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.4);
}

.improvement-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.summary-item {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
}

.summary-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 0.5rem;
}

.summary-text {
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
}

@media (max-width: 968px) {
  .comparison-container {
    grid-template-columns: 1fr;
  }

  .arrow-container {
    transform: rotate(90deg);
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    width: 100%;
  }
}
</style>
