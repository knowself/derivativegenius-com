<template>
  <div>
    <ChatbotBreadcrumb current-page="Healthcare" />
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
  name: 'Healthcare',
  components: {
    ChatbotBreadcrumb
  },
  data() {
    return {
      industryData: {
        name: 'Healthcare & Medical AI Solutions',
        fullDescription: 'Revolutionize patient care and medical practice management with intelligent automation.',
        useCases: [
          {
            title: 'Appointment Scheduling',
            icon: 'fas fa-calendar-alt',
            description: 'Automated appointment booking and management',
            benefits: [
              'Reduce no-shows by 30%',
              'Optimize scheduling efficiency',
              'Improve patient satisfaction'
            ]
          },
          {
            title: 'Patient Triage',
            icon: 'fas fa-user-md',
            description: 'Initial symptom assessment and care routing',
            benefits: [
              'Prioritize urgent cases',
              'Reduce wait times',
              'Optimize resource allocation'
            ]
          },
          {
            title: 'Medical Records Access',
            icon: 'fas fa-file-medical',
            description: 'Secure patient record retrieval and updates',
            benefits: [
              'Quick information access',
              'Reduce administrative work',
              'Improve accuracy'
            ]
          },
          {
            title: 'Medication Reminders',
            icon: 'fas fa-pills',
            description: 'Automated medication schedules and adherence tracking',
            benefits: [
              'Improve medication adherence',
              'Reduce complications',
              'Better patient outcomes'
            ]
          },
          {
            title: 'Insurance Verification',
            icon: 'fas fa-shield-alt',
            description: 'Automated insurance eligibility checks',
            benefits: [
              'Reduce claim denials',
              'Speed up verification process',
              'Improve revenue cycle'
            ]
          }
        ]
      }
    }
  }
}
</script>
