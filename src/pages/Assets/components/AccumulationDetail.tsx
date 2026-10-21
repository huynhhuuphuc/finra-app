import {
  fetchAssetAccumulationDetail,
  updateAccumulationText,
} from '@/api/core/assetDetails';
import { parseAmount } from '@/api/core/assets';
import {
  formatHomeMoney,
  getInterestProgress,
  type NearInterest,
} from '@/api/core/home';
import InterestFlag from '@/components/InterestFlag';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import {
  ArrowUpIcon,
  ClockIcon,
  EditIcon,
  MarkerIcon,
  RefreshIcon,
} from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { history, useSearchParams } from '@umijs/max';
import { App, Input, Modal } from 'antd';
import { useState, type ReactNode } from 'react';
import AccumulationAmountForm, {
  type AccumulationAction,
} from './AccumulationAmountForm';
import AccumulationRenewal from './AccumulationRenewal';

export function openAccumulationDetail(item: NearInterest) {
  if (!item.PK_MM_APPENDIX) return;
  const params = new URLSearchParams({ id: item.PK_MM_APPENDIX });
  if (typeof item.EXTEND_TYPE === 'string')
    params.set('extendType', item.EXTEND_TYPE);
  if (item.EXTEND_TYPE_NAME) params.set('extendName', item.EXTEND_TYPE_NAME);
  history.push(`${PAGE_URL.accumulation}?${params}`);
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="!mb-1 font-poppins text-xs leading-4 text-[rgba(10,10,11,0.78)]">
        {label}
      </p>
      <div className="text-sm font-semibold leading-5">{children}</div>
    </div>
  );
}

function RateValue({ value }: { value: unknown }) {
  const amount = parseAmount(value);
  if (amount === null) return '—';
  return (
    <>
      <span>
        {amount.toLocaleString('vi-VN', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
        %
      </span>
      <span className="text-xs leading-4">/năm</span>
    </>
  );
}

function InterestTrack({ item }: { item: NearInterest }) {
  const progress = getInterestProgress(item);
  const [activeFlag, setActiveFlag] = useState<number | null>(null);
  if (!progress) {
    return (
      <p className="font-poppins text-[10px] leading-4 text-white/75">
        Chưa có lịch nhận lợi ích.
      </p>
    );
  }

  return (
    <div
      className="relative h-11"
      role="img"
      aria-label={`Tiến độ kỳ nhận lợi ích ${progress.percent.toFixed(0)}%`}
    >
      <div
        className="absolute inset-x-0 top-[14px] h-1 rounded-full"
        style={{
          background:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.85) 0 3px, transparent 3px 6px)',
        }}
      />
      {progress.flags[0] && progress.flags[0].percent > progress.percent && (
        <div
          className="absolute top-3 h-2 rounded-full bg-[#f3eafd]"
          style={{
            left: `${progress.percent}%`,
            width: `${progress.flags[0].percent - progress.percent}%`,
          }}
        />
      )}
      <div
        className="absolute left-0 top-3 h-2 min-w-2 rounded-full border border-black/80 bg-[#b65ffc]"
        style={{ width: `${progress.percent}%` }}
      />
      <MarkerIcon
        width={20}
        height={17}
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-[22px] -translate-x-1/2 drop-shadow-[0_0_6px_rgba(255,204,0,0.7)]"
        style={{ left: `max(${progress.percent}%, 10px)` }}
      />
      {progress.flags.map((flag) => (
        <InterestFlag
          key={flag.date}
          date={flag.date}
          percent={flag.percent}
          open={activeFlag === flag.date}
          onToggle={() =>
            setActiveFlag((value) => (value === flag.date ? null : flag.date))
          }
          className="top-1.5 shadow-[0_4px_6px_rgba(0,0,0,0.18)]"
          iconSize={12}
        />
      ))}
    </div>
  );
}

function AccumulationDetailContent() {
  const [params] = useSearchParams();
  const id = params.get('id') ?? '';
  const { hasSession, customerCode, token } = useCustomerSession();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: ['asset-appendix-detail', customerCode, token, id],
    queryFn: ({ signal }) => fetchAssetAccumulationDetail(id, signal),
    enabled: hasSession && Boolean(id),
    retry: false,
  });
  const detail = detailQuery.data;
  const [action, setAction] = useState<AccumulationAction | null>(null);
  const extendType = detail?.EXTEND_TYPE ?? params.get('extendType');
  const extendName = detail?.EXTEND_TYPE_NAME ?? params.get('extendName') ?? '';
  const renewalKnown = extendType !== null && extendType !== undefined;
  const extended = Boolean(extendType && extendType !== 'KHONG_GIA_HAN');
  const note = detail?.NOTE?.trim();
  const [editing, setEditing] = useState<'NAME' | 'NOTE' | null>(null);
  const [text, setText] = useState('');
  const [renewing, setRenewing] = useState(false);
  const textMutation = useMutation({
    mutationFn: ({ type, value }: { type: 'NAME' | 'NOTE'; value: string }) =>
      updateAccumulationText(id, type, value),
    onSuccess: () => {
      setEditing(null);
      message.success('Chỉnh sửa thành công.');
      [
        'asset-appendix-detail',
        'asset-group-accumulations',
        'near-interest',
      ].forEach((key) => {
        void queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error: Error) => message.error(error.message),
  });
  const editText = (type: 'NAME' | 'NOTE') => {
    textMutation.reset();
    setText((type === 'NAME' ? detail?.NAME : detail?.NOTE) || '');
    setEditing(type);
  };
  const openRenewal = () => {
    if (!renewalKnown) {
      message.info(
        'Chưa có trạng thái gia hạn. Vui lòng mở khoản từ danh sách tài sản.',
      );
      return;
    }
    if (
      !extended &&
      (Number(detail?.EXTEND_FLAG) !== 1 ||
        !['TL_01', 'TL_02'].includes(detail?.PRODUCT_TYPE || ''))
    ) {
      message.info('Sản phẩm không cho phép gia hạn.');
      return;
    }
    setRenewing(true);
  };

  if (detail && action) {
    return (
      <AccumulationAmountForm
        mode={action}
        detail={detail}
        onBack={() => {
          setAction(null);
          void detailQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="min-h-full bg-white pb-8 text-[#060607]">
      <PageHeader
        title="Thông tin chi tiết"
        align="left"
        extra={
          detail && (
            <button
              type="button"
              aria-label="Làm mới"
              disabled={detailQuery.isFetching}
              onClick={() => void detailQuery.refetch()}
              className="grid size-8 shrink-0 place-items-center rounded-md disabled:opacity-60"
            >
              <RefreshIcon
                width={17.9167}
                height={17.9167}
                preserveAspectRatio="xMidYMid meet"
                className={detailQuery.isFetching ? 'animate-spin' : ''}
              />
            </button>
          )
        }
      />
      <Modal
        open={editing !== null}
        title={editing === 'NAME' ? 'Tên gói tích lũy' : 'Ghi chú'}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={textMutation.isPending}
        closable={!textMutation.isPending}
        maskClosable={!textMutation.isPending}
        onCancel={() => {
          if (!textMutation.isPending) setEditing(null);
        }}
        onOk={() => {
          if (editing && !textMutation.isPending)
            textMutation.mutate({ type: editing, value: text });
        }}
        okButtonProps={{ disabled: editing === 'NAME' && !text.trim() }}
      >
        <Input.TextArea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mb-3"
          maxLength={editing === 'NAME' ? 20 : 60}
          showCount
          disabled={textMutation.isPending}
        />
      </Modal>
      {detail && renewing && (
        <AccumulationRenewal
          detail={detail}
          extended={extended}
          extendName={extendName}
          onClose={() => setRenewing(false)}
        />
      )}
      {!id && (
        <p role="alert" className="px-5 py-3 text-sm text-red-600">
          Thiếu mã khoản tích luỹ.
        </p>
      )}
      <ProfileStatus
        loading={Boolean(id) && detailQuery.isFetching && !detail}
        error={detailQuery.error}
        retry={detailQuery.refetch}
      />

      {detail && (
        <>
          <section className="relative overflow-hidden bg-[#f7f7f7] bg-[linear-gradient(180deg,#f7f7f7_0%,#f3e8ff_100%)] px-5 pb-5 pt-5">
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="!mb-0 truncate text-lg font-semibold leading-7">
                    {detail.NAME?.trim() || 'Tích luỹ'}
                  </h2>
                  <button
                    type="button"
                    aria-label="Sửa tên khoản tích lũy"
                    onClick={() => editText('NAME')}
                  >
                    <EditIcon
                      width={16}
                      height={16}
                      aria-hidden
                      className="shrink-0"
                    />
                  </button>
                </div>
                <p className="!mb-0 mt-4 font-poppins text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng tiền gửi tích luỹ
                </p>
                <p className="!mb-0 mt-1 flex items-baseline gap-1 font-poppins">
                  <span className="text-xl leading-8">đ</span>
                  <span className="text-[32px] font-semibold leading-[52px]">
                    {formatHomeMoney(detail.CASH_VALUE, false, false)}
                  </span>
                </p>
              </div>
              <div className="relative size-20 shrink-0" aria-hidden>
                <img
                  src="/images/accumulation/coin-ring.svg"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute left-0 top-0"
                />
                <img
                  src="/images/accumulation/coin.png"
                  alt=""
                  width={80}
                  height={80}
                  className="absolute left-0 top-0 rounded-full"
                />
                <img
                  src="/images/accumulation/coin-inner.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="absolute left-2 top-2"
                />
                <img
                  src="/images/accumulation/coin-mark.svg"
                  alt=""
                  width={42}
                  height={18}
                  className="absolute left-[19px] top-[31px]"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-5 px-5 pt-5">
            <div className="grid grid-cols-3 items-stretch gap-2">
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-4 rounded-lg bg-[#f7f7f7] px-2 py-2.5"
                onClick={() =>
                  history.push(
                    detail.PRODUCT_CODE
                      ? `${
                          PAGE_URL.accountHistory
                        }?productCode=${encodeURIComponent(
                          detail.PRODUCT_CODE,
                        )}`
                      : PAGE_URL.accountHistory,
                  )
                }
              >
                <span className="grid size-8 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
                  <ClockIcon
                    width={20}
                    height={20}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </span>
                <span className="text-xs font-semibold leading-4 text-[rgba(10,10,11,0.78)]">
                  Lịch sử GD
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-4 rounded-lg bg-[#f7f7f7] px-2 py-2.5"
                onClick={() =>
                  Number(detail.LIQUID_TYPE) === 1
                    ? setAction('settle')
                    : message.info(
                        'Sản phẩm không cho phép tất toán trước hạn.',
                      )
                }
              >
                <span className="grid size-8 place-items-center rounded-full bg-[rgba(182,95,252,0.1)]">
                  <span className="grid size-5 rotate-90 place-items-center">
                    <ArrowUpIcon
                      width={14.5833}
                      height={9.58412}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </span>
                </span>
                <span className="text-xs font-semibold leading-4 text-[rgba(10,10,11,0.78)]">
                  Tất toán
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-end gap-5 rounded-lg bg-[#f7f7f7] px-2 py-2.5"
                onClick={openRenewal}
              >
                <span
                  role="img"
                  aria-label={
                    !renewalKnown
                      ? 'Chưa có trạng thái gia hạn'
                      : extended
                      ? 'Đang gia hạn'
                      : 'Không gia hạn'
                  }
                  className={`relative h-[22px] w-10 rounded-md ${
                    extended ? 'bg-[#b65ffc]' : 'bg-[#d2d5da]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-[18px] rounded bg-white shadow-[0_2px_4px_rgba(39,39,39,0.1)] ${
                      extended ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </span>
                <span className="text-xs font-semibold leading-4 text-[rgba(10,10,11,0.78)]">
                  Gia hạn
                </span>
              </button>
            </div>

            <section className="relative overflow-hidden rounded-2xl bg-[#0a0a0b] p-4">
              <div
                className="pointer-events-none absolute -left-16 -top-12 h-48 w-56 rounded-full bg-[#7e22ce]/55 blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-8 top-4 h-36 w-40 rounded-full bg-[#166534]/40 blur-2xl"
                aria-hidden
              />
              <div className="relative flex flex-col gap-2">
                <p className="!mb-0 font-poppins text-[10px] leading-4 text-white/85">
                  Mỗi bước đi đều để lại giá trị khác biệt 🤌
                </p>
                <InterestTrack item={detail} />
                <div className="flex items-start justify-between gap-3 text-xs leading-4">
                  <div>
                    <p className="!mb-1 font-poppins text-white/85">
                      Tổng gốc và LN
                    </p>
                    <p className="!mb-0 font-semibold text-white">
                      {formatHomeMoney(detail.SUM_CASH)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="!mb-1 font-poppins text-white/85">
                      Lợi nhuận hiện tại
                    </p>
                    <p className="!mb-0 font-semibold text-[#34c759]">
                      {formatHomeMoney(detail.SUM_FEE_VALUE)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-8 rounded-lg border border-[#e7e7e7] p-4">
              <div className="flex items-center justify-between">
                <h2 className="!mb-0 text-lg font-semibold leading-7">
                  Ghi chú
                </h2>
                <button
                  type="button"
                  aria-label="Sửa ghi chú"
                  onClick={() => editText('NOTE')}
                >
                  <EditIcon width={16} height={16} aria-hidden />
                </button>
              </div>
              <p
                className={`!mb-0 text-sm font-normal leading-5 ${
                  note ? 'text-[#060607]' : 'text-[rgba(10,10,11,0.36)]'
                }`}
              >
                {note || 'Nhập ghi chú'}
              </p>
            </section>

            <section className="flex flex-col gap-4 rounded-lg border border-[#e7e7e7] p-4">
              {detail.STATUS_LOAN_APPENDIX === 'DANG_UNG_TRUOC' && (
                <p className="text-right text-sm text-purple-600">
                  Đang ứng trước
                </p>
              )}
              {extended && (
                <div className="flex gap-4">
                  <DetailField label="Gói gia hạn">
                    {extendName || '—'}
                  </DetailField>
                  <DetailField label="Ngày gia hạn">
                    {detail.EXPIRE_DATE || '—'}
                  </DetailField>
                </div>
              )}
              <div className="flex gap-4">
                <DetailField label="Kỳ hạn">{detail.TERM || '—'}</DetailField>
                <DetailField label="Lợi nhuận trước thuế">
                  <RateValue value={detail.FEE_RATE} />
                </DetailField>
              </div>
              <div className="flex gap-4">
                <DetailField label="Lợi nhuận dự kiến">
                  <span className="text-[#34c759]">
                    {formatHomeMoney(detail.FEE_VALUE)}
                  </span>
                </DetailField>
                <DetailField label="Ngày thanh toán lợi nhuận">
                  {detail.DAY_PAY || '—'}
                </DetailField>
              </div>
              <div className="flex gap-4">
                <DetailField label="Ngày hợp tác">
                  {detail.OPEN_DATE || '—'}
                </DetailField>
                <DetailField label="Ngày tất toán">
                  {detail.EXPIRE_DATE || '—'}
                </DetailField>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default function AccumulationDetail() {
  const [params] = useSearchParams();
  return <AccumulationDetailContent key={params.get('id') || ''} />;
}
