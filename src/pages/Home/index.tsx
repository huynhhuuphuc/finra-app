import useCustomerProfile from '@/hooks/useCustomerProfile';
import {
  AdvanceIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpLightIcon,
  BellIcon,
  CardGlowIcon,
  EyeIcon,
  FlagIcon,
  MarkerIcon,
  PlusIcon,
  PlusLightIcon,
  QrIcon,
  RefreshIcon,
  ReloadIcon,
  ReloadLightIcon,
  ViewOffIcon,
  WaveBottom2Icon,
  WaveBottomIcon,
  WaveTop2Icon,
  WaveTopIcon,
} from '@/icons';
import type { SVGProps } from 'react';
import { useEffect, useState } from 'react';

type HomeIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function HomeGlyph({
  icon: Icon,
  width,
  height,
  flip,
}: {
  icon: HomeIcon;
  width: number;
  height: number;
  flip?: boolean;
}) {
  return (
    <Icon
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={flip ? '-rotate-90 -scale-x-100' : undefined}
    />
  );
}

const ACTIONS: {
  label: string;
  icon: HomeIcon;
  width: number;
  height: number;
  flip?: boolean;
}[] = [
  { label: 'Nộp tiền', icon: PlusIcon, width: 14.5833, height: 14.5833 },
  {
    label: 'Rút tiền',
    icon: ArrowUpIcon,
    width: 14.5833,
    height: 9.58412,
    flip: true,
  },
  { label: 'Hợp tác', icon: ReloadIcon, width: 16.25, height: 16.2497 },
  { label: 'Ứng trước', icon: AdvanceIcon, width: 17.9167, height: 17.9167 },
];

const TRANSACTIONS: {
  title: string;
  amount: string;
  icon: HomeIcon;
  width: number;
  height: number;
  flip?: boolean;
}[] = [
  {
    title: 'Nộp tiền',
    amount: '+100,000,000',
    icon: PlusLightIcon,
    width: 14.5833,
    height: 14.5833,
  },
  {
    title: 'Rút tiền',
    amount: '-5,000,000',
    icon: ArrowUpLightIcon,
    width: 14.5833,
    height: 9.58412,
    flip: true,
  },
  {
    title: 'Mở tích luỹ',
    amount: '-50,000,000',
    icon: ReloadLightIcon,
    width: 16.25,
    height: 16.2497,
  },
];

const GOALS = [
  {
    name: 'Đi du lịch',
    value: '+6.257.125đ',
    soft: 'w-[35%]',
    fill: 'w-[17%]',
    marker: 'left-[14%]',
    flags: ['left-[31%]', 'left-[62%]', 'left-[93%]'],
  },
  {
    name: 'Mua nhà mới',
    value: '+150.257.215đ',
    soft: '',
    fill: 'w-[38%]',
    marker: 'left-[35%]',
    flags: [],
  },
];

export default function HomePage() {
  const [hidden, setHidden] = useState(false);

  const { data, error } = useCustomerProfile();

  useEffect(() => {
    if (data) console.log('[Home] GET_CUSTOMER_INFO:', data.response);
    if (error) console.error('[Home] GET_CUSTOMER_INFO failed:', error);
  }, [data, error]);

  return (
    <div className="bg-white px-5 pb-6 pt-4 text-[#060607]">
      <header className="flex h-14 items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/images/home/avatar.png"
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-light leading-5 text-[rgba(10,10,11,0.78)] !mb-0">
              Xin chào ✋
            </p>
            <p className="text-sm font-semibold leading-5 !mb-0">
              Nguyễn Minh Tuấn
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Mã QR"
            className="grid size-11 place-items-center rounded-md bg-[#f2f2f2]"
          >
            <QrIcon
              width={19.5}
              height={19.5}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
          <button
            type="button"
            aria-label="Thông báo"
            className="grid size-11 place-items-center rounded-md bg-[#f2f2f2]"
          >
            <BellIcon
              width={19.5}
              height={22}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </div>
      </header>

      <section className="relative mt-5 h-[188px] overflow-hidden rounded-2xl bg-[#0a0a0b] text-white">
        <CardGlowIcon
          width={160}
          height={141}
          className="pointer-events-none absolute -right-6 top-6 opacity-80"
        />
        <WaveBottomIcon
          width={144}
          height={233}
          className="pointer-events-none absolute -left-8 bottom-8 -rotate-[75deg] opacity-60"
        />
        <WaveTopIcon
          width={112}
          height={242}
          className="pointer-events-none absolute -left-6 bottom-2 -rotate-[75deg] opacity-60"
        />
        <WaveBottom2Icon
          width={128}
          height={200}
          className="pointer-events-none absolute -right-4 top-0 rotate-[102deg] opacity-60"
        />
        <WaveTop2Icon
          width={96}
          height={152}
          className="pointer-events-none absolute right-2 -top-2 rotate-[106deg] opacity-60"
        />
        <div className="relative px-4 pt-4">
          <p className="flex items-center gap-1.5 text-xs leading-4">
            Giá trị tài sản
            <button
              type="button"
              className="grid size-4 place-items-center"
              aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
              onClick={() => setHidden((value) => !value)}
            >
              {hidden ? (
                <ViewOffIcon
                  width={16}
                  height={16}
                  fill0="#B3B3B3"
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <EyeIcon
                  width={14.3333}
                  height={10.3333}
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </button>
          </p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-xl leading-8">đ</span>
            <span className="text-[32px] font-semibold leading-[52px]">
              {hidden ? '••••••••••' : '6.868.686.868'}
            </span>
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-[60px] bg-[#1cffc7] px-4 pt-3 text-[#060607]">
          <div className="flex-1">
            <p className="text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-1">
              Tiền mặt khả dụng
            </p>
            <p className="text-xs font-semibold leading-4">100.000.000đ</p>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-1">
              Lợi nhuận hiện tại
            </p>
            <p className="text-xs font-semibold leading-4">+89,124đ (+0.3%)</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              className="flex flex-col items-center gap-4 rounded-lg bg-[#f7f7f7] px-2 py-2.5"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
                <HomeGlyph
                  icon={Icon}
                  width={action.width}
                  height={action.height}
                  flip={action.flip}
                />
              </span>
              <span className="text-xs font-semibold leading-4 text-[rgba(10,10,11,0.78)]">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold leading-7">
            Hợp tác cùng FINRA
          </h2>
          <HomeGlyph
            icon={ArrowRightIcon}
            width={9.584}
            height={14.5833}
            flip
          />
        </div>
        <img
          src="/images/home/product-card.png"
          alt="Finra Snap"
          className="mt-5 block w-full drop-shadow-[2px_2px_12px_rgba(0,0,0,0.1)]"
        />
        <div className="mt-3 flex justify-center gap-1">
          <span className="h-1 w-6 rounded-full bg-[rgba(10,10,11,0.78)]" />
          <span className="h-1 w-4 rounded-full bg-[#e7e7e7]" />
          <span className="h-1 w-4 rounded-full bg-[#e7e7e7]" />
          <span className="h-1 w-4 rounded-full bg-[#e7e7e7]" />
        </div>
      </section>

      <div className="mt-4 -mx-5 overflow-x-auto px-5">
        <img
          src="/images/home/banners.png"
          alt="Tích luỹ linh hoạt và Đầu tư dễ dàng"
          className="h-40 w-auto max-w-none"
        />
      </div>

      <section className="mt-4 rounded-lg border border-[#e7e7e7] p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold leading-7">
              Lịch sử giao dịch
            </h2>
            <p className="mt-1 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Cập nhật gần nhất:{' '}
              <span className="text-[#060607]">16/9/2024 16:13</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Làm mới"
            className="grid size-5 place-items-center"
          >
            <RefreshIcon
              width={17.9167}
              height={17.9167}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {TRANSACTIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#171b6d]">
                  <HomeGlyph
                    icon={Icon}
                    width={item.width}
                    height={item.height}
                    flip={item.flip}
                  />
                </span>
                <div
                  className={`flex min-w-0 flex-1 items-center justify-between pb-4 ${
                    index < TRANSACTIONS.length - 1
                      ? 'border-b border-[#e7e7e7]'
                      : 'pb-0'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold leading-4">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[10px] leading-4">
                      16/09/2024 <span className="text-[#b3b3b3]">|</span> 16:19
                    </p>
                  </div>
                  <p className="text-xs font-semibold leading-4">
                    {item.amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-[#e7e7e7] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold leading-7">Danh mục tích luỹ</h2>
          <HomeGlyph
            icon={ArrowRightIcon}
            width={9.584}
            height={14.5833}
            flip
          />
        </div>
        {GOALS.map((goal, index) => (
          <div
            key={goal.name}
            className={
              index === 0 ? 'mt-4 border-b border-[#e7e7e7] pb-4' : 'mt-4'
            }
          >
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold leading-5">{goal.name}</p>
              <p className="text-xs font-semibold leading-4 text-[#34c759]">
                {goal.value}
              </p>
            </div>
            <div className="relative mt-3 h-8">
              <div className="absolute inset-x-0 top-1.5 h-2 rounded-full bg-[#e7e7e7]" />
              {goal.soft ? (
                <div
                  className={`absolute left-0 top-1.5 h-2 rounded-full bg-[#f6ebff] ${goal.soft}`}
                />
              ) : null}
              <div
                className={`absolute left-0 top-1.5 h-2 rounded-full bg-[#b65ffc] ${goal.fill}`}
              />
              <MarkerIcon
                width={14}
                height={12}
                className={`absolute top-3.5 h-3 w-3.5 ${goal.marker}`}
              />
              {goal.flags.map((flag) => (
                <span
                  key={flag}
                  className={`absolute top-0 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-white shadow-[0_4px_6px_rgba(0,0,0,0.18)] ${flag}`}
                >
                  <FlagIcon
                    width={10}
                    height={11}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </span>
              ))}
            </div>
            <p className="text-[10px] leading-4 text-[rgba(10,10,11,0.55)]">
              Mỗi bước đi đều để lại giá trị khác biệt 🤌
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
