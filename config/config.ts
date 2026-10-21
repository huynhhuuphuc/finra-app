import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routes from './routes';
export default defineConfig({
  /**
   * @name Enable hash mode
   * @description Let build artifacts contain hash suffix. Usually used for incremental publishing and avoiding browser cache.
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,

  /**
   ngăn trình duyệt tự động áp dụng Dark Mode cho trang
   */
  metas: [{ name: 'color-scheme', content: 'only light' }],

  /**
   * @name Route configuration, files not imported in routes will not be compiled
   * @description Only supports path, component, routes, redirect, wrappers, title configuration
   * @doc https://umijs.org/docs/guides/routes
   */
  routes,

  /**
   * @name Antd plugin
   * @description Built-in babel import plugin
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {},

  npmClient: 'pnpm',

  /**
   * @name Access plugin
   * @description Permission plugin based on initialState, must enable initialState first
   * @doc https://umijs.org/docs/max/access
   */
  access: {},

  /**
   * @name Fast refresh configuration
   * @description A good hot update component that can preserve state during updates
   */
  fastRefresh: true,

  /**
   * @name Data flow plugin
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},

  /**
   * A global initial data flow that can be used to share data between plugins
   * @description Can be used to store some global data, such as user information, or some global state. Global initial state is created at the beginning of the entire Umi project.
   * @doc https://umijs.org/docs/max/data-flow
   */
  initialState: {},

  /**
   * @name Layout plugin
   * @doc https://umijs.org/docs/max/layout-menu
   */
  layout: {
    ...defaultSettings,
    locale: false,
  },

  locale: false,

  mfsu: {
    strategy: 'normal',
    shared: {
      clsx: {
        singleton: true,
      },
    },
  },
  jsMinifier: 'terser',
  tailwindcss: {},
  proxy: {
    '/finra-auth': {
      target: 'http://172.16.90.62:9090',
      changeOrigin: true,
      pathRewrite: { '^/finra-auth': '' },
    },
    '/finra-v2': {
      target: 'https://api-app-dev-v2.finra.com.vn',
      changeOrigin: true,
      pathRewrite: { '^/finra-v2': '' },
    },
    '/finra-app': {
      target: 'http://api-app-dev.finra.com.vn',
      changeOrigin: true,
      pathRewrite: { '^/finra-app': '' },
    },
    '/cms-api': {
      target: 'https://uat-cms.finra.com.vn',
      changeOrigin: true,
      pathRewrite: { '^/cms-api': '' },
    },
    '/core': {
      target: 'http://172.16.90.62:9090',
      changeOrigin: true,
    },
  },
});
