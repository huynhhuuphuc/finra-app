import { fetchHomeCategories } from '@/api/core/home';
import { useQuery } from '@tanstack/react-query';
import useCustomerSession from './useCustomerSession';

export default function useProductCategories() {
  const { customerCode, token, hasSession } = useCustomerSession();
  return useQuery({
    queryKey: ['home-categories', customerCode, token],
    queryFn: ({ signal }) => fetchHomeCategories(signal),
    enabled: hasSession,
    retry: false,
  });
}
