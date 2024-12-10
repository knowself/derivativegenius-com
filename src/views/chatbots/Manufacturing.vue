<template>
  <div>
    <ChatbotBreadcrumb current-page="Manufacturing" />
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
  name: 'Manufacturing',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Manufacturing AI Solutions',
        fullDescription: 'Optimize production processes and enhance operational efficiency with AI-powered chatbots that streamline workflows, monitor equipment health, manage inventory, and ensure quality control across manufacturing facilities.',
        useCases: [
          {
            title: 'Production Supervisor',
            icon: 'fas fa-industry',
            description: 'Real-time production monitoring and control',
            benefits: [
              'Line performance tracking',
              'Production bottleneck detection',
              'Shift handover automation',
              'Output optimization alerts'
            ]
          },
          {
            title: 'Predictive Maintenance',
            icon: 'fas fa-tools',
            description: 'Equipment health monitoring and maintenance scheduling',
            benefits: [
              'Early failure detection',
              'Maintenance schedule optimization',
              'Spare parts inventory management',
              'Downtime reduction'
            ]
          },
          {
            title: 'Quality Control Assistant',
            icon: 'fas fa-check-circle',
            description: 'Automated quality assurance and defect detection',
            benefits: [
              'Real-time quality monitoring',
              'Defect pattern analysis',
              'Compliance verification',
              'Quality report automation'
            ]
          },
          {
            title: 'Supply Chain Manager',
            icon: 'fas fa-link',
            description: 'End-to-end supply chain optimization',
            benefits: [
              'Supplier performance tracking',
              'Order status monitoring',
              'Logistics coordination',
              'Inventory optimization'
            ]
          },
          {
            title: 'Safety Compliance Monitor',
            icon: 'fas fa-hard-hat',
            description: 'Workplace safety and compliance management',
            benefits: [
              'Safety protocol monitoring',
              'Incident reporting automation',
              'PPE compliance tracking',
              'Safety training coordination'
            ]
          },
          {
            title: 'Energy Efficiency Optimizer',
            icon: 'fas fa-bolt',
            description: 'Smart energy consumption management',
            benefits: [
              'Real-time energy monitoring',
              'Peak usage optimization',
              'Sustainability metrics',
              'Cost reduction strategies'
            ]
          },
          {
            title: 'Inventory Intelligence',
            icon: 'fas fa-boxes',
            description: 'Smart inventory and warehouse management',
            benefits: [
              'Stock level optimization',
              'Automated reordering',
              'Storage optimization',
              'Inventory tracking'
            ]
          },
          {
            title: 'Process Innovation Lab',
            icon: 'fas fa-flask',
            description: 'Manufacturing process optimization and innovation',
            benefits: [
              'Process efficiency analysis',
              'Innovation suggestions',
              'Waste reduction strategies',
              'Lean manufacturing support'
            ]
          },
          {
            title: 'Workforce Coordinator',
            icon: 'fas fa-users-cog',
            description: 'Staff scheduling and skill management',
            benefits: [
              'Shift planning automation',
              'Skill gap analysis',
              'Training coordination',
              'Performance tracking'
            ]
          },
          {
            title: 'Digital Twin Assistant',
            icon: 'fas fa-clone',
            description: 'Virtual manufacturing process simulation',
            benefits: [
              'Real-time process simulation',
              'What-if scenario analysis',
              'Performance optimization',
              'Risk assessment'
            ]
          },
          {
            title: 'Regulatory Compliance Bot',
            icon: 'fas fa-balance-scale',
            description: 'Manufacturing compliance and certification management',
            benefits: [
              'Standards compliance tracking',
              'Audit preparation',
              'Documentation management',
              'Certification renewals'
            ]
          },
          {
            title: 'Customer Order Manager',
            icon: 'fas fa-shopping-cart',
            description: 'Order processing and customer communication',
            benefits: [
              'Order status tracking',
              'Custom specifications handling',
              'Delivery coordination',
              'Customer updates automation'
            ]
          }
        ]
      }
    }
  }
}
</script>
