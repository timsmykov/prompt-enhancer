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
/* ============================================
   MOBILE-FIRST CSS - FINAL CTA COMPONENT
   ============================================ */

/* Base styles - Mobile (320px+) */
.final-cta {
  position: relative;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
}

/* Animated gradient background */
.final-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  animation: bgPulse 10s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes bgPulse {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Grid pattern overlay */
.final-cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 3.75rem 3.75rem;
  pointer-events: none;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.cta-content {
  text-align: center;
  max-width: 56.25rem;
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  color: #60a5fa;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  border: 0.0625rem solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 1.25rem rgba(59, 130, 246, 0.2);
  animation: badgeGlow 2s ease-in-out infinite alternate;
}

@keyframes badgeGlow {
  0% { box-shadow: 0 0 1.25rem rgba(59, 130, 246, 0.2); }
  100% { box-shadow: 0 0 1.875rem rgba(59, 130, 246, 0.4); }
}

.cta-title {
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
  text-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.3);
}

.cta-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.75;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.025em;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  overflow: hidden;
  letter-spacing: 0.025em;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-size: 200% 200%;
  color: white;
  box-shadow:
    0 0.625rem 2.5rem rgba(59, 130, 246, 0.4),
    0 0 0 0 rgba(59, 130, 246, 0.7);
  animation: gradientMove 6s ease infinite, pulse 2s infinite;
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Shimmer effect */
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-0.25rem) scale(1.05);
  box-shadow:
    0 0.938rem 3.125rem rgba(59, 130, 246, 0.5),
    0 0 1.875rem rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(-0.125rem) scale(1.02);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
}

.checkmark {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  box-shadow: 0 0.25rem 0.75rem rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.cta-visual {
  max-width: 50rem;
  margin: 0 auto;
  position: relative;
  width: 100%;
  padding: 0 1rem;
}

/* Glow effect behind browser */
.cta-visual::before {
  content: '';
  position: absolute;
  width: 120%;
  height: 120%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  z-index: -1;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.browser-mockup {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1.875rem 3.75rem -1.25rem rgba(0, 0, 0, 0.6);
  border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.browser-header {
  background: #f8fafc;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 0.0625rem solid #e2e8f0;
}

.browser-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.dot:hover {
  transform: scale(1.2);
}

.dot.red {
  background: #ef4444;
  box-shadow: 0 0 0.625rem rgba(239, 68, 68, 0.5);
}

.dot.yellow {
  background: #f59e0b;
  box-shadow: 0 0 0.625rem rgba(245, 158, 11, 0.5);
}

.dot.green {
  background: #10b981;
  box-shadow: 0 0 0.625rem rgba(16, 185, 129, 0.5);
}

.browser-title {
  flex: 1;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.browser-body {
  padding: 1.25rem;
  background: #f8fafc;
}

.extension-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 0.125rem solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: center;
}

/* Glow effect on card hover */
.extension-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.extension-card:hover::before {
  opacity: 1;
}

.extension-card:hover {
  border-color: #3b82f6;
  transform: translateY(-0.25rem);
  box-shadow:
    0 0.625rem 1.25rem -0.375rem rgba(0, 0, 0, 0.1),
    0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.06);
}

.extension-icon {
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow:
    0 0.25rem 0.5rem -0.125rem rgba(0, 0, 0, 0.1),
    0 0.125rem 0.25rem -0.125rem rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
}

.extension-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.extension-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.extension-rating {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.stars {
  color: #fbbf24;
  font-size: 1rem;
  letter-spacing: 0.025em;
}

.extension-users {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 600;
}

.add-button {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 0.25rem 0.5rem -0.125rem rgba(0, 0, 0, 0.1),
    0 0.125rem 0.25rem -0.125rem rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
  overflow: hidden;
  letter-spacing: 0.025em;
}

.add-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
}

.add-button:hover::before {
  left: 100%;
}

.add-button:hover {
  transform: translateY(-0.125rem);
  box-shadow: 0 0.5rem 1.25rem rgba(59, 130, 246, 0.4);
}

.add-button:active {
  transform: translateY(0);
}

/* Tablet (48rem = 768px) */
@media (min-width: 48rem) {
  .final-cta {
    padding: 3rem 1.5rem;
  }

  .container {
    padding: 0 1.5rem;
  }

  .cta-content {
    padding: 0 1.5rem;
  }

  .cta-visual {
    padding: 0 1.5rem;
  }

  .cta-features {
    gap: 1.5rem;
  }

  .extension-card {
    flex-direction: row;
    text-align: left;
    padding: 1rem;
  }

  .extension-rating {
    justify-content: flex-start;
  }

  .add-button {
    width: auto;
  }
}

/* Desktop (64rem = 1024px) */
@media (min-width: 64rem) {
  .final-cta {
    padding: 3rem 2rem;
  }

  .container {
    padding: 0 2rem;
  }

  .cta-content {
    padding: 0 2rem;
  }

  .cta-visual {
    padding: 0 2rem;
  }

  .browser-mockup:hover {
    transform: translateY(-0.5rem) scale(1.02);
    box-shadow: 0 2.5rem 5rem -1.25rem rgba(0, 0, 0, 0.7);
  }
}

/* Large Desktop (80rem = 1280px) */
@media (min-width: 80rem) {
  .final-cta {
    padding: 3rem 0;
  }

  .cta-content {
    padding: 0;
  }

  .cta-visual {
    padding: 0;
  }
}
</style>
