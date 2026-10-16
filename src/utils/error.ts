// utils/error.ts
import { notification } from '@/components/@lgs/GlobalMessage';
import { ERRORS_CODE_MAP } from '@/constants/apiMessages';

const pickServerMessage = (data?: any): string | undefined => {
  if (!data) return undefined;
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim();
  }
  if (typeof data.msg === 'string' && data.msg.trim()) {
    return data.msg.trim();
  }
  return undefined;
};

/**
 * Error handler common
 */
const errorHandler = function (
  error: any,
  arrayMessageMap?: Record<string | number, string>,
  defaultMessage?: string,
  additionMessage?: string,
) {
  const messageMap = arrayMessageMap
    ? { ...ERRORS_CODE_MAP, ...arrayMessageMap }
    : ERRORS_CODE_MAP;

  if (error?.response) {
    const { status, data } = error.response as { status: number; data?: any };

    if (status >= 500) {
      notification.error({
        title: pickServerMessage(data) || messageMap[500],
      });
    } else {
      const errors = data?.errors;
      let msg: string | undefined;

      const serverMsg = pickServerMessage(data);
      msg =
        (serverMsg && messageMap[serverMsg]) ||
        serverMsg ||
        (typeof data?.error === 'string' ? messageMap[data.error] : undefined);

      if (!msg && Array.isArray(errors) && errors.length) {
        const codeFromServer = errors[0]?.code;
        msg = (codeFromServer && messageMap[codeFromServer]) || defaultMessage;
      } else if (!msg) {
        msg = messageMap[status] || defaultMessage;
      }

      if (additionMessage) msg = (msg || '') + additionMessage;

      if (msg) {
        notification.error({ title: msg });
      }
    }
  } else {
    notification.error({ title: messageMap[500] });
  }

  throw error;
};

export { errorHandler };
