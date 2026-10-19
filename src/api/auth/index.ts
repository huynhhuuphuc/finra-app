import { ACCESS_TOKEN } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { requestCus } from '../apiConfig';
import { customerApiOptions } from '../core/customer';
import { parseLoginResponse, type LoginResponse } from './loginResponse';

const LOGIN_ENDPOINT =
  process.env.NAME === 'development'
    ? '/finra-auth/login'
    : 'http://172.16.90.62:9090/login';

export async function login(usr: string, pwd: string) {
  const previousToken = getCookie(ACCESS_TOKEN);
  const response = await requestCus<LoginResponse>({
    url: LOGIN_ENDPOINT,
    method: 'POST',
    silentError: true,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      lang: 'vi',
      device_id: customerApiOptions.deviceId,
      // Browser supplies its own User-Agent; do not impersonate a native phone.
      ...(typeof previousToken === 'string' &&
      previousToken &&
      previousToken !== 'demo-session'
        ? { Authorization: `Bearer ${previousToken}` }
        : {}),
    },
    data: { usr: usr.trim(), pwd },
  });
  return parseLoginResponse(response, usr.trim());
}
