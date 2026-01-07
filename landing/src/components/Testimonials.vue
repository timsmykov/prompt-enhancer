<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Star, Quote, TrendingUp, Users, Globe } from 'lucide-vue-next'
import { useCounterAnimation } from '../composables/useCounterAnimation'

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

// Create counter animations for each stat
const usersCounter = useCounterAnimation(targetStats.users, 2000, { decimals: 0 })
const ratingCounter = useCounterAnimation(targetStats.rating, 2000, { decimals: 1 })
const countriesCounter = useCounterAnimation(targetStats.countries, 2000, { decimals: 0 })

onMounted(() => {
  // Start all counter animations
  usersCounter.start()
  ratingCounter.start()
  countriesCounter.start()

  // Update stats reactively as counters animate
  const updateStats = () => {
    stats.value.users = Math.floor(usersCounter.current.value)
    stats.value.rating = Number(ratingCounter.current.value.toFixed(1))
    stats.value.countries = Math.floor(countriesCounter.current.value)

    // Continue updating if animations are running
    if (
      usersCounter.current.value < targetStats.users ||
      ratingCounter.current.value < targetStats.rating ||
      countriesCounter.current.value < targetStats.countries
    ) {
      requestAnimationFrame(updateStats)
    }
  }

  updateStats()
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
   MOBILE-FIRST REDESIGN - Testimonials
   Compact, responsive, relative units only
   ============================================ */

/* Section Base */
.testimonials {
  position: relative;
  padding: 3rem 1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  overflow: hidden;
}

/* Dot pattern background */
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0.0625rem, transparent 0.0625rem);
  background-size: 1.875rem 1.875rem;
  pointer-events: none;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  color: var(--color-warm);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 0.0625rem solid rgba(251, 191, 36, 0.2);
  box-shadow: 0 0.25rem 0.75rem rgba(251, 191, 36, 0.1);
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.gradient-text {
  background: var(--gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  max-width: 43.75rem;
  margin: 0 auto;
  line-height: 1.75;
}

/* Masonry-style Grid - Mobile First */
.testimonials-masonry {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

/* Tablet: 2 columns */
@media (min-width: 48rem) {
  .testimonials-masonry {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 3 columns with auto-fit */
@media (min-width: 75rem) {
  .testimonials-masonry {
    grid-template-columns: repeat(auto-fit, minmax(21.875rem, 1fr));
    gap: 2rem;
  }

  /* Featured card spans 2 columns on large screens */
  .testimonial-card.featured {
    grid-column: span 2;
  }
}

/* Testimonial Card */
.testimonial-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 0.125rem solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.08), 0 0 0 0.0625rem rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Hover effects */
.testimonial-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.testimonial-card:hover::before {
  opacity: 1;
}

.testimonial-card:hover {
  transform: translateY(-0.5rem);
  border-color: var(--color-primary);
  box-shadow: 0 1.875rem 3.75rem rgba(0, 0, 0, 0.12), 0 0 0 0.1875rem rgba(59, 130, 246, 0.1);
}

/* Featured card special treatment */
.testimonial-card.featured {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 1.5625rem 3.125rem rgba(59, 130, 246, 0.15), 0 0 0 0.0625rem rgba(59, 130, 246, 0.1);
}

.testimonial-card.featured:hover {
  box-shadow: 0 2.1875rem 4.375rem rgba(59, 130, 246, 0.2), 0 0 0 0.1875rem rgba(59, 130, 246, 0.2);
}

/* Quote Icon */
.quote-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(203, 213, 225, 0.5);
  transition: all 0.2s ease;
}

.testimonial-card:hover .quote-icon {
  color: var(--color-primary-light);
  transform: scale(1.1) rotate(5deg);
}

/* Verification Badge */
.verified-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 0.0625rem solid rgba(16, 185, 129, 0.2);
}

/* Star Rating */
.rating {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
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
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  line-height: 1.75;
  color: var(--color-text-secondary);
  margin: 0 0 1.25rem 0;
  font-style: italic;
  position: relative;
  z-index: 1;
}

.testimonial-card.featured .testimonial-text {
  font-weight: 500;
}

/* Author Section */
.author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  width: 3rem;
  height: 3rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 9999px;
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
  width: 3rem;
  height: 3rem;
  background: var(--gradient-blue-purple);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 0.5rem 1rem rgba(59, 130, 246, 0.3), 0 0 0 0.1875rem rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  z-index: 1;
}

.testimonial-card:hover .avatar {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0.75rem 1.5rem rgba(59, 130, 246, 0.4), 0 0 0 0.25rem rgba(255, 255, 255, 1);
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 700;
  font-size: clamp(0.875rem, 1.25vw, 1.125rem);
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  color: var(--color-text-muted);
  font-weight: 500;
}

/* Hover Overlay */
.hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 1.5rem;
  pointer-events: none;
}

.testimonial-card:hover .hover-overlay {
  opacity: 1;
}

/* Trust Stats Section - Mobile First */
.trust-stats {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Animated background for stats */
.trust-stats::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  animation: statBgMove 20s linear infinite;
}

@keyframes statBgMove {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-1.25rem) translateY(-1.25rem);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
}

/* Stats Grid - Mobile First */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

/* Tablet: 2 columns */
@media (min-width: 48rem) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 3 columns */
@media (min-width: 64rem) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  padding: 1rem;
  border-radius: 1rem;
  border: 0.125rem solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.08), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0.9375rem 2.5rem rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Featured stat card */
.stat-card.featured {
  background: var(--gradient-blue-purple);
  border-color: transparent;
  box-shadow: 0 0.9375rem 2.5rem rgba(59, 130, 246, 0.3);
}

.stat-card.featured .stat-icon,
.stat-card.featured .stat-number,
.stat-card.featured .stat-label {
  color: white;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
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
  font-size: clamp(1.25rem, 2.5vw, 1.875rem);
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.stat-label {
  font-size: clamp(0.6875rem, 1vw, 0.875rem);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-bg-icon {
  position: absolute;
  bottom: -0.625rem;
  right: -0.625rem;
  font-size: 5rem;
  font-weight: 800;
  color: rgba(59, 130, 246, 0.03);
  pointer-events: none;
  user-select: none;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
  border-radius: 1rem;
  border: 0.125rem solid rgba(59, 130, 246, 0.2);
}

.cta-text {
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  color: var(--color-text-secondary);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--gradient-blue-purple);
  color: white;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 700;
  text-decoration: none;
  border-radius: 9999px;
  box-shadow: var(--shadow-primary);
  transition: all 0.2s ease;
}

.cta-link:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 0.75rem 1.875rem rgba(59, 130, 246, 0.4);
}

/* Responsive padding adjustments */
@media (min-width: 48rem) {
  .testimonials {
    padding: 3.5rem 1.5rem;
  }

  .testimonial-card {
    padding: 2rem;
  }

  .stat-card {
    padding: 1.25rem;
  }
}

@media (min-width: 75rem) {
  .testimonials {
    padding: 4rem 2rem;
  }

  .testimonial-card {
    padding: 2.5rem;
  }

  .trust-stats {
    padding: 2rem;
  }

  .stat-card {
    padding: 1.5rem;
  }
}
</style>
