import { login } from '@/api/auth';
import {
  ACCESS_TOKEN,
  MEMORIZED_ACCOUNTS,
  REFRESH_TOKEN,
  USER_INFO,
} from '@/constants/cookie';
import { PENDING_LOGIN } from '@/constants/otp';
import { PAGE_URL } from '@/constants/pathUrl';
import { AvatarIcon, EyeIcon, ReloadLightIcon, ViewOffIcon } from '@/icons';
import { setCookie } from '@/utils/cookie';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet, history, useModel } from '@umijs/max';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import LoginShortcuts from './components/LoginShortcuts';

type LoginValues = {
  username: string;
  password: string;
};

type MemorizedAccount = {
  username: string;
  fullName?: string;
  phone?: string;
};

function readMemorizedAccount(): MemorizedAccount | null {
  try {
    const value = JSON.parse(localStorage.getItem(MEMORIZED_ACCOUNTS) || '');
    return typeof value?.username === 'string' && value.username ? value : null;
  } catch {
    return null;
  }
}

function writeMemorizedAccount(account: MemorizedAccount) {
  try {
    localStorage.setItem(MEMORIZED_ACCOUNTS, JSON.stringify(account));
  } catch {
    // Storage can be blocked; remembering is optional.
  }
}

export default function Login() {
  const { message } = App.useApp();
  const { setInitialState } = useModel('@@initialState');
  const queryClient = useQueryClient();
  const [form] = Form.useForm<LoginValues>();
  const username = Form.useWatch('username', form);
  const password = Form.useWatch('password', form);
  const [submitting, setSubmitting] = useState(false);
  const [memorized, setMemorized] = useState(readMemorizedAccount);

  const canSubmit = Boolean(username?.trim() && password);

  const onSubmit = async (values: LoginValues) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const session = await login(values.username, values.password);
      const options = {
        path: '/',
        sameSite: 'lax' as const,
        secure: window.location.protocol === 'https:',
      };
      // Keep the existing session-cookie mechanism. Never persist passwords.
      setCookie(ACCESS_TOKEN, session.token, options);
      setCookie(REFRESH_TOKEN, session.refreshToken, options);
      setCookie(USER_INFO, session.currentUser, options);
      writeMemorizedAccount({
        username: values.username.trim(),
        fullName: session.currentUser.fullName,
        phone: session.currentUser.phone,
      });
      sessionStorage.removeItem(PENDING_LOGIN);
      queryClient.clear();
      flushSync(() => {
        setInitialState((state) => ({
          ...state,
          currentUser: session.currentUser,
        }));
      });
      history.replace(PAGE_URL.home);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          'Không thể kết nối máy chủ. Vui lòng thử lại.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page app-screen">
      <Helmet>
        <title>Đăng nhập - Finra</title>
      </Helmet>

      <header className="login-hero">
        <img
          src="/images/login/logo.svg"
          alt=""
          className="login-logo"
          width={26}
          height={39}
        />
        <h1>Xin chào bạn</h1>
      </header>

      <Form
        form={form}
        className="login-sheet"
        requiredMark={false}
        autoComplete="off"
        initialValues={{ username: memorized?.username }}
        onFinish={onSubmit}
      >
        <p className="login-lead font-poppins">
          {memorized ? (
            <>
              Nhập <strong>mật khẩu</strong> để bắt đầu
            </>
          ) : (
            <>
              Nhập <strong>Số điện thoại hoặc Nickname</strong> để bắt đầu
            </>
          )}
        </p>

        {memorized && (
          <div className="mb-5 flex min-h-[52px] items-center gap-3 rounded-lg bg-[#b65ffc] py-2 pl-4 pr-3 text-white">
            <div className="min-w-0 flex-1">
              <p className="!mb-0 truncate text-sm font-semibold uppercase leading-5 tracking-wide">
                {memorized.fullName || memorized.username}
              </p>
              <p className="!mb-0 truncate text-xs leading-4 tracking-wide">
                {memorized.phone || memorized.username}
              </p>
            </div>
            <button
              type="button"
              aria-label="Đổi tài khoản"
              className="grid size-9 shrink-0 place-items-center rounded-md border-0 bg-white/30"
              onClick={() => {
                setMemorized(null);
                form.setFieldsValue({ username: '', password: '' });
              }}
            >
              <ReloadLightIcon
                width={16.25}
                height={16.25}
                preserveAspectRatio="xMidYMid meet"
              />
            </button>
          </div>
        )}

        <Form.Item
          hidden={Boolean(memorized)}
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
          normalize={(value?: string) => value?.toUpperCase()}
        >
          <Input
            className="login-input"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Số điện thoại hoặc Nickname"
            prefix={<AvatarIcon width={24} height={24} />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password
            className="login-input"
            autoComplete="new-password"
            placeholder="Mật khẩu"
            prefix={
              <img
                src="/images/login/key.svg"
                alt=""
                className="login-key"
                width={24}
                height={24}
              />
            }
            iconRender={(visible) =>
              visible ? (
                <EyeIcon
                  width={21.5}
                  height={15.5}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <ViewOffIcon
                  width={24}
                  height={24}
                  fill0="#B3B3B3"
                  preserveAspectRatio="xMidYMid meet"
                />
              )
            }
          />
        </Form.Item>

        <button
          type="button"
          className="login-forgot"
          onClick={() => history.push(PAGE_URL.developing)}
        >
          Quên mật khẩu?
        </button>

        <p className="login-signup">
          Bạn chưa có tài khoản ?{' '}
          <button
            type="button"
            onClick={() => history.push(PAGE_URL.developing)}
          >
            Tạo tài khoản
          </button>
        </p>

        <Button
          htmlType="submit"
          className="login-submit transition-transform duration-150 ease-out enabled:active:scale-95"
          disabled={!canSubmit || submitting}
          loading={submitting}
          block
        >
          Đăng nhập
        </Button>
        <LoginShortcuts />
      </Form>
    </div>
  );
}
