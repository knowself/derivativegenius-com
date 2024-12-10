<template>
  <div class="chatbots-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI-Powered Chatbots for Business and Organizational Growth</h1>
        <div class="hero-subtitle">
          Transform your business operations with intelligent AI chatbots. Our solutions help small and medium-sized businesses automate customer service, streamline operations, and boost revenue through 24/7 intelligent assistance.
        </div>
      </div>
    </div>

    <div class="features-grid mb-12">
      <div class="feature-card">
        <i class="fas fa-clock text-2xl mb-3"></i>
        <h3 class="text-lg font-semibold">24/7 Availability</h3>
        <p>Never miss a customer inquiry</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-dollar-sign text-2xl mb-3"></i>
        <h3 class="text-lg font-semibold">Cost Reduction</h3>
        <p>Lower operational costs</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-chart-line text-2xl mb-3"></i>
        <h3 class="text-lg font-semibold">Increased Efficiency</h3>
        <p>Faster response times</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-users text-2xl mb-3"></i>
        <h3 class="text-lg font-semibold">Better Experience</h3>
        <p>Enhanced customer satisfaction</p>
      </div>
    </div>

    <div class="industry-grid">
      <router-link 
        v-for="industry in industries" 
        :key="industry.id"
        :to="{ name: 'ChatbotIndustry', params: { industry: industry.id }}"
        class="industry-card"
      >
        <div class="icon-wrapper">
          <i :class="industry.icon + ' text-3xl mb-4'"></i>
        </div>
        <h2 class="text-xl font-semibold mb-2">{{ industry.name }}</h2>
        <p class="text-sm">{{ industry.description }}</p>
      </router-link>
    </div>

    <div class="industries-section">
      <h2 class="section-title">Industry Solutions</h2>
      <div class="industries-grid">
        <router-link to="/chatbots/local" class="industry-card">
          <i class="fas fa-store text-3xl mb-4"></i>
          <h3>Local Business</h3>
          <p>Empower local businesses with AI assistance</p>
        </router-link>
        
        <router-link to="/chatbots/education" class="industry-card">
          <i class="fas fa-graduation-cap text-3xl mb-4"></i>
          <h3>Education</h3>
          <p>Transform learning experiences with AI</p>
        </router-link>
        
        <router-link to="/chatbots/technology" class="industry-card">
          <i class="fas fa-microchip text-3xl mb-4"></i>
          <h3>Technology</h3>
          <p>Accelerate innovation with AI solutions</p>
        </router-link>
        
        <router-link to="/chatbots/manufacturing" class="industry-card">
          <i class="fas fa-industry text-3xl mb-4"></i>
          <h3>Manufacturing</h3>
          <p>Optimize production with intelligent automation</p>
        </router-link>
        
        <router-link to="/chatbots/hospitality" class="industry-card">
          <i class="fas fa-hotel text-3xl mb-4"></i>
          <h3>Hospitality</h3>
          <p>Enhance guest experiences with AI</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chatbots',
  data() {
    return {
      industries: [
        {
          id: 'retail',
          name: 'Retail',
          icon: 'fas fa-shopping-cart',
          description: 'Smart retail solutions for enhanced shopping experiences'
        },
        {
          id: 'healthcare',
          name: 'Healthcare-Medical',
          icon: 'fas fa-hospital',
          description: 'Intelligent healthcare assistance and patient support'
        },
        {
          id: 'financial',
          name: 'Financial Services-Banking',
          icon: 'fas fa-landmark',
          description: 'Secure and efficient financial service automation'
        },
        {
          id: 'realestate',
          name: 'Real Estate',
          icon: 'fas fa-home',
          description: 'Property management and client service automation'
        },
        {
          id: 'professional',
          name: 'Professional Services',
          icon: 'fas fa-briefcase',
          description: 'Streamlined professional service delivery'
        },
        {
          id: 'hospitality',
          name: 'Hospitality-Tourism',
          icon: 'fas fa-hotel',
          description: 'Enhanced guest experiences and booking management'
        },
        {
          id: 'education',
          name: 'Education-Training',
          icon: 'fas fa-graduation-cap',
          description: 'Intelligent learning assistance and support'
        },
        {
          id: 'manufacturing',
          name: 'Manufacturing',
          icon: 'fas fa-industry',
          description: 'Automated manufacturing support and monitoring'
        },
        {
          id: 'technology',
          name: 'Technology Services',
          icon: 'fas fa-laptop-code',
          description: 'Tech support and service automation'
        },
        {
          id: 'local',
          name: 'Local Services-Home Services',
          icon: 'fas fa-tools',
          description: 'Local business and home service automation'
        }
      ]
    }
  }
}
</script>

<style scoped>
.chatbots-container {
  @apply px-4 py-12 max-w-7xl mx-auto;
}

.hero-section {
  @apply text-center mb-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-12 shadow-2xl;
}

.hero-content {
  @apply max-w-4xl mx-auto;
}

.hero-title {
  @apply text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 leading-tight;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  @apply text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto -mt-8 relative z-10;
}

.feature-card {
  @apply bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-xl text-center relative overflow-hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.industry-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.industry-card {
  @apply bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-xl text-center relative overflow-hidden cursor-pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.industry-card::before,
.industry-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.industry-card::before {
  background: linear-gradient(transparent 50%, rgba(59, 130, 246, 0.1));
  transform: translateY(-100%);
  z-index: 1;
}

.industry-card::after {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(59, 130, 246, 0.1) 10px,
    rgba(59, 130, 246, 0.1) 20px
  );
  opacity: 0;
  z-index: 1;
}

.industry-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 20px rgba(59, 130, 246, 0.4);
}

.industry-card:hover::before {
  transform: translateY(0);
  animation: scanline 2s linear infinite;
}

.industry-card:hover::after {
  opacity: 1;
  animation: diagonalStripes 15s linear infinite;
}

.industry-card .icon-wrapper {
  @apply relative z-10;
}

.industry-card i {
  @apply transition-all duration-300 relative z-10;
}

.industry-card:hover i {
  animation: glitch 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite both;
  color: #3b82f6;
}

.industries-section {
  padding: 4rem 2rem;
  background: #f8fafc;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  color: #2d3748;
}

.industries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.industry-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  text-decoration: none;
  color: #2d3748;
}

.industry-card:hover {
  transform: translateY(-5px);
}

.industry-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.industry-card p {
  color: #718096;
  line-height: 1.5;
}

@keyframes scanline {
  0% {
    background: linear-gradient(transparent 0%, rgba(59, 130, 246, 0.2));
    transform: translateY(-100%);
  }
  50% {
    background: linear-gradient(transparent 0%, rgba(59, 130, 246, 0.1));
  }
  100% {
    background: linear-gradient(transparent 0%, rgba(59, 130, 246, 0.2));
    transform: translateY(100%);
  }
}

@keyframes diagonalStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}
</style>
