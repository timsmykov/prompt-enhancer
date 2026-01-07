import { ref, onUnmounted } from 'vue'

/**
 * Reusable typewriter animation composable
 * @param {string[]} texts - Array of texts to cycle through
 * @param {Object} options - Configuration options
 * @param {number} options.typeSpeed - Typing speed in ms (default: 80)
 * @param {number} options.deleteSpeed - Deleting speed in ms (default: 40)
 * @param {number} options.pauseDuration - Pause duration at end of text in ms (default: 2000)
 * @param {number} options.switchDelay - Delay between texts in ms (default: 500)
 * @returns {Object} Reactive state and control methods
 */
export function useTypewriter(texts, options = {}) {
  const {
    typeSpeed = 80,
    deleteSpeed = 40,
    pauseDuration = 2000,
    switchDelay = 500
  } = options

  const currentText = ref('')
  const isDeleting = ref(false)
  const isPaused = ref(false)
  const charIndex = ref(0)
  const currentIndex = ref(0)
  const showCursor = ref(true)

  let timeoutId = null

  // Random variance for natural typing feel
  const getRandomVariance = () => Math.random() * 50 - 25

  const animate = () => {
    const current = texts[currentIndex.value]

    if (isPaused.value) {
      return
    }

    if (isDeleting.value) {
      // Delete stage
      if (charIndex.value > 0) {
        currentText.value = current.slice(0, charIndex.value - 1)
        charIndex.value--
        timeoutId = setTimeout(animate, deleteSpeed + getRandomVariance())
      } else {
        // Finished deleting - switch to next text
        isDeleting.value = false
        currentIndex.value = (currentIndex.value + 1) % texts.length
        isPaused.value = true
        showCursor.value = false

        timeoutId = setTimeout(() => {
          isPaused.value = false
          showCursor.value = true
          animate()
        }, switchDelay)
      }
    } else {
      // Typing stage
      if (charIndex.value < current.length) {
        currentText.value = current.slice(0, charIndex.value + 1)
        charIndex.value++
        timeoutId = setTimeout(animate, typeSpeed + getRandomVariance())
      } else {
        // Finished typing - pause then delete
        isPaused.value = true

        timeoutId = setTimeout(() => {
          isPaused.value = false
          isDeleting.value = true
          animate()
        }, pauseDuration)
      }
    }
  }

  const start = (delay = 500) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(animate, delay)
  }

  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    currentText,
    isDeleting,
    isPaused,
    showCursor,
    start,
    stop
  }
}
