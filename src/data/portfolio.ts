export interface BusinessCategoryUseCase {
  category: string;
  icon?: string;
  useCase: string;
}

export interface ProjectSynopsis {
  overview: string;
  targetAudience: string;
  keyCapabilities: string[];
  potentialBusinessCategories: BusinessCategoryUseCase[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  synopsis: ProjectSynopsis;
}

export const CENTURIONS_PROJECTS: PortfolioProject[] = [
  {
    id: 'spacejanitor',
    title: 'Space Janitor',
    description: 'Maintenance and operations platform designed for mission-critical IT & DevOps tracking.',
    image: '/images/portfolio/spacejanitor.png',
    url: 'https://www.spacejanitor.pro/',
    tags: ['Next.js', 'TypeScript', 'DevOps Ops Hub'],
    synopsis: {
      overview:
        'Space Janitor is an enterprise-grade maintenance and operations platform built to provide real-time status telemetry, incident logging, and system reliability monitoring. It transforms complex backend health data into clear, actionable executive dashboards.',
      targetAudience:
        'DevOps teams, SaaS platform operators, IT infrastructure directors, and Managed Service Providers (MSPs).',
      keyCapabilities: [
        'Real-time system telemetry and component status tracking',
        'Automated incident logging and customer impact notifications',
        'Service Level Agreement (SLA) uptime measurement & historical reporting',
        'Developer documentation hub with integrated API health endpoints',
        'High-contrast dark mode interface engineered for continuous NOC monitoring'
      ],
      potentialBusinessCategories: [
        {
          category: 'SaaS & Software Platforms',
          useCase: 'Public uptime dashboards, system status hubs, and incident disclosure pages.'
        },
        {
          category: 'Managed IT & Cybersecurity (MSPs)',
          useCase: 'Client security alert portals, SOC threat monitoring, and SLA compliance dashboards.'
        },
        {
          category: 'IoT & Industrial Automation',
          useCase: 'Smart facility sensor telemetry, machine status monitoring, and preventive alert dispatch.'
        },
        {
          category: 'Logistics & Supply Chain Uptime',
          useCase: 'Warehouse automation monitoring, cold-chain temperature telemetry, and fleet fleet status pages.'
        }
      ]
    }
  },
  {
    id: 'kerryterry',
    title: 'Kerry Terry',
    description: 'Personal executive branding and portfolio site engineered for thought leadership and high-ticket client acquisition.',
    image: '/images/portfolio/kerryterry.png',
    url: 'https://www.kerryterry.com/',
    tags: ['Next.js', 'Design', 'Executive Brand'],
    synopsis: {
      overview:
        'The Kerry Terry portfolio application is a bespoke executive branding platform designed to establish instant authority, showcase high-impact advisory work, and capture high-value strategic partnerships through high-end typography and interactive case studies.',
      targetAudience:
        'C-suite executives, keynote speakers, fractional advisors, agency owners, and top-tier creative directors.',
      keyCapabilities: [
        'Interactive case study showcases with quantitative impact metrics',
        'Seamless consultation booking & press media kit download integration',
        'Publication highlight grid featuring external articles, podcasts, and talks',
        'High-touch minimalist visual hierarchy optimized for fast load times and SEO',
        'Custom social proof highlights and client recommendation carousels'
      ],
      potentialBusinessCategories: [
        {
          category: 'Founders & Venture Executives',
          useCase: 'Personal investor relations site, deal flow landing page, and board candidate profile.'
        },
        {
          category: 'Fractional Executives & Advisory',
          useCase: 'High-ticket retainer lead capture, strategic advisory positioning, and client testimonials.'
        },
        {
          category: 'Creative Directors & Architects',
          useCase: 'Visual design portfolio, architectural project gallery, and award showcase.'
        },
        {
          category: 'Authors, Speakers & Researchers',
          useCase: 'Keynote booking site, book launch landing page, and newsletter growth engine.'
        }
      ]
    }
  },
  {
    id: 'microgreensla',
    title: 'MicrogreensLA',
    description: 'Direct-to-consumer sustainable urban farming site optimized for recurring local subscriptions.',
    image: '/images/portfolio/microgreensla.png',
    url: 'https://www.microgreensla.live/',
    tags: ['Next.js', 'Tailwind', 'E-Commerce & Subscriptions'],
    synopsis: {
      overview:
        'MicrogreensLA is a hyper-local e-commerce and subscription platform engineered for urban agriculture producers. It simplifies recurring harvest ordering, route delivery scheduling, and local farm-to-table customer engagement.',
      targetAudience:
        'Urban farming ventures, specialty food producers, local CSA subscription services, and artisanal goods purveyors.',
      keyCapabilities: [
        'Recurring subscription ordering engine with customizable delivery cycles',
        'Harvest calendar countdowns and weekly yield availability tracking',
        'Hyper-local radius delivery check via ZIP code validation',
        'Nutritional transparency cards and chef pairing recipes',
        'Direct-to-consumer checkout flow built for high mobile conversion'
      ],
      potentialBusinessCategories: [
        {
          category: 'Artisanal Agriculture & Hydroponics',
          useCase: 'Specialty mushroom farms, urban microgreen subscriptions, and honey producers.'
        },
        {
          category: 'Direct-to-Consumer Food & Beverage',
          useCase: 'Craft kombucha subscription boxes, specialty coffee roasters, and meal-prep deliveries.'
        },
        {
          category: 'Organic Skincare & Wellness',
          useCase: 'Small-batch botanical skincare, farm-sourced essential oil clubs, and herbal remedies.'
        },
        {
          category: 'Boutique Goods & Florals',
          useCase: 'Weekly flower bouquet subscriptions, hand-poured candle clubs, and gourmet artisan bakeries.'
        }
      ]
    }
  },
  {
    id: 'mobiletireman',
    title: 'Mobile Tire Man',
    description: 'On-demand mobile tire, oil change, and light auto service application that meets customers at home or work.',
    image: '/images/portfolio/mobiletireman.png',
    url: 'https://mobiletireman.vercel.app/',
    tags: ['Next.js', 'Tailwind', 'Mobile Field Service'],
    synopsis: {
      overview:
        'Mobile Tire Man is a high-conversion mobile field service platform designed to eliminate waiting rooms. It connects vehicle owners directly with on-demand mobile technicians for home and office auto maintenance.',
      targetAudience:
        'Mobile automotive technicians, roadside service operators, on-demand field service companies, and mobile detailing businesses.',
      keyCapabilities: [
        'Frictionless mobile service intake request form with instant vehicle/location validation',
        'Service scope clarity section separating on-site capabilities from shop-only maintenance',
        'Transparent pre-quote confirmation and deposit policy communication',
        'Service area lookup and arrival window preferences',
        'Mobile-first responsive UX optimized for emergency and schedule-ahead bookings'
      ],
      potentialBusinessCategories: [
        {
          category: 'Automotive & Fleet Services',
          useCase: 'Mobile auto detailing, windshield replacement, mobile EV charging, and fleet maintenance.'
        },
        {
          category: 'On-Demand Home Services',
          useCase: 'Mobile pet grooming, appliance repair, locksmith dispatch, and solar panel washing.'
        },
        {
          category: 'Mobile Healthcare & Diagnostics',
          useCase: 'In-home phlebotomy, mobile IV therapy, concierge vet visits, and mobile ultrasound.'
        },
        {
          category: 'Commercial Field Maintenance',
          useCase: 'On-site HVAC filter dispatch, commercial printer repair, and facility inspection units.'
        }
      ]
    }
  }
];

export default CENTURIONS_PROJECTS;
