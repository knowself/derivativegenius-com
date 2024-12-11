<template>
  <div class="real-estate-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <ChatbotBreadcrumb current-page="Real Estate" />
    
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-6">
          Real Estate Chatbot Solutions
        </h1>
        <p class="text-xl text-black dark:text-white max-w-3xl mx-auto leading-relaxed">
          Transform your real estate business with AI-powered chatbots that streamline property management, 
          enhance client interactions, and drive more sales through intelligent automation.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div v-for="(feature, index) in features" 
             :key="index" 
             class="bg-white dark:bg-black rounded-lg p-8 shadow-xl">
          <i :class="feature.icon + ' text-4xl text-black dark:text-white mb-6'"></i>
          <h3 class="text-2xl font-bold mb-4 text-black dark:text-white">{{ feature.title }}</h3>
          <p class="text-black dark:text-white text-lg mb-6 leading-relaxed">{{ feature.description }}</p>
          <ul class="space-y-4">
            <li v-for="(point, pIndex) in feature.points" 
                :key="pIndex" 
                class="flex items-start">
              <i class="fas fa-check-circle text-black dark:text-white mt-1.5 mr-3"></i>
              <span class="text-black dark:text-white text-lg">{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-black text-white dark:bg-white dark:text-black rounded-lg p-12 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Transform Your Real Estate Business?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Start automating your property management and sales processes today with our intelligent chatbot solutions.
        </p>
        <router-link 
          to="/contact" 
          class="inline-block bg-white text-black dark:bg-black dark:text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shadow-xl">
          Get Started
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ChatbotBreadcrumb from '@/components/ChatbotBreadcrumb.vue'

export default {
  name: 'RealEstate',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      features: [
        {
          title: 'Property Matching',
          icon: 'fas fa-home',
          description: 'Automatically match properties with potential buyers based on preferences and requirements.',
          points: [
            'AI-powered property recommendations',
            'Real-time market analysis',
            'Automated property alerts',
            'Smart filtering system'
          ]
        },
        {
          title: 'Lead Management',
          icon: 'fas fa-user-check',
          description: 'Qualify and nurture leads automatically with intelligent conversation flows.',
          points: [
            'Automated lead qualification',
            'Intelligent follow-up sequences',
            'Lead scoring and prioritization',
            'Integration with CRM systems'
          ]
        },
        {
          title: 'Viewing Automation',
          icon: 'fas fa-calendar-check',
          description: 'Streamline the property viewing process with automated scheduling and follow-ups.',
          points: [
            'Smart scheduling system',
            'Automated reminders',
            'Virtual tour coordination',
            'Feedback collection'
          ]
        },
        {
          title: 'Market Intelligence',
          icon: 'fas fa-chart-line',
          description: 'Provide real-time market insights and property valuations.',
          points: [
            'Automated market analysis',
            'Price trend predictions',
            'Neighborhood insights',
            'Investment opportunities'
          ]
        },
        {
          title: 'Document Management',
          icon: 'fas fa-file-contract',
          description: 'Automate document handling and contract processes.',
          points: [
            'Smart document processing',
            'Contract automation',
            'E-signature integration',
            'Document organization'
          ]
        },
        {
          title: 'Client Communication',
          icon: 'fas fa-comments',
          description: 'Maintain consistent communication with clients through automated messaging.',
          points: [
            '24/7 inquiry handling',
            'Multilingual support',
            'Personalized updates',
            'Feedback management'
          ]
        }
      ]
    }
  }
}
</script>
