<script setup>
// Radical minimalist design - no decorative elements
// Pure typography and whitespace driven layout
</script>

<template>
  <section class="how-it-works">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <h2>How It Works</h2>
        <p>Transform your prompts in three steps</p>
      </div>

      <!-- Three Step Process with Cards -->
      <div class="steps">
        <div class="step-card">
          <div class="step-number">01</div>
          <h3>Select Your Text</h3>
          <p>Highlight any text on any website</p>
        </div>

        <div class="arrow">→</div>

        <div class="step-card">
          <div class="step-number">02</div>
          <h3>Click "Improve"</h3>
          <p>Right-click and select from menu</p>
        </div>

        <div class="arrow">→</div>

        <div class="step-card">
          <div class="step-number">03</div>
          <h3>Get Enhanced Result</h3>
          <p>Instantly see your improved prompt</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   RADICAL MINIMALIST DESIGN - How It Works
   No decorative elements. Typography-driven.
   Slate grayscale palette only.
   ============================================ */

/* CSS Variables - Slate Grayscale System */
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

/* Base Section Styles */
.how-it-works {
  padding: 4rem 1rem;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Container */
.container {
  max-width: 64rem;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.section-header p {
  font-size: 1.125rem;
  color: var(--slate-500);
  margin: 0;
  line-height: 1.6;
}

/* Steps Grid Layout */
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 64rem;
  margin: 0 auto;
  align-items: start;
}

/* Step Card with Minimal Structure */
.step-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.step-card:hover {
  border-color: var(--slate-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Large Number with Accent Color */
.step-number {
  font-size: 3rem;
  font-weight: 800;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 1rem;
  letter-spacing: -0.05em;
}

/* Step Title */
.step-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

/* Step Description */
.step-card p {
  font-size: 1rem;
  color: var(--slate-600);
  line-height: 1.6;
  margin: 0;
}

/* Text Arrow Between Steps */
.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--slate-300);
  padding-top: 2rem;
}

/* Mobile Responsive - Stack Vertically */
@media (max-width: 768px) {
  .how-it-works {
    padding: 4rem 1rem;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .section-header p {
    font-size: 1rem;
  }

  /* Stack steps vertically */
  .steps {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  /* Center steps on mobile */
  .step-card {
    text-align: center;
  }

  /* Rotate arrows to point down */
  .arrow {
    transform: rotate(90deg);
    padding-top: 0;
  }

  .step-number {
    font-size: 3rem;
  }
}

/* Tablet Responsive - 768px to 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .steps {
    gap: 1.5rem;
  }

  .step-number {
    font-size: 3.5rem;
  }

  .arrow {
    font-size: 1.5rem;
  }
}

/* Large Desktop - 1280px and up */
@media (min-width: 1280px) {
  .steps {
    gap: 3rem;
  }

  .step-number {
    font-size: 5rem;
  }
}
</style>
