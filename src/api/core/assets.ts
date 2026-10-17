import { customerApiOptions, readCoreData, type CoreResult } from './customer';
import { getContractSumCash, requestCore } from './index';

type Amount = number | string | null;

export interface AssetSummary {
  SUM_CASH?: Amount;
  CASH_BALANCE?: Amount;
  SUM_CONTRACT?: Amount;
  SUM_FEE_VALUE?: Amount;
  SUM_CASH_TIMELINE?: unknown;
}

export interface AssetProduct {
  WEB_PRODUCT_TYPE: string;
  PRODUCT_NAME?: string;
  PRODUCT_TYPE?: string;
  SUM_CONTRACT?: Amount;
  FEE_VALUE?: Amount;
}

export function parseAmount(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (
    typeof value === 'string' &&
    !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value.trim())
  )
    return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

export interface AssetTimelinePoint {
  date: string;
  timestamp: number;
  amount: number;
}

function parseTradingDate(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match =
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T].*)?$/.exec(value) ||
    /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T].*)?$/.exec(value);
  if (!match) return null;
  const iso = value.includes('-');
  const year = Number(match[iso ? 1 : 3]);
  const month = Number(match[2]);
  const day = Number(match[iso ? 3 : 1]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date.getTime()
    : null;
}

export function parseAssetTimeline(value: unknown): AssetTimelinePoint[] {
  let rows = value;
  if (typeof rows === 'string') {
    try {
      rows = JSON.parse(rows);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(rows)) return [];
  return rows
    .flatMap((row) => {
      if (!row || typeof row !== 'object') return [];
      const timestamp = parseTradingDate(row.trading_date);
      const amount = parseAmount(row.sum_cash);
      if (timestamp === null || amount === null) return [];
      return [{ date: row.trading_date as string, timestamp, amount }];
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function fetchAssetSummary(
  customerCode: string,
  signal?: AbortSignal,
) {
  const response = await getContractSumCash<CoreResult<AssetSummary>>(
    { CUSTOMER_CODE: customerCode },
    { ...customerApiOptions, signal },
  );
  const summary = readCoreData(response)[0];
  if (!summary || typeof summary !== 'object')
    throw new Error('Không tìm thấy dữ liệu tài sản.');
  return summary;
}

export async function fetchAssetProducts(
  customerCode: string,
  signal?: AbortSignal,
) {
  const response = await requestCore<CoreResult<AssetProduct>>(
    'GET_CONTRACT_PRODUCT',
    { CUSTOMER_CODE: customerCode },
    { ...customerApiOptions, signal },
  );
  const products = readCoreData(response);
  if (products.some((product) => !product || typeof product !== 'object')) {
    throw new Error('Danh sách sản phẩm không đúng định dạng.');
  }
  return products;
}

export function sumProductContracts(products: AssetProduct[]): number | null {
  const amounts = products.map((product) => parseAmount(product.SUM_CONTRACT));
  if (amounts.some((amount) => amount === null)) return null;
  return (amounts as number[]).reduce((total, amount) => total + amount, 0);
}
