import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routes from './routes';

const BASE_URI = process.env.BASE_URI || 'https://prod-noti.finra.com.vn';
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || 'G-J80F828GC5';

console.log('BUILD ENV BASE_URI1:', BASE_URI);

export default defineConfig({
  outputPath: 'dist',
  routes,
  antd: {},
  npmClient: 'pnpm',
  access: {},
  fastRefresh: false,
  model: {},
  initialState: {},
  layout: { locale: true, ...defaultSettings },
  locale: { default: 'en-US' },
  mfsu: { strategy: 'normal', shared: { clsx: { singleton: true } } },
  jsMinifier: 'terser',
  tailwindcss: {},

  define: {
    'process.env.BASE': '',
    'process.env.NAME': 'production',
    'process.env.HOST': BASE_URI,
    'process.env.SECRET_KEY': 'salt_value',
    'process.env.GA_MEASUREMENT_ID': GA_MEASUREMENT_ID,
  },
});
