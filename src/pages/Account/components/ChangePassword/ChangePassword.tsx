import { changePassword } from '@/api/core/customer';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import useLogout from '@/hooks/useLogout';
import { history } from '@umijs/max';
import { App } from 'antd';
import { useState } from 'react';
import {
  PasswordField,
  PasswordRules,
  getChangePasswordError,
  passesRules,
  showPasswordChangedModal,
} from './passwordForm';

const AUTH_NOTICE =
  'Vui lòng nhập mật khẩu đăng nhập để xác thực account của bạn';

export default function ChangePassword() {
  const { message, modal } = App.useApp();
  const logout = useLogout();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useCustomerSession();
  const user = currentUser?.username || currentUser?.user || '';

  const mismatch = Boolean(confirm) && confirm !== next;
  const sameAsCurrent = Boolean(next) && next === current;
  const valid =
    Boolean(current) && passesRules(next) && !sameAsCurrent && confirm === next;

  const submit = async () => {
    if (!valid || submitting) return;
    if (!user) {
      message.error(
        'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.',
      );
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(user, current, next);
      showPasswordChangedModal(modal, logout);
    } catch (error: any) {
      if (error?.response?.status === 401) return;
      message.error(getChangePasswordError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-white text-[#060607]">
      <PageHeader
        title="Đổi mật khẩu đăng nhập"
        align="left"
        onBack={() => history.replace(PAGE_URL.account)}
      />

      <form
        className="px-5 pb-36 pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="flex flex-col gap-5">
          <div>
            <PasswordField
              label="Mật khẩu hiện tại"
              placeholder="Nhập Mật khẩu hiện tại"
              value={current}
              onChange={setCurrent}
              autoComplete="current-password"
            />
            <p className="!mb-0 !mt-5 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              {AUTH_NOTICE}
            </p>
          </div>

          <div>
            <PasswordField
              label="Nhập mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={next}
              onChange={setNext}
              error={
                sameAsCurrent
                  ? 'Mật khẩu mới phải khác mật khẩu hiện tại'
                  : undefined
              }
              autoComplete="new-password"
            />
            <PasswordRules value={next} />
          </div>

          <PasswordField
            label="Nhập lại mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            value={confirm}
            onChange={setConfirm}
            error={mismatch ? 'Mật khẩu nhập lại không khớp' : undefined}
            autoComplete="new-password"
          />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[var(--app-content-max)] bg-white px-5 pb-6 pt-3">
          <p className="!mb-3 text-center text-xs leading-4 text-[rgba(10,10,11,0.55)]">
            {AUTH_NOTICE}
          </p>
          <button
            type="submit"
            disabled={!valid || submitting}
            className={`h-12 w-full rounded-xl text-sm font-semibold transition-colors duration-200 ${
              valid
                ? 'bg-[#b65ffc] !text-white'
                : 'bg-[#e7e7e7] !text-[rgba(10,10,11,0.36)]'
            }`}
          >
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}
