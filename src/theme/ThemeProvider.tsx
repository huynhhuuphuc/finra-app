import { ConfigProvider, theme as antdTheme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import type { PropsWithChildren } from 'react';
import defaultSettings from '../../config/defaultSettings';
import { useThemeMode } from './themeStore';

/** Primary lấy từ `config/defaultSettings.ts` → `colorPrimary` */
export const BRAND_PRIMARY =
  (defaultSettings.colorPrimary as string) || '#903dc4';

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const mode = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: BRAND_PRIMARY,
          fontFamily: "'Inter', 'Poppins', sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
