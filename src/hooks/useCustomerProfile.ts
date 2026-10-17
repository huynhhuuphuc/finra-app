import { fetchCustomerProfile } from '@/api/core/customer';
import { ACCESS_TOKEN, USER_INFO } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';

export default function useCustomerProfile() {
  const token = getCookie(ACCESS_TOKEN) as string;
  const user = getCookie(USER_INFO) as {
    customerCode?: string;
    CUSTOMER_CODE?: string;
  } | null;
  const customerCode = user?.customerCode || user?.CUSTOMER_CODE || '000814';
  const query = useQuery({
    queryKey: ['customer-profile', customerCode, token],
    queryFn: ({ signal }) => fetchCustomerProfile(customerCode, signal),
    enabled: Boolean(token),
    staleTime: Infinity,
    retry: false,
  });
  return {
    ...query,
    profile: query.data?.profile,
    customerCode,
    hasSession: Boolean(token),
  };
}
