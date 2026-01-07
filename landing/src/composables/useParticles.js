import { ref, onUnmounted } from 'vue'

/**
 * Reusable particle system composable
 * @param {Object} options - Configuration options
 * @param {number} options.interval - Creation interval in ms (default: 300)
 * @param {number} options.maxParticles - Maximum particles allowed (default: 20)
 * @param {Function} options.shouldCreate - Callback to determine if particle should be created
 * @returns {Object} Reactive state and control methods
 */
export function useParticles(options = {}) {
  const {
    interval = 300,
    maxParticles = 20,
    shouldCreate = () => true
  } = options

  const particles = ref([])
  const intervalId = ref(null)
  const cleanupTimeouts = new Map()

  const createParticle = () => {
    if (!shouldCreate()) {
      return
    }

    // Enforce max particle limit
    if (particles.value.length >= maxParticles) {
      return
    }

    const particle = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 1000 + 500,
      delay: Math.random() * 200
    }

    particles.value.push(particle)

    // Track timeout for cleanup
    const timeoutId = setTimeout(() => {
      const index = particles.value.findIndex(p => p.id === particle.id)
      if (index > -1) {
        particles.value.splice(index, 1)
      }
      cleanupTimeouts.delete(particle.id)
    }, particle.duration + particle.delay)

    cleanupTimeouts.set(particle.id, timeoutId)
  }

  const startCreating = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    intervalId.value = setInterval(createParticle, interval)
  }

  const stopCreating = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const cleanup = () => {
    stopCreating()

    // Clear all pending particle cleanup timeouts
    cleanupTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    cleanupTimeouts.clear()

    // Clear all particles
    particles.value = []
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    particles,
    startCreating,
    stopCreating,
    cleanup
  }
}
