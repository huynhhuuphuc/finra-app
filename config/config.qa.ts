import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routes from './routes';
const BASE_URI = process.env.BASE_URI || '123';
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

console.log('BUILD ENV BASE_URI2:', BASE_URI);


export default defineConfig({
  outputPath: 'dist',

  routes,
  antd: {},
  npmClient: 'pnpm',
  access: {},
  fastRefresh: false,
  model: {},
  initialState: {},
  layout: { ...defaultSettings, locale: false },
  locale: false,
  mfsu: { strategy: 'normal', shared: { clsx: { singleton: true } } },
  jsMinifier: 'terser',
  tailwindcss: {},

  define: {
    'process.env.BASE': '',
    'process.env.NAME': 'qa',
    'process.env.HOST': process.env.BASE_URI,
    'process.env.SECRET_KEY': 'salt_value',
    'process.env.GA_MEASUREMENT_ID': GA_MEASUREMENT_ID,
  },
});
