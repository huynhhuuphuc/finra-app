import {
  fetchAssetProducts,
  fetchAssetSummary,
  parseAmount,
  sumProductContracts,
} from '@/api/core/assets';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import DotIcon from '@/icons/components/DotIcon';
import { useQuery } from '@tanstack/react-query';
import { history } from '@umijs/max';
import { useState } from 'react';
import ProfileStatus from '../Account/components/ProfileStatus';
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
  const [expanded, setExpanded] = useState(true);
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
  const allocationBase =
    totalContracts !== null && cashBalance !== null
      ? totalContracts + cashBalance
      : null;
  const cashPercent =
    allocationBase !== null &&
    allocationBase > 0 &&
    cashBalance! >= 0 &&
    totalContracts! >= 0
      ? (cashBalance! / allocationBase) * 100
      : null;

  return (
    <div className="min-h-full bg-white text-[#060607]">
      <header className="grid h-[60px] grid-cols-[40px_1fr_40px] items-center bg-white px-4">
        <button
          type="button"
          className="grid size-6 cursor-pointer place-items-center border-0 bg-transparent p-0"
          aria-label="Quay lại"
          onClick={() => history.back()}
        >
          <img src="/images/assets/back.svg" alt="" width={24} height={24} />
        </button>
        <h1 className="m-0 text-center text-lg font-semibold leading-7 text-[#060607]">
          Tài sản
        </h1>
        <button
          type="button"
          aria-label="Làm mới tài sản"
          onClick={() => {
            void summaryQuery.refetch();
            void productsQuery.refetch();
          }}
          disabled={summaryQuery.isFetching || productsQuery.isFetching}
          className="text-xl disabled:opacity-40"
        >
          ↻
        </button>
      </header>

      <div className="bg-[#f3eef7] bg-[url('/images/assets/hero-bg.svg')] bg-[length:140%] bg-[center_40%] bg-no-repeat px-5 pb-4 pt-2">
        <ProfileStatus
          loading={hasSession && summaryQuery.isPending}
          error={summaryQuery.error}
          retry={summaryQuery.refetch}
        />
        <section className="relative min-h-[112px] overflow-hidden rounded-xl bg-[linear-gradient(112deg,#963ce7_8%,#4b2768_92%)] px-4 pb-12 pt-4 text-white">
          <div>
            <p className="m-0 flex items-center gap-1.5 text-xs font-normal leading-4 text-white">
              Tổng tài sản
              <button
                type="button"
                className="grid size-4 cursor-pointer place-items-center border-0 bg-transparent p-0"
                aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
                onClick={() => setHidden((value) => !value)}
              >
                <img
                  src="/images/assets/eye.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </button>
            </p>
            <strong className="mt-1 flex items-baseline gap-1 text-xl font-semibold leading-8">
              <span className="text-sm font-normal leading-5">đ</span>
              {money(summary?.SUM_CASH, false)}
            </strong>
          </div>
          <div className="absolute bottom-1 right-2 h-[36px] w-[125px]">
            <AssetTimeline value={summary?.SUM_CASH_TIMELINE} hidden={hidden} />
          </div>
        </section>

        <div className="mt-4 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => history.push('/products')}
            className="flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-xs font-semibold leading-4 text-[#060607]"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
              <img
                src="/images/assets/plus.svg"
                alt=""
                width={20}
                height={20}
              />
            </span>
            Đầu tư
          </button>
          <button
            type="button"
            onClick={() => history.push(PAGE_URL.accountHistory)}
            className="flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-0 text-xs font-semibold leading-4 text-[#060607]"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
              <img
                src="/images/assets/clock.svg"
                alt=""
                width={20}
                height={20}
              />
            </span>
            Lịch sử giao dịch
          </button>
        </div>
      </div>

      <div className="relative isolate z-0 -mt-2 grid grid-cols-2 gap-2 px-5 pb-2 pt-4">
        <article className="relative h-[172px] overflow-hidden rounded-[8px_8px_40px_8px] border border-[#34c759] bg-[rgba(52,199,89,0.09)] p-4 shadow-[0_0_17px_rgba(52,199,89,0.24)]">
          <p className="m-0 text-sm font-normal leading-5 text-[rgba(10,10,11,0.55)]">
            Lợi nhuận
          </p>
          <strong className="my-2 block text-lg font-semibold leading-7 text-[#060607]">
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
          <div className="absolute -right-2.5 top-3 z-0 h-[140px] w-[72%] rounded-[8px_36px_8px_8px] border border-[#6d6bd8] bg-[#6d6bd8]" />
          <article className="relative z-[1] flex h-[172px] flex-col justify-center gap-4 rounded-[8px_40px_8px_8px] border border-[#5856d6] bg-[#5856d6] p-4 text-white">
            <div className="relative pl-3">
              {/* <img
                className="absolute left-0 top-1.5"
                src="/images/assets/dot.svg"
                alt=""
                width={4}
                height={4}
              /> */}
              <DotIcon
                className="absolute left-0 top-1.5"
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/75">
                Tổng số tiền đầu tư
              </p>
              <strong className="mt-0.5 block text-sm font-semibold leading-5 text-white">
                {money(summary?.SUM_CONTRACT)}
              </strong>
            </div>
            <div className="relative pl-3">
              <DotIcon
                className="absolute left-0 top-1.5"
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/75">
                Số dư khả dụng
              </p>
              <strong className="mt-0.5 block text-sm font-semibold leading-5 text-white">
                {money(summary?.CASH_BALANCE)}
              </strong>
            </div>
          </article>
        </div>
      </div>

      <section className="px-5 pb-4 pt-2">
        <h2 className="mb-3 mt-2 flex items-center gap-2 text-base font-semibold leading-6 text-[#060607]">
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
            <article
              key={`${item.WEB_PRODUCT_TYPE}-${index}`}
              className={`relative overflow-hidden rounded-xl border border-[#e7e7e7] bg-white min-h-[88px]`}
            >
              <div className="flex h-11 items-center justify-between bg-[#f7f7f7] px-4">
                <p className="m-0 text-sm font-semibold leading-5 text-[#060607]">
                  {item.PRODUCT_NAME || '—'}
                </p>
              </div>
              <div className="flex items-center justify-between px-4 pt-3">
                <span className="font-['Hanken_Grotesque',sans-serif] text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng lợi nhuận
                </span>
                <strong className="text-lg font-semibold leading-7 text-[#34c759]">
                  {money(item.FEE_VALUE, false)}
                  <small className="ml-0.5 text-xs font-semibold">đ</small>
                </strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-4 pt-2">
        <h2 className="mb-3 mt-2 text-lg font-semibold leading-7 text-[#060607]">
          Phân bổ tài sản
        </h2>
        {cashPercent !== null &&
        !hidden &&
        !summaryQuery.isError &&
        !productsQuery.isError ? (
          <div
            role="img"
            aria-label={`Phân bổ: số dư khả dụng ${cashPercent.toFixed(
              1,
            )}%, vốn tích lũy ${(100 - cashPercent).toFixed(1)}%`}
            className="mb-3 flex h-7 items-center overflow-hidden rounded-lg bg-[#b65ffc] text-xs font-semibold leading-4 text-white"
          >
            <span className="min-w-0 flex-1 overflow-hidden pl-2.5">
              {cashPercent >= 12 ? `${cashPercent.toFixed(1)}%` : ''}
            </span>
            <b
              style={{ width: `${100 - cashPercent}%` }}
              className="flex h-full shrink-0 items-center justify-end overflow-hidden rounded-lg border border-white bg-[#171b6d] pr-2.5"
            >
              {100 - cashPercent >= 12
                ? `${(100 - cashPercent).toFixed(1)}%`
                : ''}
            </b>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            {hidden ? 'Đã ẩn phân bổ tài sản' : 'Chưa có dữ liệu phân bổ'}
          </p>
        )}
        <div className="rounded-lg border border-[#e7e7e7] px-4 py-2">
          <div className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 text-sm leading-5">
            <i className="h-6 w-1.5 rounded bg-[#b65ffc]" />
            <span className="text-[#060607]">Số dư khả dụng</span>
            <b className="font-semibold text-[#060607]">
              {money(summary?.CASH_BALANCE)}
            </b>
          </div>
          <div className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 text-sm leading-5">
            <i className="h-6 w-1.5 rounded bg-[#171b6d]" />
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="inline-flex items-center gap-1 text-left text-[#060607]"
            >
              Tích luỹ
              <img
                className={expanded ? '' : '-rotate-90'}
                src="/images/assets/arrow-down.svg"
                alt=""
                width={12}
                height={12}
              />
            </button>
            <b className="font-semibold text-[#060607]">
              {money(accumulation)}
            </b>
          </div>
          {expanded &&
            products.map((item, index) => (
              <div
                key={`${item.WEB_PRODUCT_TYPE}-${index}`}
                className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 pl-4 text-xs font-normal leading-5 text-[rgba(10,10,11,0.55)]"
              >
                <i className="h-6 w-1.5" />
                <span>{item.PRODUCT_NAME || '—'}</span>
                <b className="font-normal">{money(item.SUM_CONTRACT)}</b>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
