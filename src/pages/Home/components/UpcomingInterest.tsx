import {
  formatHomeMoney,
  getInterestProgress,
  type NearInterest,
} from '@/api/core/home';
import InterestFlag from '@/components/InterestFlag';
import { MarkerIcon } from '@/icons';
import { useState } from 'react';

export default function UpcomingInterest({
  items,
  hidden,
  onSelect,
}: {
  items: NearInterest[];
  hidden: boolean;
  onSelect?: (item: NearInterest) => void;
}) {
  const [activeFlag, setActiveFlag] = useState<string | null>(null);
  return (
    <>
      {items.map((item, index) => {
        const progress = getInterestProgress(item);
        return (
          <article
            key={item.PK_MM_APPENDIX || index}
            className={`mt-4 border-b border-[#e7e7e7] pb-4 last:border-0 last:pb-0 ${
              onSelect && item.PK_MM_APPENDIX ? 'cursor-pointer' : ''
            }`}
            role={onSelect && item.PK_MM_APPENDIX ? 'button' : undefined}
            tabIndex={onSelect && item.PK_MM_APPENDIX ? 0 : undefined}
            onClick={
              onSelect && item.PK_MM_APPENDIX ? () => onSelect(item) : undefined
            }
            onKeyDown={
              onSelect && item.PK_MM_APPENDIX
                ? (event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    onSelect(item);
                  }
                : undefined
            }
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-left text-sm font-semibold">
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
            {item.EXTEND_TYPE && item.EXTEND_TYPE !== 'KHONG_GIA_HAN' && (
              <p
                title={item.EXTEND_TYPE_NAME || ''}
                className="text-xs text-gray-500"
              >
                ↻ {item.EXTEND_TYPE_NAME || 'Có gia hạn'}
              </p>
            )}
            {progress ? (
              <div
                className="relative mx-2 mt-5 h-9"
                role="img"
                aria-label={`Tiến độ kỳ nhận lợi ích ${progress.percent.toFixed(
                  0,
                )}%`}
              >
                <div
                  className="absolute inset-x-0 top-2 h-1 rounded-full"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, #e7e7e7 0 3px, transparent 3px 6px)',
                  }}
                />
                {progress.flags[0] &&
                  progress.flags[0].percent > progress.percent && (
                    <div
                      className="absolute top-2 h-1 rounded-full bg-[#efe1fe]"
                      style={{
                        left: `${progress.percent}%`,
                        width: `${
                          progress.flags[0].percent - progress.percent
                        }%`,
                      }}
                    />
                  )}
                <div
                  className="absolute left-0 top-1.5 h-2 rounded-full border border-black/80 bg-[#b65ffc]"
                  style={{ width: `${progress.percent}%` }}
                />
                <MarkerIcon
                  width={20}
                  height={17}
                  className="absolute top-3.5 -translate-x-1/2 drop-shadow-[0_0_6px_rgba(255,204,0,0.7)]"
                  style={{ left: `${progress.percent}%` }}
                />
                {progress.flags.map((flag) => {
                  const flagKey = `${index}-${flag.date}`;
                  return (
                    <InterestFlag
                      key={flag.date}
                      date={flag.date}
                      percent={flag.percent}
                      open={activeFlag === flagKey}
                      onToggle={() =>
                        setActiveFlag((value) =>
                          value === flagKey ? null : flagKey,
                        )
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-xs text-gray-500">
                Chưa có lịch nhận lợi ích.
              </p>
            )}
            <p className="line-clamp-2 text-[10px] text-gray-500">
              {item.CONTENT}
            </p>
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
