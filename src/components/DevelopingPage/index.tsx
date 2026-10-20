import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import { goBack } from '@/utils/navigation';
import { Empty } from 'antd';

export default function DevelopingPage() {
  return (
    <div className="app-screen !bg-white">
      <PageHeader
        title=""
        onBack={() => goBack(PAGE_URL.login)}
      />
      <div className="flex flex-1 items-center justify-center px-5 pb-[60px]">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-sm leading-5 text-[rgba(10,10,11,0.55)]">
              Tính năng đang phát triển. Vui lòng thử lại sau
            </span>
          }
        />
      </div>
    </div>
  );
}
