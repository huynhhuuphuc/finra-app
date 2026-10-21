import { PAGE_URL } from '@/constants/pathUrl';
import { removeCookieAll } from '@/utils/cookie';
import { clearGaUserId } from '@/utils/ga4';
import { useQueryClient } from '@tanstack/react-query';
import { history, useModel } from '@umijs/max';

export default function useLogout() {
  const queryClient = useQueryClient();
  const { setInitialState } = useModel('@@initialState');

  return () => {
    clearGaUserId();
    removeCookieAll();
    queryClient.clear();
    setInitialState((state) => ({ ...state, currentUser: undefined }));
    history.replace(PAGE_URL.login);
  };
}
