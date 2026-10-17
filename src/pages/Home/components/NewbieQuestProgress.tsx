const STEPS = ['Mở Account', 'Nộp tiền', 'Giao dịch'];

export default function NewbieQuestProgress({
  completedSteps,
}: {
  completedSteps: number;
}) {
  return (
    <section
      aria-label="Các bước bắt đầu"
      className="mx-5 h-20 rounded-b-xl bg-[#511c55] p-4 text-white"
    >
      <ol className="flex items-start">
        {STEPS.map((label, index) => {
          const done = index < completedSteps;
          const active = index === completedSteps;
          return (
            <li
              key={label}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-2 text-center"
            >
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-[11px] h-0.5 w-full ${
                    index < completedSteps
                      ? 'bg-[#b65ffc]/50'
                      : 'bg-[#e7e7e7]/50'
                  }`}
                />
              )}
              <span
                aria-hidden
                className={`relative grid size-6 place-items-center rounded-full border text-[10px] ${
                  done
                    ? 'border-[#b65ffc] bg-[#b65ffc] text-white'
                    : active
                    ? 'border-[#b65ffc] bg-white text-[#3b3b3c] shadow-[0_0_20px_#d6a3ff]'
                    : 'border-[#e7e7e7] bg-white text-[#3b3b3c]'
                }`}
              >
                {done ? '✓' : String(index + 1).padStart(2, '0')}
              </span>
              <span
                aria-current={active ? 'step' : undefined}
                className="text-xs font-semibold leading-4"
              >
                {label}
                <span className="sr-only">
                  {done
                    ? ': Đã hoàn thành'
                    : active
                    ? ': Đang thực hiện'
                    : ': Chưa thực hiện'}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
