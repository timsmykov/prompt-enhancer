<script setup>
const links = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#how-it-works', text: 'Skip to how it works section' },
  { href: '#features', text: 'Skip to features section' }
]
</script>

<template>
  <a
    v-for="link in links"
    :key="link.href"
    :href="link.href"
    class="skip-link"
  >
    {{ link.text }}
  </a>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--color-primary, #3b82f6);
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-weight: var(--font-semibold, 600);
  border-radius: 0 0 var(--radius-md, 0.5rem) 0;
  z-index: 9999;
  transition: top var(--transition-fast, 0.2s);
}

.skip-link:focus {
  top: 0;
  outline: 2px solid white;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
}
</style>
