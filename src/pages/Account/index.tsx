import { PAGE_URL } from '@/constants/pathUrl';
import { removeCookieAll } from '@/utils/cookie';
import { clearGaUserId } from '@/utils/ga4';
import { history, useModel } from '@umijs/max';
import { Button } from 'antd';

export default function AccountPage() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const name =
    initialState?.currentUser?.displayName ||
    initialState?.currentUser?.username ||
    'admin';

  const logout = () => {
    clearGaUserId();
    removeCookieAll();
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    history.replace(PAGE_URL.login);
  };

  return (
    <section className="app-placeholder">
      <h1>Tài khoản</h1>
      <p>{name}</p>
      <Button onClick={logout}>Đăng xuất</Button>
    </section>
  );
}
