import type { HomeCategory } from '@/api/core/home';
import { Carousel, Modal } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { useRef, useState } from 'react';

export default function HomeCategories({ items }: { items: HomeCategory[] }) {
  const [selected, setSelected] = useState<HomeCategory | null>(null);
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);
  const categories = items.filter((item) => item.CODE !== 'MI_UPS');
  return (
    <>
      {categories.length ? (
        <Carousel
          ref={carouselRef}
          arrows
          dots={false}
          infinite={categories.length > 1}
          autoplay={categories.length > 1}
          autoplaySpeed={4000}
          beforeChange={(_, next) => setCurrent(next)}
          className="mt-5"
        >
          {categories.map((item, index) => (
            <div key={item.CODE || index}>
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => setSelected(item)}
                aria-label={item.NAME || 'Thông tin sản phẩm'}
              >
                <img
                  src={item.URL_BANNER || '/images/home/product-card.png'}
                  alt={item.NAME || 'Sản phẩm FINRA'}
                  className="block aspect-[2/1] w-full rounded-lg object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/images/home/product-card.png';
                  }}
                />
              </button>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="text-sm text-gray-500">Chưa có sản phẩm.</p>
      )}
      {categories.length > 1 && (
        <div className="mt-3 flex justify-center gap-1">
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
