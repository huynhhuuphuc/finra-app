import { PENDING_LOGIN } from '@/constants/otp';
import { PAGE_URL } from '@/constants/pathUrl';
import { history } from '@umijs/max';
import { useEffect } from 'react';

/** The current /login contract returns a completed session, not an OTP challenge. */
export default function OtpPage() {
  useEffect(() => {
    sessionStorage.removeItem(PENDING_LOGIN);
    history.replace(PAGE_URL.login);
  }, []);
  return null;
}
