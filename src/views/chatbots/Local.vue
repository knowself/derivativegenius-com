<template>
  <div class="local-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <ChatbotBreadcrumb current-page="Local" />
    
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-black dark:text-white mb-6">
          Local Business Chatbot Solutions
        </h1>
        <p class="text-2xl text-black dark:text-white max-w-3xl mx-auto leading-relaxed">
          Empower your local business with AI-driven solutions that streamline operations,
          enhance customer service, and boost growth through intelligent automation.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="(feature, index) in features" 
             :key="index" 
             class="bg-white dark:bg-black rounded-lg p-8 shadow-xl">
          <i :class="feature.icon + ' text-5xl text-black dark:text-white mb-6'"></i>
          <h3 class="text-3xl font-bold mb-4 text-black dark:text-white">{{ feature.title }}</h3>
          <p class="text-black dark:text-white text-xl mb-6 leading-relaxed">{{ feature.description }}</p>
          <ul class="space-y-4">
            <li v-for="(point, pIndex) in feature.points" 
                :key="pIndex" 
                class="flex items-start">
              <i class="fas fa-check-circle text-black dark:text-white mt-1.5 mr-3"></i>
              <span class="text-black dark:text-white text-xl">{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-black text-white dark:bg-white dark:text-black rounded-lg p-12 text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to Transform Your Local Business?</h2>
        <p class="text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Join leading local businesses that have revolutionized their operations with our AI solutions.
        </p>
        <router-link 
          to="/contact" 
          class="inline-block bg-white text-black dark:bg-black dark:text-white px-8 py-4 rounded-lg font-bold text-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shadow-xl">
          Get Started
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ChatbotBreadcrumb from '@/components/ChatbotBreadcrumb.vue'

export default {
  name: 'Local',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      features: [
        {
          title: 'Customer Service Assistant',
          icon: 'fas fa-headset',
          description: 'Deliver exceptional 24/7 customer service with intelligent automated responses.',
          points: [
            'Instant query resolution and support',
            'Multi-channel communication handling',
            'Smart response system with learning',
            'Customer feedback and satisfaction tracking',
            'Automated issue escalation'
          ]
        },
        {
          title: 'Appointment Manager',
          icon: 'fas fa-calendar-check',
          description: 'Streamline scheduling and booking processes with intelligent automation.',
          points: [
            'Smart scheduling and availability management',
            'Automated reminders and confirmations',
            'Real-time calendar synchronization',
            'Customer preference tracking',
            'Follow-up communication automation'
          ]
        },
        {
          title: 'Sales Optimization',
          icon: 'fas fa-shopping-cart',
          description: 'Boost sales with AI-powered recommendations and customer insights.',
          points: [
            'Personalized product recommendations',
            'Intelligent upselling suggestions',
            'Customer behavior analysis',
            'Inventory-aware promotions',
            'Sales performance tracking'
          ]
        },
        {
          title: 'Operations Automation',
          icon: 'fas fa-cogs',
          description: 'Streamline daily operations with intelligent process automation.',
          points: [
            'Task scheduling and management',
            'Resource allocation optimization',
            'Process efficiency monitoring',
            'Automated reporting and analytics',
            'Workflow optimization suggestions'
          ]
        },
        {
          title: 'Marketing Intelligence',
          icon: 'fas fa-bullhorn',
          description: 'Enhance marketing campaigns with AI-driven customer engagement.',
          points: [
            'Campaign performance optimization',
            'Customer segmentation and targeting',
            'Social media engagement automation',
            'ROI tracking and analysis',
            'Content recommendation engine'
          ]
        },
        {
          title: 'Customer Loyalty',
          icon: 'fas fa-heart',
          description: 'Build lasting customer relationships with intelligent engagement.',
          points: [
            'Automated loyalty program management',
            'Personalized reward recommendations',
            'Customer engagement tracking',
            'Retention strategy optimization',
            'VIP customer identification'
          ]
        },
        {
          title: 'Inventory Management',
          icon: 'fas fa-boxes',
          description: 'Optimize inventory control with intelligent stock management.',
          points: [
            'Real-time stock monitoring',
            'Automated reordering system',
            'Demand prediction analytics',
            'Supplier management automation',
            'Inventory optimization suggestions'
          ]
        },
        {
          title: 'Payment Processing',
          icon: 'fas fa-credit-card',
          description: 'Streamline payment operations with secure, automated solutions.',
          points: [
            'Multi-payment method handling',
            'Automated invoice generation',
            'Secure transaction processing',
            'Payment reconciliation',
            'Financial reporting automation'
          ]
        },
        {
          title: 'Business Analytics',
          icon: 'fas fa-chart-line',
          description: 'Gain actionable insights with AI-powered business analytics.',
          points: [
            'Performance metrics tracking',
            'Trend analysis and forecasting',
            'Competitive intelligence gathering',
            'Custom report generation',
            'Growth opportunity identification'
          ]
        }
      ]
    }
  }
}
</script>
