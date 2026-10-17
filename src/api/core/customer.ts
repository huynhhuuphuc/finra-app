import { getCustomerInfo, requestCore } from './index';

export interface CustomerProfile {
  CUSTOMER_NAME?: string;
  NICK_NAME?: string;
  AVATAR_IMG?: string;
  ACCOUNT_CODE?: string;
  CUST_MOBILE?: string;
  CARD_ID?: string;
  BIRTH_DAY?: string;
  CUST_GENDER?: string;
  ISSUE_PLACE_NAME?: string;
  ISSUE_DATE?: string;
  RESEDENCE_ADDRESS?: string;
  CUST_EMAIL?: string;
  CUST_ADDRESS?: string;
  EXPIRE_DATE?: string;
}

export interface CoreResult<T> {
  code: string | number;
  data: T[];
  message?: string;
  msg?: string;
}

export function readCoreData<T>(response: CoreResult<T>): T[] {
  if (String(response.code) !== '1') {
    throw new Error(
      response.message || response.msg || 'Không thể tải dữ liệu.',
    );
  }
  if (!Array.isArray(response.data)) {
    throw new Error('Dữ liệu trả về không đúng định dạng.');
  }
  return response.data;
}

// Temporary device/customer values match the existing Home demo integration.
export const customerApiOptions = {
  deviceId: 'AP3A.240905.015.A2',
  silentError: true,
};

export async function fetchCustomerProfile(
  customerCode: string,
  signal?: AbortSignal,
) {
  const response = await getCustomerInfo<CoreResult<CustomerProfile>>(
    { CUSTOMER_CODE: customerCode },
    { ...customerApiOptions, signal },
  );
  const profile = readCoreData(response)[0];
  if (!profile) throw new Error('Không tìm thấy hồ sơ khách hàng.');
  return { profile, response };
}

export interface TransactionFilters {
  HISTORY_TYPE: string;
  TRANSACTION_TYPE: string;
  FROM_DATE: string;
  TO_DATE: string;
}

export interface CustomerTransaction {
  BUSINESS_CODE?: string;
  C_BUSINESS_DETAIL_CODE?: string;
  PK_CASH_TRANSACTION?: string;
  BUSINESS_TRANS_DETAIL_NAME?: string;
  DUE_DATE?: string;
  CREATE_TIME?: string;
  CASH_IN?: number | string;
  CASH_OUT?: number | string;
  STATUS_NAME?: string;
  TRANSACTION_NO?: string;
  CONTENT?: string;
}

export async function fetchCustomerTransactions(
  accountCode: string,
  filters: TransactionFilters,
  signal?: AbortSignal,
) {
  const response = await requestCore<CoreResult<CustomerTransaction>>(
    'GET_TRANSACTION_HISTORY',
    { ACCOUNT_CODE: accountCode, ...filters },
    { ...customerApiOptions, signal },
  );
  return readCoreData(response);
}

export const getCustomerName = (profile?: CustomerProfile) =>
  profile?.NICK_NAME?.trim() || profile?.CUSTOMER_NAME || '—';

export const getCustomerAvatar = (path?: string) => {
  if (!path?.trim()) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  // Same public image route as AppStrings.imageUrl in the mobile source.
  return `http://api-app-dev.finra.com.vn/api/app/public/view?p=${encodeURIComponent(
    path,
  )}`;
};
