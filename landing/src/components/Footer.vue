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
/* ===================================
   MOBILE-FIRST FOOTER DESIGN
   Base: 320px → Progressive enhancement
   =================================== */

.footer {
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
  padding: 2rem 1rem;
}

/* Container with max-width and centered content */
.container {
  max-width: 75rem;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

/* CSS Grid with auto-fit for responsive columns */
/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */
.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

/* Fluid typography with clamp() */
.footer-title {
  font-size: clamp(1rem, 0.9375rem + 0.3125vw, 1.125rem);
  font-weight: 600;
  color: var(--color-text-inverse);
  margin: 0 0 1rem 0;
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
  font-size: clamp(0.875rem, 0.8125rem + 0.3125vw, 0.9375rem);
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
  text-underline-offset: 0.25rem;
}

.footer-text {
  color: var(--color-text-light);
  font-size: clamp(0.875rem, 0.8125rem + 0.3125vw, 0.9375rem);
}

/* Social links with horizontal layout */
.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--color-text-light);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: var(--color-text-inverse);
  transform: translateY(-0.125rem);
}

.social-link:focus-visible {
  outline: 0.1875rem solid rgba(59, 130, 246, 0.6);
  outline-offset: 0.125rem;
}

/* Footer bottom section */
.footer-bottom {
  padding-top: 1.5rem;
  border-top: 0.0625rem solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  font-size: clamp(0.8125rem, 0.75rem + 0.3125vw, 0.875rem);
  color: var(--color-text-muted);
}

/* ===================================
   RESPONSIVE BREAKPOINTS (min-width)
   Progressive: stacked → 2 columns → 3 columns
   =================================== */

/* Tablet: 768px and up */
@media (min-width: 48rem) {
  .footer {
    padding: 2.5rem 1rem;
  }

  .footer-grid {
    gap: 2.5rem;
    margin-bottom: 2.5rem;
  }

  .footer-title {
    margin-bottom: 1.25rem;
  }

  .footer-links {
    gap: 0.875rem;
  }
}

/* Desktop: 1024px and up */
@media (min-width: 64rem) {
  .footer {
    padding: 2rem 1rem;
  }

  .footer-grid {
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .footer-title {
    margin-bottom: 1.5rem;
  }

  .footer-links {
    gap: 1rem;
  }

  .footer-bottom {
    padding-top: 2rem;
  }
}

/* Large Desktop: 1280px and up */
@media (min-width: 80rem) {
  .social-links {
    gap: 1rem;
  }
}
</style>
