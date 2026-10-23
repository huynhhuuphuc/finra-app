import { ACCESS_TOKEN } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { requestCus } from '../apiConfig';

const DEFAULT_ENDPOINT = process.env.CORE_URL;
const DEFAULT_API_KEY = process.env.CORE_API_KEY;

export interface CoreApiOptions {
  endpoint?: string;
  apiKey?: string;
  user?: string;
  lang?: string;
  deviceId: string;
  userAgent?: string;
  token?: string;
  signal?: AbortSignal;
  silentError?: boolean;
}

export interface CustomerParam {
  CUSTOMER_CODE: string;
}

/** POST a core command */
export const requestCore = <R = unknown, P = Record<string, unknown>>(
  cmd: string,
  param: P,
  options: CoreApiOptions,
): Promise<R> => {
  const token = options.token ?? getCookie(ACCESS_TOKEN);
  return requestCus<R>({
    url: options.endpoint ?? DEFAULT_ENDPOINT,
    method: 'POST',
    signal: options.signal,
    silentError: options.silentError,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      lang: options.lang ?? 'vi',
      device_id: options.deviceId,
      ...(options.userAgent ? { 'User-Agent': options.userAgent } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: {
      user: options.user ?? 'open_account',
      cmd,
      apiKey: options.apiKey ?? DEFAULT_API_KEY,
      param,
    },
  });
};

export const getCustomerInfo = <R = unknown>(
  param: CustomerParam,
  options: CoreApiOptions,
) => requestCore<R, CustomerParam>('GET_CUSTOMER_INFO', param, options);

export const getContractSumCash = <R = unknown>(
  param: CustomerParam,
  options: CoreApiOptions,
) => requestCore<R, CustomerParam>('GET_CONTRACT_SUM_CASH', param, options);

export const getContractNearInterest = <R = unknown>(
  param: CustomerParam,
  options: CoreApiOptions,
) =>
  requestCore<R, CustomerParam>('GET_CONTRACT_NEAR_INTEREST', param, options);

/** Reuse device, endpoint and auth settings across commands. */
export const createCoreApi = (options: CoreApiOptions) => ({
  request: <R = unknown, P = Record<string, unknown>>(cmd: string, param: P) =>
    requestCore<R, P>(cmd, param, options),
  getCustomerInfo: <R = unknown>(param: CustomerParam) =>
    getCustomerInfo<R>(param, options),
  getContractSumCash: <R = unknown>(param: CustomerParam) =>
    getContractSumCash<R>(param, options),
  getContractNearInterest: <R = unknown>(param: CustomerParam) =>
    getContractNearInterest<R>(param, options),
});
