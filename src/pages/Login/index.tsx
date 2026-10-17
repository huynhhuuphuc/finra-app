import { PENDING_LOGIN } from '@/constants/otp';
import { PAGE_URL } from '@/constants/pathUrl';
import { AvatarIcon, EyeIcon, ViewOffIcon } from '@/icons';
import type { CurrentUser } from '@/types/currentUser';
import { Helmet, history } from '@umijs/max';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = '123456';
const DEMO_ACCOUNT_CODE = /^\d{6}$/;
const SESSION_MINUTES = 60;

const isDemoAccount = (account: string) =>
  account === DEMO_USERNAME || DEMO_ACCOUNT_CODE.test(account);

type LoginValues = {
  username: string;
  password: string;
};

export default function Login() {
  const { message } = App.useApp();
  const [form] = Form.useForm<LoginValues>();
  const username = Form.useWatch('username', form);
  const password = Form.useWatch('password', form);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(username?.trim() && password);

  const onSubmit = (values: LoginValues) => {
    const account = values.username.trim();
    if (!isDemoAccount(account) || values.password !== DEMO_PASSWORD) {
      message.error('Sai tài khoản hoặc mật khẩu.');
      return;
    }

    setSubmitting(true);
    const userInfo: CurrentUser = {
      user: account,
      username: account,
      token_type: 'Bearer',
      sessionTimeoutMinutes: SESSION_MINUTES,
      displayName: account,
      permissions: [],
    };
    sessionStorage.setItem(PENDING_LOGIN, JSON.stringify(userInfo));
    history.replace(PAGE_URL.otp);
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
        <p className="login-lead">
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
          onClick={(event) => event.preventDefault()}
        >
          Quên mật khẩu?
        </button>

        <p className="login-signup">
          Bạn chưa có tài khoản ?{' '}
          <button type="button" onClick={(event) => event.preventDefault()}>
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
      </Form>
    </div>
  );
}
