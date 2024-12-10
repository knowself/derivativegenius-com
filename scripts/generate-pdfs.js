const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

// PDF Generation Configuration
const COMPANY_NAME = 'Derivative Genius';
const COMPANY_WEBSITE = 'https://derivativegenius.com';
const OUTPUT_DIR = path.join(__dirname, '../public/resources/pdfs');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// PDF Styling
const styles = {
  header: {
    fontSize: 28,
    font: 'Helvetica-Bold'
  },
  subheader: {
    fontSize: 18,
    font: 'Helvetica-Bold'
  },
  body: {
    fontSize: 12,
    font: 'Helvetica'
  },
  spacing: {
    paragraph: 15
  }
};

async function generateExecutiveOverview() {
  const doc = new PDFDocument();
  const output = path.join(OUTPUT_DIR, 'executive-overview.pdf');
  doc.pipe(fs.createWriteStream(output));

  // Add company logo
  doc.image(path.join(__dirname, '../public/images/DG-AAA.png'), 50, 50, { width: 150 });
  
  // Title
  doc.moveDown(2);
  doc.font(styles.header.font)
     .fontSize(styles.header.fontSize)
     .text('AI Automation Solutions for Your Business', { align: 'center' });

  // Introduction
  doc.moveDown();
  doc.font(styles.body.font)
     .fontSize(styles.body.fontSize)
     .text('Transform your business operations with cutting-edge AI automation solutions from Derivative Genius. We help small and medium-sized businesses leverage the power of artificial intelligence to streamline workflows, reduce costs, and drive growth.');

  // Key Benefits
  doc.moveDown(2);
  doc.font(styles.subheader.font)
     .fontSize(styles.subheader.fontSize)
     .text('Key Benefits');

  const benefits = [
    'Reduce operational costs by up to 40%',
    'Automate repetitive tasks and workflows',
    'Improve accuracy and reduce errors',
    'Scale operations without increasing headcount',
    'Make data-driven decisions with AI insights'
  ];

  doc.moveDown();
  benefits.forEach(benefit => {
    doc.font(styles.body.font)
       .fontSize(styles.body.fontSize)
       .text(`• ${benefit}`);
  });

  doc.end();
  return output;
}

async function generateServiceCatalog() {
  const doc = new PDFDocument();
  const output = path.join(OUTPUT_DIR, 'service-catalog.pdf');
  doc.pipe(fs.createWriteStream(output));

  // Add company logo
  doc.image(path.join(__dirname, '../public/images/DG-AAA.png'), 50, 50, { width: 150 });
  
  // Title
  doc.moveDown(2);
  doc.font(styles.header.font)
     .fontSize(styles.header.fontSize)
     .text('Service Catalog', { align: 'center' });

  // Services
  const services = [
    {
      title: 'AI Strategy Development',
      description: 'Custom AI roadmap aligned with your business goals',
      features: [
        'Business process analysis',
        'AI opportunity identification',
        'Implementation planning',
        'ROI projections'
      ]
    },
    {
      title: 'Process Automation',
      description: 'Streamline operations with intelligent automation',
      features: [
        'Workflow analysis and optimization',
        'Custom automation solutions',
        'Integration with existing systems',
        'Performance monitoring'
      ]
    },
    {
      title: 'Data Analytics & Insights',
      description: 'Transform data into actionable insights',
      features: [
        'Data collection and processing',
        'AI-powered analytics',
        'Custom dashboards',
        'Predictive modeling'
      ]
    }
  ];

  services.forEach(service => {
    doc.moveDown(2);
    doc.font(styles.subheader.font)
       .fontSize(styles.subheader.fontSize)
       .text(service.title);
    
    doc.moveDown();
    doc.font(styles.body.font)
       .fontSize(styles.body.fontSize)
       .text(service.description);

    doc.moveDown();
    service.features.forEach(feature => {
      doc.text(`• ${feature}`);
    });
  });

  doc.end();
  return output;
}

async function generateImplementationGuide() {
  const doc = new PDFDocument();
  const output = path.join(OUTPUT_DIR, 'implementation-guide.pdf');
  doc.pipe(fs.createWriteStream(output));

  // Add company logo
  doc.image(path.join(__dirname, '../public/images/DG-AAA.png'), 50, 50, { width: 150 });
  
  // Title
  doc.moveDown(2);
  doc.font(styles.header.font)
     .fontSize(styles.header.fontSize)
     .text('Implementation Guide', { align: 'center' });

  // Implementation Steps
  const steps = [
    {
      phase: 'Discovery',
      activities: [
        'Business process analysis',
        'Requirements gathering',
        'Technical assessment',
        'Solution design'
      ]
    },
    {
      phase: 'Development',
      activities: [
        'Solution configuration',
        'Integration setup',
        'Testing and validation',
        'User acceptance testing'
      ]
    },
    {
      phase: 'Deployment',
      activities: [
        'System deployment',
        'User training',
        'Performance monitoring',
        'Support and maintenance'
      ]
    }
  ];

  steps.forEach(step => {
    doc.moveDown(2);
    doc.font(styles.subheader.font)
       .fontSize(styles.subheader.fontSize)
       .text(`Phase: ${step.phase}`);
    
    doc.moveDown();
    step.activities.forEach(activity => {
      doc.font(styles.body.font)
         .fontSize(styles.body.fontSize)
         .text(`• ${activity}`);
    });
  });

  doc.end();
  return output;
}

async function uploadToFirebase(filePath, destination) {
  const storage = new Storage();
  const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

  await bucket.upload(filePath, {
    destination,
    metadata: {
      cacheControl: 'public, max-age=3600',
    },
  });

  console.log(`Uploaded ${filePath} to ${destination}`);
}

async function main() {
  try {
    // Generate PDFs
    const executiveOverview = await generateExecutiveOverview();
    const serviceCatalog = await generateServiceCatalog();
    const implementationGuide = await generateImplementationGuide();

    // Upload to Firebase Storage
    if (process.env.FIREBASE_STORAGE_BUCKET) {
      await uploadToFirebase(executiveOverview, 'public/resources/pdfs/executive-overview.pdf');
      await uploadToFirebase(serviceCatalog, 'public/resources/pdfs/service-catalog.pdf');
      await uploadToFirebase(implementationGuide, 'public/resources/pdfs/implementation-guide.pdf');
    }

    console.log('PDF generation and upload complete!');
  } catch (error) {
    console.error('Error generating or uploading PDFs:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateExecutiveOverview,
  generateServiceCatalog,
  generateImplementationGuide,
  uploadToFirebase
};
