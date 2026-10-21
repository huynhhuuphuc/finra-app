import { FlagIcon } from '@/icons';
import dayjs from 'dayjs';

export default function InterestFlag({
  date,
  percent,
  open,
  onToggle,
  className = 'top-0 shadow-md',
  iconSize = 10,
}: {
  date: number;
  percent: number;
  open: boolean;
  onToggle: () => void;
  className?: string;
  iconSize?: number;
}) {
  const label = dayjs(date).format('DD/MM/YYYY');
  return (
    <button
      type="button"
      aria-label={`Ngày thanh toán lợi nhuận ${label}`}
      style={{ left: `${percent}%` }}
      className={`absolute grid size-5 -translate-x-1/2 place-items-center rounded-full border-0 bg-white p-0 ${className}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <FlagIcon
        width={iconSize}
        height={iconSize}
        preserveAspectRatio="xMidYMid meet"
      />
      {open && (
        <span className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#3a1d8f] to-[#b65ffc] px-3 py-1.5 text-xs font-semibold text-white after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[6px] after:border-t-[6px] after:border-x-transparent after:border-t-[#7a3fd0] after:content-['']">
          {label}
        </span>
      )}
    </button>
  );
}
