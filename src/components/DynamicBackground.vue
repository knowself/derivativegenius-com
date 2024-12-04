<template>
  <div class="relative h-full w-full">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-500 animate-gradient-slow"></div>
    
    <!-- Geometric pattern overlay -->
    <div class="absolute inset-0 opacity-10">
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
        </pattern>
        <rect width="100" height="100" fill="url(#grid)"/>
      </svg>
    </div>
    
    <!-- Floating particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="n in 5" :key="n" 
           class="particle absolute rounded-full bg-white"
           :style="getParticleStyle(n)">
      </div>
    </div>
    
    <!-- Content overlay -->
    <div class="relative h-full w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const getParticleStyle = (n) => {
  const size = Math.random() * 4 + 2 + 'px'
  const left = Math.random() * 100 + '%'
  const animationDelay = Math.random() * 5 + 's'
  const opacity = Math.random() * 0.5 + 0.2
  
  return {
    width: size,
    height: size,
    left: left,
    animationDelay: animationDelay,
    opacity: opacity
  }
}
</script>

<style scoped>
.animate-gradient-slow {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

.particle {
  animation: float 10s infinite;
  top: -10px;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(-10px); }
  50% { transform: translateY(110%); }
  100% { transform: translateY(-10px); }
}
</style>
