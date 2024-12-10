<template>
  <div>
    <ChatbotBreadcrumb current-page="Technology" />
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
  name: 'Technology',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Technology AI Solutions',
        fullDescription: 'Accelerate innovation and enhance productivity with AI-powered chatbots that streamline development processes, automate IT operations, provide technical support, and improve product management across technology organizations.',
        useCases: [
          {
            title: 'Developer Assistant',
            icon: 'fas fa-code',
            description: 'Intelligent coding and development support',
            benefits: [
              'Code review automation',
              'API documentation generation',
              'Best practices suggestions',
              'Dependency management'
            ]
          },
          {
            title: 'DevOps Automation',
            icon: 'fas fa-infinity',
            description: 'Streamline CI/CD pipelines and infrastructure management',
            benefits: [
              'Automated deployment checks',
              'Infrastructure monitoring',
              'Pipeline optimization',
              'Security compliance automation'
            ]
          },
          {
            title: 'Technical Support Hub',
            icon: 'fas fa-headset',
            description: 'Intelligent customer support and issue resolution',
            benefits: [
              '24/7 technical assistance',
              'Automated troubleshooting',
              'Knowledge base integration',
              'Ticket prioritization'
            ]
          },
          {
            title: 'Cloud Resource Manager',
            icon: 'fas fa-cloud',
            description: 'Optimize cloud infrastructure and costs',
            benefits: [
              'Resource scaling automation',
              'Cost optimization alerts',
              'Performance monitoring',
              'Usage analytics'
            ]
          },
          {
            title: 'Security Operations Center',
            icon: 'fas fa-shield-alt',
            description: 'Enhanced cybersecurity monitoring and response',
            benefits: [
              'Threat detection automation',
              'Incident response coordination',
              'Security audit assistance',
              'Compliance monitoring'
            ]
          },
          {
            title: 'Product Analytics Assistant',
            icon: 'fas fa-chart-line',
            description: 'Data-driven product insights and optimization',
            benefits: [
              'User behavior analysis',
              'Feature usage tracking',
              'A/B testing automation',
              'Performance metrics'
            ]
          },
          {
            title: 'QA Testing Companion',
            icon: 'fas fa-vial',
            description: 'Automated testing and quality assurance',
            benefits: [
              'Test case generation',
              'Regression testing',
              'Bug reporting automation',
              'Test coverage analysis'
            ]
          },
          {
            title: 'API Management Bot',
            icon: 'fas fa-plug',
            description: 'Streamline API development and management',
            benefits: [
              'API documentation updates',
              'Version control assistance',
              'Usage monitoring',
              'Integration testing'
            ]
          },
          {
            title: 'Data Pipeline Assistant',
            icon: 'fas fa-database',
            description: 'Optimize data workflows and analytics',
            benefits: [
              'ETL process automation',
              'Data quality checks',
              'Pipeline monitoring',
              'Performance optimization'
            ]
          },
          {
            title: 'Tech Talent Manager',
            icon: 'fas fa-users-cog',
            description: 'Technical recruitment and team management',
            benefits: [
              'Skill assessment automation',
              'Technical interview assistance',
              'Team capacity planning',
              'Training recommendations'
            ]
          },
          {
            title: 'Release Manager',
            icon: 'fas fa-rocket',
            description: 'Streamline software release processes',
            benefits: [
              'Release schedule automation',
              'Change log generation',
              'Stakeholder communications',
              'Rollback coordination'
            ]
          },
          {
            title: 'Technical Documentation Bot',
            icon: 'fas fa-file-code',
            description: 'Automated technical documentation management',
            benefits: [
              'Documentation updates',
              'Code comment analysis',
              'Version tracking',
              'Search optimization'
            ]
          }
        ]
      }
    }
  }
}
</script>
