import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, theme } from 'antd';
import type { CSSProperties, ReactNode } from 'react';

type ConfirmConfig = {
  title: ReactNode;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
};

type ExtraAction = {
  key: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: 'primary' | 'danger' | 'green' | 'orange' | 'default';
};

type Props = {
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
  extras?: ExtraAction[];
  /** Khoá duyệt / từ chối / xoá khi đã xử lý */
  locked?: boolean;
  /** true = không cho xoá */
  deleteLocked?: boolean;
  retryLocked?: boolean;
  retryLoading?: boolean;
  editTitle?: string;
  approveTitle?: string;
  rejectTitle?: string;
  deleteTitle?: string;
  retryTitle?: string;
  retryLockedTitle?: string;
  deleteConfirm?: ConfirmConfig;
};

const TableRowActions = ({
  onEdit,
  onApprove,
  onReject,
  onDelete,
  onRetry,
  extras,
  locked = false,
  deleteLocked,
  retryLocked = false,
  retryLoading = false,
  editTitle = 'Xem / sửa',
  approveTitle = 'Duyệt',
  rejectTitle = 'Từ chối',
  deleteTitle = 'Xoá',
  retryTitle = 'Gửi lại',
  retryLockedTitle = 'Không thể gửi lại',
  deleteConfirm,
}: Props) => {
  const { token } = theme.useToken();
  const canMutate = !locked;
  const canDelete = !(deleteLocked ?? locked);

  const wrapStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    padding: 3,
    borderRadius: 999,
    background: token.colorFillQuaternary,
    border: `1px solid ${token.colorBorderSecondary}`,
  };

  const deleteBtn = (
    <Tooltip title={canDelete ? deleteTitle : 'Không thể xoá'}>
      <Button
        type="text"
        size="small"
        shape="circle"
        color="danger"
        variant="text"
        icon={<DeleteOutlined />}
        disabled={!canDelete || !onDelete}
        aria-label={deleteTitle}
      />
    </Tooltip>
  );

  return (
    <div style={wrapStyle} onClick={(e) => e.stopPropagation()}>
      {onEdit && (
        <Tooltip title={editTitle}>
          <Button
            type="text"
            size="small"
            shape="circle"
            color="primary"
            variant="text"
            icon={<EditOutlined />}
            onClick={onEdit}
            aria-label={editTitle}
          />
        </Tooltip>
      )}

      {extras?.map((action) => (
        <Tooltip key={action.key} title={action.title}>
          <Button
            type="text"
            size="small"
            shape="circle"
            color={action.color || 'primary'}
            variant="text"
            icon={action.icon}
            disabled={action.disabled}
            onClick={action.onClick}
            aria-label={action.title}
          />
        </Tooltip>
      ))}

      {onRetry && (
        <Tooltip title={retryLocked ? retryLockedTitle : retryTitle}>
          <Button
            type="text"
            size="small"
            shape="circle"
            color="primary"
            variant="text"
            icon={<RedoOutlined />}
            disabled={retryLocked}
            loading={retryLoading}
            onClick={onRetry}
            aria-label={retryTitle}
          />
        </Tooltip>
      )}

      {onApprove && (
        <Tooltip title={canMutate ? approveTitle : 'Đã xử lý'}>
          <Button
            type="text"
            size="small"
            shape="circle"
            color="green"
            variant="text"
            icon={<CheckOutlined />}
            disabled={!canMutate}
            onClick={onApprove}
            aria-label={approveTitle}
          />
        </Tooltip>
      )}

      {onReject && (
        <Tooltip title={canMutate ? rejectTitle : 'Đã xử lý'}>
          <Button
            type="text"
            size="small"
            shape="circle"
            color="orange"
            variant="text"
            icon={<CloseOutlined />}
            disabled={!canMutate}
            onClick={onReject}
            aria-label={rejectTitle}
          />
        </Tooltip>
      )}

      {onDelete &&
        (deleteConfirm && canDelete ? (
          <Popconfirm
            title={deleteConfirm.title}
            description={deleteConfirm.description}
            okText={deleteConfirm.okText || 'Xoá'}
            cancelText={deleteConfirm.cancelText || 'Huỷ'}
            okButtonProps={{ danger: true }}
            onConfirm={onDelete}
          >
            {deleteBtn}
          </Popconfirm>
        ) : (
          deleteBtn
        ))}
    </div>
  );
};

export default TableRowActions;
