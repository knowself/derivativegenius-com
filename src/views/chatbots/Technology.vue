<template>
  <div class="technology-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <ChatbotBreadcrumb current-page="Technology" />
    
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-6">
          Technology Chatbot Solutions
        </h1>
        <p class="text-xl text-black dark:text-white max-w-3xl mx-auto leading-relaxed">
          Empower your tech company with AI-driven solutions that streamline development processes,
          enhance customer support, and boost team productivity through intelligent automation.
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
        <h2 class="text-3xl font-bold mb-6">Ready to Transform Your Tech Operations?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Join leading technology companies that have revolutionized their operations with our AI solutions.
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
  name: 'Technology',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      features: [
        {
          title: 'AI Development Assistant',
          icon: 'fas fa-code',
          description: 'Supercharge your development workflow with AI-powered code assistance and automation.',
          points: [
            'Intelligent code completion and suggestions',
            'Automated code review and quality checks',
            'Smart debugging assistance and error detection',
            'API integration recommendations',
            'Performance optimization suggestions'
          ]
        },
        {
          title: 'DevOps Automation',
          icon: 'fas fa-cogs',
          description: 'Streamline your DevOps processes with intelligent automation and monitoring.',
          points: [
            'Automated CI/CD pipeline optimization',
            'Infrastructure as Code (IaC) assistance',
            'Container orchestration management',
            'Deployment strategy recommendations',
            'Environment configuration automation'
          ]
        },
        {
          title: 'Technical Support Bot',
          icon: 'fas fa-headset',
          description: 'Provide instant, intelligent technical support to users and developers.',
          points: [
            '24/7 automated technical assistance',
            'Smart ticket routing and prioritization',
            'Knowledge base integration and updates',
            'Solution recommendation engine',
            'Escalation path automation'
          ]
        },
        {
          title: 'Cloud Resource Manager',
          icon: 'fas fa-cloud',
          description: 'Optimize your cloud infrastructure with AI-driven insights and automation.',
          points: [
            'Automated resource scaling',
            'Cost optimization recommendations',
            'Performance monitoring and alerts',
            'Security compliance checks',
            'Disaster recovery automation'
          ]
        },
        {
          title: 'QA & Testing Assistant',
          icon: 'fas fa-vial',
          description: 'Enhance your testing processes with AI-powered test automation.',
          points: [
            'Automated test case generation',
            'Regression testing optimization',
            'Test coverage analysis',
            'Bug pattern detection',
            'Performance testing automation'
          ]
        },
        {
          title: 'Project Management Bot',
          icon: 'fas fa-tasks',
          description: 'Streamline project management with intelligent task automation.',
          points: [
            'Sprint planning assistance',
            'Resource allocation optimization',
            'Progress tracking and reporting',
            'Risk assessment automation',
            'Team collaboration enhancement'
          ]
        },
        {
          title: 'Security Operations',
          icon: 'fas fa-shield-alt',
          description: 'Strengthen your security posture with AI-powered threat detection.',
          points: [
            'Real-time threat detection',
            'Security incident response',
            'Compliance monitoring automation',
            'Vulnerability assessment',
            'Access control management'
          ]
        },
        {
          title: 'API Management',
          icon: 'fas fa-plug',
          description: 'Simplify API development and management with intelligent automation.',
          points: [
            'API documentation generation',
            'Version control assistance',
            'Performance monitoring',
            'Usage analytics',
            'Integration testing automation'
          ]
        },
        {
          title: 'Data Pipeline Assistant',
          icon: 'fas fa-database',
          description: 'Optimize your data workflows with AI-powered automation.',
          points: [
            'ETL process automation',
            'Data quality monitoring',
            'Pipeline optimization',
            'Schema management',
            'Data governance automation'
          ]
        }
      ]
    }
  }
}
</script>
