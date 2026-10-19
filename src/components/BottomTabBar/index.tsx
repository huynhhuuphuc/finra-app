import { history, useLocation } from '@umijs/max';

type TabItem = {
  path: string;
  label: string;
  icon: string;
};

const TABS: TabItem[] = [
  { path: '/home', label: 'Trang chủ', icon: '/images/tabs/home.svg' },
  { path: '/products', label: 'Sản phẩm', icon: '/images/tabs/products.svg' },
  { path: '/for-you', label: 'Khám phá', icon: '/images/tabs/for-you.svg' },
  { path: '/assets', label: 'Tài sản', icon: '/images/tabs/assets.svg' },
  { path: '/account', label: 'Tài khoản', icon: '/images/tabs/account.svg' },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="app-tabbar" aria-label="Điều hướng chính">
      {TABS.map((tab) => {
        const active =
          pathname === tab.path || pathname.startsWith(`${tab.path}/`);
        return (
          <button
            key={tab.path}
            type="button"
            className={active ? 'app-tab app-tab-active' : 'app-tab'}
            onClick={() => {
              if (!active) history.push(tab.path);
            }}
          >
            <span
              className="app-tab-icon"
              style={{ ['--tab-icon' as string]: `url("${tab.icon}")` }}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
