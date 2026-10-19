import {
  canOpenMoreAccumulations,
  fetchAssetAccumulationDetail,
  fetchAssetAccumulations,
  fetchAssetGroupSummary,
} from '@/api/core/assetDetails';
import { parseAmount, type AssetProduct } from '@/api/core/assets';
import type { NearInterest } from '@/api/core/home';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerSession from '@/hooks/useCustomerSession';
import { BackIcon, EyeIcon, PlusSignIcon } from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import UpcomingInterest from '@/pages/Home/components/UpcomingInterest';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { history, useSearchParams } from '@umijs/max';
import { Modal } from 'antd';
import { useState } from 'react';

const formatMoney = (value: unknown, hidden: boolean) => {
  if (hidden) return '••••••';
  const amount = parseAmount(value);
  if (amount === null) return '—';
  return new Intl.NumberFormat('vi-VN').format(Math.trunc(amount));
};

export default function AssetProductDetail() {
  const [params] = useSearchParams();
  const type = params.get('type') ?? '';
  const [hidden, setHidden] = useState(false);
  const { token, customerCode, hasSession } = useCustomerSession();
  const queryClient = useQueryClient();
  const [selection, setSelection] = useState<{
    item: NearInterest;
    type: string;
    customerCode: string;
    token: string;
  } | null>(null);
  const selected =
    selection?.type === type &&
    selection.customerCode === customerCode &&
    selection.token === token
      ? selection.item
      : null;
  const cachedProduct = queryClient
    .getQueryData<AssetProduct[]>(['asset-groups', customerCode, token])
    ?.find((item) => item.WEB_PRODUCT_TYPE === type);
  const title =
    params.get('name') || cachedProduct?.PRODUCT_NAME || 'Chi tiết tài sản';
  const productType =
    params.get('productType') || cachedProduct?.PRODUCT_TYPE || '';
  const enabled = hasSession && Boolean(type) && type !== 'MI_UPS';
  const summaryQuery = useQuery({
    queryKey: ['asset-group-summary', customerCode, type, token],
    queryFn: ({ signal }) => fetchAssetGroupSummary(customerCode, type, signal),
    enabled,
    refetchOnMount: 'always',
    retry: false,
  });
  const accumulationsQuery = useQuery({
    queryKey: ['asset-group-accumulations', customerCode, type, token],
    queryFn: ({ signal }) =>
      fetchAssetAccumulations(customerCode, type, signal),
    enabled,
    refetchOnMount: 'always',
    retry: false,
  });
  const selectedId = selected?.PK_MM_APPENDIX;
  const detailQuery = useQuery({
    queryKey: ['asset-appendix-detail', customerCode, type, selectedId, token],
    queryFn: ({ signal }) => fetchAssetAccumulationDetail(selectedId!, signal),
    enabled: enabled && Boolean(selectedId),
    retry: false,
  });
  const summary = summaryQuery.data;
  const detail = detailQuery.data;
  const canOpenMore =
    accumulationsQuery.isSuccess &&
    !accumulationsQuery.isError &&
    canOpenMoreAccumulations(accumulationsQuery.data);

  return (
    <div className="min-h-full bg-white px-5 pb-8 text-[#060607]">
      <header className="flex h-[60px] items-center">
        <button
          type="button"
          aria-label="Quay lại"
          className="flex size-6 items-center justify-center"
          onClick={() => history.push(PAGE_URL.assets)}
        >
          <BackIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
        <h1 className="!mb-0 ml-4 flex-1 text-lg font-semibold leading-7">
          {title}
        </h1>
        <button
          type="button"
          aria-label="Làm mới chi tiết tài sản"
          disabled={
            !enabled || summaryQuery.isFetching || accumulationsQuery.isFetching
          }
          onClick={() => {
            void summaryQuery.refetch();
            void accumulationsQuery.refetch();
          }}
          className="ml-3 text-xl disabled:opacity-40"
        >
          ↻
        </button>
      </header>

      <ProfileStatus
        loading={enabled && summaryQuery.isFetching}
        error={summaryQuery.error}
        retry={summaryQuery.refetch}
      />

      {!type && (
        <p role="alert" className="py-3 text-sm text-red-600">
          Thiếu mã nhóm sản phẩm. Vui lòng chọn lại từ màn Tài sản.
        </p>
      )}
      {type === 'MI_UPS' && (
        <p className="py-3 text-sm">Chưa hỗ trợ tài sản MI.</p>
      )}
      {enabled && (
        <>
          <section className="rounded-xl bg-[#f7f7f7] p-3 shadow-[2px_2px_16px_rgba(0,0,0,0.1)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="!mb-0 flex items-center gap-1 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng tiền gửi tích luỹ
                  <button
                    type="button"
                    aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
                    className="grid size-4 place-items-center border-0 bg-transparent p-0"
                    onClick={() => setHidden((value) => !value)}
                  >
                    <EyeIcon
                      width={14.33}
                      height={10.33}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </button>
                </p>
                <p className="!mb-0 mt-1 flex items-baseline gap-1 font-semibold">
                  <span className="text-xl font-normal leading-8">đ</span>
                  <span className="text-[32px] leading-[52px]">
                    {formatMoney(summary?.SUM_CASH, hidden)}
                  </span>
                </p>
              </div>
              {canOpenMore && (
                <button
                  type="button"
                  className="flex h-[31px] items-center gap-2 rounded-[10px] bg-[#b65ffc] px-3 text-xs !text-white"
                  onClick={() =>
                    history.push(
                      `${PAGE_URL.products}?type=${encodeURIComponent(
                        type,
                      )}&productType=${encodeURIComponent(productType)}`,
                    )
                  }
                >
                  <PlusSignIcon
                    width={12}
                    height={12}
                    fill0="#ffffff"
                    preserveAspectRatio="xMidYMid meet"
                  />
                  Mở thêm
                </button>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <p className="!mb-0 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Tổng lợi nhuận dự kiến
                </p>
                <p className="!mb-0 text-base font-semibold leading-6 text-[#34c759]">
                  {formatMoney(summary?.SUM_FEE_VALUE, hidden)}đ
                </p>
              </div>
              <div className="text-right">
                <p className="!mb-0 text-xs leading-4 text-[rgba(10,10,11,0.55)]">
                  Lợi nhuận hôm nay
                </p>
                <p className="!mb-0 text-base font-semibold leading-6 text-[#34c759]">
                  {formatMoney(summary?.FEE_VALUE, hidden)}đ
                </p>
              </div>
            </div>
          </section>

          <ProfileStatus
            loading={enabled && accumulationsQuery.isFetching}
            error={accumulationsQuery.error}
            retry={accumulationsQuery.refetch}
          />
          {accumulationsQuery.isSuccess && (
            <section
              className="mt-5 rounded-lg border border-[#e7e7e7] p-4"
              aria-label="Danh sách khoản tích luỹ"
            >
              {accumulationsQuery.data.length ? (
                <UpcomingInterest
                  items={accumulationsQuery.data}
                  hidden={hidden}
                  onSelect={(item) =>
                    setSelection({ item, type, customerCode, token })
                  }
                />
              ) : (
                <p className="text-sm text-gray-500">
                  Chưa có khoản tích luỹ trong nhóm này.
                </p>
              )}
            </section>
          )}
        </>
      )}
      <Modal
        open={Boolean(selectedId)}
        title={detail?.NAME || selected?.NAME || 'Chi tiết khoản tích luỹ'}
        footer={null}
        onCancel={() => setSelection(null)}
      >
        <ProfileStatus
          loading={detailQuery.isFetching}
          error={detailQuery.error}
          retry={detailQuery.refetch}
        />
        {detailQuery.isSuccess && detail && (
          <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm">
            <dt>Mã phụ lục</dt>
            <dd className="break-all">{detail.APPENDIX_CODE || selectedId}</dd>
            <dt>Số tiền tích luỹ</dt>
            <dd>{formatMoney(detail.CASH_VALUE, hidden)}đ</dd>
            <dt>Tổng giá trị</dt>
            <dd>{formatMoney(detail.SUM_CASH, hidden)}đ</dd>
            <dt>Lợi nhuận dự kiến</dt>
            <dd>{formatMoney(detail.SUM_FEE_VALUE, hidden)}đ</dd>
            <dt>Lợi nhuận hôm nay</dt>
            <dd>{formatMoney(detail.FEE_VALUE, hidden)}đ</dd>
            <dt>Ngày mở</dt>
            <dd>{detail.OPEN_DATE || '—'}</dd>
            <dt>Ngày tất toán</dt>
            <dd>{detail.EXPIRE_DATE || '—'}</dd>
            <dt>Gia hạn</dt>
            <dd>
              {detail.EXTEND_TYPE_NAME || selected?.EXTEND_TYPE_NAME || '—'}
            </dd>
            <dt>Ghi chú</dt>
            <dd className="whitespace-pre-wrap break-words">
              {detail.NOTE || detail.CONTENT || '—'}
            </dd>
          </dl>
        )}
      </Modal>
    </div>
  );
}
