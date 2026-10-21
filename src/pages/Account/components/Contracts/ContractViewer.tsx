import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import { goBack } from '@/utils/navigation';
import { useSearchParams } from '@umijs/max';
import { useState } from 'react';

const safePdfUrl = (value: string | null) =>
  value && /^https:\/\//i.test(value) ? value : '';

export default function ContractViewer() {
  const [params] = useSearchParams();
  const url = safePdfUrl(params.get('url'));
  const title = params.get('title') || 'Hợp đồng';
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex h-full flex-col bg-white text-[#060607]">
      <PageHeader
        title={title}
        align="left"
        backVariant="boxed"
        onBack={() => goBack(PAGE_URL.accountContracts)}
      />

      {url ? (
        <>
          <div className="relative min-h-0 flex-1 bg-[#f1f1f1]">
            {!loaded && (
              <p className="absolute inset-0 grid place-items-center text-sm text-[rgba(10,10,11,0.55)]">
                Đang tải hợp đồng...
              </p>
            )}
            <iframe
              title={title}
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              onLoad={() => setLoaded(true)}
              className="relative size-full border-0"
            />
          </div>
          <div className="shrink-0 px-5 pb-6 pt-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#b65ffc] text-sm font-semibold !text-white"
            >
              Mở / tải hợp đồng
            </a>
          </div>
        </>
      ) : (
        <p role="alert" className="px-5 py-6 text-sm text-red-600">
          Không tìm thấy file hợp đồng.
        </p>
      )}
    </div>
  );
}
