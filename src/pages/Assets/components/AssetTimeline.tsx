import { parseAssetTimeline } from '@/api/core/assets';
import { useId } from 'react';

const WIDTH = 145;
const HEIGHT = 59;
const LINE = '#ffe14d';

export default function AssetTimeline({ value }: { value: unknown }) {
  const gradientId = useId();
  let points: ReturnType<typeof parseAssetTimeline> = [];
  try {
    points = parseAssetTimeline(value);
  } catch {
    return null;
  }
  if (!points.length) return null;

  const min = Math.min(...points.map((point) => point.amount));
  const max = Math.max(...points.map((point) => point.amount));
  const first = points[0].timestamp;
  const last = points[points.length - 1].timestamp;
  const coordinates = points.map((point) => ({
    x:
      last === first
        ? WIDTH
        : ((point.timestamp - first) / (last - first)) * WIDTH,
    y:
      max === min ? HEIGHT / 2 : 54 - ((point.amount - min) / (max - min)) * 48,
  }));
  // 1 điểm: vẽ đường ngang (tài sản chưa biến động).
  const line =
    coordinates.length === 1
      ? [{ x: 0, y: coordinates[0].y }, coordinates[0]]
      : coordinates;
  const linePath = line.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = `M${line[0].x},${HEIGHT} L${linePath.replace(/ /g, ' L')} L${
    line[line.length - 1].x
  },${HEIGHT} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Biến động tài sản theo ngày"
      className="size-full overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={LINE} stopOpacity="0.45" />
          <stop offset="100%" stopColor={LINE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        points={linePath}
        fill="none"
        stroke={LINE}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
