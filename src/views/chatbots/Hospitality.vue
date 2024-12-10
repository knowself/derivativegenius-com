<template>
  <div>
    <ChatbotBreadcrumb current-page="Hospitality" />
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
  name: 'Hospitality',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Hospitality & Tourism AI Solutions',
        fullDescription: 'Elevate guest experiences and streamline operations with AI-powered chatbots that provide personalized service, automate routine tasks, and enhance customer satisfaction across hotels, resorts, restaurants, and tourism businesses.',
        useCases: [
          {
            title: 'Smart Booking Assistant',
            icon: 'fas fa-calendar-check',
            description: 'Intelligent reservation management and personalization',
            benefits: [
              'Multi-platform booking integration',
              'Smart room recommendations',
              'Dynamic pricing optimization',
              'Group booking coordination'
            ]
          },
          {
            title: 'Virtual Concierge',
            icon: 'fas fa-concierge-bell',
            description: 'Personalized guest services and recommendations',
            benefits: [
              'Local attraction suggestions',
              'Restaurant reservations',
              'Transportation arrangements',
              'Activity bookings'
            ]
          },
          {
            title: 'Room Service Manager',
            icon: 'fas fa-utensils',
            description: 'Streamlined in-room dining and amenity requests',
            benefits: [
              'Digital menu navigation',
              'Dietary preference tracking',
              'Order status updates',
              'Special requests handling'
            ]
          },
          {
            title: 'Housekeeping Coordinator',
            icon: 'fas fa-broom',
            description: 'Efficient housekeeping and maintenance management',
            benefits: [
              'Room status tracking',
              'Service request prioritization',
              'Inventory management',
              'Quality inspection reports'
            ]
          },
          {
            title: 'Guest Experience Enhancer',
            icon: 'fas fa-star',
            description: 'Proactive guest satisfaction management',
            benefits: [
              'Personalized welcome messages',
              'Special occasion recognition',
              'Real-time feedback handling',
              'Guest preference learning'
            ]
          },
          {
            title: 'Event Planner Assistant',
            icon: 'fas fa-glass-cheers',
            description: 'Comprehensive event and conference management',
            benefits: [
              'Venue space optimization',
              'Catering coordination',
              'AV equipment scheduling',
              'Event staff allocation'
            ]
          },
          {
            title: 'Loyalty Program Manager',
            icon: 'fas fa-award',
            description: 'Smart loyalty program administration',
            benefits: [
              'Points tracking automation',
              'Personalized rewards',
              'Member tier management',
              'Exclusive offer distribution'
            ]
          },
          {
            title: 'Travel Experience Curator',
            icon: 'fas fa-globe',
            description: 'Customized travel planning and experiences',
            benefits: [
              'Itinerary customization',
              'Weather-based planning',
              'Cultural experience matching',
              'Travel tips and guides'
            ]
          },
          {
            title: 'Restaurant Operations Bot',
            icon: 'fas fa-hamburger',
            description: 'Restaurant service and kitchen coordination',
            benefits: [
              'Table management',
              'Order coordination',
              'Kitchen communication',
              'Dietary tracking'
            ]
          },
          {
            title: 'Spa & Wellness Coordinator',
            icon: 'fas fa-spa',
            description: 'Spa and wellness service management',
            benefits: [
              'Treatment scheduling',
              'Therapist allocation',
              'Package customization',
              'Post-treatment feedback'
            ]
          },
          {
            title: 'Revenue Optimization System',
            icon: 'fas fa-chart-line',
            description: 'Smart revenue and pricing management',
            benefits: [
              'Dynamic rate adjustment',
              'Occupancy optimization',
              'Market demand analysis',
              'Competition monitoring'
            ]
          },
          {
            title: 'Sustainability Manager',
            icon: 'fas fa-leaf',
            description: 'Eco-friendly operations and guest engagement',
            benefits: [
              'Energy usage optimization',
              'Waste reduction tracking',
              'Green initiative promotion',
              'Sustainable supplier management'
            ]
          }
        ]
      }
    }
  }
}
</script>
