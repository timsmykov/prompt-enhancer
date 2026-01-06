<script setup>
import { Github, Twitter, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column" role="navigation" aria-labelledby="product-heading">
          <h3 id="product-heading" class="footer-title">Product</h3>
          <ul class="footer-links">
            <li><a href="javascript:void(0)" class="footer-link" rel="noopener noreferrer" aria-label="Chrome Web Store (coming soon)">Chrome Web Store</a></li>
            <li><a href="javascript:void(0)" class="footer-link" rel="noopener noreferrer" aria-label="Documentation (coming soon)">Documentation</a></li>
            <li><a href="javascript:void(0)" class="footer-link" rel="noopener noreferrer" aria-label="GitHub Repository (coming soon)">GitHub Repository</a></li>
          </ul>
        </div>

        <div class="footer-column" role="navigation" aria-labelledby="legal-heading">
          <h3 id="legal-heading" class="footer-title">Legal</h3>
          <ul class="footer-links">
            <li><a href="javascript:void(0)" class="footer-link" rel="noopener noreferrer" aria-label="Privacy Policy (coming soon)">Privacy Policy</a></li>
            <li><a href="javascript:void(0)" class="footer-link" rel="noopener noreferrer" aria-label="Terms of Service (coming soon)">Terms of Service</a></li>
            <li class="footer-text">License: MIT</li>
          </ul>
        </div>

        <div class="footer-column" role="navigation" aria-labelledby="connect-heading">
          <h3 id="connect-heading" class="footer-title">Connect</h3>
          <ul class="social-links">
            <li>
              <a href="javascript:void(0)" class="social-link" rel="noopener noreferrer" aria-label="GitHub (coming soon)">
                <Github :size="20" />
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" class="social-link" rel="noopener noreferrer" aria-label="Twitter (coming soon)">
                <Twitter :size="20" />
              </a>
            </li>
            <li>
              <a href="mailto:contact@example.com" class="social-link" rel="noopener noreferrer" aria-label="Email">
                <Mail :size="20" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 Prompt Improver. Open source project.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
  padding: var(--space-5xl) var(--space-md) var(--space-3xl) var(--space-md);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  width: 100%;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3xl);
  margin-bottom: var(--space-3xl);
  width: 100%;
  max-width: 100%;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-inverse);
  margin: 0 0 var(--space-xl) 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links li {
  font-size: 0.9375rem;
}

.footer-link {
  color: var(--color-text-light);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: inline-block;
}

.footer-link:hover {
  color: var(--color-text-inverse);
  text-decoration: underline;
  text-decoration-color: var(--color-primary);
  text-underline-offset: 4px;
}

.footer-text {
  color: var(--color-text-light);
  font-size: 0.9375rem;
}

.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: var(--space-md);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--color-text-light);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: var(--color-text-inverse);
  transform: translateY(-2px);
}

.social-link:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.6);
  outline-offset: 2px;
}

.footer-bottom {
  padding-top: var(--space-2xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .footer {
    padding: var(--space-4xl) var(--space-md) var(--space-2xl) var(--space-md);
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }

  .footer-title {
    font-size: 1rem;
    margin-bottom: var(--space-lg);
  }

  .footer-links li {
    font-size: 0.875rem;
  }

  .social-links {
    justify-content: flex-start;
  }

  .footer-bottom {
    padding-top: var(--space-xl);
  }

  .footer-bottom p {
    font-size: 0.8125rem;
  }
}
</style>
