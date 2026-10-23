import type { CustomerTransaction } from '@/api/core/customer';
import { formatHomeMoney, getTransactionAmounts } from '@/api/core/home';
import { ArrowUpLightIcon, PlusLightIcon, ReloadLightIcon } from '@/icons';
import { Empty, Modal } from 'antd';
import { useState } from 'react';

function TransactionMoney({
  item,
  hidden,
}: {
  item: CustomerTransaction;
  hidden: boolean;
}) {
  const { incoming, outgoing } = getTransactionAmounts(item);
  if (incoming === null || outgoing === null) return <>—</>;
  if (!incoming && !outgoing) return <>{formatHomeMoney(0, hidden)}</>;
  return (
    <span className="flex flex-col items-end">
      {incoming !== 0 && (
        <span className="text-[#34c759]">
          {formatHomeMoney(incoming, hidden, true, true)}
        </span>
      )}
      {outgoing !== 0 && (
        <span className="text-[#ff3b30]">
          {hidden ? '••••••' : '-' + formatHomeMoney(Math.abs(outgoing))}
        </span>
      )}
    </span>
  );
}

export default function RecentTransactions({
  items,
  hidden,
}: {
  items: CustomerTransaction[];
  hidden: boolean;
}) {
  const [selected, setSelected] = useState<CustomerTransaction | null>(null);
  return (
    <>
      {items.length === 0 && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có giao dịch."
          className="!my-6"
        />
      )}
      <div className="mt-4 flex flex-col gap-4">
        {items.slice(0, 3).map((item, index) => {
          const deposit = item.BUSINESS_CODE === 'CASH_DEPOSIT';
          const withdraw = item.BUSINESS_CODE === 'CASH_TRANSFER_OUT';
          const Icon = deposit
            ? PlusLightIcon
            : withdraw
            ? ArrowUpLightIcon
            : ReloadLightIcon;
          return (
            <button
              type="button"
              key={
                item.PK_CASH_TRANSACTION || `${item.TRANSACTION_NO}-${index}`
              }
              onClick={() => setSelected(item)}
              className="flex w-full gap-4 text-left"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#171b6d]">
                <Icon
                  width={16}
                  height={16}
                  className={withdraw ? '-rotate-90 -scale-x-100' : ''}
                />
              </span>
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3 border-b border-[#e7e7e7] pb-4">
                <span className="min-w-0">
                  <span className="block text-xs font-semibold">
                    {item.BUSINESS_TRANS_DETAIL_NAME || '—'}
                  </span>
                  <span className="mt-1 block text-[10px]">
                    {item.DUE_DATE || '—'}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold">
                  <TransactionMoney item={item} hidden={hidden} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <Modal
        open={Boolean(selected)}
        title="Chi tiết giao dịch"
        footer={null}
        onCancel={() => setSelected(null)}
      >
        {selected && (
          <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm">
            <dt>Giao dịch</dt>
            <dd>{selected.BUSINESS_TRANS_DETAIL_NAME || '—'}</dd>
            <dt>Ngày giao dịch</dt>
            <dd>{selected.DUE_DATE || '—'}</dd>
            <dt>Số tiền</dt>
            <dd>
              <TransactionMoney item={selected} hidden={hidden} />
            </dd>
            <dt>Trạng thái</dt>
            <dd>{selected.STATUS_NAME || '—'}</dd>
            <dt>Nội dung</dt>
            <dd className="whitespace-pre-wrap break-words">
              {selected.CONTENT || '—'}
            </dd>
          </dl>
        )}
      </Modal>
    </>
  );
}
