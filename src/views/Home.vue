<template>
  <!-- Quote Section -->
  <div class="py-8 bg-white relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center">
        <div class="relative">
          <img 
            src="/images/standing on the shoulders of giants.jpg" 
            alt="Standing on the shoulders of giants" 
            class="mx-auto mb-12 rounded-2xl shadow-2xl max-w-4xl w-full animate-fade-in-up"
          >
        </div>
        <div class="space-y-1 animate-fade-in-up-delay">
          <p class="text-3xl font-bold text-gray-900 mb-1 tracking-tight">"We live in the age of Giants"</p>
          <p class="text-xl text-indigo-600 font-medium">- Joe Terry, Chief D.G. of Derivative Genius LLC</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div class="max-w-7xl mx-auto">
      <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div class="sm:text-center lg:text-left">
            <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span class="block animate-fade-in-up">Automate & Transform</span>
              <span class="block text-gradient animate-fade-in-up-delay">Your Business with AI</span>
            </h1>
            <p class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up-delay-2">
              Derivative Genius is an AI Automation Agency (AAA) that transforms businesses through intelligent automation. We harness cutting-edge AI tools to automate workflows, streamline operations, and create scalable solutions.
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start animate-fade-in-up-delay-3">
              <div class="rounded-md shadow">
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10">
                  Get Started
                </a>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10">
                  View Solutions
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
  </div>

  <!-- Services Section -->
  <div class="pt-32 pb-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 id="services" class="text-base font-semibold tracking-wide uppercase text-gradient-purple">Our Services</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Intelligent Automation Solutions
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Transform your business with cutting-edge AI automation tools and expert implementation.
        </p>
      </div>

      <div class="mt-16 space-y-16">
        <div v-for="(service, index) in services" 
             :key="service.title" 
             class="service-card transform hover:scale-105 transition-all duration-200 relative"
             :class="{'from-left': index % 2 === 0, 'from-right': index % 2 === 1}">
          <div class="lg:grid lg:grid-cols-2 lg:gap-8">
            <div class="relative">
              <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl flex items-center">
                <div class="flex-shrink-0 h-12 w-12 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center transform hover:rotate-12 transition-transform duration-200 mr-4">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="service.icon" />
                  </svg>
                </div>
                {{ service.title }}
              </h3>
              <p class="mt-3 text-lg text-gray-500">{{ service.description }}</p>
              
              <div class="mt-6">
                <h4 class="text-lg font-semibold text-indigo-600">Key Features</h4>
                <ul class="mt-2 space-y-2">
                  <li v-for="feature in service.features" 
                      :key="feature" 
                      class="flex items-center text-gray-500">
                    <svg class="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="mt-8 lg:mt-0">
              <div class="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-lg p-6">
                <h4 class="text-lg font-semibold text-indigo-600 mb-4">Business Impact</h4>
                <p class="text-gray-600 mb-6">{{ service.benefits }}</p>
                
                <div class="border-t border-gray-200 pt-4">
                  <h4 class="text-lg font-semibold text-indigo-600 mb-2">Success Story</h4>
                  <p class="text-gray-600 italic">{{ service.useCase }}</p>
                </div>
                
                <div class="mt-6">
                  <a href="#" class="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-500 transition-colors duration-200">
                    Learn more
                    <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Articles Section -->
  <div id="articles" class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Resources</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Automation Insights
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Discover how AI automation is transforming businesses across industries.
        </p>
      </div>
      <!-- Article grid would go here -->
    </div>
  </div>

  <!-- Contact Section -->
  <div id="contact" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Contact Us</h2>
        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Start Your Automation Journey
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Let's discuss how we can transform your business with intelligent automation solutions.
        </p>
      </div>
      <!-- Contact form would go here -->
    </div>
  </div>
</template>

<script setup name="HomePage">
import { ref } from 'vue'

const services = ref([
  {
    title: 'Custom AI Automation',
    description: 'Tailored automation solutions designed specifically for your business needs and workflows.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    features: [
      'Custom AI model development',
      'Workflow automation pipelines',
      'Integration with existing systems',
      'Scalable architecture design'
    ],
    benefits: 'Reduce manual work by up to 80% while improving accuracy and consistency.',
    useCase: 'Document processing automation for a legal firm, reducing processing time from days to minutes.'
  },
  {
    title: 'Workflow Optimization',
    description: 'Streamline your operations with intelligent process automation and workflow integration.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    features: [
      'Process analysis and mapping',
      'Bottleneck identification',
      'Automated workflow design',
      'Performance monitoring'
    ],
    benefits: 'Optimize operational efficiency by 40-60% through intelligent automation.',
    useCase: 'Customer service automation for an e-commerce platform, reducing response time by 90%.'
  },
  {
    title: 'AI Implementation',
    description: 'Expert implementation of cutting-edge AI tools with comprehensive training and support.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    features: [
      'AI tool selection and setup',
      'Custom model training',
      'Team training programs',
      'Ongoing technical support'
    ],
    benefits: 'Achieve ROI within 3-6 months through effective AI implementation.',
    useCase: 'Sales prediction system for a retail chain, improving inventory management by 35%.'
  },
  {
    title: 'Process Consulting',
    description: 'Strategic guidance for your automation journey with proven methodologies and best practices.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    features: [
      'Automation readiness assessment',
      'ROI analysis and planning',
      'Technology stack evaluation',
      'Implementation roadmap'
    ],
    benefits: 'Make informed decisions that lead to 200-300% ROI on automation investments.',
    useCase: 'Digital transformation strategy for a healthcare provider, resulting in 50% cost reduction.'
  }
])
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.bg-grid-pattern {
  background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.text-gradient {
  background: linear-gradient(to right, #818cf8, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.text-gradient-purple {
  background: linear-gradient(to right, #8b5cf6, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.service-card {
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

.from-left {
  animation: slideFromLeft 0.6s ease-out forwards;
}

.from-right {
  animation: slideFromRight 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 0.6s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 0.6s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-in-up-delay-3 {
  animation: fadeInUp 0.6s ease-out 0.6s forwards;
  opacity: 0;
}
</style>
