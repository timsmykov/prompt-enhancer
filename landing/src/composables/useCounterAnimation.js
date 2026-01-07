import { ref, onUnmounted } from 'vue'

/**
 * Reusable counter animation composable using requestAnimationFrame
 * @param {number} target - Target value to count to
 * @param {number} duration - Animation duration in ms (default: 2000)
 * @param {Object} options - Configuration options
 * @param {number} options.decimals - Number of decimal places (default: 0)
 * @returns {Object} Reactive state and control methods
 */
export function useCounterAnimation(target, duration = 2000, options = {}) {
  const { decimals = 0 } = options

  const current = ref(0)
  let animationId = null
  let startTime = null

  // Easing function for smooth animation (ease-out cubic)
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3)
  }

  const animate = (timestamp) => {
    if (!startTime) {
      startTime = timestamp
    }

    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Apply easing
    const easedProgress = easeOutCubic(progress)

    // Calculate current value
    current.value = target * easedProgress

    if (progress < 1) {
      animationId = requestAnimationFrame(animate)
    } else {
      current.value = target
    }
  }

  const start = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    startTime = null
    current.value = 0
    animationId = requestAnimationFrame(animate)
  }

  const cancel = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    startTime = null
  }

  onUnmounted(() => {
    cancel()
  })

  return {
    current,
    start,
    cancel
  }
}
