import type { ProLayoutProps } from '@ant-design/pro-components';
import type { ThemeMode } from './themeStore';

type ProToken = ProLayoutProps['token'];

const DARK_TOKEN: ProToken = {
  // Đậm hơn `colorBgContainer` (#141414) để card nội dung nổi lên khỏi nền.
  bgLayout: '#000000',
  header: {
    colorBgHeader: '#1f1f1f',
    colorHeaderTitle: '#ffffff',
    colorTextMenu: 'rgba(255,255,255,0.85)',
    colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
    colorTextMenuSelected: '#d3adf7',
    colorBgMenuItemSelected: 'rgba(144, 61, 196, 0.28)',
    colorTextRightActionsItem: 'rgba(255,255,255,0.85)',
  },
  sider: {
    colorMenuBackground: '#1f1f1f',
    colorTextMenu: 'rgba(255,255,255,0.85)',
    colorTextMenuSelected: '#d3adf7',
    colorTextMenuActive: '#d3adf7',
    colorTextMenuItemHover: '#e0c3fc',
    colorBgMenuItemHover: 'rgba(144, 61, 196, 0.16)',
    colorBgMenuItemSelected: 'rgba(144, 61, 196, 0.28)',
    colorBgMenuItemActive: 'rgba(144, 61, 196, 0.34)',
  },
};

/** Logo dùng chung, đổi theo theme. */
export const LOGO_LIGHT = '/images/logo.svg';
export const LOGO_DARK = '/images/logo.svg';

export const getLogoByTheme = (mode: ThemeMode) =>
  mode === 'dark' ? LOGO_DARK : LOGO_LIGHT;

export const getProLayoutTheme = (mode: ThemeMode) => {
  const isDark = mode === 'dark';
  return {
    navTheme: (isDark ? 'realDark' : 'light') as ProLayoutProps['navTheme'],
    ...(isDark ? { token: DARK_TOKEN } : {}),
  };
};
