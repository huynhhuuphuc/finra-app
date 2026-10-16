/** Người dùng lưu trong cookie khi đăng nhập (khung tạm, chưa có API). */
export type CurrentUser = {
  user: string;
  username: string;
  token_type: string;
  sessionTimeoutMinutes?: number;
  access?: string[];
  permissions?: string[];
  displayName?: string;
  mail?: string | null;
};
