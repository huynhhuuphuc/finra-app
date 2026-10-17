import { PAGE_URL } from '@/constants/pathUrl';
import useHomeData from '@/hooks/useHomeData';
import {
  BackIcon,
  CheckCircleIcon,
  HelpCircleIcon,
  PlusSignIcon,
  QrCodeIcon,
} from '@/icons';
import { history, useSearchParams } from '@umijs/max';
import { Button, Input } from 'antd';
import { useMemo, useState } from 'react';

const PAYOUTS = ['Hàng tháng', '6 tháng/lần', 'Đầu kỳ', 'Hàng quý'];

const TERMS = [
  { id: '1', label: '1 tháng', months: 1, rate: 8.57 },
  { id: '2', label: '2 tháng', months: 2, rate: 8.57 },
  { id: '3', label: '3 tháng', months: 3, rate: 8.57 },
  { id: '5', label: '5M', months: 5, rate: 8.57, compact: true },
  { id: '6', label: '6M', months: 6, rate: 8.57, compact: true },
  { id: '9', label: '9M', months: 9, rate: 8.57, compact: true },
  { id: '12', label: '12M', months: 12, rate: 12.57, compact: true },
];

const formatRate = (rate: number) =>
  rate.toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatMoney = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)} ₫`;

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export default function ProductDetail() {
  const [params] = useSearchParams();
  const code = params.get('code') ?? '';
  const home = useHomeData();
  const product = home.categories.data?.find((item) => item.CODE === code);
  const title = product?.NAME || code || 'Hợp tác';

  const [amount, setAmount] = useState('');
  const [payout, setPayout] = useState(PAYOUTS[0]);
  const [termId, setTermId] = useState(TERMS[0].id);
  const [salePhone, setSalePhone] = useState('');
  const term = TERMS.find((item) => item.id === termId) ?? TERMS[0];

  const estimate = useMemo(() => {
    const value = Number(amount);
    if (!value) return null;
    const beforeTax = Math.round(value * (term.rate / 100) * (term.months / 12));
    return { beforeTax, afterTax: Math.round(beforeTax * 0.95) };
  }, [amount, term]);

  const endDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + term.months);
    return formatDate(date);
  }, [term]);

  return (
    <div className="min-h-full bg-white pb-24 text-[#060607]">
      <header
        className="px-5 pb-8"
        style={{
          background: 'linear-gradient(241deg, #c06ae4 8%, #4d24c6 100%)',
        }}
      >
        <div className="flex h-[60px] items-center">
          <button
            type="button"
            aria-label="Quay lại"
            className="flex size-6 items-center justify-center"
            onClick={() => history.push(PAGE_URL.products)}
          >
            <BackIcon
              width={24}
              height={24}
              stroke0="#ffffff"
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
          <h1 className="!mb-0 flex-1 text-center text-lg font-semibold leading-7 text-white">
            {title}
          </h1>
          <button
            type="button"
            aria-label="Trợ giúp"
            className="flex size-8 items-center justify-center"
          >
            <HelpCircleIcon
              width={18}
              height={18}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </div>
      </header>

      <div className="relative z-10 -mt-6 space-y-4 px-5">
        <section className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-[2px_2px_12px_rgba(0,0,0,0.1)]">
          <div className="min-w-0 flex-1">
            <p className="!mb-0 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Số dư khả dụng
            </p>
            <p className="!mb-0 text-lg font-semibold leading-7">
              12.500.000 ₫
            </p>
          </div>
          <button
            type="button"
            aria-label="Nộp thêm"
            className="flex size-8 items-center justify-center rounded-full bg-[rgba(182,95,252,0.1)]"
          >
            <PlusSignIcon
              width={14.5}
              height={14.5}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </section>

        <section>
          <p className="!mb-1.5 text-sm font-semibold leading-5">Số tiền hợp tác</p>
          <div className="flex items-center rounded-xl bg-white p-3 shadow-[2px_2px_12px_rgba(0,0,0,0.1)]">
            <Input
              variant="borderless"
              inputMode="numeric"
              placeholder="Nhập số tiền"
              value={
                amount
                  ? new Intl.NumberFormat('vi-VN').format(Number(amount))
                  : ''
              }
              onChange={(event) =>
                setAmount(event.target.value.replace(/\D/g, '').slice(0, 12))
              }
              className="!px-0 !text-[28px] !font-bold !text-[#060607] placeholder:!text-[rgba(10,10,11,0.36)]"
            />
            <span className="text-2xl font-bold text-[#b65ffc]">₫</span>
          </div>
        </section>

        <section>
          <p className="!mb-1.5 text-sm font-semibold leading-5">
            Hình thức nhận lợi nhuận
          </p>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-[2px_2px_24px_rgba(0,0,0,0.1)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PAYOUTS.map((item) => {
              const active = item === payout;
              return (
                <button
                  key={item}
                  type="button"
                  className={`h-9 shrink-0 rounded-lg px-5 text-sm font-semibold ${
                    active
                      ? 'bg-[#b65ffc] text-[#f6f6f6]'
                      : 'text-[#96969a]'
                  }`}
                  onClick={() => setPayout(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="!mb-1.5 text-sm font-semibold leading-5">
            Kỳ hạn & lợi nhuận
          </p>
          <div className="rounded-xl bg-white p-3 shadow-[2px_2px_24px_rgba(0,0,0,0.1)]">
            <div className="flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TERMS.map((item) => {
                const active = item.id === term.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`relative h-[52px] w-[94px] shrink-0 rounded-lg ${
                      active
                        ? 'bg-[#b65ffc] text-white'
                        : 'border border-[#f0f0f0] text-[#060607]'
                    }`}
                    onClick={() => setTermId(item.id)}
                  >
                    {item.compact ? (
                      <>
                        <span className="block text-sm font-semibold leading-5">
                          {item.label}
                        </span>
                        <span
                          className={`block text-xs leading-4 ${
                            active ? 'text-white' : 'text-[rgba(10,10,11,0.55)]'
                          }`}
                        >
                          {formatRate(item.rate)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`block text-xs leading-4 ${
                            active ? 'text-white' : 'text-[rgba(10,10,11,0.55)]'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold leading-5">
                          {formatRate(item.rate)}
                          <span className="text-[10px] font-medium">/năm</span>
                        </span>
                      </>
                    )}
                    {active ? (
                      <CheckCircleIcon
                        width={16}
                        height={16}
                        preserveAspectRatio="xMidYMid meet"
                        className="absolute -right-1.5 -top-2"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#b65ffc] bg-white p-3 shadow-[2px_2px_12px_rgba(0,0,0,0.1)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="!mb-0 text-sm leading-5 text-[rgba(10,10,11,0.55)]">
                Gói đề xuất
              </p>
              <p className="!mb-0 text-base font-semibold leading-6">
                {term.label} · {payout}
              </p>
            </div>
            <p className="!mb-0 font-semibold text-[#b65ffc]">
              <span className="text-lg leading-7">{formatRate(term.rate)}%</span>
              <span className="text-[10px] font-medium text-[rgba(10,10,11,0.55)]">
                /năm
              </span>
            </p>
          </div>
          <div className="mt-2 space-y-1 text-sm leading-5">
            <div className="flex justify-between">
              <span className="text-[rgba(10,10,11,0.55)]">
                LN trước thuế dự kiến
              </span>
              <span className="font-semibold">
                {estimate ? formatMoney(estimate.beforeTax) : '- ₫'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(10,10,11,0.55)]">
                LN sau thuế dự kiến
              </span>
              <span className="font-semibold">
                {estimate ? formatMoney(estimate.afterTax) : '- ₫'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[rgba(10,10,11,0.55)]">Ngày kết thúc</span>
              <span className="font-semibold">{endDate}</span>
            </div>
          </div>
          <div className="my-2 border-t border-dashed border-[#e7e7e7]" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(10,10,11,0.55)]">
              Tổng nhận dự kiến
            </span>
            <span className="text-base font-semibold text-[#b65ffc]">
              {estimate ? formatMoney(estimate.beforeTax + Number(amount)) : '- ₫'}
            </span>
          </div>
        </section>

        <section className="relative mt-2 flex items-center gap-3 rounded-xl bg-white p-3 shadow-[2px_2px_12px_rgba(0,0,0,0.1)]">
          <span className="absolute left-6 top-0 -translate-y-1/2 bg-white px-1 text-[10px] leading-4 text-[rgba(10,10,11,0.55)]">
            Thêm Sales giới thiệu (nếu có)
          </span>
          <label className="min-w-0 flex-1">
            <Input
              value={salePhone}
              inputMode="tel"
              placeholder="Nhập số điện thoại Sale"
              onChange={(event) => setSalePhone(event.target.value)}
              className="!h-11 !rounded-lg !border-[#e7e7e7] !text-sm"
            />
          </label>
          <button
            type="button"
            aria-label="Quét mã QR"
            className="flex size-11 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#c06ae4]"
            style={{
              background:
                'linear-gradient(258deg, rgba(192,106,228,0.02), rgba(77,36,198,0.02))',
            }}
          >
            <QrCodeIcon
              width={23}
              height={23}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-5 pb-4 pt-3 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
        <Button
          type="primary"
          block
          className="!h-12 !rounded-xl !border-0 !bg-[#b65ffc] !text-sm !font-semibold !shadow-none"
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
