import { USER_INFO } from '@/constants/cookie';
import { PERMISSION_CODES, type PermissionCode } from '@/constants/permissions';
import type { CurrentUser } from '@/types/currentUser';
import { getCookie } from '@/utils/cookie';

type InitState = { currentUser?: CurrentUser; ready?: boolean };

function getPermissionCodes(initialState?: InitState): string[] {
  const fromState = initialState?.currentUser?.permissions;
  if (Array.isArray(fromState)) {
    return fromState;
  }
  const fromCookie = getCookie(USER_INFO) as CurrentUser | undefined;
  return Array.isArray(fromCookie?.permissions)
    ? fromCookie.permissions
    : [];
}

export default function access(initialState?: InitState) {
  const codes = new Set(getPermissionCodes(initialState));

  const can = (code: string) => codes.has(code);
  const any = (...arr: string[]) => arr.some((code) => codes.has(code));

  const flags = Object.fromEntries(
    Object.values(PERMISSION_CODES).map((code) => [code, can(code)]),
  ) as Record<PermissionCode, boolean>;

  return {
    ...flags,
    can,
    any,
    canViewNotification: any(
      PERMISSION_CODES.NOTI_PUBLIC_VIEW,
      PERMISSION_CODES.NOTI_PRIVATE_VIEW,
    ),
    canViewSystem: any(
      PERMISSION_CODES.USER_VIEW,
      PERMISSION_CODES.GROUP_VIEW,
      PERMISSION_CODES.PERMISSION_VIEW,
      PERMISSION_CODES.EVENT_VIEW,
    ),
    canViewSystemUsers: any(
      PERMISSION_CODES.USER_VIEW,
      PERMISSION_CODES.GROUP_VIEW,
      PERMISSION_CODES.PERMISSION_VIEW,
    ),
  };
}
