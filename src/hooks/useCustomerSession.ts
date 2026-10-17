import { ACCESS_TOKEN, USER_INFO } from '@/constants/cookie';
import type { CurrentUser } from '@/types/currentUser';
import { getCookie } from '@/utils/cookie';

export default function useCustomerSession() {
  const token = getCookie(ACCESS_TOKEN) as string;
  const currentUser = getCookie(USER_INFO) as CurrentUser | null;
  const customerCode =
    typeof currentUser?.user === 'string' ? currentUser.user.trim() : '';
  return {
    token,
    currentUser,
    customerCode,
    accountCode: customerCode ? `${customerCode}1` : '',
    hasSession: Boolean(token && customerCode),
  };
}
