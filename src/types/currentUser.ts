/** Session profile mapped from /login data.lst[0]. */
export type CurrentUser = {
  user: string;
  username: string;
  token_type: string;
  customerCode?: string;
  accountCode?: string;
  fullName?: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  cashBalance?: number;
  resetFlag?: number;
  isHasTrans?: boolean;
  isHasContract?: boolean;
  sessionTimeoutMinutes?: number;
  access?: string[];
  permissions?: string[];
  displayName?: string;
  mail?: string | null;
};
