<script setup>
import Hero from './components/Hero.vue'
import HowItWorks from './components/HowItWorks.vue'
import LiveDemo from './components/LiveDemo.vue'
import BeforeAfter from './components/BeforeAfter.vue'
import Features from './components/Features.vue'
import Testimonials from './components/Testimonials.vue'
import FAQ from './components/FAQ.vue'
import FinalCTA from './components/FinalCTA.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <main class="landing-page">
    <Hero />
    <HowItWorks />
    <LiveDemo id="demo" />
    <BeforeAfter />
    <Features />
    <Testimonials />
    <FAQ />
    <FinalCTA id="download" />
    <Footer />
  </main>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.landing-page {
  min-height: 100vh;
  width: 100%;
}
</style>
