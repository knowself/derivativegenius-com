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
      'dev_logs/**',
      'logs/**',
      'logs_dev_old/**',
      'agents/**/.eve/**',
      'agents/**/.output/**',
      'agents/**/node_modules/**',
      '.vercel/**',
      'admin_panel/**',
      'contact_email_form/**',
      'firebase_app/**',
    ],
  },
];

export default config;
