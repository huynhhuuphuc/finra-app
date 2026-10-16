import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Tooltip } from 'antd';
import { setThemeMode, useThemeMode } from './themeStore';


const ThemeToggle = () => {
  const mode = useThemeMode();
  const isDark = mode === 'dark';
  const { setInitialState } = useModel('@@initialState');

  const handleToggle = () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
    setInitialState((prev: any) => ({ ...prev, themeMode: next }));
  };

  return (
    <Tooltip title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}>
      <Button
        type="text"
        aria-label="Đổi giao diện sáng/tối"
        onClick={handleToggle}
        icon={
          isDark ? (
            <SunOutlined style={{ fontSize: 18 }} />
          ) : (
            <MoonOutlined style={{ fontSize: 18 }} />
          )
        }
      />
    </Tooltip>
  );
};

export default ThemeToggle;
