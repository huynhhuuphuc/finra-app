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
  NOTE?: string;
  APPENDIX_CODE?: string;
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
