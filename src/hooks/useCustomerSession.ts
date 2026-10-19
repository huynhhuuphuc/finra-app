import { ACCESS_TOKEN, USER_INFO } from '@/constants/cookie';
import type { CurrentUser } from '@/types/currentUser';
import { getCookie } from '@/utils/cookie';

export default function useCustomerSession() {
  const token = getCookie(ACCESS_TOKEN) as string;
  const currentUser = getCookie(USER_INFO) as CurrentUser | null;
  const customerCode =
    typeof currentUser?.customerCode === 'string'
      ? currentUser.customerCode
      : '';
  return {
    token,
    currentUser,
    customerCode,
    accountCode: currentUser?.accountCode || '',
    hasSession: Boolean(
      token &&
        token !== 'demo-session' &&
        customerCode &&
        currentUser?.accountCode,
    ),
  };
}
