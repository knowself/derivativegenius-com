<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

    <!-- Hero section -->
    <div class="relative overflow-hidden py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative">
          <div class="text-center animate-fade-in-up">
            <h2 class="text-base text-yellow-400 font-semibold tracking-wide uppercase">About</h2>
            <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in-up-delay">
              Derivative Genius
            </h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div class="prose prose-lg max-w-prose mx-auto bg-white/10 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 animate-fade-in-up-delay-2">
        <p class="text-xl text-white leading-8 mb-6 font-semibold">
          We are all standing on the shoulders of giants. Living in a time when we, each of us, can utilize all the intellectual tools ever conceived by humankind.
        </p>
        <p class="text-lg text-gray-300 leading-relaxed">
          All of us are revolutionizing our businesses and industries with cutting-edge AI tools and techniques and Derivative Genius is here to help.
        </p>
      </div>

      <!-- Visual elements -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto pb-16">
        <div class="group bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
          <h3 class="text-lg font-semibold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">Innovation</h3>
          <p class="text-gray-300">Leveraging cutting-edge AI tools to transform businesses</p>
        </div>
        <div class="group bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
          <h3 class="text-lg font-semibold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">Expertise</h3>
          <p class="text-gray-300">Building on the foundations of proven technologies</p>
        </div>
        <div class="group bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
          <h3 class="text-lg font-semibold text-yellow-400 mb-3 group-hover:text-yellow-300 transition-colors">Partnership</h3>
          <p class="text-gray-300">Working together to achieve revolutionary results</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AboutPage">
import { ref } from 'vue'
</script>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 0.6s ease-out 0.4s forwards;
  opacity: 0;
}
</style>
