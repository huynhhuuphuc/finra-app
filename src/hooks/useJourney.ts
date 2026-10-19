import {
  createJourney,
  finishJourneyLevelUp,
  updateJourney,
  type Journey,
} from '@/utils/journey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useCustomerSession from './useCustomerSession';

export default function useJourney() {
  const { customerCode, token } = useCustomerSession();
  const key = ['journey-demo', customerCode, token];
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: key,
    initialData: createJourney,
    enabled: false,
    queryFn: createJourney,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const [celebration, setCelebration] = useState<string | null>(null);
  useEffect(() => {
    if (!data.levelUpPending) return;
    const timer = setTimeout(() => {
      queryClient.setQueryData<Journey>(key, (previous) =>
        previous ? finishJourneyLevelUp(previous) : previous,
      );
      setCelebration(`${customerCode}:${token}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [data.levelUpPending, customerCode, token, queryClient]);
  return {
    journey: data,
    celebrating: celebration === `${customerCode}:${token}`,
    closeCelebration: () => setCelebration(null),
    act: (id: string, action: 'perform' | 'claim') =>
      queryClient.setQueryData<Journey>(key, (previous) =>
        updateJourney(previous || createJourney(), id, action),
      ),
  };
}
