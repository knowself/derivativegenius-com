<template>
  <div class="chatbots-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <i class="fas fa-robot text-6xl mb-8 text-yellow-300"></i>
        </div>
        <h1 class="hero-title">AI-Powered Chatbots for Business and Organizational Growth</h1>
        <div class="hero-subtitle">
          <i class="fas fa-lightbulb text-yellow-300 mr-2"></i>
          Imagine a world where your business operates with unparalleled efficiency, where your customers feel valued every moment, and where your team is free to focus on what truly matters. With our AI-powered chatbots, this isn't just a vision – it's a reality.
        </div>
        <div class="hero-description">
          <i class="fas fa-clock text-yellow-300 mr-2"></i>
          In today's fast-paced world, every second counts. Your customers demand instant solutions, seamless interactions, and a personalized touch. Our AI chatbot solutions are more than just tools; they are partners in your journey to redefine success.
        </div>
      </div>
    </div>

    <div class="how-it-works">
      <div class="section-content">
        <div class="section-icon">
          <i class="fas fa-cogs text-4xl mb-6 text-indigo-600"></i>
        </div>
        <h2 class="section-title">
          <i class="fas fa-magic text-indigo-600 mr-2"></i>
          How Our Chatbots Work for You
        </h2>
        <p class="section-text">
          <i class="fas fa-handshake text-indigo-600 mr-2"></i>
          Behind every successful business is the ability to connect – to truly listen and respond. Our chatbots provide that connection, tirelessly working 24/7 to ensure your customers feel heard and supported.
        </p>
      </div>
    </div>

    <div class="features-grid">
      <div v-for="(feature, index) in features" :key="index" class="feature-card">
        <div class="feature-icon-wrapper">
          <i :class="feature.icon"></i>
        </div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>

    <div class="industries-section">
      <h2 class="section-title">Tailored Industry Solutions</h2>
      <p class="section-description">Your business is unique, and so are your challenges. Our chatbots adapt to meet your specific needs.</p>
      
      <div class="industries-grid">
        <router-link 
          v-for="industry in industries" 
          :key="industry.id"
          :to="{ name: 'ChatbotIndustry', params: { industry: industry.id }}"
          class="industry-card"
        >
          <div class="industry-icon-wrapper">
            <i :class="industry.icon"></i>
          </div>
          <h3>{{ industry.name }}</h3>
          <p>{{ industry.description }}</p>
        </router-link>
      </div>
    </div>

    <div class="industry-links-section">
      <h2 class="text-3xl font-bold text-center mb-12">Explore Industry Solutions</h2>
      <div class="industry-grid">
        <router-link to="/chatbots/local-business" class="industry-card">
          <div class="icon-wrapper">
            <i class="fas fa-store text-3xl"></i>
          </div>
          <h3>Local Business</h3>
          <p>Build stronger community relationships</p>
          <span class="learn-more">Learn More <i class="fas fa-arrow-right ml-2"></i></span>
        </router-link>

        <router-link to="/chatbots/education" class="industry-card">
          <div class="icon-wrapper">
            <i class="fas fa-graduation-cap text-3xl"></i>
          </div>
          <h3>Education</h3>
          <p>Transform learning experiences</p>
          <span class="learn-more">Learn More <i class="fas fa-arrow-right ml-2"></i></span>
        </router-link>

        <router-link to="/chatbots/technology" class="industry-card">
          <div class="icon-wrapper">
            <i class="fas fa-microchip text-3xl"></i>
          </div>
          <h3>Technology</h3>
          <p>Accelerate digital innovation</p>
          <span class="learn-more">Learn More <i class="fas fa-arrow-right ml-2"></i></span>
        </router-link>

        <router-link to="/chatbots/manufacturing" class="industry-card">
          <div class="icon-wrapper">
            <i class="fas fa-industry text-3xl"></i>
          </div>
          <h3>Manufacturing</h3>
          <p>Optimize production processes</p>
          <span class="learn-more">Learn More <i class="fas fa-arrow-right ml-2"></i></span>
        </router-link>

        <router-link to="/chatbots/hospitality" class="industry-card">
          <div class="icon-wrapper">
            <i class="fas fa-hotel text-3xl"></i>
          </div>
          <h3>Hospitality</h3>
          <p>Elevate guest experiences</p>
          <span class="learn-more">Learn More <i class="fas fa-arrow-right ml-2"></i></span>
        </router-link>
      </div>
    </div>

    <div class="why-choose-us">
      <div class="section-content">
        <div class="section-icon">
          <i class="fas fa-award text-4xl mb-6 text-indigo-600"></i>
        </div>
        <h2 class="section-title">Why Choose Us?</h2>
        <p class="section-text">We don't just build chatbots – we build connections.</p>
        <div class="reasons-grid">
          <div class="reason-card">
            <div class="reason-icon">
              <i class="fas fa-industry text-3xl text-indigo-600"></i>
            </div>
            <h4>Industry Expertise</h4>
            <p>We understand your unique challenges</p>
          </div>
          <div class="reason-card">
            <div class="reason-icon">
              <i class="fas fa-brain text-3xl text-indigo-600"></i>
            </div>
            <h4>Advanced AI Technology</h4>
            <p>Cutting-edge solutions for modern needs</p>
          </div>
          <div class="reason-card">
            <div class="reason-icon">
              <i class="fas fa-heart text-3xl text-indigo-600"></i>
            </div>
            <h4>Customer-Centric Design</h4>
            <p>Built with your success in mind</p>
          </div>
        </div>
      </div>
    </div>

    <div class="chatbot-types mt-8 mb-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link
            v-for="type in chatbotTypes"
            :key="type.path"
            :to="type.path"
            class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <i :class="type.icon + ' text-3xl text-indigo-600 mb-4 block'"></i>
            <h3 class="text-xl font-semibold mb-2">{{ type.name }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ type.description }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-icon">
        <i class="fas fa-rocket text-6xl mb-8 text-yellow-300"></i>
      </div>
      <h2>Take the First Step Today</h2>
      <p>Your business has dreams, goals, and a mission. Let us help you achieve them.</p>
      <button class="cta-button">
        <i class="fas fa-paper-plane mr-2"></i>
        Contact Us Today
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chatbots',
  data() {
    return {
      features: [
        {
          title: '24/7 Availability',
          icon: 'fas fa-clock-rotate-left',
          description: 'Never miss a customer inquiry with round-the-clock service'
        },
        {
          title: 'Cost Reduction',
          icon: 'fas fa-chart-line-down',
          description: 'Reduce operational costs while maintaining quality'
        },
        {
          title: 'Increased Efficiency',
          icon: 'fas fa-gauge-high',
          description: 'Lightning-fast responses and automated workflows'
        },
        {
          title: 'Better Experience',
          icon: 'fas fa-face-smile-beam',
          description: 'Delightful interactions that keep customers coming back'
        }
      ],
      industries: [
        {
          id: 'retail',
          name: 'Retail & E-commerce',
          icon: 'fas fa-store-alt',
          description: 'Smart retail solutions for enhanced shopping experiences'
        },
        {
          id: 'healthcare',
          name: 'Healthcare',
          icon: 'fas fa-staff-snake',
          description: 'Intelligent healthcare assistance and patient support'
        },
        {
          id: 'financial',
          name: 'Financial Services',
          icon: 'fas fa-money-bill-transfer',
          description: 'Secure and efficient financial service automation'
        },
        {
          id: 'realestate',
          name: 'Real Estate',
          icon: 'fas fa-building-user',
          description: 'Property management and client service automation'
        },
        {
          id: 'professional',
          name: 'Professional Services',
          icon: 'fas fa-handshake-angle',
          description: 'Streamlined professional service delivery'
        },
        {
          id: 'hospitality',
          name: 'Hospitality',
          icon: 'fas fa-bell-concierge',
          description: 'Enhanced guest experiences and booking management'
        },
        {
          id: 'education',
          name: 'Education',
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
          name: 'Technology',
          icon: 'fas fa-microchip',
          description: 'Tech support and service automation'
        },
        {
          id: 'local',
          name: 'Local Services',
          icon: 'fas fa-shop',
          description: 'Local business and home service automation'
        }
      ],
      chatbotTypes: [
        {
          path: '/chatbots/technology',
          name: 'Technology Solutions',
          icon: 'fas fa-microchip',
          description: 'AI-powered solutions for technology companies'
        },
        {
          path: '/chatbots/education',
          name: 'Education Solutions',
          icon: 'fas fa-graduation-cap',
          description: 'Smart chatbots for educational institutions'
        },
        {
          path: '/chatbots/local',
          name: 'Local Business Solutions',
          icon: 'fas fa-store',
          description: 'Chatbot solutions for local businesses'
        }
      ],
      reasons: [
        {
          title: 'Reason 1',
          description: 'Description 1'
        },
        {
          title: 'Reason 2',
          description: 'Description 2'
        },
        {
          title: 'Reason 3',
          description: 'Description 3'
        }
      ]
    }
  }
}
</script>

<style scoped>
.chatbots-container {
  @apply px-4 py-12 max-w-7xl mx-auto space-y-24;
}

.hero-section {
  @apply text-center mb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-16 shadow-2xl;
  border-radius: 48px 48px 180px 48px;
}

.hero-content {
  @apply max-w-4xl mx-auto space-y-8;
}

.hero-icon {
  @apply text-center;
}

.hero-icon i {
  @apply transition-all duration-500;
  animation: float 3s ease-in-out infinite;
}

.hero-title {
  @apply text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 leading-tight;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  @apply text-xl md:text-2xl text-gray-200 leading-relaxed;
}

.hero-description {
  @apply text-lg text-gray-300 leading-relaxed;
}

.how-it-works {
  @apply bg-gradient-to-br from-indigo-100 to-purple-100 p-16 shadow-xl;
  border-radius: 180px 48px 48px 48px;
}

.section-content {
  @apply max-w-4xl mx-auto text-center space-y-8;
}

.section-icon {
  @apply text-center;
}

.section-icon i {
  @apply transition-all duration-300;
  animation: spin-slow 10s linear infinite;
}

.section-title {
  @apply text-4xl font-bold text-gray-800 mb-6;
}

.section-text {
  @apply text-xl text-gray-600 leading-relaxed;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto;
}

.feature-card {
  @apply bg-white p-8 shadow-xl text-center space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2;
  border-radius: 32px 32px 64px 32px;
}

.feature-icon-wrapper {
  @apply w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl transform -rotate-12;
  border-radius: 16px 16px 32px 16px;
}

.feature-icon-wrapper i {
  @apply transition-all duration-300;
}

.feature-card:hover .feature-icon-wrapper i {
  animation: bounce 1s ease infinite;
}

.industries-section {
  @apply py-16 space-y-12;
}

.industries-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.industry-card {
  @apply bg-white p-8 shadow-xl text-center space-y-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer;
  border-radius: 32px 32px 64px 32px;
}

.industry-icon-wrapper {
  @apply w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl transform -rotate-12;
  border-radius: 20px 20px 40px 20px;
}

.industry-icon-wrapper i {
  @apply transition-all duration-300;
}

.industry-card:hover .industry-icon-wrapper i {
  animation: pulse 1s ease infinite;
}

.industry-links-section {
  @apply py-16 px-4 max-w-7xl mx-auto;
}

.industry-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
}

.industry-card {
  @apply bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative overflow-hidden group;
  border-radius: 32px 32px 64px 32px;
}

.industry-card::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300;
}

.industry-card:hover::before {
  @apply opacity-100;
}

.icon-wrapper {
  @apply w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-6 transform -rotate-12 transition-transform duration-300;
}

.industry-card:hover .icon-wrapper {
  @apply rotate-0 scale-110;
}

.industry-card h3 {
  @apply text-xl font-bold text-gray-800 mb-2;
}

.industry-card p {
  @apply text-gray-600 mb-4;
}

.learn-more {
  @apply text-indigo-600 font-semibold flex items-center justify-center opacity-0 transform translate-y-2 transition-all duration-300;
}

.industry-card:hover .learn-more {
  @apply opacity-100 translate-y-0;
}

.why-choose-us {
  @apply bg-gradient-to-br from-purple-100 to-indigo-100 p-16 shadow-xl;
  border-radius: 48px 180px 48px 48px;
}

.reasons-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8 mt-12;
}

.reason-card {
  @apply bg-white/80 backdrop-blur-sm p-6 shadow-lg space-y-4;
  border-radius: 24px 24px 48px 24px;
}

.reason-icon {
  @apply text-center;
}

.reason-icon i {
  @apply transition-all duration-300;
}

.reason-card:hover .reason-icon i {
  animation: wiggle 1s ease infinite;
}

.cta-section {
  @apply text-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-16 shadow-2xl text-white space-y-8;
  border-radius: 180px 48px 48px 180px;
}

.cta-icon {
  @apply text-center;
}

.cta-icon i {
  animation: rocket 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes rocket {
  0%, 100% {
    transform: translateY(0) rotate(-45deg);
  }
  50% {
    transform: translateY(-10px) rotate(-45deg);
  }
}
</style>
