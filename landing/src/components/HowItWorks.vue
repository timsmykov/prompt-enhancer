<script setup>
import { MousePointer, Sparkles, CheckCircle } from 'lucide-vue-next'

const steps = [
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
    description: ' instantly see an AI-improved version. Replace or copy with one click.',
    color: '#10b981'
  }
]
</script>

<template>
  <section class="how-it-works">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">
          Three simple steps to transform your prompts into powerful communications
        </p>
      </div>

      <div class="steps-grid">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-card"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div
            class="icon-wrapper"
            :style="{ '--step-color': step.color }"
          >
            <component :is="step.icon" :size="32" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-description">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how-it-works {
  padding: 6rem 1rem;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
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

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.step-card {
  position: relative;
  padding: 2.5rem 2rem;
  background: #f8fafc;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.step-card:hover {
  transform: translateY(-8px);
  border-color: #e2e8f0;
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.step-number {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.icon-wrapper {
  width: 4rem;
  height: 4rem;
  margin: 1.5rem auto;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--step-color, #3b82f6);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.step-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 4rem 1rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
