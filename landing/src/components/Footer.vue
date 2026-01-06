<script setup>
import { Github, Twitter, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3 class="footer-title">Product</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Chrome Web Store</a></li>
            <li><a href="#" class="footer-link">Documentation</a></li>
            <li><a href="#" class="footer-link">GitHub Repository</a></li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Legal</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Privacy Policy</a></li>
            <li><a href="#" class="footer-link">Terms of Service</a></li>
            <li class="footer-text">License: MIT</li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Connect</h3>
          <ul class="social-links">
            <li>
              <a href="#" class="social-link" aria-label="GitHub">
                <Github :size="20" />
              </a>
            </li>
            <li>
              <a href="#" class="social-link" aria-label="Twitter">
                <Twitter :size="20" />
              </a>
            </li>
            <li>
              <a href="mailto:contact@example.com" class="social-link" aria-label="Email">
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
  background: #0f172a;
  color: #e2e8f0;
  padding: 6rem 1rem 3rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
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
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #ffffff;
  text-decoration: underline;
  text-decoration-color: #3b82f6;
  text-underline-offset: 4px;
}

.footer-text {
  color: #94a3b8;
  font-size: 0.9375rem;
}

.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #ffffff;
  transform: translateY(-2px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .footer {
    padding: 4rem 1rem 2rem 1rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .footer-links li {
    font-size: 0.875rem;
  }

  .social-links {
    justify-content: flex-start;
  }

  .footer-bottom {
    padding-top: 1.5rem;
  }

  .footer-bottom p {
    font-size: 0.8125rem;
  }
}
</style>
