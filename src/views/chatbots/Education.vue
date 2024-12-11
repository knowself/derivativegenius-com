<template>
  <div class="education-container bg-gray-50 dark:bg-gray-900 min-h-screen">
    <ChatbotBreadcrumb current-page="Education" />
    
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-black dark:text-white mb-6">
          Education Chatbot Solutions
        </h1>
        <p class="text-xl text-black dark:text-white max-w-3xl mx-auto leading-relaxed">
          Transform learning experiences with AI-powered chatbots.
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
        <h2 class="text-3xl font-bold mb-6">Ready to Transform Your Educational Institution?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Join leading educational institutions that have revolutionized their operations with our AI solutions.
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
  name: 'Education',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      features: [
        {
          title: 'Student Support Assistant',
          icon: 'fas fa-user-graduate',
          description: 'Provide 24/7 personalized support for students.',
          points: [
            'Course registration assistance',
            'Financial aid information',
            'Campus resources and services'
          ]
        },
        {
          title: 'Learning Management',
          icon: 'fas fa-chalkboard-teacher',
          description: 'Enhance the learning experience with AI-powered tools.',
          points: [
            'Personalized learning paths',
            'Progress tracking',
            'Interactive study materials'
          ]
        },
        {
          title: 'Administrative Automation',
          icon: 'fas fa-cogs',
          description: 'Streamline administrative tasks efficiently.',
          points: [
            'Enrollment automation',
            'Document processing',
            'Schedule management'
          ]
        },
        {
          title: 'Faculty Assistant',
          icon: 'fas fa-users',
          description: 'Support faculty with course management tools.',
          points: [
            'Grade management',
            'Course content organization',
            'Student performance tracking'
          ]
        },
        {
          title: 'Parent Communication',
          icon: 'fas fa-comments',
          description: 'Keep parents informed and engaged.',
          points: [
            'Progress updates',
            'Event announcements',
            'Meeting scheduling'
          ]
        },
        {
          title: 'Library Services',
          icon: 'fas fa-book',
          description: 'Modernize library services with AI assistance.',
          points: [
            'Resource discovery',
            'Reservation management',
            'Research assistance'
          ]
        },
        {
          title: 'Career Services',
          icon: 'fas fa-briefcase',
          description: 'Support student career development.',
          points: [
            'Career guidance',
            'Resume assistance',
            'Job matching'
          ]
        },
        {
          title: 'Campus Life Support',
          icon: 'fas fa-university',
          description: 'Enhance campus life experience.',
          points: [
            'Housing assistance',
            'Event information',
            'Transportation services'
          ]
        },
        {
          title: 'International Student Support',
          icon: 'fas fa-globe',
          description: 'Provide specialized assistance for international students.',
          points: [
            'Visa support',
            'Cultural resources',
            'Language assistance'
          ]
        }
      ]
    }
  }
}
</script>
