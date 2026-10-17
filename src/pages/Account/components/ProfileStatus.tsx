export default function ProfileStatus({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: Error | null;
  retry: () => unknown;
}) {
  if (loading)
    return (
      <p role="status" className="px-5 py-3 text-sm">
        Đang tải thông tin…
      </p>
    );
  if (!error) return null;
  return (
    <div role="alert" className="px-5 py-3 text-sm text-red-600">
      <p>{error.message}</p>
      <button type="button" onClick={() => retry()} className="underline">
        Thử lại
      </button>
    </div>
  );
}
