import {
  fetchCustomerTransactions,
  type TransactionFilters,
} from '@/api/core/customer';
import { ACCESS_TOKEN } from '@/constants/cookie';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import {
  ArrowUpLightIcon,
  BackIcon,
  FilterIcon,
  PlusLightIcon,
  ReloadLightIcon,
} from '@/icons';
import { getCookie } from '@/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { history } from '@umijs/max';
import { ConfigProvider, DatePicker, Input, Modal, Segmented } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import ProfileStatus from '../ProfileStatus';

type Tab = 'all' | 'money' | 'saving';
type Kind = 'deposit' | 'withdraw' | 'saving';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'money', label: 'Tiền' },
  { id: 'saving', label: 'Tích lũy' },
];

function TransactionIcon({ kind }: { kind: Kind }) {
  if (kind === 'deposit') {
    return (
      <PlusLightIcon
        width={14.5833}
        height={14.5833}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  }

  if (kind === 'withdraw') {
    return (
      <ArrowUpLightIcon
        width={14.5833}
        height={9.58412}
        preserveAspectRatio="xMidYMid meet"
        className="-rotate-90 -scale-x-100"
      />
    );
  }

  return (
    <ReloadLightIcon
      width={16.25}
      height={16.2497}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

export default function TransactionHistory() {
  const [tab, setTab] = useState<Tab>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    TRANSACTION_TYPE: '',
    FROM_DATE: '',
    TO_DATE: '',
  });
  const [draft, setDraft] = useState(filters);
  const { accountCode, customerCode, hasSession } = useCustomerSession();
  const requestFilters: TransactionFilters = {
    ...filters,
    FROM_DATE: filters.FROM_DATE
      ? dayjs(filters.FROM_DATE).format('DD/MM/YYYY')
      : '',
    TO_DATE: filters.TO_DATE ? dayjs(filters.TO_DATE).format('DD/MM/YYYY') : '',
    HISTORY_TYPE: tab === 'money' ? 'CASH' : tab === 'saving' ? 'PRODUCT' : '',
  };
  const query = useQuery({
    queryKey: [
      'transactions',
      customerCode,
      accountCode,
      getCookie(ACCESS_TOKEN),
      requestFilters,
    ],
    queryFn: ({ signal }) =>
      fetchCustomerTransactions(accountCode!, requestFilters, signal),
    enabled: Boolean(hasSession && accountCode),
    retry: false,
  });
  const items = (query.data || []).map((transaction) => {
    const cashIn = Number(transaction.CASH_IN);
    const cashOut = Number(transaction.CASH_OUT);
    const positive = Number.isFinite(cashIn) && cashIn > 0;
    const amount = positive ? cashIn : cashOut;
    return {
      ...transaction,
      title: transaction.BUSINESS_TRANS_DETAIL_NAME || '—',
      amount: Number.isFinite(amount)
        ? (positive ? '+' : '-') +
          new Intl.NumberFormat('vi-VN').format(Math.abs(amount)) +
          'đ'
        : '—',
      positive,
      kind: (tab === 'saving'
        ? 'saving'
        : positive
        ? 'deposit'
        : 'withdraw') as Kind,
    };
  });

  return (
    <div className="min-h-full bg-white pb-24 text-[#060607]">
      <header className="flex h-[60px] items-center gap-4 px-5">
        <button
          type="button"
          aria-label="Quay lại"
          onClick={() => history.replace(PAGE_URL.account)}
          className="grid size-6 shrink-0 place-items-center"
        >
          <BackIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
        <h1 className="text-lg font-semibold leading-7 !mb-0">
          Lịch sử giao dịch
        </h1>
      </header>

      <div className="mx-5 mt-[22px]">
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "'Hanken Grotesque', sans-serif",
              fontSize: 12,
              borderRadius: 6,
              borderRadiusSM: 6,
              controlHeight: 36,
              boxShadowTertiary: 'none',
              motionDurationSlow: '0.3s',
            },
            components: {
              Segmented: {
                trackBg: '#e7e7e7',
                trackPadding: 2,
                itemColor: '#8e8e8f',
                itemHoverColor: '#060607',
                itemHoverBg: 'transparent',
                itemSelectedBg: '#ffffff',
                itemSelectedColor: '#060607',
                itemActiveBg: 'transparent',
              },
            },
          }}
        >
          <Segmented
            block
            value={tab}
            onChange={(value) => setTab(value as Tab)}
            options={TABS.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            className="[&_.ant-segmented-item-label]:font-normal [&_.ant-segmented-item-selected_.ant-segmented-item-label]:font-semibold"
          />
        </ConfigProvider>
      </div>

      <ProfileStatus
        loading={query.isFetching}
        error={query.error}
        retry={query.refetch}
      />
      {query.isSuccess && items.length === 0 && (
        <p className="px-5 py-3 text-sm">Không có giao dịch phù hợp.</p>
      )}
      <section className="mx-5 mt-5 rounded-lg border border-[#e7e7e7] p-4">
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div
              key={
                item.PK_CASH_TRANSACTION || `${item.TRANSACTION_NO}-${index}`
              }
              className="flex gap-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#171b6d]">
                <TransactionIcon kind={item.kind} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-4 !mb-0">
                      {item.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] leading-4 !mb-0">
                      <span>{item.DUE_DATE || '—'}</span>
                      <span className="text-[#b3b3b3]">|</span>
                      <span>{item.CREATE_TIME || ''}</span>
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-xs font-semibold leading-4 !mb-0 ${
                      item.positive ? 'text-[#34c759]' : 'text-[#ff3b30]'
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
                {index < items.length - 1 ? (
                  <div className="mt-4 h-px bg-[#e7e7e7]" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          setDraft(filters);
          setFilterOpen(true);
        }}
        className="fixed bottom-6 left-1/2 z-10 flex h-10 w-[120px] -translate-x-1/2 items-center justify-center gap-3 rounded-xl border border-[#c06ae4] bg-white text-sm font-semibold leading-5"
      >
        Bộ lọc
        <FilterIcon
          width={17.9167}
          height={17.9167}
          preserveAspectRatio="xMidYMid meet"
        />
      </button>
      <Modal
        title="Bộ lọc giao dịch"
        open={filterOpen}
        onCancel={() => setFilterOpen(false)}
        okText="Áp dụng"
        cancelText="Hủy"
        okButtonProps={{
          disabled: Boolean(
            draft.FROM_DATE &&
              draft.TO_DATE &&
              dayjs(draft.FROM_DATE).isAfter(dayjs(draft.TO_DATE)),
          ),
        }}
        onOk={() => {
          setFilters(draft);
          setFilterOpen(false);
        }}
      >
        <div className="flex flex-col gap-4 py-4">
          <label>
            Từ ngày
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              value={draft.FROM_DATE ? dayjs(draft.FROM_DATE) : null}
              onChange={(date) =>
                setDraft({
                  ...draft,
                  FROM_DATE: date ? date.format('YYYY-MM-DD') : '',
                })
              }
            />
          </label>
          <label>
            Đến ngày
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              value={draft.TO_DATE ? dayjs(draft.TO_DATE) : null}
              onChange={(date) =>
                setDraft({
                  ...draft,
                  TO_DATE: date ? date.format('YYYY-MM-DD') : '',
                })
              }
            />
          </label>
          <label>
            Mã loại giao dịch
            <Input
              value={draft.TRANSACTION_TYPE}
              onChange={(event) =>
                setDraft({ ...draft, TRANSACTION_TYPE: event.target.value })
              }
            />
          </label>
          <button
            type="button"
            onClick={() =>
              setDraft({ TRANSACTION_TYPE: '', FROM_DATE: '', TO_DATE: '' })
            }
          >
            Xóa bộ lọc
          </button>
        </div>
      </Modal>
    </div>
  );
}
