import { getCustomerName } from '@/api/core/customer';
import { formatHomeMoney, getHomeCustomerStatus } from '@/api/core/home';
import useHomeData from '@/hooks/useHomeData';
import {
  ArrowRightIcon,
  ArrowUpIcon,
  BellIcon,
  CardGlowIcon,
  EyeIcon,
  PlusIcon,
  QrIcon,
  RefreshIcon,
  ReloadIcon,
  ViewOffIcon,
  WaveBottom2Icon,
  WaveBottomIcon,
  WaveTop2Icon,
  WaveTopIcon,
} from '@/icons';
import type { SVGProps } from 'react';
import { useState } from 'react';
import CustomerAvatar from '../Account/components/CustomerAvatar';
import ProfileStatus from '../Account/components/ProfileStatus';
import HomeCategories from './components/HomeCategories';
import NewbieQuestProgress from './components/NewbieQuestProgress';
import RecentTransactions from './components/RecentTransactions';
import { openAccumulationDetail } from '../Assets/components/AccumulationDetail';
import UpcomingInterest from './components/UpcomingInterest';

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
  // { label: 'Ứng trước', icon: AdvanceIcon, width: 17.9167, height: 17.9167 },
];

export default function HomePage() {
  const [hidden, setHidden] = useState(false);

  const home = useHomeData();
  const profile = home.profile.profile;
  const customerStatus = getHomeCustomerStatus(profile);
  const summary = home.summary.data;
  const money = (value: unknown, unit = true, signed = false) =>
    formatHomeMoney(value, hidden, unit, signed);

  return (
    <div className="bg-white px-5 pb-6 pt-4 text-[#060607]">
      <header className="flex h-14 items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar profile={profile} size={44} />
          <div className="min-w-0">
            <p className="text-sm font-light leading-5 text-[rgba(10,10,11,0.78)] !mb-0">
              Xin chào ✋
            </p>
            <p className="text-sm font-semibold leading-5 !mb-0">
              {getCustomerName(profile)}
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

      <ProfileStatus
        loading={home.hasSession && home.profile.isPending}
        error={home.profile.error}
        retry={home.profile.refetch}
      />
      <ProfileStatus
        loading={home.hasSession && home.summary.isPending}
        error={home.summary.error}
        retry={home.summary.refetch}
      />
      <section
        className={`relative mt-5 overflow-hidden rounded-2xl bg-[#0a0a0b] text-white transition-[height] duration-300 ${
          customerStatus?.showBalanceDetails ? 'h-[188px]' : 'h-[128px]'
        }`}
      >
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
              {money(summary?.SUM_CASH, false)}
            </span>
          </p>
        </div>
        {customerStatus?.showBalanceDetails && (
          <div className="absolute inset-x-0 bottom-0 flex h-[60px] bg-[#1cffc7] px-4 pt-3 text-[#060607]">
            <div className="flex-1">
              <p className="text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-1">
                Tiền mặt khả dụng
              </p>
              <p className="text-xs font-semibold leading-4">
                {money(summary?.CASH_BALANCE)}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-1">
                Lợi nhuận hiện tại
              </p>
              <p className="text-xs font-semibold leading-4">
                {money(summary?.SUM_FEE_VALUE, true, true)}
              </p>
            </div>
          </div>
        )}
      </section>
      {customerStatus?.showQuestProgress && (
        <NewbieQuestProgress completedSteps={customerStatus.completedSteps} />
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
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
          <h2 className="text-lg font-semibold leading-7 !mb-0">
            Hợp tác cùng FINRA
          </h2>
          <HomeGlyph
            icon={ArrowRightIcon}
            width={9.584}
            height={14.5833}
            flip
          />
        </div>
        <ProfileStatus
          loading={home.hasSession && home.categories.isPending}
          error={home.categories.error}
          retry={home.categories.refetch}
        />
        {home.categories.isSuccess && (
          <HomeCategories items={home.categories.data} />
        )}
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
              <span className="text-[#060607]">
                {home.transactions.dataUpdatedAt
                  ? new Intl.DateTimeFormat('vi-VN', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(home.transactions.dataUpdatedAt)
                  : '—'}
              </span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Làm mới"
            onClick={() => {
              void home.transactions.refetch();
            }}
            disabled={!home.hasSession || home.transactions.isFetching}
            className="grid size-5 place-items-center"
          >
            <RefreshIcon
              width={17.9167}
              height={17.9167}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </div>
        <ProfileStatus
          loading={home.transactions.isFetching}
          error={home.transactions.error}
          retry={home.transactions.refetch}
        />
        {home.transactions.isSuccess && (
          <RecentTransactions items={home.transactions.data} hidden={hidden} />
        )}
      </section>

      {(home.nearInterest.isPending ||
        home.nearInterest.isError ||
        Boolean(home.nearInterest.data?.length)) && (
        <section className="mt-4 rounded-lg border border-[#e7e7e7] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-7">
              Khoản gần kỳ nhận lợi ích
            </h2>
            <button
              type="button"
              aria-label="Làm mới khoản gần kỳ nhận lợi ích"
              onClick={() => {
                void home.nearInterest.refetch();
              }}
              disabled={home.nearInterest.isFetching}
            >
              <RefreshIcon width={18} height={18} />
            </button>
          </div>
          <ProfileStatus
            loading={home.hasSession && home.nearInterest.isPending}
            error={home.nearInterest.error}
            retry={home.nearInterest.refetch}
          />
          {home.nearInterest.isSuccess && (
            <UpcomingInterest
              items={home.nearInterest.data}
              hidden={hidden}
              onSelect={openAccumulationDetail}
            />
          )}
        </section>
      )}
    </div>
  );
}
