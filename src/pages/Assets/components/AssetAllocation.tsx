const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 1.2;

type Slice = { label: string; value: number; color: string };

export default function AssetAllocation({
  slices,
  total,
  format,
}: {
  slices: Slice[];
  total: number;
  format: (value: number) => string;
}) {
  const visible = slices.filter((slice) => slice.value > 0);
  let offset = 0;
  const arcs = visible.map((slice) => {
    const length = (slice.value / total) * CIRCUMFERENCE;
    const dash = visible.length > 1 ? Math.max(length - GAP, 0.5) : length;
    const arc = { ...slice, dash, offset };
    offset += length;
    return arc;
  });

  return (
    <div className="flex items-center gap-5">
      <div className="relative aspect-square w-[42%] max-w-[168px] shrink-0">
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={slices
            .map(
              (slice) =>
                `${slice.label} ${
                  total > 0 ? ((slice.value / total) * 100).toFixed(1) : 0
                }%`,
            )
            .join(', ')}
          className="size-full -rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#f1f1f1"
            strokeWidth="9"
          />
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth="9"
              strokeDasharray={`${arc.dash} ${CIRCUMFERENCE}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-[14%] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] leading-4 text-[rgba(10,10,11,0.55)]">
            Tổng tài sản
          </span>
          <span className="mt-0.5 break-all text-xs font-semibold leading-4">
            {format(total)}
          </span>
        </div>
      </div>

      <ul className="!mb-0 flex min-w-0 flex-1 list-none flex-col gap-3 !pl-0">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-start gap-2">
            <span
              className="mt-1 size-2 shrink-0 rounded-full"
              style={{ background: slice.color }}
            />
            <span className="min-w-0">
              <span className="block text-xs leading-4 text-[rgba(10,10,11,0.78)]">
                {slice.label}
              </span>
              <span className="mt-0.5 block break-all text-sm font-semibold leading-5">
                {format(slice.value)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
