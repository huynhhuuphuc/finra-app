import {
  fetchLiquidPreview,
  type AssetAccumulationDetail,
  type LiquidPreview,
} from '@/api/core/assetDetails';
import { parseAmount } from '@/api/core/assets';
import { formatHomeMoney } from '@/api/core/home';
import useCustomerProfile from '@/hooks/useCustomerProfile';
import { ArrowUpIcon, BackIcon } from '@/icons';
import CustomerAvatar from '@/pages/Account/components/CustomerAvatar';
import { useMutation } from '@tanstack/react-query';
import { App, ConfigProvider, Segmented } from 'antd';
import { useState } from 'react';
import AccumulationConfirmModal from './AccumulationConfirmModal';

export type AccumulationAction = 'settle' | 'extend';

const COPY: Record<
  AccumulationAction,
  {
    doing: string;
    full: string;
    empty: string;
    contract: string;
    to?: string;
  }
> = {
  settle: {
    doing: 'Bạn đang tất toán',
    full: 'Tất toán toàn bộ',
    empty: 'Vui lòng nhập số tiền muốn tất toán',
    contract: 'Tất toán từ HĐ',
    to: 'TK thanh toán',
  },
  extend: {
    doing: 'Bạn đang gia hạn',
    full: 'Gia hạn toàn bộ',
    empty: 'Vui lòng nhập số tiền muốn gia hạn',
    contract: 'Gia hạn từ HĐ',
  },
};

const formatDigits = (digits: string) =>
  digits ? new Intl.NumberFormat('vi-VN').format(Number(digits)) : '';

export default function AccumulationAmountForm({
  mode,
  detail,
  onBack,
}: {
  mode: AccumulationAction;
  detail: AssetAccumulationDetail;
  onBack: () => void;
}) {
  const copy = COPY[mode];
  const { profile } = useCustomerProfile();
  const [tab, setTab] = useState<'partial' | 'full'>('partial');
  const [digits, setDigits] = useState('');
  const balance = parseAmount(detail.CASH_VALUE);
  const fullDigits =
    balance === null ? '' : String(Math.max(0, Math.trunc(balance)));
  const shown = tab === 'full' ? fullDigits : digits;
  const name = detail.NAME?.trim() || 'Tích luỹ';
  const { message } = App.useApp();
  const [confirming, setConfirming] = useState(false);
  const amount = Number(shown) || 0;
  const [preview, setPreview] = useState<LiquidPreview>();
  const previewMutation = useMutation({
    mutationFn: () => {
      const max = parseAmount(detail.CAPITAL_FLEX_MAX) || balance;
      if (
        balance === null ||
        !Number.isSafeInteger(amount) ||
        amount <= 0 ||
        amount > balance ||
        (tab === 'partial' && max !== null && amount > max)
      ) {
        throw new Error(
          'Số tiền tất toán vượt giá trị được phép hoặc không hợp lệ.',
        );
      }
      return fetchLiquidPreview(
        detail.PK_MM_APPENDIX,
        amount,
        tab === 'full' || amount === max ? 'TOAN_BO' : 'MOT_PHAN',
      );
    },
    onSuccess: (data) => {
      setPreview(data);
      setConfirming(true);
    },
    onError: (error: Error) => message.error(error.message),
  });
  const profit = preview?.INTEREST_CASH;
  const received = preview?.RAW_CASH;
  const productName =
    preview?.WEB_PRODUCT_TYPE_NAME ||
    detail.WEB_PRODUCT_TYPE_NAME ||
    detail.PRODUCT_NAME ||
    '—';

  return (
    <div className="flex h-full min-h-full flex-col bg-[#171b6d] text-white">
      <header className="flex h-[60px] shrink-0 items-center px-5">
        <button
          type="button"
          aria-label="Quay lại"
          className="grid size-6 place-items-center"
          onClick={onBack}
        >
          <BackIcon
            width={24}
            height={24}
            stroke0="#ffffff"
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-between px-5 pb-4 pt-5">
        <div className="flex flex-col gap-4">
          <section className="flex h-[260px] flex-col rounded-xl bg-white px-5 pb-4 pt-6">
            <div className="mx-auto w-[270px]">
              <ConfigProvider
                theme={{
                  token: {
                    fontSize: 12,
                    borderRadius: 6,
                    borderRadiusSM: 6,
                    controlHeight: 36,
                    boxShadowTertiary: 'none',
                    motionDurationSlow: '0.3s',
                  },
                  components: {
                    Segmented: {
                      trackBg: '#e7e7e7',
                      trackPadding: 2,
                      itemColor: '#8e8e8f',
                      itemHoverColor: '#060607',
                      itemHoverBg: 'transparent',
                      itemSelectedBg: '#ffffff',
                      itemSelectedColor: '#060607',
                      itemActiveBg: 'transparent',
                    },
                  },
                }}
              >
                <Segmented
                  block
                  value={tab}
                  disabled={previewMutation.isPending}
                  onChange={(value) => {
                    setTab(value as 'partial' | 'full');
                    setPreview(undefined);
                  }}
                  options={[
                    { label: 'Số tiền linh hoạt', value: 'partial' },
                    { label: copy.full, value: 'full' },
                  ]}
                  className="[&_.ant-segmented-item-label]:font-normal [&_.ant-segmented-item-selected_.ant-segmented-item-label]:font-semibold"
                />
              </ConfigProvider>
            </div>

            {tab === 'full' ? (
              <div className="flex flex-1 items-center">
                <div className="flex w-full items-start justify-between gap-3 rounded-lg border border-[#e7e7e7] p-4">
                  <div>
                    <p className="!mb-1 font-poppins text-xs leading-4 text-[rgba(10,10,11,0.78)]">
                      Số tiền
                    </p>
                    <p className="!mb-0 text-base font-semibold leading-6 text-[#060607]">
                      {formatHomeMoney(detail.CASH_VALUE)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="!mb-1 font-poppins text-xs leading-4 text-[rgba(10,10,11,0.78)]">
                      Lợi nhuận tới hôm nay
                    </p>
                    <p className="!mb-0 text-base font-semibold leading-6 text-[#34c759]">
                      {formatHomeMoney(preview?.INTEREST_CASH)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex flex-1 items-center">
                <span className="sr-only">Số tiền</span>
                <input
                  disabled={previewMutation.isPending}
                  inputMode="numeric"
                  autoFocus
                  value={formatDigits(shown)}
                  placeholder="Nhập số tiền"
                  onChange={(event) => {
                    const next = event.target.value.replace(/\D/g, '');
                    setPreview(undefined);
                    setDigits(next.replace(/^0+(?=\d)/, ''));
                  }}
                  className="w-full border-0 bg-transparent text-center !font-poppins !text-2xl !leading-9 !text-[#0a0a0b] caret-[#0a0a0b] outline-none placeholder:text-[rgba(10,10,11,0.36)] placeholder:opacity-40"
                />
              </label>
            )}

            <div className="flex items-center">
              <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-[#f8efff]">
                <span className="grid size-4 rotate-90 place-items-center">
                  <ArrowUpIcon
                    width={14.5833}
                    height={9.58412}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </span>
              </span>
              <span className="-ml-1 shrink-0">
                <CustomerAvatar profile={profile} size={28} />
              </span>
              <p className="!mb-0 ml-2 min-w-0 truncate font-poppins text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                {copy.doing}{' '}
                <span className="font-semibold text-[#b65ffc]">{name}</span>
              </p>
            </div>
          </section>

          <div className="flex items-start justify-between gap-3 text-xs leading-4">
            <div>
              <p className="!mb-1 font-poppins">Số tiền gửi tích luỹ:</p>
              <p className="!mb-0 font-semibold">
                {formatHomeMoney(detail.CASH_VALUE)}
              </p>
            </div>
            <div className="text-right">
              <p className="!mb-1 font-poppins">Phí</p>
              <p className="!mb-0 font-semibold text-[#35fc67]">
                Theo kết quả tất toán
              </p>
            </div>
          </div>
        </div>

        {amount > 0 ? (
          <button
            type="button"
            disabled={previewMutation.isPending}
            onClick={() => {
              if (!previewMutation.isPending) previewMutation.mutate();
            }}
            className="mt-4 h-12 w-full shrink-0 rounded-xl bg-[#b65ffc] text-sm font-semibold !text-white"
          >
            Thực hiện
          </button>
        ) : (
          <div
            role="status"
            className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-[rgba(255,59,48,0.24)]"
          >
            <img
              src="/images/accumulation/danger.svg"
              alt=""
              width={20}
              height={18}
            />
            <p className="!mb-0 text-sm font-semibold leading-5 text-[#ff3b30]">
              {copy.empty}
            </p>
          </div>
        )}
      </div>

      <AccumulationConfirmModal
        open={confirming}
        amount={amount}
        from={name}
        to={copy.to}
        contractLabel={copy.contract}
        productName={productName}
        profit={profit}
        received={received}
        blockedReason="Bước xác thực OTP sẽ được bổ sung trước khi gửi lệnh tất toán."
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          // TODO(OTP): authenticate settlement (otpType=8), then call settleAccumulation.
          // Revalidate the preview inputs and refresh detail, asset summaries and transactions after success.
          message.info('Chưa kết nối xác thực OTP giao dịch.');
        }}
      />
    </div>
  );
}
