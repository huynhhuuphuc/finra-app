import { ProLayoutProps } from '@ant-design/pro-components';

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#903dc4',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '',
  pwa: true,
  logo: '/images/logo.svg',
  iconfontUrl: '//at.alicdn.com/t/c/font_4809698_z83i6q5qa6s.js',
  token: {
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    bgLayout: '#F7F5F9',
    header: {
      colorBgHeader: '#fff',
      colorHeaderTitle: '#1f1f1f',
      colorTextMenu: '#1f1f1f',
    },
    sider: {
      colorMenuBackground: '#FFFFFF',
      colorTextMenu: '#595959',
      colorTextMenuSecondary: '#8C8C8C',
      colorTextMenuSelected: '#903dc4',
      colorTextMenuActive: '#903dc4',
      colorTextMenuItemHover: '#903dc4',
      colorBgMenuItemHover: 'rgba(144, 61, 196, 0.06)',
      colorBgMenuItemSelected: '#F9F0FF',
      colorBgMenuItemActive: '#F3E8FF',
    },
  },
};

export default Settings;
