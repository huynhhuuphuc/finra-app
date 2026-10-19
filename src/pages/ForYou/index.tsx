import useCustomerProfile from '@/hooks/useCustomerProfile';
import useJourney from '@/hooks/useJourney';
import {
  BannerTailIcon,
  ChestDepositIcon,
  ChestTradeIcon,
  ChevronsIcon,
  StepDoneIcon,
  TimelineIcon,
} from '@/icons';
import { Modal } from 'antd';
import CustomerAvatar from '../Account/components/CustomerAvatar';
import ProfileStatus from '../Account/components/ProfileStatus';

export default function ForYouPage() {
  const profile = useCustomerProfile();
  const { journey, act, celebrating, closeCelebration } = useJourney();
  const progress =
    journey.totalExp > 0
      ? Math.max(0, Math.min(100, (journey.exp / journey.totalExp) * 100))
      : 0;
  const steps = journey.quests.map((quest, index) => ({
    ...quest,
    title: quest.name,
    done: quest.status === 2,
    icon:
      quest.status === 2
        ? StepDoneIcon
        : index === 1
        ? ChestDepositIcon
        : ChestTradeIcon,
    iconWidth: 36,
    iconHeight: 36,
    canPerform:
      quest.status === 0 && index > 0 && journey.quests[index - 1].status !== 0,
  }));
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
          <div className="relative mx-auto w-fit rounded-full border-4 border-white">
            <CustomerAvatar profile={profile.profile} size={80} />
          </div>
          <h1 className="relative mt-4 bg-gradient-to-r from-[#c8d0d6] to-[#878eb8] bg-clip-text text-center text-lg font-semibold leading-7 text-transparent !mb-0">
            Hành trình khách hàng
          </h1>

          <div className="relative mt-[15px] flex items-center justify-between">
            <p className="text-[10px] leading-4 text-[#b3b3b3] !mb-0">
              Điểm kinh nghiệm
            </p>
            <p className="text-xs font-semibold leading-4 !mb-0">
              <span className="text-[#b65ffc]">
                {String(journey.exp).padStart(2, '0')}
              </span>
              <span className="text-[#b3b3b3]">
                /{String(journey.totalExp).padStart(2, '0')}
              </span>
            </p>
          </div>

          <div className="relative mt-1">
            <div
              style={{ width: `${progress}%` }}
              className="absolute left-0.5 top-1/2 h-1.5 -translate-y-1/2 rounded-md bg-[#d940ea] blur-[10px]"
            />
            <div className="relative rounded-full border border-[#b65ffc] bg-black p-0.5">
              <div
                role="progressbar"
                aria-label="Điểm kinh nghiệm"
                aria-valuenow={journey.exp}
                aria-valuemin={0}
                aria-valuemax={journey.totalExp}
                style={{ width: `${progress}%` }}
                className="h-1.5 rounded-md bg-[#b65ffc]"
              />
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

      <ProfileStatus
        loading={profile.hasSession && profile.isPending}
        error={profile.error}
        retry={profile.refetch}
      />
      <p className="relative px-5 pb-3 text-xs text-gray-500">
        Trải nghiệm nhiệm vụ — tiến độ tạm thời, chưa ghi nhận quyền lợi.
      </p>
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
          {steps.map((step) => (
            <div
              key={step.title}
              className="relative z-10 flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="relative grid size-11 shrink-0 place-items-center">
                  <step.icon
                    width={step.iconWidth}
                    height={step.iconHeight}
                    preserveAspectRatio="xMidYMid meet"
                  />
                  {step.status === 1 && (
                    <span
                      aria-label="Chờ nhận thưởng"
                      className="absolute -right-1 -top-1 rounded-full bg-[#b65ffc] px-1 text-xs font-bold text-white"
                    >
                      +
                    </span>
                  )}
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
                    {step.done ? 'Đã hoàn thành' : `+${step.exp} exp`}
                  </p>
                </div>
              </div>
              {step.done ? (
                <p className="shrink-0 bg-[linear-gradient(244deg,#c06ae4_8%,#4d24c6_107%)] bg-clip-text text-sm font-semibold leading-5 text-transparent !mb-0">
                  +{step.exp} exp
                </p>
              ) : null}
              {step.canPerform || step.status === 1 ? (
                <button
                  type="button"
                  disabled={journey.levelUpPending}
                  onClick={() =>
                    act(step.id, step.status === 1 ? 'claim' : 'perform')
                  }
                  className="flex h-10 w-24 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(242deg,#c06ae4_8%,#4d24c6_107%)] text-sm font-semibold leading-5 !text-white"
                >
                  {step.status === 1 ? `+${step.exp} exp` : 'Thực hiện'}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      <Modal
        open={celebrating}
        title="Chúc mừng bạn đã lên cấp!"
        onOk={closeCelebration}
        onCancel={closeCelebration}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText="Tiếp tục"
      >
        <p>Nhà đầu tư tập sự · Chiến binh nhập môn</p>
        <p>Cấp độ hiện tại: {journey.level}</p>
      </Modal>
    </div>
  );
}
