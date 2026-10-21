import { ReloadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useState } from 'react';

export default function ProfileStatus({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: Error | null;
  retry: () => unknown;
}) {
  const [retrying, setRetrying] = useState(false);

  if (loading)
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 px-5 py-4 text-sm leading-5 text-[rgba(10,10,11,0.55)]"
      >
        <Spin size="small" />
        Đang tải thông tin…
      </div>
    );
  if (!error) return null;

  const onRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await retry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="py-3">
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-[rgba(255,59,48,0.16)] bg-[#fff6f5] p-4"
      >
        <img
          src="/images/accumulation/danger.svg"
          alt=""
          width={20}
          height={18}
          className="mt-0.5 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="!mb-0 text-sm font-semibold leading-5 text-[#060607]">
            Không tải được dữ liệu
          </p>
          <p className="!mb-0 !mt-0.5 break-words text-xs leading-4 text-[rgba(10,10,11,0.55)]">
            {error.message || 'Vui lòng thử lại sau.'}
          </p>
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="!mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#b65ffc] bg-white px-3 text-xs font-semibold !text-[#b65ffc] disabled:opacity-60"
          >
            <ReloadOutlined spin={retrying} />
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}
