import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    ignores: [
      '.agent/**',
      '.agents/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      '.next/**',
      'staticfiles/**',
      'venv/**',
      'myenv/**',
      '.venv/**',
      'dev_logs/**',
      'logs/**',
      'logs_dev_old/**',
      'admin_panel/**',
      'contact_email_form/**',
      'firebase_app/**',
    ],
  },
];

export default config;
