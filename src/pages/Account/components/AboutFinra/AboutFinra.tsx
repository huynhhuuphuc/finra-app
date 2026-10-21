import PageHeader from '@/components/PageHeader';
import RemoteImage from '@/components/RemoteImage';
import { FINRA_CONTACT } from '@/constants/contact';
import { PAGE_URL } from '@/constants/pathUrl';
import { goBack } from '@/utils/navigation';

export default function AboutFinra() {
  return (
    <div className="min-h-full bg-white pb-8 text-[#060607]">
      <PageHeader
        title="Thông tin ứng dụng"
        backVariant="boxed"
        onBack={() => goBack(PAGE_URL.account)}
      />

      <article className="px-6 pt-8 text-sm leading-6">
        <h2 className="!mb-3 text-xl font-bold uppercase leading-8">
          Về chúng tôi
        </h2>
        <p className="!mb-3">
          Công Ty Cổ Phần Công Nghệ Tài Chính Finra Capital hoạt động trong lĩnh
          vực fintech với sản phẩm là ứng dụng đầu tư tài chính Finra. Bằng khát
          khao gia tăng giá trị thực cho khách hàng, Finra cung cấp những sản
          phẩm đầu tư tài chính an toàn và đa dạng, tiện ích thông minh và sáng
          tạo trên nền tảng công nghệ hiện đại hàng đầu.
        </p>
        <p className="!mb-3">
          Khởi nguồn từ ứng dụng đầu tư tài chính, Finra mong muốn giúp bạn xây
          dựng tư duy tài chính thông minh, đồng hành cùng bạn trên hành trình
          đầu tư hiệu quả để từng bước kiến tạo cuộc sống “giá trị” vững bền.
        </p>

        <RemoteImage
          src={FINRA_CONTACT.officeImage}
          alt="Văn phòng FINRA"
          className="aspect-[343/228] w-full"
        />

        <dl className="!mb-0 !mt-3">
          <div>
            <dt className="inline !font-normal">Hotline: </dt>
            <dd className="!mb-0 inline font-semibold">
              <a href={FINRA_CONTACT.hotlineTel} className="!text-[#060607]">
                {FINRA_CONTACT.hotline}
              </a>
            </dd>
          </div>
          <div>
            <dt className="inline !font-normal">Website: </dt>
            <dd className="!mb-0 inline font-semibold">
              <a
                href={FINRA_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-[#060607]"
              >
                {FINRA_CONTACT.website}
              </a>
            </dd>
          </div>
          <div>
            <dt className="!font-normal">Địa chỉ:</dt>
            <dd className="!mb-0 font-semibold">{FINRA_CONTACT.address}</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}
