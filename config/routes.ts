interface RouterConfig {
  path: string;
  component?: string;
  routes?: RouterConfig[];
  redirect?: string;
  wrappers?: any;
  name?: string;
  icon?: string;
  hideInBreadcrumb?: boolean;
  layout?: boolean;
  menuRender?: boolean;
  menuHeaderRender?: boolean;
  headerRender?: boolean;
  hideInMenu?: boolean;
  access?: string;
}

export default [
  {
    path: '/',
    redirect: '/assets',
  },
  {
    path: '/login',
    component: '@/pages/Login',
    layout: false,
  },
  {
    path: '/otp',
    component: '@/pages/Otp',
    layout: false,
  },
  {
    path: '/home',
    name: 'Trang chủ',
    component: '@/pages/Home',
  },
  {
    path: '/products',
    name: 'Sản phẩm',
    component: '@/pages/Products',
  },
  {
    path: '/for-you',
    name: 'For You',
    component: '@/pages/ForYou',
  },
  {
    path: '/assets',
    name: 'Tài sản',
    component: '@/pages/Assets',
  },
  {
    path: '/account',
    name: 'Tài khoản',
    component: '@/pages/Account',
  },
  { path: '/*', component: '@/pages/404' },
] as RouterConfig[];
