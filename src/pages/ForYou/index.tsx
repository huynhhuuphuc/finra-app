import {
  BannerTailIcon,
  ChestDepositIcon,
  ChestTradeIcon,
  ChevronsIcon,
  StepDoneIcon,
  TimelineIcon,
} from '@/icons';

const STEPS = [
  {
    title: 'Mở tài khoản',
    icon: StepDoneIcon,
    iconWidth: 36,
    iconHeight: 36,
    done: true,
  },
  {
    title: 'Nộp tiền tài khoản',
    icon: ChestDepositIcon,
    iconWidth: 36,
    iconHeight: 36,
    done: false,
    action: 'Thực hiện',
  },
  {
    title: 'Giao dịch lần đầu',
    icon: ChestTradeIcon,
    iconWidth: 37,
    iconHeight: 34,
    done: false,
  },
] as const;

export default function ForYouPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-white pb-8 text-[#060607]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[393px] bg-gradient-to-b from-[rgba(182,95,252,0.3)] to-white" />

      <section className="relative mx-auto w-[310px]">
        <div className="relative overflow-hidden rounded-b-xl bg-[#511c55] px-4 pb-5 pt-[13px]">
          <img
            src="/images/for-you/card-pattern.png"
            alt=""
            className="pointer-events-none absolute -left-[101px] top-[79px] h-[193px] w-[242px] object-cover opacity-80"
          />
          <img
            src="/images/for-you/avatar.png"
            alt=""
            width={80}
            height={80}
            className="relative mx-auto size-20 rounded-full border-4 border-white object-cover"
          />
          <h1 className="relative mt-4 bg-gradient-to-r from-[#c8d0d6] to-[#878eb8] bg-clip-text text-center text-lg font-semibold leading-7 text-transparent !mb-0">
            Nhà đầu tư tập sự
          </h1>

          <div className="relative mt-[15px] flex items-center justify-between">
            <p className="text-[10px] leading-4 text-[#b3b3b3] !mb-0">
              Điểm kinh nghiệm
            </p>
            <p className="text-xs font-semibold leading-4 !mb-0">
              <span className="text-[#b65ffc]">01</span>
              <span className="text-[#b3b3b3]">/03</span>
            </p>
          </div>

          <div className="relative mt-1">
            <div className="absolute left-0.5 top-1/2 h-1.5 w-[93px] -translate-y-1/2 rounded-md bg-[#d940ea] blur-[10px]" />
            <div className="relative rounded-full border border-[#b65ffc] bg-black p-0.5">
              <div className="h-1.5 w-[93px] rounded-md bg-[#b65ffc]" />
              <ChevronsIcon
                width={37}
                height={13}
                className="absolute left-1 top-1/2 h-[13px] w-[37px] -translate-y-1/2"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          </div>
          <p className="mt-1 text-right text-[10px] font-semibold leading-4 bg-gradient-to-r from-[#f6f287] to-[#ff76ea] bg-clip-text text-transparent !mb-0">
            Chiến binh nhập môn
          </p>
        </div>
        <BannerTailIcon
          width={230}
          height={88}
          className="mx-auto -mt-1 block h-[88px] w-[230px]"
        />
      </section>

      <section className="relative px-5">
        <h2 className="text-sm font-normal leading-5 !mb-0">
          HÀNH TRÌNH VƯƠN XA
        </h2>
        <div className="relative mt-4 flex flex-col gap-10">
          <div className="pointer-events-none absolute -left-[21px] top-0 h-[280px] w-[45px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent)]">
            <TimelineIcon
              width={45}
              height={480}
              className="h-[480px] w-[45px] max-w-none"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="relative z-10 flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center">
                  <step.icon
                    width={step.iconWidth}
                    height={step.iconHeight}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-6 !mb-0">
                    {step.title}
                  </p>
                  <p
                    className={`text-xs font-semibold leading-4 !mb-0 ${
                      step.done
                        ? 'text-[#34c759]'
                        : 'text-[rgba(10,10,11,0.55)]'
                    }`}
                  >
                    {step.done ? 'Đã hoàn thành' : '+1 exp'}
                  </p>
                </div>
              </div>
              {step.done ? (
                <p className="shrink-0 bg-[linear-gradient(244deg,#c06ae4_8%,#4d24c6_107%)] bg-clip-text text-sm font-semibold leading-5 text-transparent !mb-0">
                  +1 exp
                </p>
              ) : null}
              {'action' in step ? (
                <button
                  type="button"
                  className="flex h-10 w-24 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(242deg,#c06ae4_8%,#4d24c6_107%)] text-sm font-semibold leading-5 !text-white"
                >
                  {step.action}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
