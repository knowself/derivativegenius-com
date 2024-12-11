<template>
  <div class="industry-container" v-if="industryData">
    <div class="hero-section">
      <router-link v-if="$route.params.industry" to="/chatbots" class="back-button">
        <i class="fas fa-arrow-left mr-2"></i> Back to Industries
      </router-link>
      <h1 class="text-4xl font-bold mb-6">{{ industryData.name }}</h1>
      <p class="text-xl mb-8">{{ industryData.fullDescription }}</p>
    </div>

    <div class="use-cases-grid">
      <router-link v-for="(useCase, index) in industryData.useCases" 
           :key="index"
           :to="'/chatbots/' + useCase.route"
           class="use-case-card">
        <i :class="useCase.icon + ' text-3xl mb-4'"></i>
        <h3 class="text-xl font-semibold mb-3">{{ useCase.title }}</h3>
        <p class="mb-4">{{ useCase.description }}</p>
        <ul class="benefits-list">
          <li v-for="(benefit, bIndex) in useCase.benefits" 
              :key="bIndex"
              class="benefit-item">
            <i class="fas fa-check-circle mr-2"></i>
            {{ benefit }}
          </li>
        </ul>
        <div class="mt-6">
          <span class="text-indigo-600 hover:text-indigo-700 font-medium">
            Learn more <i class="fas fa-arrow-right ml-1"></i>
          </span>
        </div>
      </router-link>
    </div>

    <div class="cta-section">
      <h2 class="text-2xl font-semibold mb-4">Ready to Transform Your Business?</h2>
      <p class="mb-6">Experience the power of AI chatbots tailored for your industry</p>
      <router-link to="/contact" class="cta-button primary">
        Get Started
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatbotIndustry',
  data() {
    return {
      industryData: {
        name: 'AI-Powered Chatbot Solutions',
        fullDescription: 'Transform your business with intelligent chatbots designed for your specific industry needs. Our AI solutions enhance customer experience, automate operations, and drive growth across various sectors.',
        useCases: [
          {
            title: 'Technology',
            route: 'technology',
            icon: 'fas fa-microchip',
            description: 'Empower your tech company with AI-driven solutions that streamline development processes, enhance customer support, and boost team productivity.',
            benefits: [
              'Automated 24/7 technical support',
              'Smart development workflow automation',
              'Real-time system monitoring and alerts',
              'Intelligent code review assistance',
              'Automated deployment pipelines'
            ]
          },
          {
            title: 'Real Estate',
            route: 'real-estate',
            icon: 'fas fa-home',
            description: 'Revolutionize property management and sales with AI chatbots that streamline client interactions, automate showings, and enhance property marketing.',
            benefits: [
              'Automated property matching',
              '24/7 property inquiries handling',
              'Smart scheduling for viewings',
              'Real-time market analysis',
              'Automated lead qualification'
            ]
          },
          {
            title: 'Education',
            route: 'education',
            icon: 'fas fa-graduation-cap',
            description: 'Revolutionize learning with AI chatbots that provide personalized support, streamline administrative tasks, and enhance student engagement.',
            benefits: [
              'Personalized learning assistance',
              'Automated course management',
              'Smart administrative support',
              'Real-time student feedback',
              'Intelligent content recommendations'
            ]
          },
          {
            title: 'Local Business',
            route: 'local',
            icon: 'fas fa-store',
            description: 'Transform your local business with AI solutions that enhance customer service, streamline operations, and drive growth in your community.',
            benefits: [
              'Intelligent 24/7 customer support',
              'Smart appointment scheduling',
              'Automated inventory management',
              'Local SEO optimization',
              'Customer insights and analytics'
            ]
          }
        ]
      },
      industries: {
        retail: {
          name: 'Retail AI Solutions',
          fullDescription: 'Transform your retail business with AI-powered chatbots that enhance customer experience and drive sales.',
          useCases: [
            {
              title: 'Product Recommendations',
              icon: 'fas fa-tags',
              description: 'Personalized product suggestions based on customer preferences and browsing history',
              benefits: [
                'Increase average order value by 25%',
                'Improve customer satisfaction',
                'Boost repeat purchases',
              ]
            },
            {
              title: 'Inventory Management',
              icon: 'fas fa-box',
              description: 'Real-time inventory tracking and automated reordering',
              benefits: [
                'Reduce stockouts by 40%',
                'Optimize inventory levels',
                'Lower carrying costs',
              ]
            },
            {
              title: '24/7 Customer Support',
              icon: 'fas fa-headset',
              description: 'Round-the-clock automated customer service',
              benefits: [
                'Handle 80% of common queries',
                'Instant response times',
                'Reduce support costs',
              ]
            },
            {
              title: 'Order Tracking',
              icon: 'fas fa-shipping-fast',
              description: 'Automated order status updates and delivery tracking',
              benefits: [
                'Reduce "where is my order" queries',
                'Improve customer satisfaction',
                'Lower support workload',
              ]
            },
            {
              title: 'Price Monitoring',
              icon: 'fas fa-chart-line',
              description: 'Competitive price tracking and dynamic pricing',
              benefits: [
                'Optimize pricing strategy',
                'Increase profit margins',
                'Stay competitive',
              ]
            }
          ]
        },
        healthcare: {
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
                'Improve patient satisfaction',
              ]
            },
            {
              title: 'Patient Triage',
              icon: 'fas fa-user-md',
              description: 'Initial symptom assessment and care routing',
              benefits: [
                'Prioritize urgent cases',
                'Reduce wait times',
                'Optimize resource allocation',
              ]
            },
            {
              title: 'Medical Records Access',
              icon: 'fas fa-file-medical',
              description: 'Secure patient record retrieval and updates',
              benefits: [
                'Quick information access',
                'Reduce administrative work',
                'Improve accuracy',
              ]
            },
            {
              title: 'Medication Reminders',
              icon: 'fas fa-pills',
              description: 'Automated medication schedules and adherence tracking',
              benefits: [
                'Improve medication adherence',
                'Reduce complications',
                'Better patient outcomes',
              ]
            },
            {
              title: 'Insurance Verification',
              icon: 'fas fa-shield-alt',
              description: 'Automated insurance eligibility checks',
              benefits: [
                'Reduce claim denials',
                'Speed up verification process',
                'Improve revenue cycle',
              ]
            }
          ]
        },
        financial: {
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
                'Document verification assistance',
                'Status tracking updates'
              ]
            },
            {
              title: 'Compliance & Reporting',
              icon: 'fas fa-file-contract',
              description: 'Regulatory compliance and automated reporting',
              benefits: [
                'Ensure regulatory adherence',
                'Automated compliance checks',
                'Real-time reporting generation',
                'Audit trail maintenance'
              ]
            },
            {
              title: 'Financial Planning Bot',
              icon: 'fas fa-piggy-bank',
              description: 'Personal financial planning and budgeting assistance',
              benefits: [
                'Custom budget recommendations',
                'Expense tracking automation',
                'Savings goal monitoring',
                'Financial education resources'
              ]
            }
          ]
        },
        realestate: {
          name: 'Real Estate AI Solutions',
          fullDescription: 'Revolutionize property management and real estate sales with AI-powered chatbots that streamline operations, enhance client engagement, and maximize property value while reducing administrative overhead.',
          useCases: [
            {
              title: 'Property Matching Assistant',
              icon: 'fas fa-home',
              description: 'Intelligent property recommendations and search assistance',
              benefits: [
                'Match properties 3x faster than manual search',
                'Increase showing-to-sale conversion by 40%',
                'Personalized property recommendations',
                'Real-time listing updates'
              ]
            },
            {
              title: 'Virtual Property Tours',
              icon: 'fas fa-vr-cardboard',
              description: 'Interactive virtual showings and property walkthroughs',
              benefits: [
                'Reduce in-person showings by 50%',
                'Available 24/7 for virtual tours',
                'Interactive property highlights',
                'Instant room-by-room details'
              ]
            },
            {
              title: 'Maintenance Request Handler',
              icon: 'fas fa-tools',
              description: 'Automated maintenance ticket system and tracking',
              benefits: [
                'Process requests 75% faster',
                'Prioritize urgent maintenance',
                'Track repair status in real-time',
                'Automated vendor scheduling'
              ]
            },
            {
              title: 'Lease & Document Assistant',
              icon: 'fas fa-file-signature',
              description: 'Smart document handling and lease management',
              benefits: [
                'Automate 90% of document processing',
                'Instant lease agreement generation',
                'Digital signature integration',
                'Secure document storage'
              ]
            },
            {
              title: 'Market Analysis Bot',
              icon: 'fas fa-chart-area',
              description: 'Real-time market insights and property valuation',
              benefits: [
                'Live market trend analysis',
                'Competitive property pricing',
                'Investment opportunity scoring',
                'ROI projections'
              ]
            },
            {
              title: 'Tenant Communication Hub',
              icon: 'fas fa-comments',
              description: 'Centralized tenant interaction management',
              benefits: [
                'Respond to inquiries within minutes',
                'Secure message encryption',
                'Multi-channel support',
                'Communication analytics'
              ]
            },
            {
              title: 'Property Inspection Bot',
              icon: 'fas fa-clipboard-check',
              description: 'Automated inspection scheduling and reporting',
              benefits: [
                'Streamline inspection processes',
                'Digital condition reports',
                'Photo documentation system',
                'Maintenance prediction'
              ]
            },
            {
              title: 'Mortgage Calculator Plus',
              icon: 'fas fa-calculator',
              description: 'Advanced mortgage calculations and financing assistance',
              benefits: [
                'Real-time payment calculations',
                'Lender matching service',
                'Pre-qualification assessment',
                'Investment analysis tools'
              ]
            }
          ]
        },
        professional: {
          name: 'Professional Services AI Solutions',
          fullDescription: 'Transform your professional services practice with AI-powered chatbots that streamline client interactions, automate routine tasks, and enhance service delivery while maintaining the highest standards of expertise and confidentiality.',
          useCases: [
            {
              title: 'Client Intake Automation',
              icon: 'fas fa-user-plus',
              description: 'Intelligent client onboarding and information gathering',
              benefits: [
                'Reduce intake time by 75%',
                'Ensure compliance requirements',
                'Capture complete client data',
                'Seamless CRM integration'
              ]
            },
            {
              title: 'Smart Appointment Scheduler',
              icon: 'fas fa-calendar-check',
              description: 'Advanced scheduling with intelligent prioritization',
              benefits: [
                'Reduce scheduling conflicts by 90%',
                'Intelligent time allocation',
                'Automated reminders',
                'Client preference learning'
              ]
            },
            {
              title: 'Document Analysis Assistant',
              icon: 'fas fa-file-alt',
              description: 'AI-powered document review and analysis',
              benefits: [
                'Process documents 5x faster',
                'Extract key information',
                'Identify missing elements',
                'Maintain audit trails'
              ]
            },
            {
              title: 'Regulatory Compliance Bot',
              icon: 'fas fa-balance-scale',
              description: 'Real-time compliance monitoring and guidance',
              benefits: [
                'Stay current with regulations',
                'Reduce compliance risks',
                'Automated reporting',
                'Industry-specific guidelines'
              ]
            },
            {
              title: 'Project Management AI',
              icon: 'fas fa-tasks',
              description: 'Intelligent project tracking and resource allocation',
              benefits: [
                'Optimize resource utilization',
                'Real-time progress tracking',
                'Automated milestone alerts',
                'Budget monitoring'
              ]
            },
            {
              title: 'Knowledge Base Assistant',
              icon: 'fas fa-brain',
              description: 'Smart access to firm expertise and resources',
              benefits: [
                'Instant access to precedents',
                'Best practice guidance',
                'Training materials',
                'Case study database'
              ]
            },
            {
              title: 'Client Communication Hub',
              icon: 'fas fa-comments-dollar',
              description: 'Centralized client interaction management',
              benefits: [
                'Response time under 5 minutes',
                'Secure message encryption',
                'Multi-channel support',
                'Communication analytics'
              ]
            },
            {
              title: 'Billing & Invoice Assistant',
              icon: 'fas fa-file-invoice-dollar',
              description: 'Automated billing and payment processing',
              benefits: [
                'Reduce billing errors by 95%',
                'Automated time tracking',
                'Payment processing',
                'Revenue forecasting'
              ]
            },
            {
              title: 'Research & Analysis Bot',
              icon: 'fas fa-search',
              description: 'AI-powered research and trend analysis',
              benefits: [
                'Comprehensive market research',
                'Competitor analysis',
                'Industry trend tracking',
                'Custom report generation'
              ]
            },
            {
              title: 'Quality Assurance Monitor',
              icon: 'fas fa-check-double',
              description: 'Service quality monitoring and improvement',
              benefits: [
                'Real-time quality checks',
                'Performance metrics',
                'Client feedback analysis',
                'Continuous improvement'
              ]
            }
          ]
        },
        hospitality: {
          name: 'Hospitality & Tourism AI Solutions',
          fullDescription: 'Elevate guest experiences and streamline operations with AI-powered chatbots that provide personalized service, automate routine tasks, and enhance customer satisfaction across hotels, resorts, and tourism businesses.',
          useCases: [
            {
              title: 'Smart Booking Assistant',
              icon: 'fas fa-concierge-bell',
              description: 'Intelligent reservation management and personalization',
              benefits: [
                'Increase direct bookings by 35%',
                'Personalized room recommendations',
                'Real-time availability updates',
                'Upsell opportunities automation'
              ]
            },
            {
              title: 'Virtual Concierge',
              icon: 'fas fa-star',
              description: '24/7 guest services and local recommendations',
              benefits: [
                'Handle 80% of guest requests',
                'Instant local recommendations',
                'Multi-language support',
                'Personalized experiences'
              ]
            },
            {
              title: 'Check-in/Check-out Assistant',
              icon: 'fas fa-key',
              description: 'Streamlined arrival and departure processes',
              benefits: [
                'Reduce check-in time by 70%',
                'Mobile key distribution',
                'Early check-in management',
                'Express checkout service'
              ]
            },
            {
              title: 'Room Service & Amenities',
              icon: 'fas fa-utensils',
              description: 'Automated food and service ordering system',
              benefits: [
                'Process orders in under 1 minute',
                'Custom menu recommendations',
                'Dietary filter options',
                'Special requests handling'
              ]
            },
            {
              title: 'Housekeeping Coordinator',
              icon: 'fas fa-broom',
              description: 'Smart housekeeping management system',
              benefits: [
                'Optimize cleaning schedules',
                'Track room status real-time',
                'Special requests handling',
                'Quality assurance checks'
              ]
            },
            {
              title: 'Experience Planner',
              icon: 'fas fa-map-marked-alt',
              description: 'Personalized itinerary and activity planning',
              benefits: [
                'Custom travel itineraries',
                'Local event recommendations',
                'Weather-aware planning',
                'Group activity coordination'
              ]
            },
            {
              title: 'Feedback & Recovery',
              icon: 'fas fa-heart',
              description: 'Real-time feedback and issue resolution',
              benefits: [
                'Instant issue detection',
                'Automated service recovery',
                'Satisfaction monitoring',
                'Review management'
              ]
            },
            {
              title: 'Revenue Optimizer',
              icon: 'fas fa-chart-line',
              description: 'Dynamic pricing and revenue management',
              benefits: [
                'Optimize room rates',
                'Demand forecasting',
                'Competitor price tracking',
                'Revenue maximization'
              ]
            },
            {
              title: 'Transportation Coordinator',
              icon: 'fas fa-shuttle-van',
              description: 'Seamless travel and transfer management',
              benefits: [
                'Airport transfer booking',
                'Local transportation info',
                'Route optimization',
                'Real-time tracking'
              ]
            },
            {
              title: 'Event & Conference Bot',
              icon: 'fas fa-calendar-day',
              description: 'Comprehensive event management assistance',
              benefits: [
                'Venue availability checking',
                'Event space configuration',
                'Catering coordination',
                'AV equipment booking'
              ]
            },
            {
              title: 'Loyalty Program Manager',
              icon: 'fas fa-gift',
              description: 'Smart loyalty program administration',
              benefits: [
                'Points tracking & redemption',
                'Personalized rewards',
                'Member tier management',
                'Special offers distribution'
              ]
            },
            {
              title: 'Emergency Response Bot',
              icon: 'fas fa-first-aid',
              description: 'Quick emergency and safety information',
              benefits: [
                '24/7 emergency assistance',
                'Safety protocol guidance',
                'Medical service coordination',
                'Crisis communication'
              ]
            }
          ]
        },
        education: {
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
              title: 'Enrollment Guide',
              icon: 'fas fa-user-plus',
              description: 'Streamlined admission and registration process',
              benefits: [
                'Automate 80% of enrollment queries',
                'Guide application completion',
                'Document verification assistance',
                'Payment process support'
              ]
            },
            {
              title: 'Course Navigator',
              icon: 'fas fa-compass',
              description: 'Intelligent course selection and planning',
              benefits: [
                'Personalized course recommendations',
                'Prerequisites checking',
                'Schedule optimization',
                'Degree progress tracking'
              ]
            },
            {
              title: 'Study Coach',
              icon: 'fas fa-brain',
              description: 'AI-powered learning assistance',
              benefits: [
                'Adaptive study plans',
                'Concept explanations',
                'Practice problem generation',
                'Learning style adaptation'
              ]
            },
            {
              title: 'Assignment Helper',
              icon: 'fas fa-tasks',
              description: 'Assignment management and support',
              benefits: [
                'Deadline reminders',
                'Resource recommendations',
                'Citation assistance',
                'Progress tracking'
              ]
            },
            {
              title: 'Faculty Assistant',
              icon: 'fas fa-chalkboard-teacher',
              description: 'Teaching and administrative support',
              benefits: [
                'Automate grading tasks',
                'Course material organization',
                'Office hours scheduling',
                'Student progress monitoring'
              ]
            },
            {
              title: 'Library Guide',
              icon: 'fas fa-book-reader',
              description: 'Digital resource navigation',
              benefits: [
                'Resource discovery',
                'Citation formatting',
                'Database navigation',
                'Research assistance'
              ]
            },
            {
              title: 'Campus Life Coordinator',
              icon: 'fas fa-university',
              description: 'Student life and engagement support',
              benefits: [
                'Event recommendations',
                'Club/activity matching',
                'Campus navigation',
                'Community engagement'
              ]
            },
            {
              title: 'Career Advisor',
              icon: 'fas fa-briefcase',
              description: 'Career guidance and planning',
              benefits: [
                'Career path exploration',
                'Resume review assistance',
                'Interview preparation',
                'Job market insights'
              ]
            },
            {
              title: 'Parent Communication Hub',
              icon: 'fas fa-users',
              description: 'Parent engagement and updates',
              benefits: [
                'Progress reports delivery',
                'Event notifications',
                'Teacher communication',
                'Attendance tracking'
              ]
            },
            {
              title: 'Special Education Support',
              icon: 'fas fa-hand-holding-heart',
              description: 'Specialized learning assistance',
              benefits: [
                'IEP goal tracking',
                'Accommodation management',
                'Progress monitoring',
                'Resource coordination'
              ]
            },
            {
              title: 'Administrative Assistant',
              icon: 'fas fa-cogs',
              description: 'School operations management',
              benefits: [
                'Document processing',
                'Schedule management',
                'Resource allocation',
                'Compliance tracking'
              ]
            },
            {
              title: 'Assessment Guide',
              icon: 'fas fa-chart-bar',
              description: 'Testing and evaluation support',
              benefits: [
                'Exam scheduling',
                'Practice test generation',
                'Performance analytics',
                'Feedback automation'
              ]
            },
            {
              title: 'Financial Aid Advisor',
              icon: 'fas fa-dollar-sign',
              description: 'Financial assistance guidance',
              benefits: [
                'Scholarship matching',
                'Application assistance',
                'Payment plan options',
                'Deadline management'
              ]
            }
          ]
        },
        manufacturing: {
          name: 'Manufacturing AI Solutions',
          fullDescription: 'Optimize production processes and enhance operational efficiency with AI-powered chatbots that streamline workflows, monitor equipment health, manage inventory, and ensure quality control across manufacturing facilities.',
          useCases: [
            {
              title: 'Production Supervisor',
              icon: 'fas fa-industry',
              description: 'Real-time production monitoring and control',
              benefits: [
                'Increase production efficiency by 30%',
                'Real-time status updates',
                'Production schedule optimization',
                'Resource allocation tracking'
              ]
            },
            {
              title: 'Maintenance Assistant',
              icon: 'fas fa-tools',
              description: 'Predictive maintenance and repair support',
              benefits: [
                'Reduce downtime by 45%',
                'Preventive maintenance alerts',
                'Repair procedure guidance',
                'Parts inventory management'
              ]
            },
            {
              title: 'Quality Control Monitor',
              icon: 'fas fa-check-circle',
              description: 'Quality assurance and defect detection',
              benefits: [
                'Improve quality rates by 25%',
                'Real-time defect detection',
                'Quality metrics tracking',
                'Compliance verification'
              ]
            },
            {
              title: 'Inventory Manager',
              icon: 'fas fa-boxes',
              description: 'Smart inventory and supply chain management',
              benefits: [
                'Reduce inventory costs by 20%',
                'Automated reordering',
                'Stock level optimization',
                'Supplier coordination'
              ]
            },
            {
              title: 'Safety Coordinator',
              icon: 'fas fa-hard-hat',
              description: 'Workplace safety and compliance monitoring',
              benefits: [
                'Reduce safety incidents by 40%',
                'Safety protocol guidance',
                'Incident reporting',
                'Compliance tracking'
              ]
            },
            {
              title: 'Process Optimizer',
              icon: 'fas fa-chart-line',
              description: 'Manufacturing process optimization',
              benefits: [
                'Improve process efficiency by 35%',
                'Bottleneck identification',
                'Workflow optimization',
                'Performance analytics'
              ]
            },
            {
              title: 'Equipment Monitor',
              icon: 'fas fa-robot',
              description: 'Machine health and performance tracking',
              benefits: [
                'Extend equipment life by 25%',
                'Performance monitoring',
                'Anomaly detection',
                'Maintenance scheduling'
              ]
            },
            {
              title: 'Supply Chain Coordinator',
              icon: 'fas fa-truck',
              description: 'End-to-end supply chain management',
              benefits: [
                'Reduce lead times by 30%',
                'Supplier communication',
                'Logistics optimization',
                'Delivery tracking'
              ]
            },
            {
              title: 'Training Assistant',
              icon: 'fas fa-user-cog',
              description: 'Employee training and skill development',
              benefits: [
                'Reduce training time by 50%',
                'Interactive tutorials',
                'Skill assessment',
                'Certification tracking'
              ]
            },
            {
              title: 'Energy Manager',
              icon: 'fas fa-bolt',
              description: 'Energy consumption optimization',
              benefits: [
                'Reduce energy costs by 15%',
                'Usage monitoring',
                'Peak load management',
                'Efficiency recommendations'
              ]
            },
            {
              title: 'Compliance Guide',
              icon: 'fas fa-clipboard-check',
              description: 'Regulatory compliance management',
              benefits: [
                'Ensure 100% compliance',
                'Regulation updates',
                'Audit preparation',
                'Documentation management'
              ]
            },
            {
              title: 'Waste Reduction Analyst',
              icon: 'fas fa-recycle',
              description: 'Waste management and sustainability',
              benefits: [
                'Reduce waste by 30%',
                'Material optimization',
                'Recycling guidance',
                'Environmental reporting'
              ]
            },
            {
              title: 'Customer Order Manager',
              icon: 'fas fa-shopping-cart',
              description: 'Order processing and customization',
              benefits: [
                'Reduce order processing time by 60%',
                'Custom specifications handling',
                'Production scheduling',
                'Delivery coordination'
              ]
            },
            {
              title: 'Data Analytics Hub',
              icon: 'fas fa-database',
              description: 'Manufacturing intelligence and analytics',
              benefits: [
                'Real-time data analysis',
                'Performance dashboards',
                'Trend prediction',
                'Decision support'
              ]
            }
          ]
        },
        technology: {
          name: 'Technology AI Solutions',
          fullDescription: 'Accelerate innovation and enhance productivity with AI-powered chatbots that streamline development processes, automate IT operations, provide technical support, and improve product management across technology organizations.',
          useCases: [
            {
              title: 'Developer Assistant',
              icon: 'fas fa-code',
              description: 'Intelligent coding and development support',
              benefits: [
                'Increase developer productivity by 40%',
                'Code review automation',
                'Bug detection assistance',
                'Documentation generation'
              ]
            },
            {
              title: 'DevOps Orchestrator',
              icon: 'fas fa-sync',
              description: 'CI/CD and deployment automation',
              benefits: [
                'Reduce deployment time by 60%',
                'Pipeline optimization',
                'Infrastructure management',
                'Release coordination'
              ]
            },
            {
              title: 'IT Support Agent',
              icon: 'fas fa-headset',
              description: '24/7 technical support automation',
              benefits: [
                'Resolve 75% of tickets automatically',
                'Instant issue diagnosis',
                'Knowledge base integration',
                'Escalation management'
              ]
            },
            {
              title: 'Security Guardian',
              icon: 'fas fa-shield-alt',
              description: 'Security monitoring and incident response',
              benefits: [
                'Reduce security incidents by 50%',
                'Threat detection',
                'Compliance monitoring',
                'Security advisory'
              ]
            },
            {
              title: 'Product Manager',
              icon: 'fas fa-tasks',
              description: 'Product lifecycle and roadmap management',
              benefits: [
                'Streamline feature planning by 35%',
                'Requirements tracking',
                'Sprint planning',
                'Stakeholder updates'
              ]
            },
            {
              title: 'QA Automator',
              icon: 'fas fa-check-double',
              description: 'Automated testing and quality assurance',
              benefits: [
                'Increase test coverage by 45%',
                'Test case generation',
                'Regression testing',
                'Bug tracking'
              ]
            },
            {
              title: 'System Monitor',
              icon: 'fas fa-server',
              description: 'Infrastructure and performance monitoring',
              benefits: [
                'Reduce system downtime by 70%',
                'Performance analytics',
                'Resource optimization',
                'Capacity planning'
              ]
            },
            {
              title: 'API Manager',
              icon: 'fas fa-plug',
              description: 'API documentation and testing',
              benefits: [
                'Improve API adoption by 40%',
                'Documentation automation',
                'Integration testing',
                'Version management'
              ]
            },
            {
              title: 'Data Scientist Helper',
              icon: 'fas fa-brain',
              description: 'ML/AI development assistance',
              benefits: [
                'Accelerate model development by 30%',
                'Dataset management',
                'Model optimization',
                'Performance monitoring'
              ]
            },
            {
              title: 'Cloud Optimizer',
              icon: 'fas fa-cloud',
              description: 'Cloud resource management',
              benefits: [
                'Reduce cloud costs by 25%',
                'Resource scaling',
                'Service optimization',
                'Cost monitoring'
              ]
            },
            {
              title: 'UX Research Assistant',
              icon: 'fas fa-user-check',
              description: 'User research and feedback analysis',
              benefits: [
                'Process feedback 5x faster',
                'Sentiment analysis',
                'Usage analytics',
                'User journey mapping'
              ]
            },
            {
              title: 'Documentation Manager',
              icon: 'fas fa-book',
              description: 'Technical documentation automation',
              benefits: [
                'Reduce documentation time by 55%',
                'Auto-generation',
                'Version control',
                'Content organization'
              ]
            },
            {
              title: 'Compliance Monitor',
              icon: 'fas fa-clipboard-list',
              description: 'Regulatory compliance management',
              benefits: [
                'Ensure 100% compliance',
                'Audit preparation',
                'Policy enforcement',
                'Risk assessment'
              ]
            },
            {
              title: 'Innovation Scout',
              icon: 'fas fa-lightbulb',
              description: 'Technology trend analysis',
              benefits: [
                'Early trend identification',
                'Market intelligence',
                'Competitor analysis',
                'Innovation tracking'
              ]
            }
          ]
        },
        local: {
          name: 'Local Business AI Solutions',
          fullDescription: 'Empower local businesses with AI-powered chatbots that enhance customer service, streamline operations, boost engagement, and drive growth while maintaining that personal, community-focused touch that makes local businesses special.',
          useCases: [
            {
              title: 'Appointment Scheduler',
              icon: 'fas fa-calendar-check',
              description: 'Smart booking and appointment management',
              benefits: [
                'Reduce scheduling time by 80%',
                '24/7 booking availability',
                'Automated reminders',
                'Calendar integration'
              ]
            },
            {
              title: 'Menu & Order Assistant',
              icon: 'fas fa-utensils',
              description: 'Digital menu and ordering system',
              benefits: [
                'Increase order accuracy by 95%',
                'Custom recommendations',
                'Dietary filter options',
                'Special requests handling'
              ]
            },
            {
              title: 'Local Guide',
              icon: 'fas fa-map-marker-alt',
              description: 'Community information and recommendations',
              benefits: [
                'Enhance visitor engagement',
                'Local event updates',
                'Directions assistance',
                'Parking information'
              ]
            },
            {
              title: 'Service Quote Generator',
              icon: 'fas fa-calculator',
              description: 'Instant service pricing and quotes',
              benefits: [
                'Generate quotes in under 1 minute',
                'Custom service packages',
                'Pricing transparency',
                'Booking integration'
              ]
            },
            {
              title: 'Inventory Tracker',
              icon: 'fas fa-box-open',
              description: 'Real-time inventory management',
              benefits: [
                'Reduce stockouts by 40%',
                'Automated reordering',
                'Product availability updates',
                'Demand forecasting'
              ]
            },
            {
              title: 'Loyalty Program Manager',
              icon: 'fas fa-gift',
              description: 'Customer rewards and engagement',
              benefits: [
                'Increase repeat visits by 35%',
                'Points tracking',
                'Personalized rewards',
                'Special offers'
              ]
            },
            {
              title: 'Review Manager',
              icon: 'fas fa-star',
              description: 'Review monitoring and response',
              benefits: [
                'Improve ratings by 1.5 stars',
                'Quick response templates',
                'Sentiment analysis',
                'Feedback collection'
              ]
            },
            {
              title: 'Staff Coordinator',
              icon: 'fas fa-users-cog',
              description: 'Employee scheduling and management',
              benefits: [
                'Reduce scheduling conflicts by 90%',
                'Shift management',
                'Time-off requests',
                'Task assignment'
              ]
            },
            {
              title: 'Marketing Assistant',
              icon: 'fas fa-bullhorn',
              description: 'Local marketing automation',
              benefits: [
                'Increase local reach by 45%',
                'Social media management',
                'Event promotion',
                'Email campaigns'
              ]
            },
            {
              title: 'Service Reminder',
              icon: 'fas fa-bell',
              description: 'Customer follow-up and reminders',
              benefits: [
                'Boost return visits by 30%',
                'Service reminders',
                'Maintenance alerts',
                'Follow-up scheduling'
              ]
            },
            {
              title: 'Community Connector',
              icon: 'fas fa-handshake',
              description: 'Local business networking',
              benefits: [
                'Expand business network by 50%',
                'Event coordination',
                'Partnership opportunities',
                'Resource sharing'
              ]
            },
            {
              title: 'Payment Processor',
              icon: 'fas fa-credit-card',
              description: 'Smart payment handling',
              benefits: [
                'Process payments in seconds',
                'Multiple payment options',
                'Invoice generation',
                'Payment reminders'
              ]
            },
            {
              title: 'Customer Insights',
              icon: 'fas fa-chart-pie',
              description: 'Customer behavior analytics',
              benefits: [
                'Understand customers better',
                'Purchase patterns',
                'Preference tracking',
                'Trend analysis'
              ]
            },
            {
              title: 'Emergency Response',
              icon: 'fas fa-exclamation-circle',
              description: 'Crisis management and communication',
              benefits: [
                'Instant emergency updates',
                'Safety protocols',
                'Service disruption alerts',
                'Community updates'
              ]
            }
          ]
        },
        // Add similar detailed data for other industries...
      }
    }
  },
  created() {
    const industry = this.$route.params.industry
    if (industry) {
      this.industryData = this.industries[industry]
    }
  }
}
</script>

<style scoped>
.industry-container {
  @apply max-w-7xl mx-auto px-4 py-8;
}

.hero-section {
  @apply text-center mb-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg p-12;
}

.back-button {
  @apply inline-flex items-center text-white hover:text-indigo-200 mb-8 transition-colors;
}

.use-cases-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16;
}

.use-case-card {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1;
  text-decoration: none;
  color: inherit;
}

.use-case-card i {
  @apply text-indigo-600 dark:text-indigo-400 transition-colors duration-300;
}

.use-case-card:hover i {
  @apply text-indigo-500;
}

.use-case-card h3 {
  @apply text-gray-900 dark:text-white transition-colors duration-300;
}

.use-case-card p {
  @apply text-gray-600 dark:text-gray-300;
}

.benefits-list {
  @apply mt-4 space-y-2;
}

.benefit-item {
  @apply flex items-center text-gray-700 dark:text-gray-300 text-sm;
}

.benefit-item i {
  @apply text-green-500 text-xs;
}

.cta-section {
  @apply text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-12;
}

.cta-buttons {
  @apply flex justify-center space-x-4;
}

.cta-button {
  @apply px-6 py-3 rounded-lg font-medium transition-colors;
}

.cta-button.primary {
  @apply bg-indigo-600 text-white hover:bg-indigo-700;
}

.cta-button.secondary {
  @apply bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50;
}
</style>
