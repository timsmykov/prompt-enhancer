<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err, instance, info) => {
  console.error('Error captured by boundary:', err, info)
  errorMessage.value = 'Something went wrong. Please refresh the page.'
  hasError.value = true
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
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 9999;
  padding: var(--space-md);
}

.error-content {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-content h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text);
  margin: 0 0 var(--space-md) 0;
  line-height: var(--leading-tight);
}

.error-content p {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2xl) 0;
  line-height: var(--leading-relaxed);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg) var(--space-2xl);
  background: var(--gradient-blue-purple);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-primary);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px -5px rgba(59, 130, 246, 0.5);
}

.btn:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.5);
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .error-content {
    padding: var(--space-2xl);
  }

  .error-content h2 {
    font-size: var(--text-2xl);
  }

  .error-content p {
    font-size: var(--text-base);
  }
}
</style>
