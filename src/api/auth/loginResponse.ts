import type { CurrentUser } from '@/types/currentUser';

export interface LoginAccount {
  ACCOUNT_NAME?: string;
  AVATAR_IMG?: string;
  ACCOUNT_CODE: string;
  CUSTOMER_CODE: string;
  CASH_BALANCE?: number;
  RESET_FLAG?: number;
  IS_HAS_TRANS?: number;
  IS_HAS_CONTRACT?: number;
  USER_NAME?: string;
  NICK_NAME?: string;
  CUSTOMER_PHONE?: string;
}
export interface LoginResponse {
  code: number | string;
  message?: string;
  data?: { token?: string; refreshToken?: string; lst?: LoginAccount[] };
}

export function parseLoginResponse(response: LoginResponse, loginName: string) {
  if (String(response?.code) !== '1') {
    throw new Error(response?.message || 'Đăng nhập không thành công.');
  }
  const data = response.data;
  const account = Array.isArray(data?.lst) ? data.lst[0] : undefined;
  if (
    typeof data?.token !== 'string' ||
    !data.token.trim() ||
    typeof data.refreshToken !== 'string' ||
    !data.refreshToken.trim() ||
    typeof account?.CUSTOMER_CODE !== 'string' ||
    !account.CUSTOMER_CODE.trim() ||
    typeof account.ACCOUNT_CODE !== 'string' ||
    !account.ACCOUNT_CODE.trim()
  ) {
    throw new Error('Phản hồi đăng nhập thiếu token hoặc thông tin tài khoản.');
  }
  // Business identifiers come from lst, never username or decoded JWT claims.
  const currentUser: CurrentUser = {
    user: account.USER_NAME || loginName,
    username: account.USER_NAME || loginName,
    token_type: 'Bearer',
    customerCode: account.CUSTOMER_CODE,
    accountCode: account.ACCOUNT_CODE,
    displayName: account.NICK_NAME || account.ACCOUNT_NAME || loginName,
    fullName: account.ACCOUNT_NAME || '',
    nickname: account.NICK_NAME || '',
    phone: account.CUSTOMER_PHONE || '',
    avatar: account.AVATAR_IMG || '',
    cashBalance: account.CASH_BALANCE,
    resetFlag: Number(account.RESET_FLAG || 0),
    isHasTrans: Number(account.IS_HAS_TRANS || 0) === 1,
    isHasContract: Number(account.IS_HAS_CONTRACT || 0) === 1,
    permissions: [],
  };
  return { token: data.token, refreshToken: data.refreshToken, currentUser };
}
