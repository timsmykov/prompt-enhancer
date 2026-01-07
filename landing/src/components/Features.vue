<script setup>
// No external dependencies - pure minimalist implementation
</script>

<template>
  <section class="features">
    <div class="container">
      <div class="section-header">
        <h2>Why Prompt Improver?</h2>
        <p>Simple tools for better communication</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Get improved prompts in 2-3 seconds. No waiting.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Privacy First</h3>
          <p>Your data stays on your device. We store nothing.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🌐</div>
          <h3>Works Everywhere</h3>
          <p>Use it in Gmail, Docs, Twitter, or any website.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3>Fully Customizable</h3>
          <p>Choose AI model, typing speed, system prompts.</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="cta-section">
        <p class="cta-text">
          Free Forever. No subscriptions. Bring your own API key.
        </p>
        <a href="#download" class="btn-primary">
          Add to Chrome - Free
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   RADICAL MINIMALIST DESIGN
   No decorations, typography-driven
   Slate grayscale palette only
   ============================================ */

/* CSS Variables - Slate Grayscale */
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

/* Section Container - 4rem (64px) padding */
.features {
  padding: 4rem 1rem;
  background: var(--slate-50);
}

.container {
  max-width: 48rem;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
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

/* Features Grid - 2x2 Layout */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 0.75rem;
  padding: 2rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  border-color: var(--slate-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--slate-900);
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.feature-card p {
  font-size: 0.9375rem;
  color: var(--slate-600);
  line-height: 1.6;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Divider - Thin 1px line */
.divider {
  height: 1px;
  background: var(--slate-200);
  margin: 3rem 0;
}

/* CTA Section */
.cta-section {
  text-align: center;
}

.cta-text {
  font-size: 1.125rem;
  color: var(--slate-700);
  margin-bottom: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--slate-900);
  color: white;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.btn-primary:hover {
  background: var(--slate-800);
}

/* Mobile Responsive - Single column */
@media (max-width: 768px) {
  .features {
    padding: 3rem 1rem;
  }

  .section-header h2 {
    font-size: 1.75rem;
  }

  .section-header p {
    font-size: 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-icon {
    font-size: 1.5rem;
  }

  .feature-card h3 {
    font-size: 1rem;
  }

  .feature-card p {
    font-size: 0.875rem;
  }

  .cta-text {
    font-size: 1rem;
  }

  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }
}

/* Small mobile */
@media (max-width: 23.4375rem) {
  .features {
    padding: 2.5rem 0.75rem;
  }

  .features-list {
    gap: 1.5rem;
  }
}
</style>
