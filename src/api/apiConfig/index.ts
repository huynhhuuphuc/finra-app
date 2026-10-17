import { message } from '@/components/@lgs/GlobalMessage';
import { GLOBAL_LOADING_KEY } from '@/constants';
import { ACCESS_TOKEN } from '@/constants/cookie';
import { PAGE_URL } from '@/constants/pathUrl';
import { getCookie } from '@/utils/cookie';
import { errorHandler } from '@/utils/error';
import { handleSessionExpired } from '@/utils/session';
import type {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios';
import axios, { AxiosHeaders } from 'axios';

// 1. Basic type definitions
interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  error_code?: string;
  data_list?: T[];
  error_desc?: string;
  success?: boolean;
}
export type GasResponse<T> = {
  ok: boolean;
  data: T;
  meta: {
    rows: number;
    sheetId: string;
    sheetName: string;
    buildAt?: string;
  };
};

const ABSOLUTE_URL = /^https?:\/\//i;
const EXTERNAL_HOST_WHITELIST = ['script.google.com'];

const isExternalUrl = (url?: string) => {
  if (!url || !ABSOLUTE_URL.test(url)) return false;
  try {
    const { host } = new URL(url);
    return EXTERNAL_HOST_WHITELIST.includes(host);
  } catch {
    return false;
  }
};

const isDev = process.env.NAME === 'development';

// 2. Create instance
const instance = axios.create({
  baseURL: process.env.HOST || '',
  timeout: 60000,
  withCredentials: false,
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

// 3. Request cancellation configuration
const pendingRequests = new Map<string, CancelTokenSource>();

/**
 * Generate unique request identifier
 */
const generateReqKey = (config: AxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
};
/**
 * Cancel duplicate requests
 */
const removePendingRequest = (config: AxiosRequestConfig) => {
  const requestKey = generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const source = pendingRequests.get(requestKey);
    source?.cancel('Request cancelled');
    pendingRequests.delete(requestKey);
  }
};

// 3. Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const external = isExternalUrl(config.url);
    (config as any).__external = external;

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers);
    }
    const headers = config.headers as AxiosHeaders;

    if (external) {
      config.baseURL = '';
      headers.delete('Authorization');
      (headers as any).delete('apiKey');
      headers.delete('Content-Type');
    }

    if (/GET/i.test(config.method ?? '')) {
      const t = Math.random().toString(36).slice(2, 9);
      config.params = { ...(config.params || {}), t };
    }

    removePendingRequest(config);

    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    const requestKey = generateReqKey(config);
    pendingRequests.set(requestKey, source);

    if (!external) {
      const token = getCookie(ACCESS_TOKEN) ?? '';
      const whiteList = ['/api/auth/login'];
      if (token && !whiteList.some((path) => config.url?.startsWith(path))) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * Cancel all pending requests
 */
const cancelAllRequests = () => {
  pendingRequests.forEach((source) => {
    source.cancel('Batch cancel requests');
  });
  pendingRequests.clear();
};

// 4. Response interceptor
instance.interceptors.response.use(
  (response) => {
    // -- Remove pending status after request completion
    const requestKey = generateReqKey(response.config);
    pendingRequests.delete(requestKey);

    // -- Clear loadings
    message.destroy(GLOBAL_LOADING_KEY);

    if ((response.config as any).__external) {
      return response.data;
    }

    // Handle stream data
    if (response.request.responseType === 'blob') {
      return { code: 200, data: response.data, msg: 'success' };
    }

    // Business error handling
    const { code } = response.data as unknown as ApiResponse;
    if (code === 401) {
      handleSessionExpired({ removeNow: false, loginPath: PAGE_URL.login });

      return Promise.reject(new Error('Session expired'));
    }

    return response.data;
  },
  (error: AxiosError) => {
    if (error.config) {
      const requestKey = generateReqKey(error.config);
      pendingRequests.delete(requestKey);
    }

    // -- Clear global loading
    message.destroy(GLOBAL_LOADING_KEY);

    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const isLoginRequest = requestUrl.includes('/api/auth/login');

    if (status === 401 && !isLoginRequest) {
      cancelAllRequests();
      handleSessionExpired({ removeNow: false, loginPath: PAGE_URL.login });
    }

    // Để trang Login tự hiển thị message từ API
    if (!isLoginRequest) {
      try {
        errorHandler(error);
      } catch (err) {
        console.log(err);
      }
    }

    return Promise.reject(error);
  },
);

// 5. Unified request method
const request = <R = any>(
  options: AxiosRequestConfig,
): Promise<ApiResponse<R>> => {
  return instance(options);
};

/** Authenticated request — uses main instance (Bearer token / env HOST) */
const requestAuth = <R = any>(options: AxiosRequestConfig): Promise<R> => {
  const config: AxiosRequestConfig = { ...options };

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': undefined,
    };
  }

  return instance(config).then((res: any) => res as R);
};

/**
 * Custom request — no login required.
 * Can call absolute URLs / domains outside env HOST.
 */
const cusInstance = axios.create({
  timeout: 60000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

cusInstance.interceptors.response.use(
  (response) => {
    message.destroy(GLOBAL_LOADING_KEY);
    return response.data;
  },
  (error: AxiosError) => {
    message.destroy(GLOBAL_LOADING_KEY);
    if ((error.config as CustomRequestConfig | undefined)?.silentError) {
      return Promise.reject(error);
    }
    try {
      errorHandler(error);
    } catch (err) {
      console.log(err);
    }
    return Promise.reject(error);
  },
);

type CustomRequestConfig = AxiosRequestConfig & { silentError?: boolean };

const requestCus = <R = any>(options: CustomRequestConfig): Promise<R> => {
  const config: AxiosRequestConfig = { ...options };

  // FormData: drop default JSON content-type so boundary is set correctly
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': undefined,
    };
  }

  return cusInstance(config).then((res: any) => res as R);
};

/**
 * Cancel specific request
 * @param config Request configuration or unique request identifier
 */
const cancelRequest = (config: AxiosRequestConfig | string) => {
  const requestKey =
    typeof config === 'string' ? config : generateReqKey(config);
  if (pendingRequests.has(requestKey)) {
    const source = pendingRequests.get(requestKey);
    source?.cancel(`Cancel request: ${requestKey}`);
    pendingRequests.delete(requestKey);
  }
};

export { cancelAllRequests, cancelRequest, requestAuth, requestCus };
export default request;
