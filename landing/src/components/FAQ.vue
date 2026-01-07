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
/* ============================================
   MOBILE-FIRST CSS - FAQ COMPONENT
   Base: 320px | Progressive enhancement
   Units: rem, em, %, clamp() only
   ============================================ */

/* Section Container */
.faq {
  position: relative;
  padding: 3rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  overflow: hidden;
}

/* Background Pattern */
.faq::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

/* Content Container */
.container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #64748b;
  max-width: 100%;
  margin: 0 auto;
  line-height: 1.6;
}

/* FAQ List Container */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

/* Individual FAQ Item */
.faq-item {
  background: white;
  border-radius: 0.75rem;
  border: 0.125rem solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;
}

.faq-item.open {
  border-color: #3b82f6;
  box-shadow: 0 0.5rem 1.5rem -0.3125rem rgba(59, 130, 246, 0.15);
}

/* Left Accent Bar for Open Items */
.faq-item.open::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0.25rem;
  background: #3b82f6;
}

/* FAQ Question Button */
.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: white;
  border: none;
  text-align: left;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.faq-question:hover {
  background: #f8fafc;
}

.faq-question:focus-visible {
  outline: 0.1875rem solid #3b82f6;
  outline-offset: -0.1875rem;
}

/* Icon Container */
.faq-question .icon {
  color: #64748b;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 0.75rem;
}

.faq-item.open .faq-question .icon {
  color: #3b82f6;
  transform: rotate(180deg);
}

/* FAQ Answer Panel */
.faq-answer {
  padding: 0 1.25rem 1rem 1.25rem;
  animation: slideDown 0.2s ease-out;
  background: #f8fafc;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-answer p {
  margin: 0;
  line-height: 1.6;
  color: #475569;
  font-size: clamp(0.9375rem, 2vw, 1rem);
}

/* Contact Section */
.faq-contact {
  margin-top: 2.5rem;
  padding: 2rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.75rem;
  text-align: center;
  color: white;
  box-shadow: 0 0.5rem 1rem -0.25rem rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

/* Animated Shimmer Background */
.faq-contact::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.faq-contact h3 {
  font-size: clamp(1.25rem, 4vw, 1.875rem);
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  position: relative;
  z-index: 1;
}

.faq-contact p {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  opacity: 0.95;
  margin: 0 0 1.25rem 0;
  position: relative;
  z-index: 1;
}

/* Contact Links Container */
.contact-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.contact-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  border-radius: 0.5rem;
  border: 0.125rem solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  display: inline-block;
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-0.125rem);
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.2);
}

.contact-link:focus-visible {
  outline: 0.1875rem solid rgba(255, 255, 255, 0.8);
  outline-offset: 0.125rem;
}

.separator {
  opacity: 0.6;
  font-weight: 600;
}

/* ============================================
   MEDIA QUERIES (min-width - progressive)
   ============================================ */

/* Small devices (480px+) */
@media (min-width: 30rem) {
  .faq {
    padding: 3rem 1.25rem;
  }

  .container {
    max-width: 100%;
  }

  .section-subtitle {
    max-width: 36rem;
  }

  .faq-list {
    gap: 1rem;
  }

  .faq-question {
    padding: 1.125rem 1.5rem;
  }

  .faq-answer {
    padding: 0 1.5rem 1.125rem 1.5rem;
  }

  .faq-contact {
    padding: 2.25rem 2rem;
  }
}

/* Medium devices (640px+) */
@media (min-width: 40rem) {
  .faq {
    padding: 3rem 1.5rem;
  }

  .container {
    max-width: 100%;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .faq-question {
    padding: 1.25rem 1.75rem;
  }

  .faq-answer {
    padding: 0 1.75rem 1.25rem 1.75rem;
  }

  .faq-contact {
    padding: 2.5rem 2.5rem;
    margin-top: 3rem;
  }
}

/* Large devices (768px+) */
@media (min-width: 48rem) {
  .faq {
    padding: 3rem 2rem;
  }

  .container {
    max-width: 48rem;
  }

  .faq-list {
    gap: 1rem;
  }

  .faq-question {
    padding: 1.25rem 2rem;
  }

  .faq-answer {
    padding: 0 2rem 1.25rem 2rem;
  }

  .faq-contact {
    padding: 3rem 3rem;
  }

  .contact-link {
    padding: 0.875rem 1.5rem;
  }
}

/* Extra large devices (1024px+) */
@media (min-width: 64rem) {
  .faq {
    padding: 3rem 2.5rem;
  }

  .container {
    max-width: 56rem;
  }

  .section-header {
    margin-bottom: 3.5rem;
  }

  .faq-list {
    gap: 1rem;
  }

  .faq-contact {
    padding: 3.5rem 4rem;
  }
}

/* Ultra wide screens (1280px+) */
@media (min-width: 80rem) {
  .faq {
    padding: 3rem 3rem;
  }

  .container {
    max-width: 64rem;
  }
}
</style>
