import {
  fetchCustomerTransactions,
  type CustomerTransaction,
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
import { goBack } from '@/utils/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from '@umijs/max';
import {
  ConfigProvider,
  DatePicker,
  Drawer,
  Empty,
  Modal,
  Segmented,
} from 'antd';
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

const LIQUIDATION_CODES = [
  'ADV_APPENDIX_LIQ_CASH_OUT',
  'ADV_APPENDIX_LIQ_CASH_FEE',
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value) + 'đ';

function getCast(transaction: CustomerTransaction) {
  const cashIn = Number(transaction.CASH_IN) || 0;
  const cashOut = Number(transaction.CASH_OUT) || 0;
  if (cashIn === 0 && cashOut === 0) {
    return { cash: '0', value: formatMoney(0), color: 'text-[#060607]' };
  }
  if (cashIn === 0) {
    return {
      cash: '-' + formatMoney(cashOut),
      value: formatMoney(cashOut),
      color: 'text-[#ff3b30]',
    };
  }
  return {
    cash: '+' + formatMoney(cashIn),
    value: formatMoney(cashIn),
    color: 'text-[#34c759]',
    positive: true,
  };
}

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
  const [params] = useSearchParams();
  const productCode = params.get('productCode') || '';
  const [tab, setTab] = useState<Tab>(productCode ? 'saving' : 'all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    TRANSACTION_TYPE: '',
    FROM_DATE: '',
    TO_DATE: '',
  });
  const [draft, setDraft] = useState(filters);
  const [selected, setSelected] = useState<CustomerTransaction | null>(null);
  const { accountCode, customerCode, hasSession } = useCustomerSession();
  const requestFilters: TransactionFilters = {
    ...filters,
    FROM_DATE: filters.FROM_DATE
      ? dayjs(filters.FROM_DATE).format('DD/MM/YYYY')
      : '',
    TO_DATE: filters.TO_DATE ? dayjs(filters.TO_DATE).format('DD/MM/YYYY') : '',
    HISTORY_TYPE: productCode
      ? 'PRODUCT'
      : tab === 'money'
      ? 'CASH'
      : tab === 'saving'
      ? 'PRODUCT'
      : '',
    TRANSACTION_TYPE: productCode || filters.TRANSACTION_TYPE,
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
    const { cash, color, positive } = getCast(transaction);
    const [date = '', time = ''] = (transaction.DUE_DATE || '').split(' ');
    return {
      ...transaction,
      title: transaction.BUSINESS_TRANS_DETAIL_NAME || '—',
      amount: cash,
      color,
      date,
      time: time.slice(0, 5),
      kind: (tab === 'saving'
        ? 'saving'
        : positive
        ? 'deposit'
        : 'withdraw') as Kind,
    };
  });

  return (
    <div className="min-h-full bg-white pb-24 text-[#060607]">
      <div className="sticky top-0 z-10 bg-white">
        <header className="flex h-[60px] items-center gap-4 px-5">
          <button
            type="button"
            aria-label="Quay lại"
            onClick={() => goBack(PAGE_URL.account)}
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

        <div className="-mb-2 mt-[14px] px-5 py-2">
          <ConfigProvider
            theme={{
              token: {
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
              disabled={Boolean(productCode)}
              value={productCode ? 'saving' : tab}
              onChange={(value) => setTab(value as Tab)}
              options={TABS.map((item) => ({
                label: item.label,
                value: item.id,
              }))}
              className="[&_.ant-segmented-item-label]:font-normal [&_.ant-segmented-item-selected_.ant-segmented-item-label]:font-semibold"
            />
          </ConfigProvider>
        </div>
      </div>

      <ProfileStatus
        loading={query.isFetching}
        error={query.error}
        retry={query.refetch}
      />
      <section className="mx-5 mt-5 rounded-lg border border-[#e7e7e7] p-4">
        {query.isSuccess && items.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có giao dịch phù hợp"
            className="!my-6"
          />
        )}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <button
              type="button"
              key={
                item.PK_CASH_TRANSACTION || `${item.TRANSACTION_NO}-${index}`
              }
              onClick={() => setSelected(item)}
              className="flex gap-4 text-left"
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
                      <span>{item.date || '—'}</span>
                      <span className="text-[#b3b3b3]">|</span>
                      <span>{item.time}</span>
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-xs font-semibold leading-4 !mb-0 ${item.color}`}
                  >
                    {item.amount}
                  </p>
                </div>
                {index < items.length - 1 ? (
                  <div className="mt-4 h-px bg-[#e7e7e7]" />
                ) : null}
              </div>
            </button>
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
      <Drawer
        placement="bottom"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        closable={false}
        size="auto"
        styles={{
          body: { padding: '8px 20px 24px' },
          section: { borderRadius: '16px 16px 0 0' },
        }}
      >
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#d9d9d9]" />
        <h2 className="!mb-4 text-xl font-semibold leading-7 text-[#060607]">
          Chi tiết
        </h2>
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#e7e7e7] p-4 text-[#060607]">
          <div className="col-span-2">
            <p className="text-xs leading-4 text-[#545454] !mb-1">Nội dung</p>
            <p className="text-sm font-semibold leading-5 !mb-0">
              {selected?.CONTENT || selected?.BUSINESS_TRANS_DETAIL_NAME || '—'}
            </p>
          </div>
          {selected &&
          LIQUIDATION_CODES.includes(selected.C_BUSINESS_DETAIL_CODE || '') ? (
            <div>
              <p className="text-xs leading-4 text-[#545454] !mb-1">Giá trị</p>
              <p className="text-sm font-semibold leading-5 !mb-0">
                {getCast(selected).value}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs leading-4 text-[#545454] !mb-1">
                Phí giao dịch
              </p>
              <p className="text-sm font-semibold leading-5 !mb-0">Miễn phí</p>
            </div>
          )}
          <div>
            <p className="text-xs leading-4 text-[#545454] !mb-1">Trạng thái</p>
            <p className="text-sm font-semibold leading-5 !mb-0">
              {selected?.STATUS_NAME || '—'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs leading-4 text-[#545454] !mb-1">Thời gian</p>
            <p className="text-sm font-semibold leading-5 !mb-0">
              {selected?.DUE_DATE || '—'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="!mt-6 h-12 w-full rounded-xl bg-[#e7e7e7] text-sm font-semibold leading-5 text-[#060607]"
        >
          Đóng
        </button>
      </Drawer>
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
          {/* <label>
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
          </button> */}
        </div>
      </Modal>
    </div>
  );
}
