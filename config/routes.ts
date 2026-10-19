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
    path: '/products/detail',
    name: 'Chi tiết hợp tác',
    component: '@/pages/Products/components/ProductDetail',
  },
  {
    path: '/products/cooperate',
    name: 'Sản phẩm tích lũy',
    component: '@/pages/Products/components/ProductCooperate',
  },
  {
    path: '/products',
    name: 'Sản phẩm',
    component: '@/pages/Products',
  },
  {
    path: '/for-you',
    name: 'Khám phá',
    component: '@/pages/ForYou',
  },
  {
    path: '/assets/product',
    name: 'Chi tiết sản phẩm',
    component: '@/pages/Assets/components/AssetProductDetail',
    hideInMenu: true,
  },
  {
    path: '/assets',
    name: 'Tài sản',
    component: '@/pages/Assets',
  },
  {
    path: '/account/info',
    name: 'Thông tin tài khoản',
    component: '@/pages/Account/components/AccountDetail/AccountDetail',
  },
  {
    path: '/account/history',
    name: 'Lịch sử giao dịch',
    component:
      '@/pages/Account/components/TransactionHistory/TransactionHistory',
  },
  {
    path: '/account',
    name: 'Tài khoản',
    component: '@/pages/Account',
  },
  { path: '/*', component: '@/pages/404' },
] as RouterConfig[];
