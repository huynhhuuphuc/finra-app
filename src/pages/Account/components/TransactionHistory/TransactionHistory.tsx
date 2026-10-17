import { PAGE_URL } from '@/constants/pathUrl';
import {
  ArrowUpLightIcon,
  BackIcon,
  FilterIcon,
  PlusLightIcon,
  ReloadLightIcon,
} from '@/icons';
import { history } from '@umijs/max';
import { ConfigProvider, Segmented } from 'antd';
import { useState } from 'react';

type Tab = 'all' | 'money' | 'saving';
type Kind = 'deposit' | 'withdraw' | 'saving';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'money', label: 'Tiền' },
  { id: 'saving', label: 'Tích lũy' },
];

const TRANSACTIONS: {
  title: string;
  amount: string;
  kind: Kind;
  positive: boolean;
}[] = [
  {
    title: 'Nộp tiền',
    amount: '+100,000,000',
    kind: 'deposit',
    positive: true,
  },
  {
    title: 'Rút tiền',
    amount: '-5,000,000',
    kind: 'withdraw',
    positive: false,
  },
  {
    title: 'Nộp tiền',
    amount: '+100,000,000',
    kind: 'deposit',
    positive: true,
  },
  {
    title: 'Mở tích luỹ',
    amount: '-50,000,000',
    kind: 'saving',
    positive: false,
  },
  {
    title: 'Mở tích luỹ',
    amount: '-100,000,000',
    kind: 'saving',
    positive: false,
  },
  {
    title: 'Nộp tiền',
    amount: '+100,000,000',
    kind: 'deposit',
    positive: true,
  },
  {
    title: 'Rút tiền',
    amount: '-5,000,000',
    kind: 'withdraw',
    positive: false,
  },
  {
    title: 'Nộp tiền',
    amount: '+100,000,000',
    kind: 'deposit',
    positive: true,
  },
  {
    title: 'Mở tích luỹ',
    amount: '-100,000,000',
    kind: 'saving',
    positive: false,
  },
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
  const items = TRANSACTIONS.filter((item) => {
    if (tab === 'money') return item.kind !== 'saving';
    if (tab === 'saving') return item.kind === 'saving';
    return true;
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

      <section className="mx-5 mt-5 rounded-lg border border-[#e7e7e7] p-4">
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex gap-4">
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
                      <span>16/09/2024</span>
                      <span className="text-[#b3b3b3]">|</span>
                      <span>16:19</span>
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
        className="fixed bottom-6 left-1/2 z-10 flex h-10 w-[120px] -translate-x-1/2 items-center justify-center gap-3 rounded-xl border border-[#c06ae4] bg-white text-sm font-semibold leading-5"
      >
        Bộ lọc
        <FilterIcon
          width={17.9167}
          height={17.9167}
          preserveAspectRatio="xMidYMid meet"
        />
      </button>
    </div>
  );
}
