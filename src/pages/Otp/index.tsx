import OTPInput from '@/components/@lgs/OTPInput';
import { ACCESS_TOKEN, USER_INFO } from '@/constants/cookie';
import { OTP_LENGTH, PENDING_LOGIN } from '@/constants/otp';
import { PAGE_URL } from '@/constants/pathUrl';
import type { CurrentUser } from '@/types/currentUser';
import { setCookie } from '@/utils/cookie';
import { setGaUserId } from '@/utils/ga4';
import { CloseOutlined } from '@ant-design/icons';
import { Helmet, history, useModel } from '@umijs/max';
import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';

const readPendingLogin = (): CurrentUser | null => {
  const raw = sessionStorage.getItem(PENDING_LOGIN);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
};

export default function OtpPage() {
  const { setInitialState } = useModel('@@initialState');
  const [account] = useState(() => readPendingLogin());
  const [otp, setOtp] = useState('');

  const onChangeOTP = useCallback((value: string) => {
    setOtp(value.length === OTP_LENGTH ? value : '');
  }, []);

  const close = () => {
    sessionStorage.removeItem(PENDING_LOGIN);
    history.replace(PAGE_URL.login);
  };

  const confirm = () => {
    if (!account || otp.length !== OTP_LENGTH) return;

    const minutes = account.sessionTimeoutMinutes || 60;
    const expires = new Date(Date.now() + minutes * 60 * 1000);
    setCookie(ACCESS_TOKEN, 'demo-session', { expires });
    setCookie(USER_INFO, account, { expires });
    setGaUserId(account.username);
    sessionStorage.removeItem(PENDING_LOGIN);
    flushSync(() => {
      setInitialState((state) => ({ ...state, currentUser: account }));
    });
    history.replace(PAGE_URL.home);
  };

  return (
    <div className="login-page app-screen otp-page">
      <Helmet>
        <title>Xác thực OTP - Finra</title>
      </Helmet>

      <header className="login-hero">
        <img
          src="/images/login/logo.svg"
          alt=""
          className="login-logo"
          width={26}
          height={39}
        />
        <h1>Xác thực OTP</h1>
      </header>

      <div className="login-sheet">
        <button
          type="button"
          className="otp-close"
          aria-label="Đóng"
          onClick={close}
        >
          <CloseOutlined />
        </button>

        <p className="login-lead">
          Nhập mã OTP gồm <strong>{OTP_LENGTH} số</strong> được gửi tới
        </p>
        <p className="otp-account">{account?.displayName || account?.username}</p>

        <OTPInput
          autoFocus
          isNumberInput
          length={OTP_LENGTH}
          className="otp-inputs"
          inputClassName="otp-digit"
          onChangeOTP={onChangeOTP}
        />

        <Button
          className="login-submit"
          disabled={otp.length !== OTP_LENGTH}
          onClick={confirm}
          block
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
}
