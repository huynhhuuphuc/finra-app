import { changePassword } from '@/api/core/customer';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import { EyeIcon, ViewOffIcon } from '@/icons';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { history } from '@umijs/max';
import { App } from 'antd';
import { useId, useState } from 'react';

const RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: 'Ít nhất 1 ký tự đặc biệt', test: (v) => /[^A-Za-z0-9]/.test(v) },
  {
    label: 'Có chữ viết hoa, số',
    test: (v) => /[A-Z]/.test(v) && /\d/.test(v),
  },
  {
    label: 'Độ dài 10-16 ký tự',
    test: (v) => v.length >= 10 && v.length <= 16,
  },
];

const LABEL_RESTING =
  'peer-[:placeholder-shown:not(:focus)]:top-1/2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-[:placeholder-shown:not(:focus)]:leading-5 peer-[:placeholder-shown:not(:focus)]:text-[#060607]';

function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const border = error
    ? 'border-[#ff3b30]'
    : value
    ? 'border-[#b65ffc]'
    : 'border-[#0a0a0b] focus-within:border-[#b65ffc]';

  return (
    <div>
      <div
        className={`relative flex h-12 items-center gap-2 rounded-lg border bg-white pl-4 pr-3 transition-colors duration-200 ${border}`}
      >
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          placeholder=" "
          onChange={(event) => onChange(event.target.value)}
          className="peer h-full min-w-0 flex-1 border-0 bg-transparent !text-sm !leading-5 !text-[#060607] caret-[#060607] outline-none"
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-[10px] leading-4 text-[rgba(10,10,11,0.55)] transition-all duration-200 ease-out ${LABEL_RESTING}`}
        >
          {label}
        </label>
        <button
          type="button"
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          onClick={() => setVisible((v) => !v)}
          className="grid size-6 shrink-0 place-items-center"
        >
          {visible ? (
            <EyeIcon
              width={21.5}
              height={15.5}
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <ViewOffIcon
              width={24}
              height={24}
              fill0="#060607"
              preserveAspectRatio="xMidYMid meet"
            />
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="!mb-0 mt-1 text-xs leading-4 text-[#ff3b30]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ChangePassword() {
  const { message } = App.useApp();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useCustomerSession();
  const user = currentUser?.username || currentUser?.user || '';

  const passed = RULES.map((rule) => rule.test(next));
  const mismatch = Boolean(confirm) && confirm !== next;
  const sameAsCurrent = Boolean(next) && next === current;
  const valid =
    Boolean(current) &&
    passed.every(Boolean) &&
    !sameAsCurrent &&
    confirm === next;

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
      message.success('Đổi mật khẩu thành công.');
      history.replace(PAGE_URL.account);
    } catch (error: any) {
      if (error?.response?.status === 401) return;
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          'Không thể đổi mật khẩu. Vui lòng thử lại.',
      );
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
        className="px-5 pb-28 pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="flex flex-col gap-8">
          <PasswordField
            label="Mật khẩu hiện tại"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />

          <div>
            <PasswordField
              label="Nhập mật khẩu mới"
              value={next}
              onChange={setNext}
              error={
                sameAsCurrent
                  ? 'Mật khẩu mới phải khác mật khẩu hiện tại'
                  : undefined
              }
              autoComplete="new-password"
            />
            <ul className="!mb-0 !mt-3 flex list-none flex-col gap-2 !pl-1">
              {RULES.map((rule, index) => {
                const ok = passed[index];
                const state = !next ? 'idle' : ok ? 'ok' : 'fail';
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs leading-4 ${
                      state === 'ok'
                        ? 'text-[#34c759]'
                        : state === 'fail'
                        ? 'text-[#ff3b30]'
                        : 'text-[#060607]'
                    }`}
                  >
                    <span className="grid size-3.5 shrink-0 place-items-center">
                      {state === 'ok' ? (
                        <CheckCircleFilled />
                      ) : state === 'fail' ? (
                        <CloseCircleFilled />
                      ) : (
                        <span className="size-1 rounded-full bg-[#060607]" />
                      )}
                    </span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <PasswordField
            label="Nhập lại mật khẩu mới"
            value={confirm}
            onChange={setConfirm}
            error={mismatch ? 'Mật khẩu nhập lại không khớp' : undefined}
            autoComplete="new-password"
          />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[var(--app-content-max)] bg-white px-5 pb-6 pt-3">
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
