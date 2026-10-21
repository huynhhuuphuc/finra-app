import {
  fetchAssetProducts,
  fetchAssetSummary,
  parseAmount,
  sumProductContracts,
} from '@/api/core/assets';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import { PlusIcon, ReloadIcon, ViewOffIcon } from '@/icons';
import DotIcon from '@/icons/components/DotIcon';
import { useQuery } from '@tanstack/react-query';
import { history } from '@umijs/max';
import { useState } from 'react';
import ProfileStatus from '../Account/components/ProfileStatus';
import AssetAllocation from './components/AssetAllocation';
import AssetTimeline from './components/AssetTimeline';

const COINS = [
  'right-[18px] bottom-2 size-[46px]',
  'right-[52px] bottom-[22px] size-[38px]',
  'right-[78px] bottom-1.5 size-8',
  'right-1 bottom-9 size-7',
  'right-9 bottom-0 size-[22px]',
];

export default function AssetsPage() {
  const [hidden, setHidden] = useState(false);
  const { token, customerCode, hasSession } = useCustomerSession();
  const summaryQuery = useQuery({
    queryKey: ['asset-summary', customerCode, token],
    queryFn: ({ signal }) => fetchAssetSummary(customerCode, signal),
    enabled: hasSession,
    retry: false,
  });
  const productsQuery = useQuery({
    queryKey: ['asset-groups', customerCode, token],
    queryFn: ({ signal }) => fetchAssetProducts(customerCode, signal),
    enabled: hasSession,
    retry: false,
  });
  const summary = summaryQuery.data;
  const products = productsQuery.data || [];
  const money = (value: unknown, unit = true) => {
    if (hidden) return '••••••';
    const amount = parseAmount(value);
    return amount === null
      ? '—'
      : new Intl.NumberFormat('vi-VN').format(Math.trunc(amount)) +
          (unit ? 'đ' : '');
  };
  const totalContracts = productsQuery.isSuccess
    ? sumProductContracts(products)
    : null;
  const cashBalance = parseAmount(summary?.CASH_BALANCE);
  const profit = parseAmount(summary?.SUM_FEE_VALUE);
  // Mobile allocation chart uses principal; the accumulation label also includes profit.
  const accumulation =
    totalContracts !== null && profit !== null ? totalContracts + profit : null;
  const allocation =
    cashBalance !== null &&
    accumulation !== null &&
    cashBalance >= 0 &&
    accumulation >= 0 &&
    cashBalance + accumulation > 0 &&
    !summaryQuery.isError &&
    !productsQuery.isError
      ? {
          cash: cashBalance,
          accumulation,
          total: cashBalance + accumulation,
        }
      : null;

  return (
    <div className="min-h-full bg-white text-[#060607]">
      <PageHeader title="Tài sản" showBack={false} />

      <div className="bg-[#f3eef7] bg-[url('/images/assets/hero-bg.svg')] bg-[length:140%] bg-[center_40%] bg-no-repeat px-5 pb-4 pt-2">
        <ProfileStatus
          loading={hasSession && summaryQuery.isPending}
          error={summaryQuery.error}
          retry={summaryQuery.refetch}
        />
        <section className="relative min-h-[88px] overflow-hidden rounded-xl bg-[linear-gradient(180deg,#9b3fe8_0%,#4b2768_100%)] px-4 pb-4 pt-4 text-white">
          <div className="pointer-events-none absolute bottom-2 right-0 h-[34px] w-[42%]">
            <AssetTimeline value={summary?.SUM_CASH_TIMELINE} />
          </div>
          <div className="relative">
            <p className="m-0 flex items-center gap-2 text-sm font-normal leading-5 text-white/90">
              Tổng tài sản
              <button
                type="button"
                className="grid size-5 cursor-pointer place-items-center border-0 bg-transparent p-0"
                aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
                onClick={() => setHidden((value) => !value)}
              >
                {hidden ? (
                  <ViewOffIcon
                    width={18}
                    height={18}
                    fill0="#ffffff"
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <img
                    src="/images/assets/eye.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                )}
              </button>
            </p>
            <strong className="mt-1 flex items-baseline gap-1 text-xl font-semibold leading-8">
              {!hidden && (
                <span className="text-sm font-normal leading-5">đ</span>
              )}
              {money(summary?.SUM_CASH, false)}
            </strong>
          </div>
        </section>

        <div className="mt-5 flex justify-around">
          <button
            type="button"
            onClick={() => history.push(PAGE_URL.developing)}
            className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-sm font-semibold leading-5 !text-[#060607]"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[rgba(182,95,252,0.12)]">
              <PlusIcon
                width={18}
                height={18}
                fill0="#0A0A0B"
                preserveAspectRatio="xMidYMid meet"
              />
            </span>
            Hợp tác
          </button>
          <button
            type="button"
            onClick={() => history.push(PAGE_URL.accountHistory)}
            className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-sm font-semibold leading-5 !text-[#060607]"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[rgba(182,95,252,0.12)]">
              <ReloadIcon
                width={20}
                height={20}
                fill0="#0A0A0B"
                fill1="#0A0A0B"
                preserveAspectRatio="xMidYMid meet"
              />
            </span>
            Lịch sử giao dịch
          </button>
        </div>
      </div>

      <div className="relative isolate z-0 grid grid-cols-2 gap-4 px-5 pb-2 pt-5">
        <article className="relative h-[176px] overflow-hidden rounded-[10px_10px_10px_48px] border-2 border-[#6ee7b7] bg-[linear-gradient(180deg,#e8faf1_0%,#f3fcf7_100%)] p-4 shadow-[0_6px_18px_rgba(52,199,89,0.18)]">
          <p className="m-0 text-sm font-normal leading-5 text-[rgba(10,10,11,0.78)]">
            Lợi nhuận trước thuế
          </p>
          <strong className="my-2 block text-xl font-semibold leading-8 text-[#060607]">
            {money(summary?.SUM_FEE_VALUE)}
          </strong>
          <div
            className="absolute -bottom-[18px] -right-1.5 h-[78px] w-[150px]"
            aria-hidden
          >
            {COINS.map((coin) => (
              <i
                key={coin}
                className={`absolute rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffe27a_0%,#f5b400_42%,#c48412_78%)] shadow-[inset_-3px_-3px_0_rgba(120,70,0,0.18),0_2px_0_rgba(255,255,255,0.35)] ${coin}`}
              />
            ))}
          </div>
        </article>

        <div className="relative">
          <div className="absolute -right-2 top-4 z-0 h-[150px] w-[72%] rounded-[10px_44px_10px_10px] bg-[#8f7de6]" />
          <article className="relative z-[1] flex h-[176px] flex-col justify-center gap-5 rounded-[10px_48px_10px_10px] border-2 border-[#5b4fd8] bg-[linear-gradient(160deg,#a58de0_0%,#b39ee6_50%,#8d6fe2_100%)] p-4 text-white">
            <div className="relative pl-3">
              <DotIcon
                className="absolute left-0 top-1.5"
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/85">
                Tổng số tiền đầu tư
              </p>
              <strong className="mt-0.5 block text-base font-semibold leading-6 text-white">
                {money(summary?.SUM_CONTRACT)}
              </strong>
            </div>
            <div className="relative pl-3">
              <DotIcon
                className="absolute left-0 top-1.5"
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/85">
                Số dư khả dụng
              </p>
              <strong className="mt-0.5 block text-base font-semibold leading-6 text-white">
                {money(summary?.CASH_BALANCE)}
              </strong>
            </div>
          </article>
        </div>
      </div>

      <section className="px-5 pb-4 pt-2">
        <h2 className="!mb-3 !mt-2 flex items-center gap-3 text-base !font-normal leading-6 text-[#060607]">
          <img src="/images/assets/money.svg" alt="" width={20} height={20} />
          {productsQuery.isSuccess
            ? `Bạn đang đầu tư ${products.length} sản phẩm`
            : 'Sản phẩm đang đầu tư'}
        </h2>
        <ProfileStatus
          loading={hasSession && productsQuery.isPending}
          error={productsQuery.error}
          retry={productsQuery.refetch}
        />
        {productsQuery.isSuccess && products.length === 0 && (
          <p className="text-sm text-gray-500">
            Bạn chưa có sản phẩm đang đầu tư.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {products.map((item, index) => (
            <button
              type="button"
              key={`${item.WEB_PRODUCT_TYPE}-${index}`}
              className="relative min-h-[88px] w-full cursor-pointer overflow-hidden rounded-xl border border-[#e7e7e7] bg-white p-0 text-left"
              onClick={() =>
                history.push(
                  `${PAGE_URL.assetProduct}?type=${encodeURIComponent(
                    item.WEB_PRODUCT_TYPE,
                  )}&name=${encodeURIComponent(
                    item.PRODUCT_NAME || '',
                  )}&productType=${encodeURIComponent(
                    item.PRODUCT_TYPE || '',
                  )}`,
                )
              }
            >
              <div className="flex h-11 items-center justify-between bg-[#f7f7f7] px-4">
                <p className="m-0 text-sm font-semibold leading-5 text-[#060607]">
                  {item.PRODUCT_NAME || '—'}
                </p>
                <img
                  src="/images/assets/arrow-up-right.svg"
                  alt=""
                  width={15}
                  height={15}
                />
              </div>
              <div className="flex items-center justify-between px-4 pt-3">
                <span className="text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng lợi nhuận
                </span>
                <strong className="text-lg font-semibold leading-7 text-[#34c759]">
                  {money(item.FEE_VALUE, false)}
                  <small className="ml-0.5 text-xs font-semibold">đ</small>
                </strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pb-4 pt-2">
        <h2 className="mb-3 mt-2 text-lg font-semibold leading-7 text-[#060607]">
          Phân bổ tài sản
        </h2>
        {allocation ? (
          <AssetAllocation
            total={allocation.total}
            format={(value) => money(value)}
            slices={[
              {
                label: 'Số dư khả dụng',
                value: allocation.cash,
                color: '#b65ffc',
              },
              {
                label: 'Tích luỹ Finra',
                value: allocation.accumulation,
                color: '#1cffc7',
              },
            ]}
          />
        ) : (
          <p className="text-xs text-gray-500">Chưa có dữ liệu phân bổ</p>
        )}
      </section>
    </div>
  );
}
