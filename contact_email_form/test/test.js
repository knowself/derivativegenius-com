require('dotenv').config({ path: '../.env' });
const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');

const firebaseConfig = require('./firebase-web-config.json');

console.log('Starting test script...');
console.log('Environment variables loaded:', {
  SMTP_HOST: process.env.SMTP_HOST ? 'set' : 'not set',
  SMTP_PORT: process.env.SMTP_PORT ? 'set' : 'not set',
  SMTP_USER: process.env.SMTP_USER ? 'set' : 'not set',
  SMTP_PASS: process.env.SMTP_PASS ? 'set' : 'not set',
  SMTP_FROM: process.env.SMTP_FROM ? 'set' : 'not set'
});

// Initialize Firebase
console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: '***' // Hide API key in logs
});

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'us-west1');

// Create the test function
async function testContactForm() {
  try {
    console.log('Creating callable function reference...');
    const sendContactEmail = httpsCallable(functions, 'sendContactEmail', {
      timeout: 60000, // Set timeout to 60 seconds
    });
    
    // Test data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from the contact form.'
    };

    console.log('Sending test request with data:', testData);
    console.log('Waiting for response...');
    
    const result = await sendContactEmail(testData);
    console.log('Response received:', result.data);
  } catch (error) {
    console.error('\nError occurred while testing contact form:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'functions/permission-denied') {
      console.error('\nPermission denied error. This could be due to:');
      console.error('1. CORS settings not allowing the request');
      console.error('2. Function requires authentication');
      console.error('3. Function has specific IAM roles requirement');
      console.error('4. Function is not deployed or not accessible');
    } else if (error.code === 'functions/not-found') {
      console.error('\nFunction not found error. This could be due to:');
      console.error('1. Function is not deployed');
      console.error('2. Function name is incorrect');
      console.error('3. Function region is incorrect');
      console.error('4. Function codebase name is incorrect');
    } else if (error.code === 'functions/internal') {
      console.error('\nInternal error. This could be due to:');
      console.error('1. Missing environment variables in the cloud function');
      console.error('2. Error in the function\'s business logic');
      console.error('3. Database or other service connection issues');
      console.error('4. Rate limiting or quota issues');
    }
    
    if (error.details) {
      console.error('\nDetailed error information:');
      console.error(JSON.stringify(error.details, null, 2));
    }
    
    console.error('\nFull error object:');
    console.error(JSON.stringify(error, null, 2));
  }
}

// Run the test
console.log('Starting contact form test...');
testContactForm()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Unexpected error:', err));
