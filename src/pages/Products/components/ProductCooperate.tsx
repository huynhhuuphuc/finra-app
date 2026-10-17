import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import { LinkSquareIcon } from '@/icons';
import { history } from '@umijs/max';
import { Button, Slider } from 'antd';
import { useState } from 'react';

const MIN_AMOUNT = 200_000;
const MAX_AMOUNT = 200_000_000;
const STEP = 100_000;
const YEARLY_RATE = 0.035;
const TICK_COUNT = 19;
const DEFAULT_AMOUNT =
  Math.round(
    (MIN_AMOUNT + (10 / TICK_COUNT) * (MAX_AMOUNT - MIN_AMOUNT)) / STEP,
  ) * STEP;

const formatDong = (value: number) =>
  `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

export default function ProductCooperate() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [touched, setTouched] = useState(false);
  const ratio = (amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT);
  const profit = touched ? Math.round(amount * YEARLY_RATE) : 0;

  return (
    <div className="flex min-h-full flex-col bg-white pb-24">
      <PageHeader
        title="Sản phẩm tích lũy"
        onBack={() => history.push(PAGE_URL.products)}
        extra={
          <button
            type="button"
            aria-label="Mở liên kết"
            className="flex size-8 items-center justify-center rounded border border-[#8e8e8f]"
          >
            <LinkSquareIcon
              width={16.25}
              height={16.25}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        }
      />

      <div className="px-5">
        <section className="relative mx-auto mt-5 h-[172px] w-[310px] overflow-hidden rounded-xl bg-[#f6ebff]">
          <div className="pointer-events-none absolute -left-6 top-4 size-24 rounded-full bg-[#e4c8ff] blur-2xl" />
          <div className="relative z-10 flex h-full flex-col px-4 py-3">
            <span
              className="inline-flex h-6 w-fit items-center rounded-md px-2 text-xs font-semibold text-white"
              style={{
                background: 'linear-gradient(221.9deg, #c06ae4 0%, #4d24c6 100%)',
              }}
            >
              Tích luỹ Linh hoạt
            </span>
            <p className="!mb-0 mt-2 text-base font-semibold leading-6 text-[#060607]">
              Không kỳ hạn
            </p>
            <p className="!mb-0 mt-auto text-xs leading-4 text-[rgba(10,10,11,0.55)]">
              Lợi nhuận mục tiêu
            </p>
            <p className="!mb-0 font-semibold text-[#b65ffc]">
              <span className="text-[32px] leading-[52px]">3.5</span>
              <span className="text-base leading-6">%</span>
              <span className="text-sm leading-5">/năm</span>
            </p>
          </div>
          <div className="pointer-events-none absolute right-3 top-1/2 size-[88px] -translate-y-1/2">
            <img
              src="/images/products/coin.png"
              alt=""
              className="size-full rounded-full object-cover shadow-[0_8px_16px_rgba(180,120,20,0.35)]"
            />
            <img
              src="/images/products/infinity.svg"
              alt=""
              className="absolute left-1/2 top-1/2 w-[41px] -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </section>

        <section className="relative mt-5 flex h-[76px] items-center overflow-hidden rounded-lg bg-[#1cffc7] px-4">
          <img
            src="/images/products/profit-shape.svg"
            alt=""
            className="pointer-events-none absolute -left-4 -top-[19px] h-[108px] w-[246px] max-w-none"
          />
          <div className="relative z-10 flex flex-1 flex-col">
            <span className="text-sm leading-5 text-white">Lợi nhuận dự kiến</span>
            <span className="font-semibold text-[#34c759]">
              <span className="text-xl leading-8">
                +{new Intl.NumberFormat('vi-VN').format(profit)}
              </span>
              <span className="text-base leading-6">đ</span>
            </span>
          </div>
          <div className="relative z-10 text-right">
            <p className="!mb-0 text-xs leading-4 text-[#060607]">
              Ngày trả LN định kỳ
            </p>
            <p className="!mb-0 text-sm font-semibold leading-5 text-[#060607]">
              15/11/2024
            </p>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold leading-5 text-[#060607]">
              Nhập số tiền
            </span>
            <span className="rounded-xl bg-[#e7e7e7] px-1 py-0.5 text-sm font-semibold leading-5 text-[#060607] underline">
              đ
            </span>
          </div>
          <p
            className={`!mb-0 mt-3 text-center text-2xl leading-9 ${
              touched
                ? 'font-semibold text-[#060607]'
                : 'text-[rgba(10,10,11,0.36)] opacity-40'
            }`}
          >
            {touched ? formatDong(amount) : 'Số tiền tích luỹ'}
          </p>
          <div className="relative mt-2 overflow-hidden rounded-lg bg-[#f7f7f7] px-3 py-1.5">
            <div className="pointer-events-none absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between">
              {Array.from({ length: TICK_COUNT }, (_, index) => {
                const before = index / (TICK_COUNT - 1) < ratio - 0.02;
                return (
                  <span
                    key={index}
                    className={`w-px rounded-full ${
                      before ? 'h-3 bg-[#d0d0d0]' : 'h-6 bg-[#0a0a0b]'
                    }`}
                  />
                );
              })}
            </div>
            <Slider
              className="amount-ruler"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={STEP}
              value={amount}
              tooltip={{ open: false }}
              onChange={(value) => {
                setAmount(value);
                setTouched(true);
              }}
            />
          </div>
          <div className="mt-2 flex items-start justify-between text-xs leading-4">
            <div>
              <p className="!mb-0 text-[rgba(10,10,11,0.55)]">GT gửi tối thiểu</p>
              <p className="!mb-0 font-semibold text-[#060607]">
                {formatDong(MIN_AMOUNT)}
              </p>
            </div>
            <div className="text-right">
              <p className="!mb-0 text-[rgba(10,10,11,0.55)]">GT gửi tối đa</p>
              <p className="!mb-0 font-semibold text-[#060607]">
                {formatDong(MAX_AMOUNT)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#e7e7e7] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <p className="!mb-0 text-sm font-semibold leading-5 text-[#060607]">
              Tài khoản thanh toán{' '}
              <span className="font-light text-[rgba(10,10,11,0.55)]">(</span>
              666888
              <span className="font-light text-[rgba(10,10,11,0.55)]">)</span>
            </p>
            <p className="!mb-0 shrink-0 text-lg font-semibold leading-7 text-[#060607]">
              6.868.686.868đ
            </p>
          </div>
          <p className="!mb-0 mt-1 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
            Số dư TK khả dụng
          </p>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-4 bg-white px-5 pb-4 pt-3 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
        <Button className="!h-12 !w-[100px] !rounded-xl !border-[#8e8e8f] !text-sm !font-semibold !text-[#060607]">
          Chi tiết
        </Button>
        <Button
          type="primary"
          className="!h-12 !flex-1 !rounded-xl !border-0 !bg-[#b65ffc] !text-sm !font-semibold !shadow-none"
        >
          Thực hiện
        </Button>
      </div>
    </div>
  );
}
