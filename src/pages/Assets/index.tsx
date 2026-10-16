import { history } from '@umijs/max';
import { useState } from 'react';

const HOLDINGS = [
  {
    name: 'Tích luỹ Linh hoạt',
    value: '68.888.999',
    stack: 'z-[1] -mb-8 h-[116px]',
  },
  {
    name: 'Tích luỹ Vững bền',
    value: '68.686.686',
    stack: 'z-[2] -mb-8 h-[116px]',
  },
  {
    name: 'Tích luỹ Thần tốc',
    value: '6.868.888',
    stack: 'z-[3] mb-0 h-[88px]',
  },
];

const ALLOCATION = [
  { name: 'Tích luỹ Linh hoạt', value: '2,000,000đ' },
  { name: 'Tích luỹ Vững bền', value: '500,000đ' },
  { name: 'Tích luỹ Thần tốc', value: '500,000đ' },
];

const COINS = [
  'right-[18px] bottom-2 size-[46px]',
  'right-[52px] bottom-[22px] size-[38px]',
  'right-[78px] bottom-1.5 size-8',
  'right-1 bottom-9 size-7',
  'right-9 bottom-0 size-[22px]',
];

export default function AssetsPage() {
  const [hidden, setHidden] = useState(false);

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
      </header>

      <div className="bg-[#f3eef7] bg-[url('/images/assets/hero-bg.svg')] bg-[length:140%] bg-[center_40%] bg-no-repeat px-5 pb-4 pt-2">
        <section className="relative h-[92px] overflow-hidden rounded-xl bg-[linear-gradient(112deg,#963ce7_8%,#4b2768_92%)] px-4 pb-3 pt-4 text-white">
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
              {hidden ? '••••••••••' : '6.868.686.868'}
            </strong>
          </div>
          <div
            className="pointer-events-none absolute bottom-2 right-2 h-[59px] w-[145px]"
            aria-hidden
          >
            <img
              className="absolute left-0 top-0 w-[145px]"
              src="/images/assets/chart-fill.svg"
              alt=""
            />
            <img
              className="absolute left-0 top-1 w-[145px]"
              src="/images/assets/chart-line.svg"
              alt=""
            />
          </div>
        </section>

        <div className="mt-4 flex justify-center gap-6">
          <button
            type="button"
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
            68.686.686đ
          </strong>
          <em className="inline-flex rounded-[5px] bg-[#34c759] px-1.5 py-0.5 text-xs font-semibold not-italic leading-4 text-white">
            +4,8%
          </em>
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
              <img
                className="absolute left-0 top-1.5"
                src="/images/assets/dot.svg"
                alt=""
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/75">
                Tổng số tiền đầu tư
              </p>
              <strong className="mt-0.5 block text-sm font-semibold leading-5 text-white">
                686.686.686đ
              </strong>
            </div>
            <div className="relative pl-3">
              <img
                className="absolute left-0 top-1.5"
                src="/images/assets/dot.svg"
                alt=""
                width={4}
                height={4}
              />
              <p className="m-0 text-xs leading-4 text-white/75">
                Số dư khả dụng
              </p>
              <strong className="mt-0.5 block text-sm font-semibold leading-5 text-white">
                888.999đ
              </strong>
            </div>
          </article>
        </div>
      </div>

      <section className="px-5 pb-4 pt-2">
        <h2 className="mb-3 mt-2 flex items-center gap-2 text-base font-semibold leading-6 text-[#060607]">
          <img src="/images/assets/money.svg" alt="" width={20} height={20} />
          Bạn đang đầu tư 3 sản phẩm
        </h2>
        <div className="flex flex-col">
          {HOLDINGS.map((item) => (
            <article
              key={item.name}
              className={`relative overflow-hidden rounded-xl border border-[#e7e7e7] bg-white ${item.stack}`}
            >
              <div className="flex h-11 items-center justify-between bg-[#f7f7f7] px-4">
                <p className="m-0 text-sm font-semibold leading-5 text-[#060607]">
                  {item.name}
                </p>
                <img
                  src="/images/assets/arrow-up-right.svg"
                  alt=""
                  width={15}
                  height={15}
                />
              </div>
              <div className="flex items-center justify-between px-4 pt-3">
                <span className="font-['Hanken_Grotesque',sans-serif] text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng lợi nhuận
                </span>
                <strong className="text-lg font-semibold leading-7 text-[#34c759]">
                  {item.value}
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
        <div className="mb-3 flex h-7 items-center overflow-hidden rounded-lg bg-[#b65ffc] text-xs font-semibold leading-4 text-white">
          <span className="flex-1 pl-2.5">75%</span>
          <b className="flex h-full w-[35.7%] items-center justify-end rounded-lg border border-white bg-[#171b6d] pr-2.5 font-semibold">
            25%
          </b>
        </div>
        <div className="rounded-lg border border-[#e7e7e7] px-4 py-2">
          <div className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 text-sm leading-5">
            <i className="h-6 w-1.5 rounded bg-[#b65ffc]" />
            <span className="text-[#060607]">Số dư khả dụng</span>
            <b className="font-semibold text-[#060607]">100,000,000đ</b>
          </div>
          <div className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 text-sm leading-5">
            <i className="h-6 w-1.5 rounded bg-[#171b6d]" />
            <span className="inline-flex items-center gap-1 text-[#060607]">
              Tích luỹ
              <img
                src="/images/assets/arrow-down.svg"
                alt=""
                width={12}
                height={12}
              />
            </span>
            <b className="font-semibold text-[#060607]">3,000,000đ</b>
          </div>
          {ALLOCATION.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[16px_1fr_auto] items-center gap-2 py-2 pl-4 text-xs font-normal leading-5 text-[rgba(10,10,11,0.55)]"
            >
              <i className="h-6 w-1.5" />
              <span>{item.name}</span>
              <b className="font-normal">{item.value}</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
