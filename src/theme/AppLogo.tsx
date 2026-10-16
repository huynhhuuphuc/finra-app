import { PAGE_URL } from '@/constants/pathUrl';
import { history } from '@umijs/max';
import { Grid } from 'antd';
import { LOGO_LIGHT } from './proLayoutTheme';
import { useThemeMode } from './themeStore';

export const LOGO_SHORT = '/logo.png';

const AppLogo = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  if (isMobile) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? '#fff' : 'transparent',
          borderRadius: 8,
          padding: isDark ? 4 : 0,
        }}
        onClick={() => {
          history.push(PAGE_URL.dashboard);
        }}
      >
        <img
          src={LOGO_SHORT}
          alt="Finra"
          style={{ height: 16, width: 16, borderRadius: 6, display: 'block' }}
        />
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: isDark ? '#fff' : 'transparent',
        borderRadius: 8,
        padding: isDark ? '4px 10px' : 0,
      }}
      onClick={() => {
        history.push(PAGE_URL.dashboard);
      }}
    >
      <img
        src={LOGO_LIGHT}
        alt="Finra"
        style={{ height: 36, width: 'auto', display: 'block' }}
      />
    </span>
  );
};

export default AppLogo;
