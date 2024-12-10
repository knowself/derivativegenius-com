<template>
  <div>
    <ChatbotBreadcrumb current-page="Retail" />
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
  name: 'Retail',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Retail AI Solutions',
        fullDescription: 'Transform your retail business with AI-powered chatbots that enhance customer experience and drive sales.',
        useCases: [
          {
            title: 'Product Recommendations',
            icon: 'fas fa-tags',
            description: 'Personalized product suggestions based on customer preferences and browsing history',
            benefits: [
              'Increase average order value by 25%',
              'Improve customer satisfaction',
              'Boost repeat purchases'
            ]
          },
          {
            title: 'Inventory Management',
            icon: 'fas fa-box',
            description: 'Real-time inventory tracking and automated reordering',
            benefits: [
              'Reduce stockouts by 40%',
              'Optimize inventory levels',
              'Lower carrying costs'
            ]
          },
          {
            title: '24/7 Customer Support',
            icon: 'fas fa-headset',
            description: 'Round-the-clock automated customer service',
            benefits: [
              'Handle 80% of common queries',
              'Instant response times',
              'Reduce support costs'
            ]
          },
          {
            title: 'Order Tracking',
            icon: 'fas fa-shipping-fast',
            description: 'Automated order status updates and delivery tracking',
            benefits: [
              'Reduce "where is my order" queries',
              'Improve customer satisfaction',
              'Lower support workload'
            ]
          },
          {
            title: 'Price Monitoring',
            icon: 'fas fa-chart-line',
            description: 'Competitive price tracking and dynamic pricing',
            benefits: [
              'Optimize pricing strategy',
              'Increase profit margins',
              'Stay competitive'
            ]
          }
        ]
      }
    }
  }
}
</script>
