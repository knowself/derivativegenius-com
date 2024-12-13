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
      </div>
    </div>

    <div class="market-segments-grid mt-16 mb-24">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-12">
          <h2 class="text-4xl font-bold text-center mb-4">AI-Powered Chatbot Solutions</h2>
          <p class="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive suite of intelligent chatbot solutions designed for various industries and use cases.
          </p>
        </div>
        
        <div class="grid grid-cols-1 gap-12">
          <!-- Technology Solutions -->
          <section class="technology-solutions">
            <h2 class="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              <i class="fas fa-microchip mr-3"></i>Technology Solutions
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="segment in technologySegments" 
                   :key="segment.id" 
                   class="segment-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="segment-number text-sm text-blue-600 dark:text-blue-400 mb-2">
                  #{{ segment.number }}
                </div>
                <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">{{ segment.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ segment.description }}</p>
                <p class="text-base text-center text-gray-500 dark:text-gray-400 mb-3">Click below to learn more</p>
                <router-link 
                  :to="{ name: 'chatbot-details', params: { id: segment.id }}"
                  class="block text-center">
                  <i :class="segment.detailIcon + ' text-4xl text-blue-600 hover:text-blue-700 transition-colors'"></i>
                </router-link>
              </div>
            </div>
          </section>

          <!-- Real Estate Solutions -->
          <section class="real-estate-solutions">
            <h2 class="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              <i class="fas fa-home mr-3"></i>Real Estate Solutions
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="segment in realEstateSegments" 
                   :key="segment.id" 
                   class="segment-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="segment-number text-sm text-blue-600 dark:text-blue-400 mb-2">
                  #{{ segment.number }}
                </div>
                <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">{{ segment.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ segment.description }}</p>
                <p class="text-base text-center text-gray-500 dark:text-gray-400 mb-3">Click below to learn more</p>
                <router-link 
                  :to="{ name: 'chatbot-details', params: { id: segment.id }}"
                  class="block text-center">
                  <i :class="segment.detailIcon + ' text-4xl text-blue-600 hover:text-blue-700 transition-colors'"></i>
                </router-link>
              </div>
            </div>
          </section>

          <!-- Education Solutions -->
          <section class="education-solutions">
            <h2 class="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              <i class="fas fa-graduation-cap mr-3"></i>Education Solutions
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="segment in educationSegments" 
                   :key="segment.id" 
                   class="segment-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="segment-number text-sm text-blue-600 dark:text-blue-400 mb-2">
                  #{{ segment.number }}
                </div>
                <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">{{ segment.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ segment.description }}</p>
                <p class="text-base text-center text-gray-500 dark:text-gray-400 mb-3">Click below to learn more</p>
                <router-link 
                  :to="{ name: 'chatbot-details', params: { id: segment.id }}"
                  class="block text-center">
                  <i :class="segment.detailIcon + ' text-4xl text-blue-600 hover:text-blue-700 transition-colors'"></i>
                </router-link>
              </div>
            </div>
          </section>

          <!-- Local Business Solutions -->
          <section class="local-business-solutions">
            <h2 class="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
              <i class="fas fa-store mr-3"></i>Local Business Solutions
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="segment in localBusinessSegments" 
                   :key="segment.id" 
                   class="segment-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="segment-number text-sm text-blue-600 dark:text-blue-400 mb-2">
                  #{{ segment.number }}
                </div>
                <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">{{ segment.name }}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ segment.description }}</p>
                <p class="text-base text-center text-gray-500 dark:text-gray-400 mb-3">Click below to learn more</p>
                <router-link 
                  :to="{ name: 'chatbot-details', params: { id: segment.id }}"
                  class="block text-center">
                  <i :class="segment.detailIcon + ' text-4xl text-blue-600 hover:text-blue-700 transition-colors'"></i>
                </router-link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-icon">
        <i class="fas fa-rocket text-6xl mb-8 text-yellow-300"></i>
      </div>
      <h2>Take the First Step Today</h2>
      <p>Your business has dreams, goals, and a mission. Let us help you achieve them.</p>
      <router-link to="/contact" class="cta-button">
        <i class="fas fa-paper-plane mr-2"></i>
        Contact Us Today
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chatbots',
  data() {
    return {
      technologySegments: [
        {
          id: 'ai-development',
          number: 1,
          name: 'AI Development Assistant',
          description: 'Intelligent coding assistance and automation for developers',
          icon: 'fas fa-code',
          detailIcon: 'fas fa-laptop-code',
          color: 'blue'
        },
        {
          id: 'devops-automation',
          number: 2,
          name: 'DevOps Automation',
          description: 'Streamline deployment and infrastructure management',
          icon: 'fas fa-cogs',
          detailIcon: 'fas fa-server',
          color: 'blue'
        },
        {
          id: 'cloud-management',
          number: 3,
          name: 'Cloud Management',
          description: 'Optimize cloud resources and cost management',
          icon: 'fas fa-cloud',
          detailIcon: 'fas fa-cloud-upload-alt',
          color: 'blue'
        },
        {
          id: 'security-monitoring',
          number: 4,
          name: 'Security Monitoring',
          description: 'Real-time threat detection and response',
          icon: 'fas fa-shield-alt',
          detailIcon: 'fas fa-user-shield',
          color: 'blue'
        },
        {
          id: 'data-analytics',
          number: 5,
          name: 'Data Analytics',
          description: 'Intelligent data processing and visualization',
          icon: 'fas fa-chart-line',
          detailIcon: 'fas fa-database',
          color: 'blue'
        },
        {
          id: 'api-integration',
          number: 6,
          name: 'API Integration',
          description: 'Seamless API management and integration',
          icon: 'fas fa-plug',
          detailIcon: 'fas fa-network-wired',
          color: 'blue'
        },
        {
          id: 'testing-automation',
          number: 7,
          name: 'Testing Automation',
          description: 'Automated testing and quality assurance',
          icon: 'fas fa-vial',
          detailIcon: 'fas fa-check-circle',
          color: 'blue'
        },
        {
          id: 'ci-cd',
          number: 8,
          name: 'CI/CD Pipeline',
          description: 'Continuous integration and deployment automation',
          icon: 'fas fa-sync',
          detailIcon: 'fas fa-code-branch',
          color: 'blue'
        },
        {
          id: 'tech-support',
          number: 9,
          name: 'Technical Support',
          description: '24/7 technical assistance and troubleshooting',
          icon: 'fas fa-headset',
          detailIcon: 'fas fa-life-ring',
          color: 'blue'
        }
      ],
      realEstateSegments: [
        {
          id: 'property-matching',
          number: 10,
          name: 'Property Matching',
          description: 'AI-powered property recommendations',
          icon: 'fas fa-home',
          detailIcon: 'fas fa-search-location',
          color: 'blue'
        },
        {
          id: 'virtual-tours',
          number: 11,
          name: 'Virtual Tours',
          description: 'Interactive virtual property tours',
          icon: 'fas fa-vr-cardboard',
          detailIcon: 'fas fa-street-view',
          color: 'blue'
        },
        {
          id: 'market-analysis',
          number: 12,
          name: 'Market Analysis',
          description: 'Real-time market insights and trends',
          icon: 'fas fa-chart-bar',
          detailIcon: 'fas fa-chart-bar',
          color: 'blue'
        },
        {
          id: 'lease-management',
          number: 13,
          name: 'Lease Management',
          description: 'Automated lease processing and tracking',
          icon: 'fas fa-file-contract',
          detailIcon: 'fas fa-file-signature',
          color: 'blue'
        },
        {
          id: 'property-maintenance',
          number: 14,
          name: 'Property Maintenance',
          description: 'Maintenance request handling and scheduling',
          icon: 'fas fa-tools',
          detailIcon: 'fas fa-wrench',
          color: 'blue'
        },
        {
          id: 'agent-support',
          number: 15,
          name: 'Agent Support',
          description: 'Real estate agent assistance and coordination',
          icon: 'fas fa-user-tie',
          detailIcon: 'fas fa-id-badge',
          color: 'blue'
        }
      ],
      educationSegments: [
        {
          id: 'student-support',
          number: 16,
          name: 'Student Support',
          description: '24/7 student assistance and guidance',
          icon: 'fas fa-user-graduate',
          detailIcon: 'fas fa-graduation-cap',
          color: 'blue'
        },
        {
          id: 'course-registration',
          number: 17,
          name: 'Course Registration',
          description: 'Automated course enrollment and scheduling',
          icon: 'fas fa-calendar-alt',
          detailIcon: 'fas fa-calendar-check',
          color: 'blue'
        },
        {
          id: 'academic-advising',
          number: 18,
          name: 'Academic Advising',
          description: 'Personalized academic guidance',
          icon: 'fas fa-chalkboard-teacher',
          detailIcon: 'fas fa-user-friends',
          color: 'blue'
        },
        {
          id: 'library-services',
          number: 19,
          name: 'Library Services',
          description: 'Digital library assistance and research support',
          icon: 'fas fa-book',
          detailIcon: 'fas fa-books',
          color: 'blue'
        },
        {
          id: 'campus-info',
          number: 20,
          name: 'Campus Information',
          description: 'Campus resources and facilities information',
          icon: 'fas fa-university',
          detailIcon: 'fas fa-info-circle',
          color: 'blue'
        },
        {
          id: 'financial-aid',
          number: 21,
          name: 'Financial Aid',
          description: 'Financial aid guidance and processing',
          icon: 'fas fa-dollar-sign',
          detailIcon: 'fas fa-hand-holding-usd',
          color: 'blue'
        },
        {
          id: 'study-groups',
          number: 22,
          name: 'Study Groups',
          description: 'Study group coordination and management',
          icon: 'fas fa-users',
          detailIcon: 'fas fa-user-friends',
          color: 'blue'
        },
        {
          id: 'exam-prep',
          number: 23,
          name: 'Exam Preparation',
          description: 'Exam scheduling and preparation assistance',
          icon: 'fas fa-tasks',
          detailIcon: 'fas fa-clipboard-check',
          color: 'blue'
        },
        {
          id: 'career-services',
          number: 24,
          name: 'Career Services',
          description: 'Career guidance and job placement support',
          icon: 'fas fa-briefcase',
          detailIcon: 'fas fa-handshake',
          color: 'blue'
        }
      ],
      localBusinessSegments: [
        {
          id: 'customer-service',
          number: 25,
          name: 'Customer Service',
          description: '24/7 customer support and assistance',
          icon: 'fas fa-headset',
          detailIcon: 'fas fa-comments',
          color: 'blue'
        },
        {
          id: 'appointment-scheduling',
          number: 26,
          name: 'Appointment Scheduling',
          description: 'Automated appointment booking and management',
          icon: 'fas fa-calendar-check',
          detailIcon: 'fas fa-clock',
          color: 'blue'
        },
        {
          id: 'inventory-management',
          number: 27,
          name: 'Inventory Management',
          description: 'Real-time inventory tracking and alerts',
          icon: 'fas fa-boxes',
          detailIcon: 'fas fa-warehouse',
          color: 'blue'
        },
        {
          id: 'order-processing',
          number: 28,
          name: 'Order Processing',
          description: 'Automated order handling and fulfillment',
          icon: 'fas fa-shopping-cart',
          detailIcon: 'fas fa-truck',
          color: 'blue'
        },
        {
          id: 'loyalty-programs',
          number: 29,
          name: 'Loyalty Programs',
          description: 'Customer loyalty tracking and rewards',
          icon: 'fas fa-gift',
          detailIcon: 'fas fa-medal',
          color: 'blue'
        },
        {
          id: 'marketing-automation',
          number: 30,
          name: 'Marketing Automation',
          description: 'Automated marketing campaigns and analytics',
          icon: 'fas fa-bullhorn',
          detailIcon: 'fas fa-chart-line',
          color: 'blue'
        },
        {
          id: 'feedback-management',
          number: 31,
          name: 'Feedback Management',
          description: 'Customer feedback collection and analysis',
          icon: 'fas fa-star',
          detailIcon: 'fas fa-clipboard-list',
          color: 'blue'
        },
        {
          id: 'employee-scheduling',
          number: 32,
          name: 'Employee Scheduling',
          description: 'Staff scheduling and shift management',
          icon: 'fas fa-user-clock',
          detailIcon: 'fas fa-calendar-alt',
          color: 'blue'
        },
        {
          id: 'pos-integration',
          number: 33,
          name: 'POS Integration',
          description: 'Point of sale system integration',
          icon: 'fas fa-cash-register',
          detailIcon: 'fas fa-receipt',
          color: 'blue'
        }
      ]
    }
  }
}
</script>

<style scoped>
.chatbots-container {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900;
}

.hero-section {
  @apply bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-20 px-4;
}

.hero-content {
  @apply max-w-4xl mx-auto text-center;
}

.hero-icon {
  @apply flex justify-center;
}

.hero-title {
  @apply text-4xl md:text-5xl font-bold mb-8;
}

.hero-subtitle {
  @apply text-xl mb-6 leading-relaxed;
}

.market-segments-grid {
  @apply py-16;
}

.segment-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.segment-icon {
  @apply flex justify-center items-center mb-4;
  height: 80px;
}

.segment-icon i {
  font-size: 2.5rem;
}

.segment-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.cta-section {
  @apply bg-gradient-to-b from-indigo-800 to-indigo-900 text-white py-20 px-4 text-center;
}

.cta-button {
  @apply inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-xl 
         hover:bg-yellow-400 transition-colors mt-8;
}
</style>
