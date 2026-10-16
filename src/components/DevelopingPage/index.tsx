import { PageContainer } from '@ant-design/pro-components';
import { Empty } from 'antd';

export default function DevelopingPage() {
  return (
    <PageContainer title={false} breadcrumb={{}}>
      <Empty className="py-16" description="Đang phát triển" />
    </PageContainer>
  );
}
