<template>
  <div>
    <ChatbotBreadcrumb current-page="Education" />
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
  name: 'Education',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Education AI Solutions',
        fullDescription: 'Transform learning experiences with AI-powered chatbots that provide personalized support, streamline administrative tasks, and enhance engagement for students, educators, and administrators across all educational levels.',
        useCases: [
          {
            title: 'Student Support Assistant',
            icon: 'fas fa-graduation-cap',
            description: '24/7 academic guidance and support',
            benefits: [
              'Answer 90% of common questions',
              'Reduce support wait times by 75%',
              'Personalized learning paths',
              'Multi-language assistance'
            ]
          },
          {
            title: 'Homework Helper',
            icon: 'fas fa-book-reader',
            description: 'Interactive homework assistance and study guidance',
            benefits: [
              'Step-by-step problem solving',
              'Subject-specific resources',
              'Practice exercises generation',
              'Progress tracking'
            ]
          },
          {
            title: 'Course Registration Bot',
            icon: 'fas fa-calendar-plus',
            description: 'Streamlined course enrollment and scheduling',
            benefits: [
              'Real-time class availability',
              'Prerequisites verification',
              'Schedule conflict detection',
              'Waitlist management'
            ]
          },
          {
            title: 'Research Assistant',
            icon: 'fas fa-microscope',
            description: 'Advanced research support and resource discovery',
            benefits: [
              'Literature search automation',
              'Citation assistance',
              'Research methodology guidance',
              'Data analysis support'
            ]
          },
          {
            title: 'Language Learning Companion',
            icon: 'fas fa-language',
            description: 'Interactive language practice and assessment',
            benefits: [
              'Real-time conversation practice',
              'Pronunciation feedback',
              'Vocabulary building exercises',
              'Cultural context insights'
            ]
          },
          {
            title: 'Parent Communication Hub',
            icon: 'fas fa-users',
            description: 'Streamlined parent-teacher communication',
            benefits: [
              'Progress report delivery',
              'Event notifications',
              'Meeting scheduling',
              'Attendance updates'
            ]
          },
          {
            title: 'Campus Life Navigator',
            icon: 'fas fa-university',
            description: 'Comprehensive campus information and services',
            benefits: [
              'Campus event updates',
              'Facility booking system',
              'Club/activity information',
              'Emergency services access'
            ]
          },
          {
            title: 'Assessment & Grading Assistant',
            icon: 'fas fa-check-square',
            description: 'Automated assessment and feedback system',
            benefits: [
              'Auto-grading capabilities',
              'Personalized feedback generation',
              'Performance analytics',
              'Learning gap identification'
            ]
          },
          {
            title: 'Special Education Support',
            icon: 'fas fa-hand-holding-heart',
            description: 'Specialized assistance for diverse learning needs',
            benefits: [
              'Adaptive learning paths',
              'Accessibility features',
              'IEP progress tracking',
              'Resource recommendations'
            ]
          },
          {
            title: 'Professional Development Coach',
            icon: 'fas fa-chalkboard-teacher',
            description: 'Teacher training and skill development',
            benefits: [
              'Personalized training plans',
              'Teaching resource library',
              'Best practice sharing',
              'Certification tracking'
            ]
          }
        ]
      }
    }
  }
}
</script>
