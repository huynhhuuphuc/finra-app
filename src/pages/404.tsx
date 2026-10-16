import { history } from '@umijs/max';
import { Button, Result } from 'antd';

export default function Page() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Địa chỉ không tồn tại!"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          Quay lại trang chủ
        </Button>
      }
    />
  );
}
