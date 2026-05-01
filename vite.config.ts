import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          academics: path.resolve(__dirname, 'academics.html'),
          admissions: path.resolve(__dirname, 'admissions.html'),
          studentLife: path.resolve(__dirname, 'student-life.html'),
          newsEvents: path.resolve(__dirname, 'news-events.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          portalLogin: path.resolve(__dirname, 'portal/login.html'),
          portalApply: path.resolve(__dirname, 'portal/apply.html'),
          portalDashboard: path.resolve(__dirname, 'portal/dashboard.html'),
          portalResults: path.resolve(__dirname, 'portal/results.html'),
          portalPayments: path.resolve(__dirname, 'portal/payments.html'),
          portalProfile: path.resolve(__dirname, 'portal/profile.html'),
          portalDocuments: path.resolve(__dirname, 'portal/documents.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
