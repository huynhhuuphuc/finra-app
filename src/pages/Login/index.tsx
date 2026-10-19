import { login } from '@/api/auth';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO } from '@/constants/cookie';
import { PENDING_LOGIN } from '@/constants/otp';
import { PAGE_URL } from '@/constants/pathUrl';
import { AvatarIcon, EyeIcon, ViewOffIcon } from '@/icons';
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

export default function Login() {
  const { message } = App.useApp();
  const { setInitialState } = useModel('@@initialState');
  const queryClient = useQueryClient();
  const [form] = Form.useForm<LoginValues>();
  const username = Form.useWatch('username', form);
  const password = Form.useWatch('password', form);
  const [submitting, setSubmitting] = useState(false);

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
        onFinish={onSubmit}
      >
        <p className="login-lead font-poppins">
          Nhập <strong>Số điện thoại hoặc Nickname</strong> để bắt đầu
        </p>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
        >
          <Input
            className="login-input"
            autoComplete="off"
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
