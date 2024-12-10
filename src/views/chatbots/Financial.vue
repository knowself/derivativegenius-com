<template>
  <div>
    <ChatbotBreadcrumb current-page="Financial Services" />
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
  name: 'Financial',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Financial Services & Banking AI Solutions',
        fullDescription: 'Transform your financial services with AI-powered chatbots that enhance customer experience, improve security, and streamline operations while ensuring regulatory compliance.',
        useCases: [
          {
            title: 'Account Management Assistant',
            icon: 'fas fa-university',
            description: 'Intelligent account services and transaction support',
            benefits: [
              'Handle 90% of routine account inquiries',
              'Reduce customer service wait times by 60%',
              'Available 24/7 for account support',
              'Secure authentication process'
            ]
          },
          {
            title: 'Investment Advisory',
            icon: 'fas fa-chart-line',
            description: 'Personalized investment guidance and portfolio monitoring',
            benefits: [
              'Real-time portfolio insights',
              'Market trend analysis',
              'Risk assessment automation',
              'Custom investment recommendations'
            ]
          },
          {
            title: 'Fraud Detection & Alerts',
            icon: 'fas fa-shield-alt',
            description: 'Real-time transaction monitoring and fraud prevention',
            benefits: [
              'Instant suspicious activity detection',
              'Automated fraud alerts',
              'Reduce fraud losses by 40%',
              'Proactive security measures'
            ]
          },
          {
            title: 'Loan Processing Assistant',
            icon: 'fas fa-hand-holding-usd',
            description: 'Streamlined loan application and processing',
            benefits: [
              'Reduce application processing time by 70%',
              'Automated eligibility checks',
              'Improve approval accuracy',
              'Enhanced compliance'
            ]
          }
        ]
      }
    }
  }
}
</script>
