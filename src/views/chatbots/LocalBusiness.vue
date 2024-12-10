<template>
  <div>
    <ChatbotBreadcrumb current-page="Local Business" />
    <div class="chatbot-industry-page">
      <h1>{{ industryData.name }}</h1>
      <p class="industry-description">{{ industryData.fullDescription }}</p>
      
      <div class="use-cases-grid">
        <div v-for="useCase in industryData.useCases" :key="useCase.title" class="use-case-card">
          <div class="use-case-icon">
            <i :class="useCase.icon"></i>
          </div>
          <h3>{{ useCase.title }}</h3>
          <p>{{ useCase.description }}</p>
          <ul class="benefits-list">
            <li v-for="benefit in useCase.benefits" :key="benefit">{{ benefit }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatbotBreadcrumb from '@/components/ChatbotBreadcrumb.vue'
import '@/assets/styles/chatbot-industry.css'

export default {
  name: 'LocalBusiness',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Local Business AI Solutions',
        fullDescription: 'Empower local businesses with AI-powered chatbots that enhance customer service, streamline operations, boost engagement, and drive growth while maintaining that personal, community-focused touch that makes local businesses special.',
        useCases: [
          {
            title: 'Appointment Scheduler',
            icon: 'fas fa-calendar-check',
            description: 'Smart booking and appointment management',
            benefits: [
              'Reduce scheduling time by 80%',
              '24/7 booking availability',
              'Automated reminders',
              'Calendar integration'
            ]
          },
          {
            title: 'Customer Service Assistant',
            icon: 'fas fa-headset',
            description: 'Intelligent customer support and FAQ handling',
            benefits: [
              'Answer common questions instantly',
              'Route complex inquiries to staff',
              'Collect customer feedback',
              'Personalized responses'
            ]
          },
          {
            title: 'Inventory Manager',
            icon: 'fas fa-boxes',
            description: 'Real-time inventory tracking and management',
            benefits: [
              'Automated stock alerts',
              'Sales trend analysis',
              'Supplier order automation',
              'Waste reduction'
            ]
          },
          {
            title: 'Marketing Campaign Assistant',
            icon: 'fas fa-bullhorn',
            description: 'Smart marketing automation and engagement',
            benefits: [
              'Personalized promotions',
              'Social media management',
              'Campaign performance tracking',
              'Customer segmentation'
            ]
          },
          {
            title: 'Payment Processing Bot',
            icon: 'fas fa-credit-card',
            description: 'Secure payment handling and invoicing',
            benefits: [
              'Multiple payment methods',
              'Automated invoicing',
              'Payment reminders',
              'Transaction history'
            ]
          },
          {
            title: 'Local SEO Optimizer',
            icon: 'fas fa-map-marker-alt',
            description: 'Local search optimization and reputation management',
            benefits: [
              'Improve local rankings',
              'Monitor online reviews',
              'Update business listings',
              'Location-based marketing'
            ]
          },
          {
            title: 'Staff Management Helper',
            icon: 'fas fa-users',
            description: 'Employee scheduling and task management',
            benefits: [
              'Automated shift scheduling',
              'Time-off management',
              'Task assignment',
              'Performance tracking'
            ]
          },
          {
            title: 'Customer Loyalty Program',
            icon: 'fas fa-star',
            description: 'Automated rewards and loyalty management',
            benefits: [
              'Points tracking system',
              'Personalized rewards',
              'Birthday specials',
              'VIP customer recognition'
            ]
          }
        ]
      }
    }
  }
}
</script>
