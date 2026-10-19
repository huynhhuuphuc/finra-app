import { customerApiOptions, readCoreData, type CoreResult } from './customer';
import type { NearInterest } from './home';
import { requestCore } from './index';

export interface AssetGroupSummary {
  SUM_CASH?: number | string | null;
  SUM_FEE_VALUE?: number | string | null;
  FEE_VALUE?: number | string | null;
}

export interface AssetAccumulation extends NearInterest {
  IS_WEB_PRODUCT_TYPE_ACTIVE?: number | string | null;
}

export interface AssetAccumulationDetail
  extends AssetAccumulation,
    AssetGroupSummary {
  PRODUCT_CODE?: string;
  PRODUCT_TYPE?: string;
  PRODUCT_NAME?: string;
  WEB_PRODUCT_TYPE_NAME?: string;
  LIQUID_TYPE?: number | string;
  EXTEND_FLAG?: number | string;
  CAPITAL_FLEX_MAX?: number | string;
  CAPITAL_LEFT?: number | string;
  PENALTY_CASH?: number | string;
  NOTE?: string;
  APPENDIX_CODE?: string;
  TERM?: string;
  FEE_RATE?: number | string;
  INTEREST_DATE?: string;
  DAY_PAY?: number | string;
}

function firstRow<T>(response: CoreResult<T>): T {
  const row = readCoreData(response)[0];
  if (!row || typeof row !== 'object' || Array.isArray(row)) {
    throw new Error('Không tìm thấy thông tin chi tiết tài sản.');
  }
  return row;
}

export async function fetchAssetGroupSummary(
  customerCode: string,
  webProductType: string,
  signal?: AbortSignal,
) {
  const response = await requestCore<CoreResult<AssetGroupSummary>>(
    'GET_CONTRACT_DETAIL_CASH',
    { CUSTOMER_CODE: customerCode, WEB_PRODUCT_TYPE: webProductType },
    { ...customerApiOptions, signal },
  );
  return firstRow(response);
}

export async function fetchAssetAccumulations(
  customerCode: string,
  webProductType: string,
  signal?: AbortSignal,
) {
  const response = await requestCore<CoreResult<AssetAccumulation>>(
    'GET_CONTRACT_DETAIL',
    { CUSTOMER_CODE: customerCode, WEB_PRODUCT_TYPE: webProductType },
    { ...customerApiOptions, signal },
  );
  const rows = readCoreData(response);
  if (
    rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))
  ) {
    throw new Error('Danh sách khoản tích luỹ không hợp lệ.');
  }
  return rows;
}

export async function fetchAssetAccumulationDetail(
  appendixId: string,
  signal?: AbortSignal,
) {
  const response = await requestCore<CoreResult<AssetAccumulationDetail>>(
    'GET_CONTRACT_DETAIL_INFO',
    { PK_MM_APPENDIX: appendixId },
    { ...customerApiOptions, signal },
  );
  return firstRow(response);
}

export const canOpenMoreAccumulations = (rows: AssetAccumulation[]) =>
  !rows.some(
    (row) =>
      row.IS_WEB_PRODUCT_TYPE_ACTIVE !== null &&
      row.IS_WEB_PRODUCT_TYPE_ACTIVE !== undefined &&
      String(row.IS_WEB_PRODUCT_TYPE_ACTIVE) === '0',
  );

/** Rename and note changes do not use the transaction OTP flow in mobile. */
export async function updateAccumulationText(
  appendixId: string,
  type: 'NAME' | 'NOTE',
  content: string,
) {
  const value = content.trim();
  if (
    !appendixId ||
    (type === 'NAME' && !value) ||
    Array.from(value).length > (type === 'NAME' ? 20 : 60)
  ) {
    throw new Error('Tên hoặc ghi chú không hợp lệ.');
  }
  const response = await requestCore<{
    code: number | string;
    message?: string;
    re?: string;
  }>(
    'UPDATE_CONTRACT_DETAIL_INFO',
    { PK_MM_APPENDIX: appendixId, TYPE: type, CONTENT: value },
    customerApiOptions,
  );
  if (String(response.code) !== '1') {
    throw new Error(
      response.re || response.message || 'Không thể lưu thay đổi.',
    );
  }
}

export interface LiquidPreview {
  NAME?: string;
  INTEREST_CASH?: number | string;
  RAW_CASH?: number | string;
  TERM_NAME?: string;
  WEB_PRODUCT_TYPE_NAME?: string;
  CAPITAL_LOAN_LIQUID?: number | string;
}
export async function fetchLiquidPreview(
  appendixId: string,
  amount: number,
  liquidType: 'TOAN_BO' | 'MOT_PHAN',
) {
  if (!appendixId || !Number.isSafeInteger(amount) || amount <= 0)
    throw new Error('Số tiền tất toán không hợp lệ.');
  return firstRow(
    await requestCore<CoreResult<LiquidPreview>>(
      'GET_LIQUID_INFO',
      {
        PK_MM_APPENDIX: appendixId,
        LIQUID_VALUE: amount,
        LIQUID_TYPE: liquidType,
      },
      customerApiOptions,
    ),
  );
}

/** Invoke only after transaction authentication is implemented and succeeds. */
export async function updateAccumulationRenewal(
  appendixId: string,
  extendType: string,
) {
  if (!appendixId || !extendType) throw new Error('Thiếu thông tin gia hạn.');
  const response = await requestCore<{
    code: number | string;
    message?: string;
    re?: string;
  }>(
    'UPDATE_CONTRACT_EXTEND_TYPE',
    { PK_MM_APPENDIX: appendixId, EXTEND_TYPE: extendType },
    customerApiOptions,
  );
  if (String(response.code) !== '1')
    throw new Error(
      response.re || response.message || 'Không thể cập nhật gia hạn.',
    );
  return response;
}

/** Invoke only after transaction authentication is implemented and succeeds. */
export async function settleAccumulation(
  appendixId: string,
  amount: number,
  liquidId: string | null = null,
) {
  if (!appendixId || !Number.isSafeInteger(amount) || amount <= 0)
    throw new Error('Số tiền tất toán không hợp lệ.');
  const response = await requestCore<
    CoreResult<Record<string, unknown>> & { re?: string }
  >(
    'UPDATE_CONTRACT_LIQUID',
    {
      PK_MM_APPENDIX: appendixId,
      CASH_VALUE: amount,
      PK_APPENDIX_LIQUID: liquidId,
    },
    customerApiOptions,
  );
  if (String(response.code) !== '1')
    throw new Error(response.re || response.message || 'Không thể tất toán.');
  return response;
}
