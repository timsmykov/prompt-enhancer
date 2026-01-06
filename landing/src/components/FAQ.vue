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
            @click="toggleFAQ(index)"
            class="faq-question"
          >
            <span>{{ faq.question }}</span>
            <span class="icon">
              <ChevronDown v-if="!faq.isOpen" :size="20" />
              <ChevronUp v-else :size="20" />
            </span>
          </button>

          <div class="faq-answer" v-show="faq.isOpen">
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
  padding: 6rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
  max-width: 900px;
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s;
}

.faq-item.open {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.2);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s;
}

.faq-question:hover {
  background: #f8fafc;
}

.faq-question .icon {
  color: #64748b;
  transition: transform 0.3s;
}

.faq-item.open .faq-question .icon {
  color: #3b82f6;
}

.faq-answer {
  padding: 0 2rem 1.5rem 2rem;
  animation: slideDown 0.3s ease-out;
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
  line-height: 1.7;
  color: #475569;
}

.faq-contact {
  margin-top: 4rem;
  padding: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 16px;
  text-align: center;
  color: white;
}

.faq-contact h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
}

.faq-contact p {
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0 0 1.5rem 0;
}

.contact-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.contact-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.2s;
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.separator {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .faq {
    padding: 4rem 1rem;
  }

  .faq-question {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }

  .faq-answer {
    padding: 0 1.5rem 1.25rem 1.5rem;
  }

  .faq-contact {
    padding: 2rem;
  }

  .faq-contact h3 {
    font-size: 1.5rem;
  }

  .contact-links {
    flex-direction: column;
  }

  .separator {
    display: none;
  }
}
</style>
