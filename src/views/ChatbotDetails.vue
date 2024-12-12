<template>
  <div class="chatbot-details-container min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4">
      <router-link to="/chatbots" class="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8">
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Solutions
      </router-link>

      <div v-if="segment" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div class="segment-number text-sm" :class="'text-' + segment.color + '-600 dark:text-' + segment.color + '-400'">
          #{{ segment.number }}
        </div>
        
        <div class="text-center mb-12">
          <i :class="segment.icon + ' text-6xl mb-6 text-' + segment.color + '-600'"></i>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ segment.name }}</h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">{{ segment.description }}</p>
        </div>

        <div class="space-y-8 mb-12">
          <div class="feature-section bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Key Features</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li v-for="(feature, index) in segment.features" 
                  :key="index"
                  class="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <i :class="'fas fa-check-circle text-' + segment.color + '-600 mt-1 mr-3'"></i>
                <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <div class="benefits-section bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Benefits</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li v-for="(benefit, index) in defaultBenefits" 
                  :key="index"
                  class="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <i :class="'fas fa-star text-' + segment.color + '-600 mt-1 mr-3'"></i>
                <span class="text-gray-700 dark:text-gray-300">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center">
          <router-link 
            to="/" 
            class="inline-block px-8 py-4 text-lg font-bold text-white rounded-lg transition-colors"
            :class="'bg-' + segment.color + '-600 hover:bg-' + segment.color + '-700'">
            Get Started with {{ segment.name }}
          </router-link>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600 dark:text-gray-300">Solution not found.</p>
        <router-link 
          to="/chatbots" 
          class="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
          Return to Solutions
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatbotDetails',
  data() {
    return {
      defaultBenefits: [
        'Increased efficiency and productivity',
        'Reduced operational costs',
        '24/7 availability and instant responses',
        'Scalable solution for growing needs',
        'Data-driven insights and analytics'
      ],
      segments: {
        // Technology Solutions (1-9)
        'ai-development': {
          number: 1,
          name: 'AI Development Assistant',
          description: 'Supercharge your development workflow with AI-powered code assistance and automation.',
          icon: 'fas fa-code',
          color: 'indigo',
          features: [
            'Intelligent code completion and suggestions',
            'Automated code review and quality checks',
            'Smart debugging assistance',
            'API integration recommendations',
            'Performance optimization suggestions'
          ]
        },
        'devops-automation': {
          number: 2,
          name: 'DevOps Automation',
          description: 'Streamline your deployment pipeline and infrastructure management with intelligent automation.',
          icon: 'fas fa-cogs',
          color: 'indigo',
          features: [
            'Automated deployment workflows',
            'Infrastructure as code management',
            'Container orchestration',
            'Service monitoring and alerts',
            'Resource optimization'
          ]
        },
        'cloud-management': {
          number: 3,
          name: 'Cloud Management',
          description: 'Optimize your cloud resources and costs with intelligent management solutions.',
          icon: 'fas fa-cloud',
          color: 'indigo',
          features: [
            'Resource utilization monitoring',
            'Cost optimization recommendations',
            'Auto-scaling management',
            'Security compliance checks',
            'Performance analytics'
          ]
        },
        'security-monitoring': {
          number: 4,
          name: 'Security Monitoring',
          description: 'Protect your systems with real-time threat detection and automated response.',
          icon: 'fas fa-shield-alt',
          color: 'indigo',
          features: [
            'Real-time threat detection',
            'Automated incident response',
            'Security compliance monitoring',
            'Vulnerability assessment',
            'Access control management'
          ]
        },
        'data-analytics': {
          number: 5,
          name: 'Data Analytics',
          description: 'Transform your data into actionable insights with intelligent analytics.',
          icon: 'fas fa-chart-line',
          color: 'indigo',
          features: [
            'Automated data processing',
            'Advanced visualization',
            'Predictive analytics',
            'Custom reporting',
            'Data integration'
          ]
        },
        'api-integration': {
          number: 6,
          name: 'API Integration',
          description: 'Seamlessly connect and manage your APIs with intelligent automation.',
          icon: 'fas fa-plug',
          color: 'indigo',
          features: [
            'API documentation',
            'Request/response monitoring',
            'Error handling',
            'Performance optimization',
            'Security management'
          ]
        },
        'testing-automation': {
          number: 7,
          name: 'Testing Automation',
          description: 'Enhance your quality assurance with automated testing solutions.',
          icon: 'fas fa-vial',
          color: 'indigo',
          features: [
            'Automated test generation',
            'Regression testing',
            'Performance testing',
            'Test reporting',
            'CI/CD integration'
          ]
        },
        'ci-cd': {
          number: 8,
          name: 'CI/CD Pipeline',
          description: 'Streamline your development pipeline with continuous integration and deployment.',
          icon: 'fas fa-sync',
          color: 'indigo',
          features: [
            'Automated builds',
            'Deployment automation',
            'Pipeline monitoring',
            'Version control integration',
            'Release management'
          ]
        },
        'tech-support': {
          number: 9,
          name: 'Technical Support',
          description: 'Provide 24/7 technical assistance with intelligent support automation.',
          icon: 'fas fa-headset',
          color: 'indigo',
          features: [
            'Issue tracking',
            'Knowledge base integration',
            'Ticket routing',
            'SLA monitoring',
            'Customer satisfaction tracking'
          ]
        },
        // Real Estate Solutions (10-15)
        'property-matching': {
          number: 10,
          name: 'Property Matching',
          description: 'Connect buyers with their ideal properties using AI-powered matching.',
          icon: 'fas fa-home',
          color: 'blue',
          features: [
            'Intelligent property recommendations',
            'Preference matching',
            'Virtual tours integration',
            'Market analysis',
            'Appointment scheduling'
          ]
        },
        'virtual-tours': {
          number: 11,
          name: 'Virtual Tours',
          description: 'Offer immersive property experiences with virtual tour automation.',
          icon: 'fas fa-vr-cardboard',
          color: 'blue',
          features: [
            '360° virtual tours',
            'Interactive floor plans',
            'Live virtual showings',
            'Tour scheduling',
            'Analytics tracking'
          ]
        },
        'market-analysis': {
          number: 12,
          name: 'Market Analysis',
          description: 'Make data-driven decisions with real-time market insights.',
          icon: 'fas fa-chart-bar',
          color: 'blue',
          features: [
            'Price trend analysis',
            'Competitive insights',
            'Market predictions',
            'Custom reporting',
            'Investment recommendations'
          ]
        },
        'lease-management': {
          number: 13,
          name: 'Lease Management',
          description: 'Streamline lease operations with intelligent automation.',
          icon: 'fas fa-file-contract',
          color: 'blue',
          features: [
            'Automated lease generation',
            'Payment tracking',
            'Renewal management',
            'Document storage',
            'Tenant communication'
          ]
        },
        'property-maintenance': {
          number: 14,
          name: 'Property Maintenance',
          description: 'Efficiently manage property maintenance with automated solutions.',
          icon: 'fas fa-tools',
          color: 'blue',
          features: [
            'Maintenance requests',
            'Vendor management',
            'Schedule tracking',
            'Cost monitoring',
            'Preventive maintenance'
          ]
        },
        'agent-support': {
          number: 15,
          name: 'Agent Support',
          description: 'Empower real estate agents with intelligent assistance.',
          icon: 'fas fa-user-tie',
          color: 'blue',
          features: [
            'Lead management',
            'Task automation',
            'Communication tools',
            'Performance tracking',
            'Resource access'
          ]
        },
        // Education Solutions (16-24)
        'student-support': {
          number: 16,
          name: 'Student Support',
          description: 'Provide 24/7 assistance for student success.',
          icon: 'fas fa-user-graduate',
          color: 'green',
          features: [
            'Academic guidance',
            'Resource access',
            'Question answering',
            'Schedule management',
            'Progress tracking'
          ]
        },
        'course-registration': {
          number: 17,
          name: 'Course Registration',
          description: 'Streamline course enrollment with automated assistance.',
          icon: 'fas fa-calendar-alt',
          color: 'green',
          features: [
            'Course recommendations',
            'Schedule planning',
            'Prerequisites checking',
            'Waitlist management',
            'Registration support'
          ]
        },
        'academic-advising': {
          number: 18,
          name: 'Academic Advising',
          description: 'Guide students with personalized academic support.',
          icon: 'fas fa-chalkboard-teacher',
          color: 'green',
          features: [
            'Course planning',
            'Degree tracking',
            'Career guidance',
            'Academic support',
            'Resource recommendations'
          ]
        },
        'library-services': {
          number: 19,
          name: 'Library Services',
          description: 'Enhance library access with digital assistance.',
          icon: 'fas fa-book',
          color: 'green',
          features: [
            'Resource search',
            'Citation assistance',
            'Research guidance',
            'Document access',
            'Study room booking'
          ]
        },
        'campus-info': {
          number: 20,
          name: 'Campus Information',
          description: 'Provide instant access to campus resources and information.',
          icon: 'fas fa-university',
          color: 'green',
          features: [
            'Facility information',
            'Event updates',
            'Directory access',
            'Navigation assistance',
            'Service locations'
          ]
        },
        'financial-aid': {
          number: 21,
          name: 'Financial Aid',
          description: 'Guide students through financial aid processes.',
          icon: 'fas fa-dollar-sign',
          color: 'green',
          features: [
            'Application assistance',
            'Document tracking',
            'Status updates',
            'Deadline reminders',
            'Resource guidance'
          ]
        },
        'study-groups': {
          number: 22,
          name: 'Study Groups',
          description: 'Facilitate collaborative learning with group coordination.',
          icon: 'fas fa-users',
          color: 'green',
          features: [
            'Group formation',
            'Schedule coordination',
            'Resource sharing',
            'Progress tracking',
            'Communication tools'
          ]
        },
        'exam-prep': {
          number: 23,
          name: 'Exam Preparation',
          description: 'Support students with exam preparation assistance.',
          icon: 'fas fa-tasks',
          color: 'green',
          features: [
            'Study planning',
            'Practice tests',
            'Resource access',
            'Progress tracking',
            'Time management'
          ]
        },
        'career-services': {
          number: 24,
          name: 'Career Services',
          description: 'Guide students in career development and job search.',
          icon: 'fas fa-briefcase',
          color: 'green',
          features: [
            'Resume review',
            'Job matching',
            'Interview prep',
            'Career guidance',
            'Employer connections'
          ]
        },
        // Local Business Solutions (25-33)
        'customer-service': {
          number: 25,
          name: 'Customer Service',
          description: 'Deliver exceptional customer support with 24/7 assistance.',
          icon: 'fas fa-headset',
          color: 'purple',
          features: [
            'Query resolution',
            'Order tracking',
            'Product support',
            'Feedback collection',
            'Issue escalation'
          ]
        },
        'appointment-scheduling': {
          number: 26,
          name: 'Appointment Scheduling',
          description: 'Streamline booking with automated scheduling.',
          icon: 'fas fa-calendar-check',
          color: 'purple',
          features: [
            'Online booking',
            'Reminder system',
            'Calendar management',
            'Staff coordination',
            'Resource allocation'
          ]
        },
        'inventory-management': {
          number: 27,
          name: 'Inventory Management',
          description: 'Optimize inventory with real-time tracking.',
          icon: 'fas fa-boxes',
          color: 'purple',
          features: [
            'Stock tracking',
            'Reorder automation',
            'Supplier management',
            'Analytics reporting',
            'Loss prevention'
          ]
        },
        'order-processing': {
          number: 28,
          name: 'Order Processing',
          description: 'Automate order handling and fulfillment.',
          icon: 'fas fa-shopping-cart',
          color: 'purple',
          features: [
            'Order tracking',
            'Payment processing',
            'Shipping coordination',
            'Status updates',
            'Return management'
          ]
        },
        'loyalty-programs': {
          number: 29,
          name: 'Loyalty Programs',
          description: 'Engage customers with automated loyalty rewards.',
          icon: 'fas fa-gift',
          color: 'purple',
          features: [
            'Point tracking',
            'Reward management',
            'Member communication',
            'Promotion automation',
            'Analytics reporting'
          ]
        },
        'marketing-automation': {
          number: 30,
          name: 'Marketing Automation',
          description: 'Streamline marketing with intelligent automation.',
          icon: 'fas fa-bullhorn',
          color: 'purple',
          features: [
            'Campaign management',
            'Lead nurturing',
            'Analytics tracking',
            'Content scheduling',
            'Performance reporting'
          ]
        },
        'feedback-management': {
          number: 31,
          name: 'Feedback Management',
          description: 'Collect and analyze customer feedback efficiently.',
          icon: 'fas fa-star',
          color: 'purple',
          features: [
            'Survey automation',
            'Sentiment analysis',
            'Response tracking',
            'Insight generation',
            'Action planning'
          ]
        },
        'employee-scheduling': {
          number: 32,
          name: 'Employee Scheduling',
          description: 'Optimize staff scheduling with automated management.',
          icon: 'fas fa-user-clock',
          color: 'purple',
          features: [
            'Shift planning',
            'Time tracking',
            'Availability management',
            'Coverage optimization',
            'Schedule communication'
          ]
        },
        'pos-integration': {
          number: 33,
          name: 'POS Integration',
          description: 'Streamline operations with POS system integration.',
          icon: 'fas fa-cash-register',
          color: 'purple',
          features: [
            'Transaction processing',
            'Inventory sync',
            'Sales reporting',
            'Employee tracking',
            'Customer management'
          ]
        }
      }
    }
  },
  computed: {
    segment() {
      const id = this.$route.params.id
      return this.segments[id] || null
    }
  }
}
</script>

<style scoped>
.chatbot-details-container {
  min-height: calc(100vh - 4rem);
}

.segment-number {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-weight: bold;
}
</style>
