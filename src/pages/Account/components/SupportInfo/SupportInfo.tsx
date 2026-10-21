import PageHeader from '@/components/PageHeader';
import RemoteImage from '@/components/RemoteImage';
import { FINRA_CONTACT } from '@/constants/contact';
import { PAGE_URL } from '@/constants/pathUrl';
import { goBack } from '@/utils/navigation';

export default function SupportInfo() {
  return (
    <div className="min-h-full bg-white pb-8 text-[rgba(10,10,11,0.78)]">
      <PageHeader
        title="Thông tin hỗ trợ"
        backVariant="boxed"
        onBack={() => goBack(PAGE_URL.account)}
      />

      <div className="px-5 pt-5">
        <RemoteImage
          src={FINRA_CONTACT.officeImage}
          alt="Văn phòng FINRA"
          priority
          className="aspect-[343/159] w-full rounded-2xl"
        />

        <dl className="!mb-0 !mt-5 flex flex-col gap-1 text-sm leading-6">
          <div>
            <dt className="inline !font-semibold">Hotline: </dt>
            <dd className="!mb-0 inline">
              <a
                href={FINRA_CONTACT.hotlineTel}
                className="!text-[rgba(10,10,11,0.78)]"
              >
                {FINRA_CONTACT.hotline}
              </a>
            </dd>
          </div>
          <div>
            <dt className="inline !font-semibold">Website: </dt>
            <dd className="!mb-0 inline">
              <a
                href={FINRA_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-[#3b6fe0]"
              >
                {FINRA_CONTACT.website}
              </a>
            </dd>
          </div>
          <div>
            <dt className="inline !font-semibold">Địa chỉ: </dt>
            <dd className="!mb-0 inline">{FINRA_CONTACT.address}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
