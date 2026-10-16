import { LOGO_LIGHT } from '@/theme/proLayoutTheme';
import { useThemeMode } from '@/theme/themeStore';
import { theme } from 'antd';
import { CSSProperties, memo } from 'react';

export default memo(function Footer() {
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const { token } = theme.useToken();

  const wrapperStyle: CSSProperties = {
    background: 'transparent',
    zIndex: 1,
    padding: '32px 0',
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: token.colorTextSecondary,
    fontSize: 14,
  };

  return (
    <footer style={wrapperStyle}>
      <span>{`© ${new Date().getFullYear()}`}</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: isDark ? '#fff' : 'transparent',
          borderRadius: 6,
          padding: isDark ? '2px 8px' : 0,
        }}
      >
        <img
          src={LOGO_LIGHT}
          alt="Finra"
          style={{ height: 28, width: 'auto', display: 'block' }}
        />
      </span>
    </footer>
  );
});
