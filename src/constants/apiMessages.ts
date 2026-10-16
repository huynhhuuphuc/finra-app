const ERRORS_CODE_MAP: Record<any, string> = {
  // 400: 'Yêu cầu không hợp lệ!',
  // 401: 'Vui lòng đăng nhập lại!',
  403: 'Bạn không có quyền truy cập!',
  404: 'Không tìm thấy tài nguyên!',
  409: 'Dữ liệu bị trùng hoặc xung đột!',
  500: 'Lỗi hệ thống xin vui lòng liên hệ với quản trị viên!',
  502: 'Máy chủ bận hoặc bảo trì!',
  BANNER_DUPLICATED: 'Banner đã tồn tại!',
  CMS_USER_NOT_FOUND: 'Không tìm thấy người dùng!',
  CMS_USER_FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này!',
  CMS_USER_INVALID_REQUEST: 'Yêu cầu không hợp lệ!',
  'Current password is incorrect': 'Mật khẩu hiện tại không đúng',
  CMS_USER_DUPLICATED: 'Tên đăng nhập đã tồn tại!',
  CMS_GROUP_NOT_FOUND: 'Không tìm thấy nhóm người dùng!',
  CMS_GROUP_DUPLICATED: 'Mã nhóm người dùng đã tồn tại!',
  CMS_GROUP_INVALID_REQUEST: 'Yêu cầu không hợp lệ!',
  CMS_PERMISSION_NOT_FOUND: 'Không tìm thấy mã quyền!',
  CMS_PERMISSION_DUPLICATED: 'Mã quyền đã tồn tại!',
  CMS_PERMISSION_INVALID_REQUEST: 'Yêu cầu không hợp lệ!',
};

export { ERRORS_CODE_MAP };
