import { PAGE_URL } from '@/constants/pathUrl';
import { useFullScreen } from '@/hooks';
import { removeCookieAll } from '@/utils/cookie';
import { clearGaUserId } from '@/utils/ga4';
import { LogoutOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { App, Spin, theme } from 'antd';
import React, { useCallback, useState } from 'react';
import HeaderDropdown from './HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { token } = theme.useToken();
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.2,
      }}
    >
      <span style={{ color: token.colorText, fontSize: 14 }}>
        {currentUser?.displayName || currentUser?.username || currentUser?.user || ''}
      </span>
      {currentUser?.mail && (
        <span style={{ color: token.colorTextSecondary, fontSize: 12 }}>
          {currentUser.mail}
        </span>
      )}
    </span>
  );
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  // -- state
  const [openForm, setOpenForm] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message, modal } = App.useApp();
  const { isFullScreen, enterFullScreen, exitFullScreen } = useFullScreen();

  // -- methods
  const loginOut = async () => {
    clearGaUserId();
    removeCookieAll();
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    history.replace(PAGE_URL.login);
  };
  const jumpToLoginPages = () => {
    clearGaUserId();
    removeCookieAll();
    message.success('Logout successful');
    history.push('/login');
  };

  // -- styles
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  // -- events
  const onMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (key === 'logout') {
        loginOut();
        return;
      }
      if (key === 'changepsw') {
        setOpenForm(true);
      }
    },
    [setInitialState],
  );

  // -- layouts
  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser) {
    return loading;
  }

  const menuItems = [
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
    </>
  );
};
