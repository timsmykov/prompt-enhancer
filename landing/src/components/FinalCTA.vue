<script setup>
import { Download, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <section id="download" class="final-cta">
    <div class="container">
      <div class="cta-content">
        <div class="badge">
          <Sparkles :size="16" />
          <span>Ready to get started?</span>
        </div>

        <h2 class="cta-title">
          Start Improving Your Prompts Today
        </h2>

        <p class="cta-description">
          Join thousands of professionals who communicate more effectively.
          Free, private, and powerful - install Prompt Improver in seconds.
        </p>

        <div class="cta-buttons">
          <a
            href="#"
            class="btn btn-primary"
            @click.prevent
          >
            <Download :size="20" />
            Add to Chrome - It's Free
          </a>
        </div>

        <div class="cta-features">
          <div class="feature">
            <div class="checkmark">✓</div>
            <span>No credit card required</span>
          </div>
          <div class="feature">
            <div class="checkmark">✓</div>
            <span>Setup in 2 minutes</span>
          </div>
          <div class="feature">
            <div class="checkmark">✓</div>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      <div class="cta-visual">
        <div class="browser-mockup">
          <div class="browser-header">
            <div class="browser-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="browser-title">Chrome Web Store</div>
          </div>
          <div class="browser-body">
            <div class="extension-card">
              <div class="extension-icon">
                <Sparkles :size="48" />
              </div>
              <div class="extension-info">
                <h3>Prompt Improver</h3>
                <p class="extension-rating">
                  <span class="stars">★★★★★</span>
                  4.8 (2,453 reviews)
                </p>
                <p class="extension-users">10,000+ users</p>
              </div>
              <button class="add-button">
                Add to Chrome
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final-cta {
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
}

.final-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem auto;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: white;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
}

.cta-description {
  font-size: 1.25rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0 0 2.5rem 0;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 2.5rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.5);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -4px rgba(59, 130, 246, 0.6);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 1rem;
}

.checkmark {
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: white;
}

.cta-visual {
  max-width: 700px;
  margin: 0 auto;
}

.browser-mockup {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.5);
}

.browser-header {
  background: #f1f5f9;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.browser-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red {
  background: #ef4444;
}

.dot.yellow {
  background: #f59e0b;
}

.dot.green {
  background: #10b981;
}

.browser-title {
  flex: 1;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.browser-body {
  padding: 2rem;
  background: #f8fafc;
}

.extension-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.extension-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.extension-info {
  flex: 1;
}

.extension-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.extension-rating {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #475569;
}

.stars {
  color: #fbbf24;
  margin-right: 0.5rem;
}

.extension-users {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.4);
}

@media (max-width: 768px) {
  .final-cta {
    padding: 4rem 1rem;
  }

  .cta-title {
    font-size: 2.5rem;
  }

  .cta-description {
    font-size: 1.125rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .cta-features {
    flex-direction: column;
    gap: 1rem;
  }

  .extension-card {
    flex-direction: column;
    text-align: center;
  }

  .add-button {
    width: 100%;
  }
}
</style>
