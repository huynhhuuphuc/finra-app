import {
  formatHomeMoney,
  getInterestProgress,
  type NearInterest,
} from '@/api/core/home';
import { FlagIcon, MarkerIcon } from '@/icons';

export default function UpcomingInterest({
  items,
  hidden,
}: {
  items: NearInterest[];
  hidden: boolean;
}) {
  return (
    <>
      {items.map((item, index) => {
        const progress = getInterestProgress(item);
        return (
          <article
            key={item.PK_MM_APPENDIX || index}
            className="mt-4 border-b border-[#e7e7e7] pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold">
                {item.NAME?.trim() || 'Tích luỹ'}
              </p>
              <p className="shrink-0 text-xs font-semibold text-[#34c759]">
                {formatHomeMoney(item.CASH_VALUE, hidden)}
              </p>
            </div>
            {item.EXPIRE_DATE && (
              <p className="text-xs">
                Ngày tất toán:{' '}
                <span className="text-[#b65ffc]">{item.EXPIRE_DATE}</span>
              </p>
            )}
            {item.EXTEND_TYPE_NAME && (
              <p className="text-xs text-gray-500">{item.EXTEND_TYPE_NAME}</p>
            )}
            {progress ? (
              <div
                className="relative mx-2 mt-5 h-9"
                role="img"
                aria-label={`Tiến độ kỳ nhận lợi ích ${progress.percent.toFixed(
                  0,
                )}%`}
              >
                <div className="absolute inset-x-0 top-1.5 h-2 rounded-full bg-[#e7e7e7]" />
                <div
                  className="absolute left-0 top-1.5 h-2 rounded-full bg-[#b65ffc]"
                  style={{ width: `${progress.percent}%` }}
                />
                <MarkerIcon
                  width={14}
                  height={12}
                  className="absolute top-3.5 -translate-x-1/2"
                  style={{ left: `${progress.percent}%` }}
                />
                {progress.flags.map((flag) => (
                  <span
                    key={flag.date}
                    title={new Intl.DateTimeFormat('vi-VN').format(flag.date)}
                    style={{ left: `${flag.percent}%` }}
                    className="absolute top-0 grid size-5 -translate-x-1/2 place-items-center rounded-full bg-white shadow-md"
                  >
                    <FlagIcon width={10} height={11} />
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-gray-500">
                Chưa có lịch nhận lợi ích.
              </p>
            )}
            <p className="text-[10px] text-gray-500">{item.CONTENT}</p>
            {item.STATUS_LOAN_APPENDIX === 'DANG_UNG_TRUOC' && (
              <p className="text-right text-xs text-[#b65ffc]">
                Đang ứng trước
              </p>
            )}
          </article>
        );
      })}
    </>
  );
}
