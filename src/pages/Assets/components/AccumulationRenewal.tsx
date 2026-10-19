import type { AssetAccumulationDetail } from '@/api/core/assetDetails';
import { formatHomeMoney } from '@/api/core/home';
import { fetchExtendOptions } from '@/api/core/products';
import useCustomerSession from '@/hooks/useCustomerSession';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { useQuery } from '@tanstack/react-query';
import { Alert, Modal, Select } from 'antd';
import { useState } from 'react';

export default function AccumulationRenewal({
  detail,
  extended,
  extendName,
  onClose,
}: {
  detail: AssetAccumulationDetail;
  extended: boolean;
  extendName: string;
  onClose: () => void;
}) {
  const { customerCode, token, hasSession } = useCustomerSession();
  const [selected, setSelected] = useState<string>();
  const query = useQuery({
    queryKey: [
      'appendix-extend-options',
      customerCode,
      token,
      detail.PRODUCT_TYPE,
    ],
    queryFn: ({ signal }) => fetchExtendOptions(detail.PRODUCT_TYPE!, signal),
    enabled: hasSession && Boolean(detail.PRODUCT_TYPE) && !extended,
    retry: false,
  });
  const options = query.data?.filter(
    (item) => item.EXTEND_TYPE !== 'KHONG_GIA_HAN',
  );
  return (
    <Modal
      open
      title={extended ? 'Hủy gia hạn' : 'Chọn gói gia hạn'}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <ProfileStatus
        loading={query.isFetching}
        error={query.error}
        retry={query.refetch}
      />
      {extended ? (
        <p>Gói hiện tại: {extendName || '—'}</p>
      ) : (
        <Select
          className="w-full"
          placeholder="Chọn gói gia hạn"
          value={selected}
          onChange={setSelected}
          loading={query.isFetching}
          options={options?.map((item) => ({
            value: item.EXTEND_TYPE,
            label: item.EXTEND_NAME,
          }))}
        />
      )}
      {!extended && query.isSuccess && !options?.length && (
        <p>Không có gói gia hạn phù hợp.</p>
      )}
      <p className="mt-4">
        Số tiền:{' '}
        {formatHomeMoney(
          !extended && !selected
            ? undefined
            : selected === 'LAI_NHAP_GOC'
            ? detail.SUM_CASH
            : detail.CASH_VALUE,
        )}
      </p>
      <p>Sản phẩm: {detail.WEB_PRODUCT_TYPE_NAME || detail.NAME || '—'}</p>
      <p>Ngày gia hạn: {detail.EXPIRE_DATE || '—'}</p>
      {/* TODO(OTP): authenticate extendContract (otpType=17), then call updateAccumulationRenewal
        with KHONG_GIA_HAN for cancellation or the selected EXTEND_TYPE. Invalidate detail and list caches. */}
      <button
        type="button"
        disabled
        className="my-3 w-full rounded-lg bg-gray-200 p-3 text-gray-500"
      >
        Xác nhận (chờ OTP)
      </button>
      <Alert
        type="info"
        showIcon
        description="Gia hạn và hủy gia hạn cần xác thực giao dịch. Chưa thể xác nhận trên web khi dịch vụ xác thực chưa được kết nối."
      />
    </Modal>
  );
}
