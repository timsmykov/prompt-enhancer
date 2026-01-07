# Landing Page Optimization Plan - Phase 1 & 2
**Prompt Improver Chrome Extension Landing Page**

**Date:** 2025-01-07
**Estimated Time:** 6-8 hours (Phase 1: 4h, Phase 2: 4h)
**Target:** Production-ready landing with A+ grade (95+)

---

## Phase 1: Critical Fixes (4 hours)

### Task 1.1: Fix Memory Leak in HowItWorks.vue (30 min)

**File:** `landing/src/components/HowItWorks.vue`

**Issue:** `setInterval` created in `onMounted` but never cleared in `onUnmounted`

**Steps:**
1. Add variable to track interval ID
2. Clear interval in `onUnmounted` hook
3. Verify cleanup works

**Code:**
```javascript
// Add before onMounted
let stepInterval = null

// Modify onMounted
onMounted(() => {
  stepInterval = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.value.length
  }, 3000)
})

// Add onUnmounted
onUnmounted(() => {
  if (stepInterval) {
    clearInterval(stepInterval)
    stepInterval = null
  }
})
```

**Verification:** Navigate away from page and check memory profiler

---

### Task 1.2: Fix Memory Leaks in Hero.vue Particle System (1 hour)

**File:** `landing/src/components/Hero.vue`

**Issue:** Timeouts create closures, no cleanup on unmount

**Steps:**
1. Create Map to track all timeout IDs
2. Store timeout ID when particle created
3. Clear all timeouts in `onUnmounted`
4. Add max particle limit (20)

**Code:**
```javascript
// Add at top of script setup
const particleTimeouts = new Map()

// Modify createParticle function
const createParticle = () => {
  if (isPaused.value && !isDeleting.value) return

  // Add max particle limit
  if (particles.value.length >= 20) return

  const particle = {
    id: Date.now() + Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 1000 + 1000,
    delay: Math.random() * 500
  }

  particles.value.push(particle)

  const timeoutId = setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
    particleTimeouts.delete(particle.id)
  }, particle.duration + particle.delay)

  particleTimeouts.set(particle.id, timeoutId)
}

// Add onUnmounted cleanup
onUnmounted(() => {
  // Clear all particle timeouts
  particleTimeouts.forEach((timeoutId) => {
    clearTimeout(timeoutId)
  })
  particleTimeouts.clear()

  // Clear animation timeout
  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }

  // Clear particle interval
  if (particleInterval) {
    clearInterval(particleInterval)
  }
})
```

**Verification:** Check memory profiler after repeated navigation

---

### Task 1.3: Fix Hero Section Contrast (15 min)

**File:** `landing/src/components/Hero.vue` (styles)

**Issue:** Title (4.2:1) and description (4.1:1) fail WCAG AA (4.5:1)

**Steps:**
1. Add text-shadow to Hero title
2. Increase description opacity
3. Add shadow to description

**Code:**
```css
/* In Hero.vue <style> section */
.hero-title {
  /* Add text shadow */
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.hero-description {
  /* Increase opacity and add shadow */
  color: rgba(255, 255, 255, 0.98);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
}
```

**Verification:** Use Chrome DevTools Lighthouse accessibility audit

---

### Task 1.4: Add ARIA Labels to Interactive Elements (1 hour)

**Files:** All component files

**Steps:**
1. Add `aria-label` to icon-only buttons in FAQ.vue
2. Add `aria-label` to copy button in LiveDemo.vue
3. Add `aria-label` to close buttons
4. Add `aria-expanded` to FAQ accordions
5. Add `aria-controls` to FAQ buttons

**Code Examples:**

**FAQ.vue:**
```vue
<button
  @click="toggleFAQ(index)"
  class="faq-question"
  :aria-expanded="faq.isOpen"
  :aria-controls="`faq-answer-${index}`"
  :id="`faq-question-${index}`"
>
  {{ faq.question }}
  <ChevronDown
    :aria-label="faq.isOpen ? 'Collapse answer' : 'Expand answer'"
  />
</button>

<div
  :id="`faq-answer-${index}`"
  class="faq-answer"
  v-show="faq.isOpen"
  role="region"
  :aria-labelledby="`faq-question-${index}`"
>
  <p>{{ faq.answer }}</p>
</div>
```

**LiveDemo.vue:**
```vue
<button
  @click="copyToClipboard"
  class="btn btn-secondary"
  :aria-label="isCopying ? 'Copied!' : 'Copy to clipboard'"
  :disabled="!improvedText"
>
  <Copy :size="18" />
  {{ isCopying ? 'Copied!' : 'Copy' }}
</button>

<textarea
  v-model="originalText"
  class="demo-textarea"
  aria-label="Enter your prompt text"
  placeholder="Try: Can you help me with my project?"
  rows="6"
></textarea>
```

**Verification:** Test with screen reader (NVDA/VoiceOver)

---

### Task 1.5: Add Error Boundary Component (1 hour)

**File:** Create `landing/src/components/ErrorBoundary.vue`

**Steps:**
1. Create ErrorBoundary component
2. Add error tracking (console + user feedback)
3. Integrate into App.vue
4. Test with intentional errors

**Code:**

**ErrorBoundary.vue:**
```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err, instance, info) => {
  console.error('Error captured by boundary:', err, info)
  errorMessage.value = 'Something went wrong. Please refresh the page.'
  hasError.value = true

  // Log to error tracking service (Sentry, etc.)
  // logErrorToService(err, instance, info)

  // Prevent error from propagating
  return false
})
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h2>Oops! Something went wrong</h2>
      <p>{{ errorMessage }}</p>
      <button @click="location.reload()" class="btn btn-primary">
        Refresh Page
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: var(--space-xl);
  text-align: center;
}

.error-content {
  max-width: 500px;
}

.error-content h2 {
  color: var(--color-error);
  margin-bottom: var(--space-md);
}
</style>
```

**App.vue:**
```vue
<template>
  <ErrorBoundary>
    <div class="landing-page">
      <Hero />
      <Features />
      <!-- ... other components ... -->
    </div>
  </ErrorBoundary>
</template>

<script setup>
import ErrorBoundary from './components/ErrorBoundary.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
// ... other imports
</script>
```

**Verification:** Trigger errors in dev tools to verify boundary catches them

---

## Phase 2: Optimization (4 hours)

### Task 2.1: Extract useTypewriter Composable (1 hour)

**Create:** `landing/src/composables/useTypewriter.js`

**Steps:**
1. Create composable with reusable typewriter logic
2. Extract animation logic from Hero.vue
3. Add cleanup tracking
4. Update Hero.vue to use composable

**Code:**
```javascript
// landing/src/composables/useTypewriter.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useTypewriter(texts, options = {}) {
  const {
    typeSpeed = 80,
    deleteSpeed = 40,
    pauseDuration = 2000,
    initialDelay = 500
  } = options

  const currentText = ref('')
  const isDeleting = ref(false)
  const textIndex = ref(0)
  const charIndex = ref(0)

  let timeoutId = null
  let isStopped = false

  const type = () => {
    if (isStopped) return

    const current = texts[textIndex.value]

    if (isDeleting.value) {
      if (charIndex.value > 0) {
        currentText.value = current.slice(0, charIndex.value - 1)
        charIndex.value--
        timeoutId = setTimeout(type, deleteSpeed)
      } else {
        isDeleting.value = false
        textIndex.value = (textIndex.value + 1) % texts.length
        timeoutId = setTimeout(type, pauseDuration)
      }
    } else {
      if (charIndex.value < current.length) {
        currentText.value = current.slice(0, charIndex.value + 1)
        charIndex.value++
        timeoutId = setTimeout(type, typeSpeed)
      } else {
        isDeleting.value = true
        timeoutId = setTimeout(type, pauseDuration)
      }
    }
  }

  const start = () => {
    isStopped = false
    timeoutId = setTimeout(type, initialDelay)
  }

  const stop = () => {
    isStopped = true
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  onMounted(start)
  onUnmounted(stop)

  return {
    currentText,
    isDeleting,
    start,
    stop
  }
}
```

**Update Hero.vue:**
```vue
<script setup>
import { useTypewriter } from '@/composables/useTypewriter'

const prompts = [
  "Improve Your Prompts in One Click",
  "Better Prompts, Better Results",
  "AI-Powered Prompt Enhancement"
]

const { currentText: animationText } = useTypewriter(prompts, {
  typeSpeed: TYPE_SPEED,
  deleteSpeed: DELETE_SPEED,
  pauseDuration: PAUSE_DURATION
})
</script>
```

---

### Task 2.2: Extract useParticles Composable (1 hour)

**Create:** `landing/src/composables/useParticles.js`

**Steps:**
1. Create composable for particle system
2. Extract particle logic from Hero.vue
3. Add proper cleanup tracking
4. Limit max particles

**Code:**
```javascript
// landing/src/composables/useParticles.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useParticles(options = {}) {
  const {
    maxParticles = 20,
    creationInterval = 300,
    isPaused = ref(false)
  } = options

  const particles = ref([])
  const particleTimeouts = new Map()
  let creationIntervalId = null

  const createParticle = () => {
    if (isPaused.value) return
    if (particles.value.length >= maxParticles) return

    const particle = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 1000 + 1000,
      delay: Math.random() * 500
    }

    particles.value.push(particle)

    const timeoutId = setTimeout(() => {
      const index = particles.value.findIndex(p => p.id === particle.id)
      if (index > -1) {
        particles.value.splice(index, 1)
      }
      particleTimeouts.delete(particle.id)
    }, particle.duration + particle.delay)

    particleTimeouts.set(particle.id, timeoutId)
  }

  const startCreating = () => {
    if (creationIntervalId) return
    creationIntervalId = setInterval(createParticle, creationInterval)
  }

  const stopCreating = () => {
    if (creationIntervalId) {
      clearInterval(creationIntervalId)
      creationIntervalId = null
    }
  }

  const cleanup = () => {
    stopCreating()

    // Clear all particle timeouts
    particleTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    particleTimeouts.clear()

    // Clear all particles
    particles.value = []
  }

  onUnmounted(cleanup)

  return {
    particles,
    startCreating,
    stopCreating,
    cleanup
  }
}
```

---

### Task 2.3: Extract useCounterAnimation Composable (30 min)

**Create:** `landing/src/composables/useCounterAnimation.js`

**Steps:**
1. Create composable for animated counters
2. Extract logic from Testimonials.vue
3. Use requestAnimationFrame instead of setInterval

**Code:**
```javascript
// landing/src/composables/useCounterAnimation.js
import { ref, onMounted } from 'vue'

export function useCounterAnimation(target, duration = 2000) {
  const current = ref(0)
  let animationFrameId = null

  onMounted(() => {
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)

      current.value = Math.floor(eased * target)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        current.value = target
      }
    }

    animationFrameId = requestAnimationFrame(animate)
  })

  const cancel = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }

  return {
    current,
    cancel
  }
}
```

**Update Testimonials.vue:**
```vue
<script setup>
import { useCounterAnimation } from '@/composables/useCounterAnimation'

const targetStats = {
  users: 10000,
  prompts: 500000,
  satisfaction: 98
}

const { current: usersCount } = useCounterAnimation(targetStats.users, 2000)
const { current: promptsCount } = useCounterAnimation(targetStats.prompts, 2500)
const { current: satisfactionCount } = useCounterAnimation(targetStats.satisfaction, 1800)
</script>
```

---

### Task 2.4: Implement Lazy Loading (30 min)

**File:** `landing/src/App.vue`

**Steps:**
1. Import `defineAsyncComponent` from Vue
2. Lazy load below-fold components
3. Add loading state
4. Add error handling

**Code:**
```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// Above-fold: load immediately
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import HowItWorks from './components/HowItWorks.vue'

// Below-fold: lazy load
const LiveDemo = defineAsyncComponent(() =>
  import('./components/LiveDemo.vue')
)

const BeforeAfter = defineAsyncComponent(() =>
  import('./components/BeforeAfter.vue')
)

const Testimonials = defineAsyncComponent(() =>
  import('./components/Testimonials.vue')
)

const FAQ = defineAsyncComponent(() =>
  import('./components/FAQ.vue')
)

const FinalCTA = defineAsyncComponent(() =>
  import('./components/FinalCTA.vue')
)

const Footer = defineAsyncComponent(() =>
  import('./components/Footer.vue')
)
</script>

<template>
  <div class="landing-page">
    <Hero />
    <Features />
    <HowItWorks />

    <!-- Lazy loaded components -->
    <Suspense>
      <template #default>
        <LiveDemo />
        <BeforeAfter />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </template>

      <template #fallback>
        <div class="loading-section">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: var(--space-md);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-bg-alt);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

---

### Task 2.5: Add Error Handling in LiveDemo (30 min)

**File:** `landing/src/components/LiveDemo.vue`

**Steps:**
1. Add error state ref
2. Wrap async operations in try-catch
3. Show user-facing error messages
4. Add clipboard fallback

**Code:**
```vue
<script setup>
import { ref } from 'vue'

const error = ref(null)
const isCancelled = ref(false)

const improvePrompt = async () => {
  if (!originalText.value.trim()) return

  isLoading.value = true
  error.value = null
  isCancelled.value = false

  try {
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (!isCancelled.value) {
          const randomResponse = mockResponses[
            Math.floor(Math.random() * mockResponses.length)
          ]
          improvedText.value = randomResponse
          resolve()
        } else {
          reject(new Error('Cancelled'))
        }
      }, 1500)

      // Store for cleanup
      return () => clearTimeout(timeoutId)
    })
  } catch (err) {
    error.value = 'Failed to improve prompt. Please try again.'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  isCancelled.value = true
})

const copyToClipboard = async () => {
  if (!improvedText.value) return

  copyError.value = null

  try {
    await navigator.clipboard.writeText(improvedText.value)
    isCopying.value = true
    setTimeout(() => { isCopying.value = false }, 2000)
  } catch (err) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = improvedText.value
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      isCopying.value = true
      setTimeout(() => { isCopying.value = false }, 2000)
    } catch (fallbackErr) {
      copyError.value = 'Copy not supported in this browser'
      console.error('Copy failed:', fallbackErr)
    }
  }
}
</script>

<template>
  <div class="live-demo">
    <!-- Error state -->
    <div v-if="error" class="error-message" role="alert">
      {{ error }}
      <button @click="error = null" class="error-close">×</button>
    </div>

    <!-- Existing UI... -->
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-lg);
  background: var(--color-error-bg, #fee2e2);
  border: 1px solid var(--color-error, #ef4444);
  border-radius: var(--radius-md);
  color: var(--color-error, #ef4444);
}

.error-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

---

### Task 2.6: Add Input Validation (30 min)

**File:** Create `landing/src/utils/validation.js`

**Steps:**
1. Create validation utility functions
2. Add runtime validation to LiveDemo
3. Add safe array access to BeforeAfter
4. Show validation errors

**Code:**
```javascript
// landing/src/utils/validation.js
export const validatePromptInput = (text) => {
  if (typeof text !== 'string') {
    return { valid: false, error: 'Input must be text' }
  }

  if (text.trim().length === 0) {
    return { valid: false, error: 'Please enter some text' }
  }

  if (text.length > 4000) {
    return { valid: false, error: 'Text too long. Maximum 4000 characters.' }
  }

  // Check for suspicious patterns
  if (/(.)\1{100,}/.test(text)) {
    return { valid: false, error: 'Input contains suspicious patterns' }
  }

  return { valid: true }
}

export const safeArrayAccess = (array, index, defaultValue = null) => {
  if (!Array.isArray(array) || index < 0 || index >= array.length) {
    return defaultValue
  }
  return array[index]
}
```

**Update LiveDemo.vue:**
```vue
<script setup>
import { validatePromptInput } from '@/utils/validation'

const improvePrompt = () => {
  // Validate input
  const validation = validatePromptInput(originalText.value)
  if (!validation.valid) {
    error.value = validation.error
    return
  }

  // ... rest of logic
}
</script>
```

**Update BeforeAfter.vue:**
```vue
<script setup>
import { safeArrayAccess } from '@/utils/validation'

const activeExample = computed(() =>
  safeArrayAccess(examples.value, activeIndex.value, {
    before: '',
    after: '',
    category: 'General'
  })
)
</script>

<template>
  <div class="example-text">{{ activeExample.before }}</div>
  <div class="example-text">{{ activeExample.after }}</div>
</template>
```

---

## Verification Checklist

After completing all tasks:

### Phase 1 Verification:
- [ ] No memory leaks (verify with Chrome Memory Profiler)
- [ ] Hero contrast passes WCAG AA (Lighthouse accessibility audit)
- [ ] All interactive elements have ARIA labels
- [ ] Error boundary catches and displays errors

### Phase 2 Verification:
- [ ] Composables work correctly (test in isolation)
- [ ] Lazy loading reduces initial bundle size
- [ ] Error handling shows user-friendly messages
- [ ] Input validation prevents invalid data

### Performance Metrics:
- [ ] Initial load time reduced by 2+ seconds
- [ ] No memory leaks after 10+ navigations
- [ ] All animations run at 60fps
- [ ] Lighthouse score: 90+ Performance, 95+ Accessibility

---

## Success Criteria

**Before Optimization:**
- Memory leaks: 3 identified
- Accessibility: 65/100 (WCAG AA fails)
- Error handling: Minimal
- Code reusability: Low

**After Optimization:**
- Memory leaks: 0 ✅
- Accessibility: 95/100 (WCAG AA passes) ✅
- Error handling: Comprehensive ✅
- Code reusability: High (3 composables) ✅
- Bundle size: Reduced by 30% ✅

**Final Grade Target:** A+ (95/100)

---

## Implementation Order

**Day 1 (4 hours):**
1. Morning (2h): Tasks 1.1, 1.2, 1.3 - Memory leaks + contrast
2. Afternoon (2h): Task 1.4 - ARIA labels

**Day 2 (4 hours):**
1. Morning (2h): Tasks 2.1, 2.2, 2.3 - Composables
2. Afternoon (2h): Tasks 2.4, 2.5, 2.6 - Lazy loading + validation

**Total:** 8 hours over 2 days
