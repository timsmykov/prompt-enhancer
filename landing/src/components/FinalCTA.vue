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
  position: relative;
  padding: var(--space-5xl) var(--space-md);
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
  background-size: 60px 60px;
  pointer-events: none;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-md);
  position: relative;
  z-index: 1;
}

.cta-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto var(--space-3xl) auto;
  padding: 0 var(--space-md);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #60a5fa;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xl);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  animation: badgeGlow 2s ease-in-out infinite alternate;
}

@keyframes badgeGlow {
  0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
  100% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.4); }
}

.cta-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  color: white;
  margin: 0 0 var(--space-lg) 0;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.cta-description {
  font-size: var(--text-xl);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-2xl) 0;
  letter-spacing: var(--tracking-wide);
}

.cta-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-2xl);
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-2xl);
  border-radius: var(--radius-lg);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  text-decoration: none;
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
  overflow: hidden;
  letter-spacing: var(--tracking-wide);
}

.btn-primary {
  background: var(--gradient-blue-purple);
  background-size: 200% 200%;
  color: white;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4),
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
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 15px 50px rgba(59, 130, 246, 0.5),
              0 0 30px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(-2px) scale(1.02);
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

.checkmark {
  width: 2rem;
  height: 2rem;
  background: var(--gradient-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.cta-visual {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  width: 100%;
  padding: 0 var(--space-md);
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
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
}

.browser-mockup {
  background: white;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform var(--transition-slow), box-shadow var(--transition-slow);
}

.browser-mockup:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7);
}

.browser-header {
  background: var(--color-bg-alt);
  padding: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.browser-dots {
  display: flex;
  gap: var(--space-sm);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: transform var(--transition-fast);
}

.dot:hover {
  transform: scale(1.2);
}

.dot.red {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.dot.yellow {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.dot.green {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.browser-title {
  flex: 1;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
}

.browser-body {
  padding: var(--space-2xl);
  background: var(--color-bg-alt);
}

.extension-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: white;
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

/* Glow effect on card hover */
.extension-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.extension-card:hover::before {
  opacity: 1;
}

.extension-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
}

.extension-icon {
  width: 5rem;
  height: 5rem;
  background: var(--gradient-blue-purple);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: var(--shadow-primary);
  position: relative;
  z-index: 1;
}

.extension-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.extension-info h3 {
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
}

.extension-rating {
  margin: var(--space-xs) 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.stars {
  color: #fbbf24;
  font-size: var(--text-base);
  letter-spacing: var(--spacing-tight);
}

.extension-users {
  margin: var(--space-xs) 0 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-semibold);
}

.add-button {
  padding: var(--space-md) var(--space-xl);
  background: var(--gradient-blue-purple);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-primary);
  position: relative;
  z-index: 1;
  overflow: hidden;
  letter-spacing: var(--tracking-wide);
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
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.add-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .final-cta {
    padding: var(--space-4xl) var(--space-md);
  }

  .container,
  .cta-content,
  .cta-visual {
    padding-left: var(--space-sm);
    padding-right: var(--space-sm);
  }

  .cta-title {
    font-size: var(--text-4xl);
  }

  .cta-description {
    font-size: var(--text-lg);
  }

  .btn {
    width: 100%;
    justify-content: center;
    padding: var(--space-md) var(--space-xl);
    font-size: var(--text-lg);
  }

  .cta-features {
    flex-direction: column;
    gap: var(--space-md);
  }

  .extension-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }

  .add-button {
    width: 100%;
  }

  .browser-mockup:hover {
    transform: none;
  }
}

@media (max-width: 480px) {
  .cta-title {
    font-size: var(--text-3xl);
  }

  .browser-body {
    padding: var(--space-md);
  }

  .extension-icon {
    width: 4rem;
    height: 4rem;
  }

  .extension-info h3 {
    font-size: var(--text-lg);
  }
}
</style>
