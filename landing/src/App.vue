<script setup>
import Hero from './components/Hero.vue'
import HowItWorks from './components/HowItWorks.vue'
import LiveDemo from './components/LiveDemo.vue'
import BeforeAfter from './components/BeforeAfter.vue'
import Features from './components/Features.vue'
import Testimonials from './components/Testimonials.vue'
import FAQ from './components/FAQ.vue'
import FinalCTA from './components/FinalCTA.vue'
// Footer component to be created
</script>

<template>
  <div class="landing-page">
    <Hero />
    <HowItWorks />
    <LiveDemo id="demo" />
    <BeforeAfter />
    <Features />
    <Testimonials />
    <FAQ />
    <FinalCTA id="download" />
    <!-- Footer component to be added here -->
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  width: 100%;
}

html {
  scroll-behavior: smooth;
}

/* Let each component manage its own spacing */
</style>
