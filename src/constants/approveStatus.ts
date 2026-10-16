export const APPROVE_STATUS_LABEL: Record<string, string> = {
  none: 'Chưa duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

export const APPROVE_STATUS_VALUE_ENUM = {
  none: { text: APPROVE_STATUS_LABEL.none },
  approved: { text: APPROVE_STATUS_LABEL.approved },
  rejected: { text: APPROVE_STATUS_LABEL.rejected },
};
