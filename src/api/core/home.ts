import { parseAmount } from './assets';
import {
  customerApiOptions,
  readCoreData,
  type CoreResult,
  type CustomerTransaction,
} from './customer';
import { getContractNearInterest, requestCore } from './index';

export interface HomeCategory {
  CODE: string;
  NAME?: string;
  DESCRIPTION?: string;
  URL_BANNER?: string;
}

export interface NearInterest {
  PK_MM_APPENDIX: string;
  NAME?: string;
  CONTENT?: string;
  CASH_VALUE?: number | string;
  OPEN_DATE?: string;
  EXPIRE_DATE?: string;
  EXTEND_TYPE?: string;
  EXTEND_TYPE_NAME?: string;
  DAY_TIMELINE_ARR?: unknown;
  STATUS_LOAN_APPENDIX?: string;
}

function checkRows<T>(rows: T[]): T[] {
  if (rows.some((row) => !row || typeof row !== 'object'))
    throw new Error('Dữ liệu danh sách không hợp lệ.');
  return rows;
}

export async function fetchHomeCategories(signal?: AbortSignal) {
  const response = await requestCore<CoreResult<HomeCategory>>(
    'GET_LIST_CATEGORY_SYSTEM',
    { CODE: 'WEB_PRODUCT_TYPE' },
    { ...customerApiOptions, signal },
  );
  return checkRows(readCoreData(response));
}

export async function fetchNearInterest(
  customerCode: string,
  signal?: AbortSignal,
) {
  const response = await getContractNearInterest<CoreResult<NearInterest>>(
    { CUSTOMER_CODE: customerCode },
    { ...customerApiOptions, signal },
  );
  return checkRows(readCoreData(response));
}

export function formatHomeMoney(
  value: unknown,
  hidden = false,
  unit = true,
  signed = false,
) {
  if (hidden) return '••••••';
  const amount = parseAmount(value);
  if (amount === null) return '—';
  return (
    (signed && amount > 0 ? '+' : '') +
    new Intl.NumberFormat('vi-VN').format(Math.trunc(amount)) +
    (unit ? 'đ' : '')
  );
}

export function getTransactionAmounts(transaction: CustomerTransaction) {
  const incoming = parseAmount(transaction.CASH_IN);
  const outgoing = parseAmount(transaction.CASH_OUT);
  // Both nonzero are displayed separately; do not invent a net amount.
  return { incoming, outgoing };
}

export function parseInterestDate(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date.getTime()
    : null;
}

export function getInterestProgress(item: NearInterest, now = new Date()) {
  let raw = item.DAY_TIMELINE_ARR;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = [];
    }
  }
  const days = Array.isArray(raw)
    ? [
        ...new Set(
          raw
            .map(parseInterestDate)
            .filter((date): date is number => date !== null),
        ),
      ].sort((a, b) => a - b)
    : [];
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const open = parseInterestDate(item.OPEN_DATE);
  const previous = days.filter((date) => date <= today).pop();
  const start = previous ?? (open !== null ? Math.min(open, today) : null);
  if (start === null) return null;
  const next = days.filter((date) => date > start).slice(0, 3);
  const end = next.length
    ? next[next.length - 1]
    : parseInterestDate(item.EXPIRE_DATE);
  if (end === null || end <= start) return null;
  const percent = Math.max(
    0,
    Math.min(100, ((today - start) / (end - start)) * 100),
  );
  return {
    percent,
    flags: next.slice(0, -1).map((date) => ({
      date,
      percent: ((date - start) / (end - start)) * 100,
    })),
  };
}
