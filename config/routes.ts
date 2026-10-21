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
    path: '/developing',
    component: '@/components/DevelopingPage',
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
    path: '/assets/accumulation',
    name: 'Thông tin chi tiết',
    component: '@/pages/Assets/components/AccumulationDetail',
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
    path: '/account/password',
    name: 'Đổi mật khẩu đăng nhập',
    component: '@/pages/Account/components/ChangePassword/ChangePassword',
  },
  {
    path: '/account/contracts/view',
    name: 'Hợp đồng',
    component: '@/pages/Account/components/Contracts/ContractViewer',
  },
  {
    path: '/account/contracts',
    name: 'Danh sách hợp đồng',
    component: '@/pages/Account/components/Contracts/ContractList',
  },
  {
    path: '/account/support',
    name: 'Thông tin hỗ trợ',
    component: '@/pages/Account/components/SupportInfo/SupportInfo',
  },
  {
    path: '/account/about',
    name: 'Thông tin ứng dụng',
    component: '@/pages/Account/components/AboutFinra/AboutFinra',
  },
  {
    path: '/account',
    name: 'Tài khoản',
    component: '@/pages/Account',
  },
  { path: '/*', component: '@/pages/404' },
] as RouterConfig[];
