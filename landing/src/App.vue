<script setup>
import { defineAsyncComponent } from 'vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import SkipLink from './components/SkipLink.vue'

// Above-fold components - immediate load
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import HowItWorks from './components/HowItWorks.vue'

// Below-fold components - lazy load
const LiveDemo = defineAsyncComponent(() => import('./components/LiveDemo.vue'))
const BeforeAfter = defineAsyncComponent(() => import('./components/BeforeAfter.vue'))
const Testimonials = defineAsyncComponent(() => import('./components/Testimonials.vue'))
const FAQ = defineAsyncComponent(() => import('./components/FAQ.vue'))
const FinalCTA = defineAsyncComponent(() => import('./components/FinalCTA.vue'))
const Footer = defineAsyncComponent(() => import('./components/Footer.vue'))
</script>

<template>
  <!-- Skip Links for Keyboard Navigation -->
  <SkipLink />

  <ErrorBoundary>
    <main id="main-content" class="landing-page">
      <!-- Above-fold - loads immediately -->
      <Hero />
      <Features id="features" />
      <HowItWorks id="how-it-works" />

      <!-- Below-fold - individual Suspense for each component -->
      <Suspense>
        <template #default>
          <ErrorBoundary>
            <LiveDemo id="demo" />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ErrorBoundary>
            <BeforeAfter />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ErrorBoundary>
            <FAQ />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ErrorBoundary>
            <FinalCTA id="download" />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ErrorBoundary>
            <Footer />
          </ErrorBoundary>
        </template>
        <template #fallback>
          <LoadingSpinner />
        </template>
      </Suspense>
    </main>
  </ErrorBoundary>
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
