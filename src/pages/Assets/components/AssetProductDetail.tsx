import {
  fetchAssetProducts,
  parseAmount,
  type AssetProduct,
} from '@/api/core/assets';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import { BackIcon, EyeIcon, FlagIcon, PlusSignIcon } from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { useQuery } from '@tanstack/react-query';
import { history, useSearchParams } from '@umijs/max';
import { useState } from 'react';

const formatMoney = (value: unknown, hidden: boolean) => {
  if (hidden) return '••••••';
  const amount = parseAmount(value);
  if (amount === null) return '—';
  return new Intl.NumberFormat('vi-VN').format(Math.trunc(amount));
};

function GoalRow({
  name,
  profit,
  hidden,
  pin,
  light,
}: {
  name: string;
  profit: unknown;
  hidden: boolean;
  pin: number;
  light: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="!mb-0 text-sm font-semibold leading-5 text-[#060607]">
          {name}
        </p>
        <p className="!mb-0 text-xs font-semibold leading-4 text-[#34c759]">
          +{formatMoney(profit, hidden)}đ
        </p>
      </div>
      <div className="relative mt-2 h-11">
        <div
          className="absolute inset-x-0 top-3 h-2 overflow-hidden rounded-full"
          style={{
            background:
              'repeating-linear-gradient(-45deg, #d9d9d9 0 1.5px, transparent 1.5px 5px)',
          }}
        >
          <div
            className="h-full rounded-full bg-[#f6ebff]"
            style={{ width: `${light}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full rounded-full border border-black/20 bg-[#b65ffc]"
            style={{ width: `${pin}%` }}
          />
        </div>
        {[34, 65].map((flag) => (
          <span
            key={flag}
            className="absolute top-1.5 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-white shadow-[0_4px_6px_rgba(0,0,0,0.18)]"
            style={{ left: `${flag}%` }}
          >
            <FlagIcon
              width={10}
              height={11}
              preserveAspectRatio="xMidYMid meet"
            />
          </span>
        ))}
        <img
          src="/images/assets/progress-pin.svg"
          alt=""
          width={34}
          height={32}
          className="pointer-events-none absolute top-4 -translate-x-1/2"
          style={{ left: `${pin}%` }}
        />
      </div>
      <p className="!mb-0 text-[10px] leading-4 text-[rgba(10,10,11,0.55)]">
        Mỗi bước đi đều để lại giá trị khác biệt 🤌
      </p>
    </div>
  );
}

export default function AssetProductDetail() {
  const [params] = useSearchParams();
  const type = params.get('type') ?? '';
  const [hidden, setHidden] = useState(false);
  const { token, customerCode, hasSession } = useCustomerSession();
  const productsQuery = useQuery({
    queryKey: ['asset-groups', customerCode, token],
    queryFn: ({ signal }) => fetchAssetProducts(customerCode, signal),
    enabled: hasSession,
    retry: false,
  });
  const product: AssetProduct | undefined = productsQuery.data?.find(
    (item) => item.WEB_PRODUCT_TYPE === type,
  );
  const title = product?.PRODUCT_NAME || 'Sản phẩm';

  return (
    <div className="min-h-full bg-white px-5 pb-8 text-[#060607]">
      <header className="flex h-[60px] items-center">
        <button
          type="button"
          aria-label="Quay lại"
          className="flex size-6 items-center justify-center"
          onClick={() => history.push(PAGE_URL.assets)}
        >
          <BackIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
        <h1 className="!mb-0 ml-4 text-lg font-semibold leading-7">{title}</h1>
      </header>

      <ProfileStatus
        loading={hasSession && productsQuery.isPending}
        error={productsQuery.error}
        retry={productsQuery.refetch}
      />

      <section className="rounded-xl bg-[#f7f7f7] p-3 shadow-[2px_2px_16px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="!mb-0 flex items-center gap-1 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Tổng tiền gửi tích luỹ
              <button
                type="button"
                aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
                className="grid size-4 place-items-center border-0 bg-transparent p-0"
                onClick={() => setHidden((value) => !value)}
              >
                <EyeIcon
                  width={14.33}
                  height={10.33}
                  preserveAspectRatio="xMidYMid meet"
                />
              </button>
            </p>
            <p className="!mb-0 mt-1 flex items-baseline gap-1 font-semibold">
              <span className="text-xl font-normal leading-8">đ</span>
              <span className="text-[32px] leading-[52px]">
                {formatMoney(product?.SUM_CONTRACT, hidden)}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="flex h-[31px] items-center gap-2 rounded-[10px] bg-[#b65ffc] px-3 text-xs !text-white"
            onClick={() => history.push(PAGE_URL.products)}
          >
            <PlusSignIcon
              width={12}
              height={12}
              fill0="#ffffff"
              preserveAspectRatio="xMidYMid meet"
            />
            Mở thêm
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between">
          <div>
            <p className="!mb-0 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Tổng lợi nhuận dự kiến
            </p>
            <p className="!mb-0 text-base font-semibold leading-6 text-[#34c759]">
              {formatMoney(product?.FEE_VALUE, hidden)}đ
            </p>
          </div>
          <div className="text-right">
            <p className="!mb-0 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Lợi nhuận hôm nay
            </p>
            <p className="!mb-0 text-base font-semibold leading-6 text-[#34c759]">
              {hidden ? '••••••' : '—'}
            </p>
          </div>
        </div>
      </section>

      {product ? (
        <section className="mt-5 rounded-lg border border-[#e7e7e7] p-4">
          <GoalRow
            name={product.PRODUCT_NAME || 'Khoản tích luỹ'}
            profit={product.FEE_VALUE}
            hidden={hidden}
            pin={17}
            light={35}
          />
        </section>
      ) : null}
    </div>
  );
}
