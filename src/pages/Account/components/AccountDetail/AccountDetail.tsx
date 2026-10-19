import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerProfile from '@/hooks/useCustomerProfile';
import { BackIcon, CameraIcon, EditIcon } from '@/icons';
import { history } from '@umijs/max';
import CustomerAvatar from '../CustomerAvatar';
import ProfileStatus from '../ProfileStatus';

function Field({
  label,
  value,
  tone = 'strong',
}: {
  label: string;
  value?: string;
  tone?: 'strong' | 'muted';
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-xs leading-4 !text-[rgba(10,10,11,0.36)] !mb-0">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold leading-5 !mb-0 ${
          tone === 'muted'
            ? '!text-[rgba(10,10,11,0.36)]'
            : '!text-[rgba(10,10,11,0.78)]'
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}

export default function AccountDetail() {
  const { profile, isPending, error, refetch, hasSession } =
    useCustomerProfile();
  return (
    <div className="min-h-full bg-white pb-8 text-[#060607]">
      <header className="flex h-[60px] items-center px-5">
        <button
          type="button"
          aria-label="Quay lại"
          onClick={() => history.replace(PAGE_URL.account)}
          className="grid size-6 place-items-center"
        >
          <BackIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
      </header>

      <div className="relative mx-auto mt-5 size-32">
        <div className="grid size-full place-items-center rounded-full bg-[#b65ffc] text-[60px] font-semibold leading-none text-white">
          <CustomerAvatar profile={profile} size={128} />
        </div>
        <button
          type="button"
          aria-label="Đổi ảnh đại diện"
          className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-[#f7f7f7]"
        >
          <CameraIcon
            width={17.92}
            height={17.92}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
      </div>

      <div className="mt-3 text-center">
        <h1 className="text-lg font-semibold leading-7 !mb-0">
          {profile?.CUSTOMER_NAME || '—'}
        </h1>
        <button
          type="button"
          className="mt-0.5 text-sm leading-5 !text-[#b65ffc] underline"
        >
          {profile?.NICK_NAME?.trim() || 'Đặt Nickname'}
        </button>
      </div>

      <div className="mt-[30px] flex flex-col gap-5 px-5">
        <ProfileStatus
          loading={hasSession && isPending}
          error={error}
          retry={refetch}
        />
        <section className="rounded-lg border border-[#e7e7e7] p-4">
          <h2 className="text-lg font-semibold leading-7 !mb-0">
            Thông tin tài khoản
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            <Field
              label="Số tài khoản"
              value={profile?.CUST_MOBILE}
              tone="muted"
            />
            <Field label="CMND/CCCD" value={profile?.CARD_ID} tone="muted" />
            <Field
              label="Họ và tên"
              value={profile?.CUSTOMER_NAME}
              tone="muted"
            />
            <div className="flex gap-4">
              <Field
                label="Ngày sinh"
                value={profile?.BIRTH_DAY}
                tone="muted"
              />
              <Field
                label="Giới tính"
                value={profile?.CUST_GENDER}
                tone="muted"
              />
            </div>
            <Field
              label="Nơi cấp"
              value={profile?.ISSUE_PLACE_NAME}
              tone="muted"
            />
            <div className="flex gap-4">
              <Field
                label="Ngày cấp"
                value={profile?.ISSUE_DATE}
                tone="muted"
              />
              <Field
                label="Ngày hết hạn"
                value={profile?.EXPIRE_DATE}
                tone="muted"
              />
            </div>
            <Field
              label="Địa chỉ thường trú"
              value={profile?.RESEDENCE_ADDRESS}
              tone="muted"
            />
          </div>
        </section>

        <section className="rounded-lg border border-[#e7e7e7] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-7 !mb-0">
              Thông tin liên hệ
            </h2>
            <button type="button" aria-label="Sửa thông tin liên hệ">
              <EditIcon
                width={16.123}
                height={16.126}
                preserveAspectRatio="xMidYMid meet"
              />
            </button>
          </div>
          <div className="mt-8 flex flex-col gap-4">
            <Field label="Số điện thoại" value={profile?.CUST_MOBILE} />
            <Field label="Email" value={profile?.CUST_EMAIL} />
            <Field label="Địa chỉ liên hệ" value={profile?.CUST_ADDRESS} />
          </div>
        </section>

        {/* <button
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f7f7f7] text-sm font-semibold leading-5 !text-[rgba(10,10,11,0.78)]"
        >
          <CancelIcon
            width={21.5}
            height={21.5}
            preserveAspectRatio="xMidYMid meet"
          />
          Vô hiệu tài khoản
        </button> */}
      </div>
    </div>
  );
}
