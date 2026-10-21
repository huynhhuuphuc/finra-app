import { fetchCustomerProfile } from '@/api/core/customer';
import { useQuery } from '@tanstack/react-query';
import useCustomerSession from './useCustomerSession';

export default function useCustomerProfile(options?: {
  refetchInterval?: number;
}) {
  const { token, customerCode, hasSession } = useCustomerSession();
  const query = useQuery({
    queryKey: ['customer-profile', customerCode, token],
    queryFn: ({ signal }) => fetchCustomerProfile(customerCode, signal),
    enabled: hasSession,
    staleTime: Infinity,
    retry: false,
    refetchInterval: options?.refetchInterval,
  });
  return {
    ...query,
    profile: query.data?.profile,
    customerCode,
    hasSession,
  };
}
