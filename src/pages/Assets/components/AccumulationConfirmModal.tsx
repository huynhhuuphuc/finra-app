import { formatHomeMoney } from '@/api/core/home';
import { Modal } from 'antd';
import type { ReactNode } from 'react';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs leading-4">
      <span className="text-[rgba(10,10,11,0.78)]">{label}</span>
      <span className="text-right font-semibold text-[#060607]">
        {children}
      </span>
    </div>
  );
}

export default function AccumulationConfirmModal({
  open,
  amount,
  from,
  to,
  contractLabel,
  productName,
  profit,
  received,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  amount: number;
  from: string;
  to?: string;
  contractLabel: string;
  productName: string;
  profit: unknown;
  received: unknown;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      centered
      width={343}
      footer={null}
      closable={false}
      onCancel={onCancel}
      destroyOnHidden
      styles={{
        mask: { background: 'rgba(0, 0, 0, 0.75)' },
        container: { padding: 0, background: 'transparent', boxShadow: 'none' },
      }}
    >
      <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-white" />

      <section className="rounded-xl bg-white p-4 text-[#060607]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="!mb-0 text-base font-semibold leading-6">
            Xác nhận giao dịch
          </h2>
          <img
            src="/images/accumulation/coin.png"
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
          />
        </div>

        <p className="!mb-0 mt-2 flex items-baseline gap-1 font-semibold">
          <span className="text-[32px] leading-[44px]">
            {formatHomeMoney(amount, false, false)}
          </span>
          <span className="text-base leading-6 underline">đ</span>
        </p>

        {to && (
          <p className="!mb-0 mt-1 flex min-w-0 items-center gap-2 text-xs leading-4">
            <span className="truncate font-semibold text-[#b65ffc]">
              {from}
            </span>
            <span
              aria-label="chuyển đến"
              className="shrink-0 tracking-[-2px] text-[#b3b3b3]"
            >
              ››››
            </span>
            <span className="truncate text-[rgba(10,10,11,0.55)]">{to}</span>
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 border-t border-[#e7e7e7] pt-4">
          <Row label={contractLabel}>{productName}</Row>
          <Row label="Lợi nhuận">{formatHomeMoney(profit)}</Row>
          <Row label="Thực nhận">
            <span className="text-[#34c759]">
              {formatHomeMoney(received, false, true, true)}
            </span>
          </Row>
        </div>
      </section>

      <button
        type="button"
        disabled={loading}
        onClick={onConfirm}
        className="!mt-4 h-12 w-full rounded-xl bg-[#b65ffc] text-sm font-semibold !text-white disabled:opacity-60"
      >
        Xác nhận
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="!mt-3 h-12 w-full rounded-xl bg-[#3a3a3c] text-sm font-semibold !text-white"
      >
        Huỷ giao dịch
      </button>
    </Modal>
  );
}
