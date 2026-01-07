<script setup>
import { ref } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const faqs = ref([
  {
    question: 'Is Prompt Improver really free?',
    answer: 'Yes! The extension is completely free to download and use. You\'ll need an OpenRouter API key to make improvements, which you can get from openrouter.ai. The cost is minimal - typically pennies per hundred prompts - and you control your own spending.',
    isOpen: true
  },
  {
    question: 'What AI models does it support?',
    answer: 'Prompt Improver works with any model available on OpenRouter, including GPT-4, Claude, Gemini, and many more. You can choose your preferred model in the extension settings. We recommend starting with openrouter/auto for the best balance of quality and cost.',
    isOpen: false
  },
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. Your prompts are sent directly to OpenRouter\'s API and never stored on our servers. OpenRouter has a strict privacy policy and doesn\'t use your data for training. The extension runs entirely in your browser with minimal permissions.',
    isOpen: false
  },
  {
    question: 'Which websites does it work on?',
    answer: 'Prompt Improver works on virtually any website where you can select text. This includes Gmail, Google Docs, Microsoft Office Online, Slack, Discord, LinkedIn, Twitter, and thousands more. If you can highlight text, you can improve it!',
    isOpen: false
  },
  {
    question: 'How do I get started?',
    answer: 'Simply click "Add to Chrome" above, install the extension, and open the settings to add your OpenRouter API key. Then select any text on any webpage, right-click, and choose "Improve prompt" from the context menu. That\'s it!',
    isOpen: false
  }
])

const toggleFAQ = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

<template>
  <section class="faq">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">
          Everything you need to know about Prompt Improver
        </p>
      </div>

      <div class="faq-list">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ open: faq.isOpen }"
        >
          <button
            :id="'faq-question-' + index"
            @click="toggleFAQ(index)"
            class="faq-question"
            :aria-expanded="faq.isOpen"
            :aria-controls="'faq-answer-' + index"
          >
            <span>{{ faq.question }}</span>
            <span class="icon" aria-hidden="true">
              <ChevronDown v-if="!faq.isOpen" :size="20" />
              <ChevronUp v-else :size="20" />
            </span>
          </button>

          <div
            :id="'faq-answer-' + index"
            role="region"
            class="faq-answer"
            v-show="faq.isOpen"
            :aria-labelledby="'faq-question-' + index"
          >
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <div class="faq-contact">
        <h3>Still have questions?</h3>
        <p>
          Check out our documentation or contact us directly
        </p>
        <div class="contact-links">
          <a href="#" class="contact-link">View Documentation</a>
          <span class="separator">•</span>
          <a href="#" class="contact-link">Contact Support</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  position: relative;
  padding: var(--space-3xl) var(--space-md);
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  overflow: hidden;
}

/* Subtle background pattern */
.faq::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: var(--container-lg);
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 100%;
}

.faq-item {
  background: white;
  border-radius: var(--radius-2xl);
  border: 2px solid var(--color-border);
  overflow: hidden;
  transition: all var(--transition-base);
  position: relative;
}

.faq-item.open {
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px -5px rgba(59, 130, 246, 0.15);
}

/* Add left accent for open items */
.faq-item.open::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-primary);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl) var(--space-2xl);
  background: white;
  border: none;
  text-align: left;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  z-index: 1;
}

.faq-question:hover {
  background: var(--color-bg-alt);
}

.faq-question:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: -3px;
}

.faq-question .icon {
  color: var(--color-text-muted);
  transition: transform var(--transition-base);
  flex-shrink: 0;
}

.faq-item.open .faq-question .icon {
  color: var(--color-primary);
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 var(--space-2xl) var(--space-xl) var(--space-2xl);
  animation: slideDown 0.3s ease-out;
  background: var(--color-bg-alt);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-answer p {
  margin: 0;
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
}

.faq-contact {
  margin-top: var(--space-3xl);
  padding: var(--space-3xl);
  background: var(--gradient-blue-purple);
  border-radius: var(--radius-2xl);
  text-align: center;
  color: white;
  box-shadow: var(--shadow-primary);
  position: relative;
  overflow: hidden;
}

/* Add subtle animated background */
.faq-contact::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.faq-contact h3 {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  margin: 0 0 var(--space-md) 0;
  position: relative;
  z-index: 1;
}

.faq-contact p {
  font-size: var(--text-lg);
  opacity: 0.95;
  margin: 0 0 var(--space-xl) 0;
  position: relative;
  z-index: 1;
}

.contact-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.contact-link {
  color: white;
  text-decoration: none;
  font-weight: var(--font-semibold);
  padding: var(--space-md) var(--space-xl);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-base);
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.contact-link:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.separator {
  opacity: 0.6;
  font-weight: var(--font-semibold);
}

@media (max-width: 768px) {
  .faq {
    padding: var(--space-4xl) var(--space-md);
  }

  .faq-question {
    padding: var(--space-lg) var(--space-xl);
    font-size: var(--text-base);
  }

  .faq-answer {
    padding: 0 var(--space-xl) var(--space-lg) var(--space-xl);
  }

  .faq-contact {
    padding: var(--space-2xl);
  }

  .faq-contact h3 {
    font-size: var(--text-2xl);
  }

  .contact-links {
    flex-direction: column;
    width: 100%;
  }

  .contact-link {
    width: 100%;
    justify-content: center;
  }

  .separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--text-3xl);
  }

  .faq-contact h3 {
    font-size: var(--text-xl);
  }
}
</style>
