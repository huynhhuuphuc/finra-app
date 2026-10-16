import { defineConfig } from '@umijs/max';
// TODO: For local development, please modify HOST address according to your local IP
const HOST = {
  BackendA: 'https://test-boltholdings.upse.vn',
  BackendB: 'Backend B server address here',
};
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

export default defineConfig({
  outputPath: 'dist',
  define: {
    'process.env.BASE': '',
    'process.env.NAME': 'development',
    // 'process.env.HOST': 'http://172.33.30.23:8100',
    'process.env.HOST': process.env.BASE_URI,
    'process.env.SECRET_KEY': 'salt_value',
    'process.env.GA_MEASUREMENT_ID': GA_MEASUREMENT_ID,
  },
});
