import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Umi chỉ tự load `.env` và `.env.local`, KHÔNG load `.env.<UMI_ENV>`.
 * Vì vậy đọc thêm `.env.<UMI_ENV>` ở đây và ưu tiên giá trị trong file đó,
 * để build prod/qa không bị dính giá trị dev từ `.env.local`.
 */
function readEnvFile(name: string): Record<string, string> {
  const file = join(process.cwd(), name);
  if (!existsSync(file)) return {};
  const result: Record<string, string> = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    result[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return result;
}

const modeEnv = process.env.UMI_ENV
  ? readEnvFile(`.env.${process.env.UMI_ENV}`)
  : {};
const read = (key: string) => modeEnv[key] ?? process.env[key];

export const apiDefine = {
  'process.env.CORE_API_KEY': read('CORE_API_KEY') || '',
  'process.env.DEVICE_ID': read('DEVICE_ID') || '',
  'process.env.AUTH_LOGIN_URL': read('AUTH_LOGIN_URL') || '/login',
  'process.env.CORE_URL': read('CORE_URL') || '/core',
  'process.env.PUBLIC_CORE_URL': read('PUBLIC_CORE_URL') || '/core',
  'process.env.APP_API_HOST': read('APP_API_HOST') || '',
  'process.env.APP_API_ORIGIN': read('APP_API_ORIGIN') || '',
  'process.env.V2_API_HOST': read('V2_API_HOST') || '',
};
