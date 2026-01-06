<script setup>
import { Star, Quote } from 'lucide-vue-next'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    rating: 5,
    text: 'This extension has completely transformed how I write emails and requirements. My team notices the difference in clarity and specificity.',
    avatar: 'SC'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Software Engineer',
    company: 'StartupXYZ',
    rating: 5,
    text: 'I use it daily for code reviews, documentation, and even Slack messages. It\'s like having a professional editor built into my browser.',
    avatar: 'MR'
  },
  {
    name: 'Emily Watson',
    role: 'Content Creator',
    company: 'Freelance',
    rating: 5,
    text: 'As a writer, I\'m constantly crafting prompts for research and ideation. This tool saves me hours every week and improves my output quality.',
    avatar: 'EW'
  }
]
</script>

<template>
  <section class="testimonials">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Loved by Users</h2>
        <p class="section-subtitle">
          Join thousands of professionals who've upgraded their communication
        </p>
      </div>

      <div class="testimonials-grid">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="testimonial-card"
        >
          <div class="quote-icon">
            <Quote :size="32" />
          </div>

          <div class="rating">
            <Star
              v-for="i in testimonial.rating"
              :key="i"
              :size="18"
              class="star-filled"
            />
          </div>

          <p class="testimonial-text">"{{ testimonial.text }}"</p>

          <div class="author">
            <div class="avatar">{{ testimonial.avatar }}</div>
            <div class="author-info">
              <div class="author-name">{{ testimonial.name }}</div>
              <div class="author-role">
                {{ testimonial.role }} at {{ testimonial.company }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="trust-badges">
        <div class="badge-item">
          <div class="badge-number">10,000+</div>
          <div class="badge-text">Active Users</div>
        </div>
        <div class="badge-item">
          <div class="badge-number">4.8/5</div>
          <div class="badge-text">Average Rating</div>
        </div>
        <div class="badge-item">
          <div class="badge-number">50+</div>
          <div class="badge-text">Countries</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  padding: 6rem 1rem;
  background: white;
}

.container {
  max-width: 1200px;
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

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.testimonial-card {
  position: relative;
  background: #f8fafc;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.quote-icon {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: #cbd5e1;
}

.rating {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}

.star-filled {
  color: #fbbf24;
  fill: #fbbf24;
}

.testimonial-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #334155;
  margin: 0 0 2rem 0;
  font-style: italic;
}

.author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.875rem;
  color: #64748b;
}

.trust-badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  text-align: center;
}

.badge-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0284c7;
}

.badge-text {
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
}

@media (max-width: 768px) {
  .testimonials {
    padding: 4rem 1rem;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .trust-badges {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
}
</style>
