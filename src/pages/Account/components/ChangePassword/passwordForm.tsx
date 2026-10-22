import { EyeIcon, ViewOffIcon } from '@/icons';
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import type { App } from 'antd';
import { useId, useState } from 'react';

type ModalApi = ReturnType<typeof App.useApp>['modal'];

export function showPasswordChangedModal(modal: ModalApi, onLogin: () => void) {
  const instance = modal.confirm({
    icon: null,
    title: null,
    footer: null,
    centered: true,
    closable: false,
    maskClosable: false,
    keyboard: false,
    width: 365,
    className:
      '[&_.ant-modal-content]:!overflow-visible [&_.ant-modal-content]:!rounded-2xl',
    content: (
      <div className="pt-10 text-center">
        <span className="absolute left-1/2 top-0 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#34c759] text-[28px] text-white shadow-[0_0_20px_6px_rgba(52,199,89,0.55),0_0_48px_20px_rgba(52,199,89,0.3)]">
          <CheckOutlined />
        </span>
        <h3 className="!mb-2 text-base font-bold leading-6 text-[#060607]">
          Đổi mật khẩu thành công
        </h3>
        <p className="!mb-6 text-xs leading-5 text-[rgba(10,10,11,0.55)]">
          Quý khách vừa đổi mật khẩu thành công. Vui lòng đăng nhập lại account
        </p>
        <button
          type="button"
          className="h-12 w-full rounded-xl border-0 bg-[#b65ffc] text-sm font-semibold !text-white"
          onClick={() => {
            instance.destroy();
            onLogin();
          }}
        >
          Đăng nhập
        </button>
      </div>
    ),
  });
}

export const MAX_LENGTH = 20;

export const RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: 'Ít nhất 1 kí tự đặc biệt', test: (v) => /[^A-Za-z0-9]/.test(v) },
  {
    label: 'Có chữ viết hoa, số',
    test: (v) => /[A-Z]/.test(v) && /\d/.test(v),
  },
  {
    label: 'Độ dài 10 - 20 kí tự',
    test: (v) => v.length >= 10 && v.length <= MAX_LENGTH,
  },
];

export const passesRules = (value: string) =>
  RULES.every((rule) => rule.test(value));

export function getChangePasswordError(error: any) {
  const errorMessage: string =
    error?.response?.data?.message || error?.message || '';
  return errorMessage.includes('Mật khẩu không chính xác')
    ? 'Nhập sai mật khẩu hiện tại'
    : errorMessage || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
}

export function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}: {
  label: string;
  placeholder: string;
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
          placeholder={placeholder}
          maxLength={MAX_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          className={`h-full min-w-0 flex-1 border-0 bg-transparent !leading-5 !text-[#060607] caret-[#060607] outline-none placeholder:!text-sm placeholder:tracking-normal placeholder:text-[rgba(10,10,11,0.36)] ${
            !visible && value ? '!text-[10px] tracking-[0.2em]' : '!text-sm'
          }`}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-[10px] leading-4 text-[rgba(10,10,11,0.55)]"
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

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="!mb-0 !mt-4 flex list-none flex-col gap-2 !pl-1">
      {RULES.map((rule) => {
        const state = !value ? 'idle' : rule.test(value) ? 'ok' : 'fail';
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
  );
}
