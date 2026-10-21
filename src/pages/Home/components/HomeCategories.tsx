import type { HomeCategory } from '@/api/core/home';
import RemoteImage from '@/components/RemoteImage';
import { PAGE_URL } from '@/constants/pathUrl';
import { history } from '@umijs/max';
import { Carousel, Modal } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { useRef, useState } from 'react';

function ProductBanner({
  item,
  priority,
}: {
  item: HomeCategory;
  priority: boolean;
}) {
  return (
    <RemoteImage
      src={item.URL_BANNER}
      alt={item.NAME || 'Sản phẩm FINRA'}
      priority={priority}
      className="min-h-0 w-full flex-1 rounded-xl"
      fallback={
        <div className="flex h-full items-center justify-center text-xs text-[#5d01a6]">
          Chưa có ảnh sản phẩm
        </div>
      }
    />
  );
}

export default function HomeCategories({ items }: { items: HomeCategory[] }) {
  const [selected, setSelected] = useState<HomeCategory | null>(null);
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);
  const categories = items.filter((item) => item.CODE !== 'MI_UPS');
  // const handleCooperate = (item: HomeCategory) => {
  //   history.push(
  //     `${PAGE_URL.productDetail}?code=${encodeURIComponent(
  //       item.CODE,
  //     )}&name=${encodeURIComponent(item.NAME || '')}`,
  //   );
  // };

  const handleCooperate = () => history.push(PAGE_URL.developing);
  return (
    <>
      {categories.length ? (
        <Carousel
          ref={carouselRef}
          arrows={false}
          draggable
          swipe
          swipeToSlide
          touchMove
          cssEase="cubic-bezier(0.4, 0, 0.2, 1)"
          dots={false}
          infinite={categories.length > 1}
          autoplay={categories.length > 1}
          autoplaySpeed={4000}
          beforeChange={(_, next) => setCurrent(next)}
          className="-mx-5 touch-pan-y select-none"
        >
          {categories.map((item, index) => (
            <div key={item.CODE || index}>
              <div className="aspect-[390/271] px-5 pb-4 pt-5">
                <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white px-1 pt-1 pb-2 shadow-[0_0_16px_rgba(0,0,0,0.08)]">
                  {/* Banner đầu tiên là ảnh lớn nhất lúc mở Home: tải ngay */}
                  <button
                    type="button"
                    onClick={handleCooperate}
                    aria-label={`Xem ${item.NAME || 'sản phẩm FINRA'}`}
                    className="flex min-h-0 w-full flex-1 border-0 bg-transparent p-0"
                  >
                    <ProductBanner
                      key={item.URL_BANNER}
                      item={item}
                      priority={index === 0}
                    />
                  </button>
                  <div className="mt-4 flex h-[45px] shrink-0 items-center justify-between gap-3 px-3">
                    <div className="min-w-0 pb-2">
                      <p
                        className="!mb-0 truncate text-base font-semibold leading-6 text-[#0a0a0b]"
                        title={item.NAME}
                      >
                        {item.NAME || 'Sản phẩm FINRA'}
                      </p>
                      <p
                        className="!mb-0 truncate bg-gradient-to-br from-[#ff5e5e] to-[#7c4dff] bg-clip-text text-[10px] leading-4 text-transparent"
                        title={item.DESCRIPTION}
                      >
                        {item.DESCRIPTION}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCooperate}
                      aria-label={`Hợp tác ${item.NAME || 'cùng FINRA'}`}
                      className="isolate order-1 mx-auto flex h-8 w-[100px] flex-none flex-row items-center justify-between rounded-[10px] border-0 bg-[#b65ffc] px-1 py-0 text-xs leading-4 text-white"
                    >
                      <span className="w-full text-center text-white text-xs font-semibold">
                        Hợp tác
                      </span>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="text-sm text-gray-500">Chưa có sản phẩm.</p>
      )}
      {categories.length > 0 && (
        <div className="flex justify-center gap-1">
          {categories.map((item, index) => (
            <button
              key={item.CODE || index}
              type="button"
              aria-label={`Xem sản phẩm ${index + 1}`}
              aria-current={index === current}
              onClick={() => carouselRef.current?.goTo(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-6 bg-[rgba(10,10,11,0.78)]'
                  : 'w-4 bg-[#e7e7e7]'
              }`}
            />
          ))}
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        title={selected?.NAME || 'Thông tin sản phẩm'}
        footer={null}
        onCancel={() => setSelected(null)}
      >
        <p className="whitespace-pre-wrap">
          {selected?.DESCRIPTION || 'Chưa có mô tả sản phẩm.'}
        </p>
      </Modal>
    </>
  );
}
