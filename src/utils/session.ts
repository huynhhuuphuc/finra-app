import { PAGE_URL } from '@/constants/pathUrl';
import { removeCookieAll } from '@/utils/cookie';
import { history } from '@umijs/max';
import { Modal } from 'antd';

let sessionModalOpened = false;

/**
 * Show session expiration popup and redirect to login.
 * @param opts.removeNow true = delete cookie now (more secure); false = delete when OK is clicked
 * @param opts.loginPath login page path (default '/login')
 */
export function handleSessionExpired(opts?: {
  removeNow?: boolean;
  loginPath?: string;
}) {
  if (sessionModalOpened) return;
  sessionModalOpened = true;

  const removeNow = opts?.removeNow ?? false;
  const loginPath = opts?.loginPath ?? PAGE_URL.login;

  if (removeNow) {
    removeCookieAll();
  }

  Modal.error({
    title: 'Session expired',
    content: 'Please log in again.',
    okText: 'OK',
    centered: true,
    maskClosable: false,
    onOk: () => {
      if (!removeNow) {
        removeCookieAll();
      }
      sessionModalOpened = false;
      history.replace(loginPath);
    },
    afterClose: () => {
      sessionModalOpened = false;
    },
  });
}
