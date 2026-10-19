import { ACCESS_TOKEN } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { requestCus } from '../apiConfig';
import { parseAmount } from './assets';
import { customerApiOptions, readCoreData, type CoreResult } from './customer';
import { requestCore } from './index';

const V2_HOST =
  process.env.NAME === 'development'
    ? '/finra-v2'
    : 'https://api-app-dev-v2.finra.com.vn';

export interface InvestmentProduct {
  PRODUCT_CODE: string;
  PRODUCT_NAME?: string;
  PRODUCT_TYPE?: string;
  URL_BANNER?: string;
  TERM?: string;
  FEE_RATE?: number | string;
  CAP_MIN?: number | string;
  CAP_MAX?: number | string;
  LIQUID_TYPE?: number | string;
  EXTEND_FLAG?: number | string;
}
export interface FeeReceive {
  EXPIRE_DAY?: string;
  INTEREST_RECEIVED?: number | string;
}
export interface ProductConfirmation {
  WEB_PRODUCT_TYPE_NAME?: string;
  FEE_RATE?: number | string;
  OPEN_DATE?: string;
  EXPIRE_DATE?: string;
  INTEREST_RECEIVED?: number | string;
  DAY_PAY?: number | string;
  INTEREST_DATE?: string;
  INTEREST_RECEIVED_NEAR?: number | string;
  INTEREST_RECEIVED_SUM?: number | string;
  AUTO_EXTEND?: number | string;
}
export interface PartnerInfo {
  saleName?: string;
  saleCode?: string;
  phoneNumber?: string;
  saleType?: string;
}
export interface ExtendOption {
  EXTEND_TYPE: string;
  EXTEND_NAME?: string;
}

function validateRows<T>(response: CoreResult<T>): T[] {
  const rows = readCoreData(response);
  if (rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row)))
    throw new Error('Dữ liệu sản phẩm không hợp lệ.');
  return rows;
}
function first<T>(response: CoreResult<T>): T {
  const row = validateRows(response)[0];
  if (!row) throw new Error('Không tìm thấy thông tin sản phẩm.');
  return row;
}
export async function fetchInvestmentProducts(
  categoryCode: string,
  page: number,
  signal?: AbortSignal,
) {
  const products = validateRows(
    await requestCore<CoreResult<InvestmentProduct>>(
      'GET_PRODUCT',
      {
        WEB_PRODUCT_TYPE: categoryCode,
        PK_MM_FEE_RATE: '',
        PAGE: page,
        RECORD_PER_PAGE: 10,
      },
      { ...customerApiOptions, signal },
    ),
  );
  if (
    products.some(
      (product) =>
        typeof product.PRODUCT_CODE !== 'string' ||
        !product.PRODUCT_CODE.trim(),
    )
  ) {
    throw new Error('Gói sản phẩm chưa có mã hợp lệ.');
  }
  return products;
}
export async function fetchProductFee(
  productCode: string,
  amount: number,
  signal?: AbortSignal,
) {
  const rows = validateRows(
    await requestCore<CoreResult<FeeReceive>>(
      'GET_FEE_RECEIVE',
      {
        PRODUCT_CODE: productCode,
        CASH_VALUE: amount,
      },
      { ...customerApiOptions, signal },
    ),
  );
  return rows[0] || null;
}
export async function fetchProductConfirmation(
  productCode: string,
  amount: number,
  signal?: AbortSignal,
) {
  return first(
    await requestCore<CoreResult<ProductConfirmation>>(
      'GET_CONFIRM_PRODUCT',
      {
        PRODUCT_CODE: productCode,
        CASH_VALUE: amount,
      },
      { ...customerApiOptions, signal },
    ),
  );
}
export async function fetchExtendOptions(
  productType: string,
  signal?: AbortSignal,
) {
  return validateRows(
    await requestCore<CoreResult<ExtendOption>>(
      'GET_CONTRACT_EXTEND_TYPE',
      {
        PRODUCT_TYPE: productType,
      },
      { ...customerApiOptions, signal },
    ),
  );
}
async function requestV2<R>(
  path: string,
  body?: unknown,
  signal?: AbortSignal,
): Promise<R> {
  const token = getCookie(ACCESS_TOKEN);
  return requestCus<R>({
    url: `${V2_HOST}${path}`,
    method: body === undefined ? 'GET' : 'POST',
    data: body,
    signal,
    silentError: true,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      lang: 'vi',
      device_id: customerApiOptions.deviceId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
export async function fetchPartnerInfo(
  criteria: { SALE_ID: string } | { C_PHONE: string },
  signal?: AbortSignal,
) {
  const response = await requestV2<CoreResult<PartnerInfo>>(
    '/api/fr/partner/get-sale-info',
    criteria,
    signal,
  );
  return validateRows(response)[0] || null;
}
export async function fetchProductConfiguration(signal?: AbortSignal) {
  const response = await requestV2<{
    code: number | string;
    data: { 'finra-shield'?: { product_code?: string } };
    message?: string;
  }>('/api/config', undefined, signal);
  if (
    String(response.code) !== '1' ||
    !response.data ||
    typeof response.data !== 'object'
  )
    throw new Error(response.message || 'Không thể tải cấu hình sản phẩm.');
  return response.data;
}
export function validateInvestmentAmount(
  product: InvestmentProduct | undefined,
  input: string,
  balance: unknown,
): string | null {
  if (!product?.PRODUCT_CODE) return 'Vui lòng chọn một gói hợp lệ.';
  if (
    !/^\d+$/.test(input) ||
    !Number.isSafeInteger(Number(input)) ||
    Number(input) <= 0
  )
    return 'Vui lòng nhập số tiền nguyên lớn hơn 0.';
  const amount = Number(input),
    min = parseAmount(product.CAP_MIN),
    max = parseAmount(product.CAP_MAX),
    available = parseAmount(balance);
  if (min === null || max === null) return 'Gói chưa có hạn mức hợp lệ.';
  if (amount < min)
    return `Số tiền tối thiểu ${new Intl.NumberFormat('vi-VN').format(min)}đ.`;
  if (max !== -1 && amount > max)
    return `Số tiền tối đa ${new Intl.NumberFormat('vi-VN').format(max)}đ.`;
  if (available === null) return 'Chưa tải được số dư khả dụng.';
  if (amount > available) return 'Số tiền vượt số dư khả dụng.';
  return null;
}
