import { fetchAssetSummary } from '@/api/core/assets';
import { fetchCustomerTransactions } from '@/api/core/customer';
import { fetchHomeCategories, fetchNearInterest } from '@/api/core/home';
import { useQuery } from '@tanstack/react-query';
import useCustomerProfile from './useCustomerProfile';
import useCustomerSession from './useCustomerSession';

/** Auto-refresh so balances update after a deposit without a manual reload. */
const HOME_REFETCH_INTERVAL = 30_000;

export default function useHomeData() {
  const session = useCustomerSession();
  const profile = useCustomerProfile({
    refetchInterval: HOME_REFETCH_INTERVAL,
  });
  const { token, customerCode, accountCode, hasSession } = session;
  const summary = useQuery({
    queryKey: ['asset-summary', customerCode, token],
    queryFn: ({ signal }) => fetchAssetSummary(customerCode, signal),
    enabled: hasSession,
    retry: false,
    refetchInterval: HOME_REFETCH_INTERVAL,
  });
  const categories = useQuery({
    queryKey: ['home-categories', customerCode, token],
    queryFn: ({ signal }) => fetchHomeCategories(signal),
    enabled: hasSession,
    retry: false,
  });
  const nearInterest = useQuery({
    queryKey: ['near-interest', customerCode, token],
    queryFn: ({ signal }) => fetchNearInterest(customerCode, signal),
    enabled: hasSession,
    retry: false,
    refetchInterval: HOME_REFETCH_INTERVAL,
  });
  const filters = {
    HISTORY_TYPE: '',
    TRANSACTION_TYPE: '',
    FROM_DATE: '',
    TO_DATE: '',
  };
  const transactions = useQuery({
    queryKey: ['transactions', customerCode, accountCode, token, filters],
    queryFn: ({ signal }) =>
      fetchCustomerTransactions(accountCode!, filters, signal),
    enabled: hasSession && Boolean(accountCode),
    retry: false,
    refetchInterval: HOME_REFETCH_INTERVAL,
  });
  return {
    ...session,
    profile,
    summary,
    categories,
    nearInterest,
    transactions,
  };
}
