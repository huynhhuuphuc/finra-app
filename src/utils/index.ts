import { USER_INFO } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { message } from 'antd';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

export default class Utils {
  /**
   * Check permissions -- Function permissions
   * @param code
   * @returns
   */
  public static checkAccessForFunc = (code: string) => {
    const user = getCookie(USER_INFO) ?? {};
    const access = (user.permissions ?? user.access ?? []) as Array<string>;
    return new Promise((resolve) => {
      if (access.includes(code)) {
        resolve(null);
      } else {
        message.info('You do not have permission~');
      }
    });
  };

  /**
   * Encrypt
   * @param word
   * @returns
   */
  public static encrypt = (word: string) => {
    try {
      return CryptoJS.AES.encrypt(word, process.env.SECRET_KEY!).toString();
    } catch {
      return null;
    }
  };

  /**
   * Decrypt
   * @param word
   * @returns
   */
  public static decrypt = (word: string) => {
    try {
      return CryptoJS.AES.decrypt(word, process.env.SECRET_KEY!).toString(
        CryptoJS.enc.Utf8,
      );
    } catch (error) {
      return null;
    }
  };

  /**
   * MD5 encryption
   * @param word
   * @returns
   */
  public static md5 = (word: string) => {
    return CryptoJS.MD5(word).toString();
  };
  /**
   * Get new page number
   * Recalculate page number after deleting table data
   * @param pageInfo
   * @returns
   */
  public static getNewPage = (pageInfo?: {
    pageSize: number;
    total: number;
    current: number;
  }) => {
    // -- Get current page number and pagination info
    const current = pageInfo?.current || 1;
    const pageSize = pageInfo?.pageSize || 10;
    const total = pageInfo?.total || 0;
    // -- Total data count after deletion
    const newTotal = total - 1;
    // -- If current page has no data, decrease page number by 1
    const newPage = Math.max(
      1,
      Math.ceil(newTotal / pageSize) < current ? current - 1 : current,
    );
    // -- Return new data
    return newPage;
  };
}

const isExistInArray = (array: any[] | undefined, data: any): boolean => {
  return Array.isArray(array) && array.includes(data);
};

const getPermission = (data: any[]) => {
  const roles: any[] = [];
  const permissions: any[] = [];
  data.forEach((item) => {
    roles.push(item.roleName);
    if (item.authIds?.length) {
      item.authIds.forEach((authId: any) => {
        if (permissions.indexOf(authId) === -1) {
          permissions.push(authId);
        }
      });
    }
  });
  return { roles, permissions };
};

const extractPermissionsFromAccess = (
  accessList: any[],
  authIds: string[],
): string[] => {
  const result: string[] = [];

  const traverse = (items: any[]) => {
    items.forEach((item) => {
      if (authIds.includes(item.id.toString())) {
        result.push(item.code);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(accessList);
  return result;
};

const filterAccessByAuthIds = (accessList: any[], authIds: any[]) => {
  return accessList
    .map((access) => {
      if (access.children) {
        const children = access.children.filter((child: any) =>
          authIds.includes(child.id),
        );
        if (children.length > 0) {
          return { ...access, children };
        }
      }
      if (authIds.includes(access.id)) {
        return { ...access };
      }
      return null;
    })
    .filter(Boolean);
};

const formatMoneyVietnamese = (money: number) => {
  return money.toLocaleString('en-US');
};

// Add 0 at the beginning if the format is ".xx" or "-.xx"
// Also remove the % character if the API accidentally includes it.
const ensureLeadingZero = (v: string | number | null | undefined) => {
  if (v === null || v === undefined) return '0';
  let s = String(v).trim().replace(/%/g, '');
  // ".53"  -> "0.53"
  // "-.53" -> "-0.53"
  s = s.replace(/^(-?)\.(\d+)/, '$10.$2');
  return s;
};

// Format birth date: 08121998 -> 08/12/1998
const formatBirthDate = (birthDate: string) => {
  return (
    birthDate.slice(0, 2) +
    '/' +
    birthDate.slice(2, 4) +
    '/' +
    birthDate.slice(4)
  );
};

/**
 * Get current date yyyyMMdd
 * @returns {string}
 */
const getCurrentDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// get date range based on period
const getDateRange = (period: string): [string, string] => {
  const today = dayjs();

  switch (period) {
    case 'month': {
      // current month
      const startOfMonth = dayjs().startOf('month');
      return [startOfMonth.format('YYYYMMDD'), today.format('YYYYMMDD')];
    }

    case 'last_month': {
      // last month
      const startLastMonth = dayjs().subtract(1, 'month').startOf('month');
      const endLastMonth = dayjs().subtract(1, 'month').endOf('month');
      return [
        startLastMonth.format('YYYYMMDD'),
        endLastMonth.format('YYYYMMDD'),
      ];
    }

    case '3_months': {
      // 3 months ago (not including current month)
      const start3Months = dayjs().subtract(3, 'month').startOf('month');
      const end3Months = dayjs().subtract(1, 'month').endOf('month');
      return [start3Months.format('YYYYMMDD'), end3Months.format('YYYYMMDD')];
    }

    case '6_months': {
      // 6 months ago (not including current month)
      const start6Months = dayjs().subtract(6, 'month').startOf('month');
      const end6Months = dayjs().subtract(1, 'month').endOf('month');
      return [start6Months.format('YYYYMMDD'), end6Months.format('YYYYMMDD')];
    }

    case 'ytd': {
      // From the beginning of the year to the current date
      const startOfYear = dayjs().startOf('year');
      return [startOfYear.format('YYYYMMDD'), today.format('YYYYMMDD')];
    }

    default:
      return [today.format('YYYYMMDD'), today.format('YYYYMMDD')];
  }
};

// get start of month
const getStartOfMonth = () => {
  return dayjs().startOf('month').format('YYYYMMDD');
};

// format integer
const formatInteger = (num: number) => {
  return Math.floor(num).toLocaleString('en-US');
};

const formatJson = (raw?: string | null) => {
  if (!raw) return '—';
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
};

const statusColor = (status?: string) => {
  if (status === 'done') return 'success';
  if (status === 'error') return 'error';
  return 'default';
};

export {
  ensureLeadingZero,
  extractPermissionsFromAccess,
  filterAccessByAuthIds,
  formatBirthDate,
  formatInteger,
  formatJson,
  formatMoneyVietnamese,
  getCurrentDate,
  getDateRange,
  getPermission,
  getStartOfMonth,
  isExistInArray,
  statusColor,
};
