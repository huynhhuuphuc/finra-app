export const PERMISSION_CODES = {
  BANNER_APPROVE: 'BANNER_APPROVE', // Duyệt hoặc từ chối banner
  BANNER_DELETE: 'BANNER_DELETE', // Xoá banner
  BANNER_MANAGE: 'BANNER_MANAGE', // Tạo mới, cập nhật, bật/tắt hiển thị và upload ảnh banner
  BANNER_VIEW: 'BANNER_VIEW', // Xem danh sách/chi tiết banner
  CATEGORY_DELETE: 'CATEGORY_DELETE', // Xoá category và item
  CATEGORY_MANAGE: 'CATEGORY_MANAGE', // Tạo mới và cập nhật category và item
  CATEGORY_VIEW: 'CATEGORY_VIEW', // Xem danh sách/chi tiết category và item
  EVENT_MANAGE: 'EVENT_MANAGE',
  EVENT_VIEW: 'EVENT_VIEW',
  GROUP_DELETE: 'GROUP_DELETE',
  GROUP_MANAGE: 'GROUP_MANAGE',
  GROUP_VIEW: 'GROUP_VIEW',
  NOTI_PRIVATE_APPROVE: 'NOTI_PRIVATE_APPROVE',
  NOTI_PRIVATE_DELETE: 'NOTI_PRIVATE_DELETE',
  NOTI_PRIVATE_MANAGE: 'NOTI_PRIVATE_MANAGE',
  NOTI_PRIVATE_VIEW: 'NOTI_PRIVATE_VIEW',
  NOTI_PUBLIC_APPROVE: 'NOTI_PUBLIC_APPROVE',
  NOTI_PUBLIC_DELETE: 'NOTI_PUBLIC_DELETE',
  NOTI_PUBLIC_MANAGE: 'NOTI_PUBLIC_MANAGE',
  NOTI_PUBLIC_VIEW: 'NOTI_PUBLIC_VIEW',
  PERMISSION_DELETE: 'PERMISSION_DELETE',
  PERMISSION_MANAGE: 'PERMISSION_MANAGE',
  PERMISSION_VIEW: 'PERMISSION_VIEW',
  QUEUE_VIEW: 'QUEUE_VIEW',
  USER_DELETE: 'USER_DELETE',
  USER_MANAGE: 'USER_MANAGE',
  USER_VIEW: 'USER_VIEW',
} as const;

export type PermissionCode =
  (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];

type MenuRoute = {
  path: string;
  anyOf: PermissionCode[];
};

const MENU_ROUTES: MenuRoute[] = [
  { path: '/home', anyOf: [] },
  { path: '/products', anyOf: [] },
  { path: '/for-you', anyOf: [] },
  { path: '/assets', anyOf: [] },
  { path: '/account', anyOf: [] },
];

const hasAny = (permissions: Set<string>, codes: PermissionCode[]) =>
  codes.length === 0 || codes.some((code) => permissions.has(code));

export function firstAccessiblePath(
  permissions?: string[] | null,
  prefix?: string,
): string {
  const set = new Set(permissions ?? []);
  const list = prefix
    ? MENU_ROUTES.filter((route) => route.path.startsWith(prefix))
    : MENU_ROUTES;

  for (const route of list) {
    if (hasAny(set, route.anyOf)) {
      return route.path;
    }
  }

  if (prefix) {
    return firstAccessiblePath(permissions);
  }

  return '/assets';
}

export function isPathAllowed(
  path: string,
  permissions?: string[] | null,
): boolean {
  const pathname = path.split('?')[0];
  if (!pathname || pathname === '/' || pathname === '/login') {
    return true;
  }

  const set = new Set(permissions ?? []);

  if (pathname === '/notification' || pathname === '/system') {
    return MENU_ROUTES.some(
      (route) => route.path.startsWith(pathname) && hasAny(set, route.anyOf),
    );
  }

  const matched = MENU_ROUTES.find(
    (route) => pathname === route.path || pathname.startsWith(`${route.path}/`),
  );

  if (!matched) {
    return true;
  }

  return hasAny(set, matched.anyOf);
}
