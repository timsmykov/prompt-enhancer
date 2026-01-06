<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Star, Quote, TrendingUp, Users, Globe } from 'lucide-vue-next'

const testimonials = ref([
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    company: 'TechCorp',
    rating: 5,
    text: 'This extension has completely transformed how I write emails and requirements. My team notices the difference in clarity and specificity. Absolutely essential tool!',
    avatar: 'SC',
    featured: true,
    verified: true
  },
  {
    name: 'Michael Rodriguez',
    role: 'Software Engineer',
    company: 'StartupXYZ',
    rating: 5,
    text: 'I use it daily for code reviews, documentation, and even Slack messages. It\'s like having a professional editor built into my browser.',
    avatar: 'MR',
    featured: false,
    verified: true
  },
  {
    name: 'Emily Watson',
    role: 'Content Creator',
    company: 'Freelance',
    rating: 5,
    text: 'As a writer, I\'m constantly crafting prompts for research and ideation. This tool saves me hours every week and improves my output quality.',
    avatar: 'EW',
    featured: false,
    verified: true
  },
  {
    name: 'David Kim',
    role: 'Marketing Director',
    company: 'GrowthLabs',
    rating: 5,
    text: 'The impact on our team\'s communication has been phenomenal. Clearer prompts, better AI responses, and faster workflows across the board.',
    avatar: 'DK',
    featured: false,
    verified: true
  },
  {
    name: 'Lisa Thompson',
    role: 'UX Researcher',
    company: 'DesignStudio',
    rating: 5,
    text: 'I recommend this to everyone in my field. It\'s helped me craft better research prompts and get more insightful responses from participants.',
    avatar: 'LT',
    featured: false,
    verified: false
  }
])

const stats = ref({
  users: 0,
  rating: 0,
  countries: 0
})

const targetStats = {
  users: 10000,
  rating: 4.8,
  countries: 50
}

// Animated counter
const animateCounter = (target, duration, callback) => {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    callback(current)
  }, 16)
}

onMounted(() => {
  // Animate stats on load
  animateCounter(targetStats.users, 2000, (val) => {
    stats.value.users = Math.floor(val)
  })
  animateCounter(targetStats.rating, 2000, (val) => {
    stats.value.rating = val.toFixed(1)
  })
  animateCounter(targetStats.countries, 2000, (val) => {
    stats.value.countries = Math.floor(val)
  })
})
</script>

<template>
  <section class="testimonials">
    <!-- Animated background -->
    <div class="bg-dots"></div>

    <div class="container">
      <div class="section-header">
        <div class="badge">
          <Star :size="16" :fill="'currentColor'" />
          <span>Social Proof</span>
        </div>
        <h2 class="section-title">
          Loved by <span class="gradient-text">10,000+</span> Users
        </h2>
        <p class="section-subtitle">
          Join thousands of professionals who've upgraded their communication
        </p>
      </div>

      <!-- Masonry-style Testimonials Grid -->
      <div class="testimonials-masonry">
        <!-- Featured testimonial (larger) -->
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="testimonial-card"
          :class="{ featured: testimonial.featured }"
        >
          <!-- Decorative quote icon -->
          <div class="quote-icon">
            <Quote :size="40" />
          </div>

          <!-- Verification badge -->
          <div v-if="testimonial.verified" class="verified-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            <span>Verified</span>
          </div>

          <!-- Star rating with animation -->
          <div class="rating">
            <Star
              v-for="i in testimonial.rating"
              :key="i"
              :size="20"
              class="star-filled"
              :style="{ animationDelay: `${i * 100}ms` }"
            />
          </div>

          <!-- Testimonial text -->
          <p class="testimonial-text">"{{ testimonial.text }}"</p>

          <!-- Author section with glowing avatar -->
          <div class="author">
            <div class="avatar-glow"></div>
            <div class="avatar">{{ testimonial.avatar }}</div>
            <div class="author-info">
              <div class="author-name">{{ testimonial.name }}</div>
              <div class="author-role">
                {{ testimonial.role }} at {{ testimonial.company }}
              </div>
            </div>
          </div>

          <!-- Hover effect overlay -->
          <div class="hover-overlay"></div>
        </div>
      </div>

      <!-- Trust Stats Section -->
      <div class="trust-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <Users :size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.users.toLocaleString() }}+</div>
              <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-bg-icon">Users</div>
          </div>

          <div class="stat-card featured">
            <div class="stat-icon">
              <Star :size="32" :fill="'currentColor'" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.rating }}/5</div>
              <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-bg-icon">Rating</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <Globe :size="32" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ stats.countries }}+</div>
              <div class="stat-label">Countries</div>
            </div>
            <div class="stat-bg-icon">Global</div>
          </div>
        </div>
      </div>

      <!-- Call to action -->
      <div class="cta-section">
        <p class="cta-text">
          Ready to join thousands of satisfied users?
        </p>
        <a href="#download" class="cta-link">
          Get Started Free
          <TrendingUp :size="18" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   DRAMATIC TRANSFORMATION - Testimonials
   Enhanced social proof with masonry layout,
   animated stats, and glowing avatars
   ============================================ */

.testimonials {
  position: relative;
  padding: var(--space-5xl) var(--space-md);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

/* Dot pattern background */
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
}

.container {
  max-width: var(--container-2xl);
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: var(--space-4xl);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(251, 191, 36, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-warm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);
  border: 1px solid rgba(251, 191, 36, 0.2);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.1);
}

.section-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.gradient-text {
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--color-text-muted);
  max-width: 700px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}

/* Masonry-style Grid */
.testimonials-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-4xl);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* Featured card spans 2 columns */
@media (min-width: 1200px) {
  .testimonial-card.featured {
    grid-column: span 2;
  }
}

@media (max-width: 1199px) {
  .testimonials-masonry {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .testimonial-card.featured {
    grid-column: span 1;
  }
}

/* Testimonial Card with Enhanced Design */
.testimonial-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: var(--space-3xl);
  border-radius: var(--radius-3xl);
  border: 2px solid rgba(226, 232, 240, 0.8);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: all var(--transition-slow);
  overflow: hidden;
}

/* Hover effects */
.testimonial-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.testimonial-card:hover::before {
  opacity: 1;
}

.testimonial-card:hover {
  transform: translateY(-12px);
  border-color: var(--color-primary);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.12),
    0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Featured card gets special treatment */
.testimonial-card.featured {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow:
    0 25px 50px rgba(59, 130, 246, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.1);
}

.testimonial-card.featured:hover {
  box-shadow:
    0 35px 70px rgba(59, 130, 246, 0.2),
    0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Quote Icon */
.quote-icon {
  position: absolute;
  top: var(--space-xl);
  right: var(--space-xl);
  color: rgba(203, 213, 225, 0.5);
  transition: all var(--transition-base);
}

.testimonial-card:hover .quote-icon {
  color: var(--color-primary-light);
  transform: scale(1.1) rotate(5deg);
}

/* Verification Badge */
.verified-badge {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* Star Rating with Animation */
.rating {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.star-filled {
  color: var(--color-warm);
  animation: starPop 0.5s ease-out backwards;
}

@keyframes starPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.testimonial-card:hover .star-filled {
  animation: starPulse 1s ease-in-out infinite;
}

@keyframes starPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Testimonial Text */
.testimonial-text {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2xl) 0;
  font-style: italic;
  position: relative;
  z-index: 1;
}

.testimonial-card.featured .testimonial-text {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
}

/* Author Section with Glowing Avatar */
.author {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  position: relative;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  width: 4rem;
  height: 4rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: var(--radius-full);
  animation: avatarGlow 2s ease-in-out infinite alternate;
}

@keyframes avatarGlow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.avatar {
  position: relative;
  width: 4rem;
  height: 4rem;
  background: var(--gradient-blue-purple);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-extrabold);
  font-size: var(--text-lg);
  flex-shrink: 0;
  box-shadow:
    0 8px 16px rgba(59, 130, 246, 0.3),
    0 0 0 3px rgba(255, 255, 255, 0.8);
  transition: all var(--transition-base);
  z-index: 1;
}

.testimonial-card:hover .avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow:
    0 12px 24px rgba(59, 130, 246, 0.4),
    0 0 0 4px rgba(255, 255, 255, 1);
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.author-role {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-medium);
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.03) 0%,
    rgba(139, 92, 246, 0.03) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
  border-radius: var(--radius-3xl);
  pointer-events: none;
}

.testimonial-card:hover .hover-overlay {
  opacity: 1;
}

/* Trust Stats Section */
.trust-stats {
  margin-bottom: var(--space-3xl);
  padding: var(--space-3xl);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: var(--radius-3xl);
  position: relative;
  overflow: hidden;
}

/* Animated background for stats */
.trust-stats::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: statBgMove 20s linear infinite;
}

@keyframes statBgMove {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-20px) translateY(-20px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  position: relative;
  z-index: 1;
}

.stat-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-base);
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Featured stat card */
.stat-card.featured {
  background: var(--gradient-blue-purple);
  border-color: transparent;
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.3);
}

.stat-card.featured .stat-icon,
.stat-card.featured .stat-number,
.stat-card.featured .stat-label {
  color: white;
}

.stat-icon {
  width: 4rem;
  height: 4rem;
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.stat-card.featured .stat-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-number {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
  line-height: var(--leading-tight);
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.stat-bg-icon {
  position: absolute;
  bottom: -10px;
  right: -10px;
  font-size: 8rem;
  font-weight: var(--font-extrabold);
  color: rgba(59, 130, 246, 0.03);
  pointer-events: none;
  user-select: none;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: var(--space-2xl);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: var(--radius-2xl);
  border: 2px solid rgba(59, 130, 246, 0.2);
}

.cta-text {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-lg) 0;
  font-weight: var(--font-medium);
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-2xl);
  background: var(--gradient-blue-purple);
  color: white;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  text-decoration: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-primary);
  transition: all var(--transition-base);
}

.cta-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .testimonials {
    padding: var(--space-3xl) var(--space-md);
  }

  .testimonials-masonry {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .testimonial-card.featured {
    grid-column: span 1;
  }

  .section-title {
    font-size: var(--text-4xl);
  }

  .testimonial-card {
    padding: var(--space-2xl);
  }

  .testimonial-card.featured .testimonial-text {
    font-size: var(--text-lg);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .stat-card {
    padding: var(--space-lg);
  }

  .stat-icon {
    width: 3.5rem;
    height: 3.5rem;
  }

  .stat-number {
    font-size: var(--text-2xl);
  }

  .trust-stats {
    padding: var(--space-xl);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: var(--text-3xl);
  }

  .testimonial-text {
    font-size: var(--text-base);
  }

  .avatar {
    width: 3.5rem;
    height: 3.5rem;
    font-size: var(--text-base);
  }
}
</style>
