import AntWrapApp from '@/components/@lgs/GlobalMessage';
import {
  ProConfigProvider,
  viVNIntl,
  type Settings as LayoutSettings,
} from '@ant-design/pro-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { history, RunTimeLayoutConfig, useLocation } from '@umijs/max';
import { App } from 'antd';
import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import defaultSettings from '../config/defaultSettings';
import BottomTabBar from './components/BottomTabBar';
import { ACCESS_TOKEN, USER_INFO } from './constants/cookie';
import { PENDING_LOGIN } from './constants/otp';
import { PAGE_URL } from './constants/pathUrl';
import NoPermission from './pages/403';
import ThemeProvider from './theme/ThemeProvider';
import { getThemeMode, useThemeMode, type ThemeMode } from './theme/themeStore';
import type { CurrentUser } from './types/currentUser';
import { getCookie, removeCookieAll } from './utils/cookie';
import { clearGaUserId, setGaUserId, trackPageView } from './utils/ga4';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const TAB_PATHS = new Set([
  '/home',
  '/products',
  '/for-you',
  '/assets',
  '/account',
]);
const getBase = () => (window as any)?.routerBase || '/';
const stripBase = (p: string) => {
  const base = getBase();
  return p.startsWith(base) ? p.slice(base.length - 1) : p;
};
let NAV_LOCK = false;

type PageTransition = 'forward' | 'back' | 'none';

// Độ sâu theo URL: tab chính = 1, trang con (/account/history) = 2...
const pageDepth = (path: string) =>
  TAB_PATHS.has(path) ? 1 : path.split('/').filter(Boolean).length;

function usePageTransition(path: string) {
  const prevPath = useRef(path);
  const [transition, setTransition] = useState<PageTransition>('none');
  if (prevPath.current !== path) {
    const from = pageDepth(prevPath.current);
    const to = pageDepth(path);
    const wasTab = TAB_PATHS.has(prevPath.current);
    prevPath.current = path;
    let next: PageTransition;
    if (to !== from) next = to > from ? 'forward' : 'back';
    // Cùng độ sâu giữa 2 tab chính: chuyển tab, không trượt.
    else if (wasTab && TAB_PATHS.has(path)) next = 'none';
    // Cùng độ sâu theo history.
    else if (history.action === 'PUSH') next = 'forward';
    else if (history.action === 'POP') next = 'back';
    else next = 'none';
    if (next !== transition) setTransition(next);
  }
  return transition;
}

function AppShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const path = stripBase(pathname);
  const showTabs = TAB_PATHS.has(path);
  const transition = usePageTransition(path);
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [path]);

  return (
    <div className="app-shell">
      <div ref={bodyRef} className="app-shell-body">
        <div key={path} className={`app-page app-page--${transition}`}>
          {children}
        </div>
      </div>
      {showTabs ? <BottomTabBar /> : null}
    </div>
  );
}

export function onRouteChange({
  location,
}: {
  location: Location & { pathname?: string };
}) {
  if (NAV_LOCK) return;

  const rawPath = location?.pathname || window.location.pathname;
  const atLogin = /(^|\/)login(\/|$)/.test(rawPath);
  const atOtp = /(^|\/)otp(\/|$)/.test(rawPath);
  const atPublic = stripBase(rawPath) === PAGE_URL.developing;
  const storedToken = getCookie(ACCESS_TOKEN);
  const user = getCookie(USER_INFO) as CurrentUser | null;
  const token =
    storedToken &&
    storedToken !== 'demo-session' &&
    user?.customerCode &&
    user?.accountCode
      ? storedToken
      : '';
  if (storedToken && !token) removeCookieAll();
  sessionStorage.removeItem(PENDING_LOGIN);

  if (!token && !atLogin && !atPublic) {
    NAV_LOCK = true;
    history.replace(PAGE_URL.login);
    queueMicrotask(() => {
      NAV_LOCK = false;
    });
    return;
  }

  if (token && (atLogin || atOtp)) {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const target =
      redirect && redirect !== PAGE_URL.login ? redirect : PAGE_URL.home;

    if (stripBase(rawPath) !== stripBase(target)) {
      NAV_LOCK = true;
      history.replace(target);
      queueMicrotask(() => {
        NAV_LOCK = false;
      });
    }
  }

  const cleanedPath = stripBase(rawPath);
  const title = typeof document !== 'undefined' ? document.title : undefined;
  queueMicrotask(() => {
    trackPageView(cleanedPath, title);
  });
}

const AppProviders = ({ children }: PropsWithChildren) => {
  const mode = useThemeMode();
  return (
    <ProConfigProvider intl={viVNIntl} dark={mode === 'dark'}>
      <App>
        <AntWrapApp />
        {children}
      </App>
    </ProConfigProvider>
  );
};

export const rootContainer = (root: JSX.Element) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProviders>
          <div className="app-stage">
            <div className="app-phone">{root}</div>
          </div>
        </AppProviders>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
  ready?: boolean;
  themeMode?: ThemeMode;
}> {
  const recordGaIdentity = (user?: any) => {
    const gaUserId =
      user?.login_id ||
      user?.user_name ||
      user?.username ||
      user?.profile?.userId ||
      user?.nickname ||
      user?.fullName ||
      user?.user;

    queueMicrotask(() => {
      if (gaUserId) {
        setGaUserId(gaUserId);
      } else {
        clearGaUserId();
      }
    });
  };

  const fetchUserInfo = async () => {
    const user = getCookie(USER_INFO) as CurrentUser | undefined;
    recordGaIdentity(user);
    return user;
  };

  const storedToken = getCookie(ACCESS_TOKEN);
  const storedUser = getCookie(USER_INFO) as CurrentUser | null;
  const hasToken = Boolean(
    storedToken &&
      storedToken !== 'demo-session' &&
      storedUser?.customerCode &&
      storedUser?.accountCode,
  );
  if (storedToken && !hasToken) removeCookieAll();
  const currentUser = hasToken ? await fetchUserInfo() : undefined;

  if (!currentUser) {
    recordGaIdentity(undefined);
  }

  return {
    fetchUserInfo,
    currentUser,
    ready: true,
    themeMode: getThemeMode(),
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    ...initialState?.settings,
    pure: true,
    menuRender: false,
    headerRender: false,
    footerRender: false,
    menuHeaderRender: false,
    onPageChange: () => {
      const raw = history?.location?.pathname || window.location.pathname;
      const path = stripBase(raw);
      if (path === PAGE_URL.login) return;

      const user = getCookie(USER_INFO) as any | undefined;
      const cur = initialState?.currentUser;

      const uid = user?.username ?? user?.user ?? user?.fullName ?? '';
      const cuid = cur?.username ?? cur?.user ?? cur?.fullName ?? '';

      if (uid && uid !== cuid) {
        setInitialState((prev) => ({ ...prev, currentUser: user }));
      }
    },
    childrenRender: (children) => <AppShell>{children}</AppShell>,
    unAccessible: <NoPermission />,
  };
};
