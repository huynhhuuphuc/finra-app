import { parseAssetTimeline } from '@/api/core/assets';

export default function AssetTimeline({
  value,
  hidden,
}: {
  value: unknown;
  hidden: boolean;
}) {
  if (hidden) return null;
  if (typeof value === 'string' && value.trim() && value !== '0') {
    try {
      JSON.parse(value);
    } catch {
      return (
        <span role="status" className="text-[10px] text-white/75">
          Không đọc được dữ liệu biểu đồ
        </span>
      );
    }
  }
  const points = parseAssetTimeline(value);
  if (!points.length)
    return (
      <span className="text-[10px] text-white/75">Chưa có dữ liệu biểu đồ</span>
    );
  const min = Math.min(...points.map((point) => point.amount));
  const max = Math.max(...points.map((point) => point.amount));
  const first = points[0].timestamp;
  const last = points[points.length - 1].timestamp;
  const coordinates = points.map((point) => ({
    ...point,
    x:
      last === first
        ? 72
        : 4 + ((point.timestamp - first) / (last - first)) * 136,
    y: max === min ? 28 : 52 - ((point.amount - min) / (max - min)) * 46,
  }));
  return (
    <svg
      viewBox="0 0 145 59"
      role="img"
      aria-label="Biến động tài sản theo ngày"
      className="h-full w-full"
    >
      <polyline
        fill="none"
        stroke="white"
        strokeWidth="2"
        points={coordinates.map((point) => `${point.x},${point.y}`).join(' ')}
      />
      {coordinates.map((point, index) => (
        <circle
          key={`${point.timestamp}-${index}`}
          cx={point.x}
          cy={point.y}
          r="2"
          fill="white"
        >
          <title>
            {point.date}: {new Intl.NumberFormat('vi-VN').format(point.amount)}đ
          </title>
        </circle>
      ))}
    </svg>
  );
}
