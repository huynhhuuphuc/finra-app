import { changePassword } from '@/api/core/customer';
import useCustomerSession from '@/hooks/useCustomerSession';
import useLogout from '@/hooks/useLogout';
import {
  PasswordField,
  PasswordRules,
  getChangePasswordError,
  passesRules,
  showPasswordChangedModal,
} from '@/pages/Account/components/ChangePassword/passwordForm';
import { App, Modal } from 'antd';
import { useState } from 'react';

export default function FirstLoginPasswordModal() {
  const { message, modal } = App.useApp();
  const logout = useLogout();
  const { currentUser } = useCustomerSession();
  const user = currentUser?.username || currentUser?.user || '';
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const sameAsCurrent = Boolean(next) && next === current;
  const valid = Boolean(current) && passesRules(next) && !sameAsCurrent;

  const submit = async () => {
    if (!valid || submitting || !user) return;
    setSubmitting(true);
    try {
      await changePassword(user, current, next);
      setDone(true);
      showPasswordChangedModal(modal, logout);
    } catch (error: any) {
      if (error?.response?.status === 401) return;
      message.error(getChangePasswordError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={currentUser?.resetFlag === 1 && !done}
      centered
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={null}
      width={335}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <h2 className="!mb-6 text-center text-base font-semibold leading-6 text-[#060607]">
          Đổi mật khẩu lần đầu đăng nhập
        </h2>
        <div className="flex flex-col gap-5">
          <PasswordField
            label="Mật khẩu cũ"
            placeholder="Nhập lại mật khẩu cũ"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />
          <div>
            <PasswordField
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={next}
              onChange={setNext}
              error={
                sameAsCurrent ? 'Mật khẩu mới phải khác mật khẩu cũ' : undefined
              }
              autoComplete="new-password"
            />
            <PasswordRules value={next} />
          </div>
        </div>
        <button
          type="submit"
          disabled={!valid || submitting}
          className={`!mt-6 h-12 w-full rounded-xl text-sm font-semibold transition-colors duration-200 ${
            valid
              ? 'bg-[#b65ffc] !text-white'
              : 'bg-[#e7e7e7] !text-[rgba(10,10,11,0.36)]'
          }`}
        >
          Xác nhận
        </button>
      </form>
    </Modal>
  );
}
