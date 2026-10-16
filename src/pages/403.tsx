import { removeCookieAll } from '@/utils/cookie';
import { Button, Result } from 'antd';
import React from 'react';
import { history, useModel } from 'umi';

const NoPermission: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');

  const handelLogout = async () => {
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    removeCookieAll();
    history.push('/login');
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle="Bạn không có quyền sử dụng chức năng này, xin vui lòng liên hệ với quản trị viên!"
      extra={
        <>
          <Button type="primary" onClick={() => history.push('/')}>
            Quay lại trang trủ
          </Button>
          <Button onClick={handelLogout}>Đăng xuất</Button>
        </>
      }
    />
  );
};

export default NoPermission;
