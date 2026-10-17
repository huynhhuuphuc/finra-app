import { ACCESS_TOKEN, USER_INFO } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';

export default function useCustomerSession() {
  const token = getCookie(ACCESS_TOKEN) as string;
  const user = getCookie(USER_INFO) as {
    customerCode?: string;
    CUSTOMER_CODE?: string;
  } | null;
  const customerCode = user?.customerCode || user?.CUSTOMER_CODE || '000814';
  return {
    token,
    // Existing login is still a demo; use its configured customer until real login.
    customerCode,
    accountCode: `${customerCode}1`,
    hasSession: Boolean(token),
  };
}
