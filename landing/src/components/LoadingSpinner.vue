<script setup>
/**
 * Loading spinner component for Suspense fallback
 */
</script>

<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p class="loading-text">Loading...</p>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-3xl);
  min-height: 300px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-text-muted);
  margin: 0;
}
</style>
