import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(env.VITE_CLOUDINARY_CLOUD_NAME),
        'process.env.VITE_CLOUDINARY_UPLOAD_PRESET': JSON.stringify(env.VITE_CLOUDINARY_UPLOAD_PRESET)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
