import { getCustomerName } from '@/api/core/customer';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerProfile from '@/hooks/useCustomerProfile';
import {
  ArrowRight01Icon,
  ArrowRightIcon,
  ArrowUpIcon,
  BellIcon,
  ClockIcon,
  FinraMarkIcon,
  InfoIcon,
  LockPasswordIcon,
  LogoutIcon,
  NoteDoneIcon,
  PlusLightIcon,
  ProfileIcon,
  SettingsIcon,
  UserSharingIcon,
} from '@/icons';
import { removeCookieAll } from '@/utils/cookie';
import { clearGaUserId } from '@/utils/ga4';
import { useQueryClient } from '@tanstack/react-query';
import { history, useModel } from '@umijs/max';
import type { SVGProps } from 'react';
import { useState } from 'react';
import CustomerAvatar from './components/CustomerAvatar';
import ProfileStatus from './components/ProfileStatus';

type AccountIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function Arrow({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const scale = size / 20;
  return (
    <ArrowRightIcon
      width={9.584 * scale}
      height={14.5833 * scale}
      preserveAspectRatio="xMidYMid meet"
      className={`-rotate-90 -scale-x-100 ${className}`}
    />
  );
}

function MenuIcon({
  icon: Icon,
  width,
  height,
  plain,
}: {
  icon: AccountIcon;
  width: number;
  height: number;
  plain?: boolean;
}) {
  return (
    <span
      className={`grid size-7 shrink-0 place-items-center rounded-md ${
        plain ? '' : 'bg-[rgba(182,95,252,0.12)]'
      }`}
    >
      <Icon width={width} height={height} preserveAspectRatio="xMidYMid meet" />
    </span>
  );
}

const SECURITY: {
  label: string;
  icon: AccountIcon;
  width: number;
  height: number;
  trailing?: 'switch';
  to?: string;
}[] = [
  {
    label: 'Đổi mật khẩu đăng nhập',
    icon: LockPasswordIcon,
    width: 14.5835,
    height: 17.9167,
    to: PAGE_URL.accountPassword,
  },
  // {
  //   label: 'Đăng nhập sinh trắc học',
  //   icon: IdentificationIcon,
  //   width: 17.0835,
  //   height: 17.0834,
  //   trailing: 'switch',
  // },
  // {
  //   label: 'Đăng ký Smart OTP',
  //   icon: LockedIcon,
  //   width: 17.5,
  //   height: 17.5001,
  // },
  // {
  //   label: 'Quản lý thiết bị đăng nhập',
  //   icon: DevicesIcon,
  //   width: 16.2497,
  //   height: 17.9167,
  // },
];

const GENERAL: {
  label: string;
  icon: AccountIcon;
  width: number;
  height: number;
  plain?: boolean;
  to?: string;
  href?: string;
}[] = [
  {
    label: 'Hợp đồng của tôi',
    icon: ProfileIcon,
    width: 17.0835,
    height: 17.0834,
  },
  {
    label: 'Lịch sử giao dịch',
    icon: ClockIcon,
    width: 17.917,
    height: 17.9167,
    to: PAGE_URL.accountHistory,
  },
  {
    label: 'Chính sách và Điều khoản',
    icon: NoteDoneIcon,
    width: 17.2921,
    height: 18.3336,
    href: 'https://finra.com.vn/guide',
  },
  // {
  //   label: 'Cài đặt & Bảo mật',
  //   icon: Settings02Icon,
  //   width: 17.9168,
  //   height: 16.6667,
  // },
  {
    label: 'Thông tin hỗ trợ',
    icon: InfoIcon,
    width: 17.9168,
    height: 17.9167,
  },
  {
    label: 'Về FINRA',
    icon: FinraMarkIcon,
    width: 13.2231,
    height: 20,
    plain: true,
  },
];

export default function AccountPage() {
  const { profile, isPending, error, refetch, hasSession } =
    useCustomerProfile();
  const queryClient = useQueryClient();
  const { setInitialState } = useModel('@@initialState');
  const [biometric, setBiometric] = useState(false);
  const [rating, setRating] = useState(0);
  const toDeveloping = () => history.push(PAGE_URL.developing);

  const logout = () => {
    clearGaUserId();
    removeCookieAll();
    queryClient.clear();
    setInitialState((state) => ({ ...state, currentUser: undefined }));
    history.replace(PAGE_URL.login);
  };

  return (
    <div className="bg-white pb-6 text-[#060607]">
      <div className="relative">
        <div className="h-[86px] rounded-b-xl bg-[#1a1a1a]" />
        <button
          type="button"
          aria-label="Cài đặt"
          onClick={toDeveloping}
          className="absolute right-5 top-3.5 grid size-8 place-items-center rounded border border-[#8e8e8f]"
        >
          <SettingsIcon
            width={17.5}
            height={17.9167}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
        <div className="absolute left-5 top-[60px] grid size-20 place-items-center rounded-full border-4 border-white bg-[#b65ffc] text-[37px] font-semibold leading-none text-white">
          <CustomerAvatar profile={profile} size={72} />
        </div>
        <button
          type="button"
          aria-label="Thông báo"
          onClick={toDeveloping}
          className="absolute right-5 top-[104px] grid size-8 place-items-center rounded-md bg-[#f2f2f2]"
        >
          <BellIcon
            width={13}
            height={14.67}
            preserveAspectRatio="xMidYMid meet"
          />
          <span className="absolute -left-2 -top-2 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-[#ff3b30] px-0.5 text-[10px] font-semibold leading-4 text-white">
            75
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-[66px]">
        <ProfileStatus
          loading={hasSession && isPending}
          error={error}
          retry={refetch}
        />
        <section className="rounded-[10px] border border-[#e7e7e7] p-4">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-base font-semibold leading-6 !mb-0">
                {getCustomerName(profile)}
              </h1>
              <button
                type="button"
                onClick={() => history.push(PAGE_URL.accountInfo)}
                className="mt-1 flex items-center gap-2 text-xs leading-4 !text-[rgba(10,10,11,0.55)]"
              >
                Xem thông tin tài khoản
                <ArrowRight01Icon
                  width={16}
                  height={16}
                  preserveAspectRatio="xMidYMid meet"
                  className="mt-0.5"
                />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex h-20 gap-2">
                <button
                  type="button"
                  onClick={toDeveloping}
                  className="flex h-full flex-1 flex-col justify-between rounded-lg bg-[#f7f7f7] p-3 text-left"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-[#0a0a0b]">
                    <PlusLightIcon
                      width={14.5833}
                      height={14.5833}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </span>
                  <span className="text-sm font-semibold leading-5">
                    Nộp tiền
                  </span>
                </button>
                <button
                  type="button"
                  onClick={toDeveloping}
                  className="flex h-full flex-1 flex-col justify-between rounded-lg bg-[#f7f7f7] p-3 text-left"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
                    <ArrowUpIcon
                      width={14.5833}
                      height={9.58412}
                      preserveAspectRatio="xMidYMid meet"
                      className="-rotate-90 -scale-x-100"
                    />
                  </span>
                  <span className="text-sm font-semibold leading-5">
                    Rút tiền
                  </span>
                </button>
              </div>
              <button
                type="button"
                onClick={toDeveloping}
                className="flex w-full items-center gap-3 rounded-xl border border-[#e7e7e7] py-3 pl-4 pr-2"
              >
                <MenuIcon
                  icon={UserSharingIcon}
                  width={17.9168}
                  height={17.9167}
                />
                <span className="flex flex-1 items-center gap-1 text-left">
                  <span className="text-sm leading-5">Xem thông tin</span>
                  <span className="text-base font-semibold leading-6 text-[#b65ffc] [text-shadow:1px_1px_0_rgba(112,3,199,0.24)]">
                    Fpartner
                  </span>
                </span>
                <ArrowRight01Icon
                  width={20}
                  height={20}
                  preserveAspectRatio="xMidYMid meet"
                  fill0="#0A0A0B"
                />
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold leading-6">Bảo mật</h2>
          <div className="rounded-xl border border-[#e7e7e7] p-4">
            {SECURITY.map((item, index) => (
              <div
                key={item.label}
                className={
                  index > 0 ? 'mt-4 border-t border-[#e7e7e7] pt-4' : ''
                }
              >
                {item.trailing === 'switch' ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <MenuIcon
                        icon={item.icon}
                        width={item.width}
                        height={item.height}
                      />
                      <span className="text-sm leading-5">{item.label}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={biometric}
                      aria-label={item.label}
                      onClick={() => setBiometric((value) => !value)}
                      className={`relative h-[22px] w-10 shrink-0 rounded-md ${
                        biometric ? 'bg-[#b65ffc]' : 'bg-[#d2d5da]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 size-[18px] rounded bg-white shadow-[0_2px_4px_rgba(39,39,39,0.1)] ${
                          biometric ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => history.push(item.to ?? PAGE_URL.developing)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <MenuIcon
                      icon={item.icon}
                      width={item.width}
                      height={item.height}
                    />
                    <span className="min-w-0 flex-1 text-sm leading-5">
                      {item.label}
                    </span>
                    <ArrowRight01Icon
                      width={20}
                      height={20}
                      preserveAspectRatio="xMidYMid meet"
                      fill0="#0A0A0B"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold leading-6">Cài đặt chung</h2>
          <div className="rounded-xl border border-[#e7e7e7] p-4">
            {GENERAL.map((item, index) => (
              <div
                key={item.label}
                className={
                  index > 0 ? 'mt-4 border-t border-[#e7e7e7] pt-4' : ''
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    if (item.href) {
                      window.open(item.href, '_blank', 'noopener,noreferrer');
                      return;
                    }
                    history.push(item.to ?? PAGE_URL.developing);
                  }}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <MenuIcon
                    icon={item.icon}
                    width={item.width}
                    height={item.height}
                    plain={item.plain}
                  />
                  <span className="min-w-0 flex-1 text-sm leading-5">
                    {item.label}
                  </span>
                  <ArrowRight01Icon
                    width={20}
                    height={20}
                    preserveAspectRatio="xMidYMid meet"
                    className="[&_path]:fill-[#0A0A0B] [&_path]:fill-opacity-[1]"
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="relative flex items-start justify-between rounded-xl border border-[#e7e7e7] p-4">
          <div className="w-[222px]">
            <p className="text-sm font-semibold leading-5 !mb-0">
              Bạn cảm thấy FINRA thế nào?
            </p>
            <p className="mt-1 text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-0">
              Sẽ thật tuyệt vời nếu FINRA nhận được góp ý để cải thiện dịch vụ
            </p>
            <div className="mt-6 flex gap-4">
              {Array.from({ length: 5 }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`${index + 1} sao`}
                  onClick={() => setRating(index + 1)}
                >
                  <StarIcon
                    width={17.9191}
                    height={17.9178}
                    fill0={index < rating ? '#B65FFC' : '#B3B3B3'}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </button>
              ))}
            </div>
          </div>
          <img
            src="/images/account/emoji.png"
            alt=""
            width={74}
            height={74}
            className="size-[74px] shrink-0"
          />
        </section>

        <p className="text-center text-xs leading-4 text-[rgba(10,10,11,0.55)] !mb-0">
          Phiên bản 1.0.0
        </p> */}

        <button
          type="button"
          onClick={logout}
          className="flex h-12 w-full items-center justify-center gap-4 rounded-lg bg-[#f7f7f7] text-sm font-semibold leading-5 text-[rgba(10,10,11,0.78)]"
        >
          <LogoutIcon
            width={19.5}
            height={19.5}
            preserveAspectRatio="xMidYMid meet"
          />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
