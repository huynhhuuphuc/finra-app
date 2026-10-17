import type { HomeCategory } from '@/api/core/home';
import { Carousel, Modal } from 'antd';
import { useState } from 'react';

export default function HomeCategories({ items }: { items: HomeCategory[] }) {
  const [selected, setSelected] = useState<HomeCategory | null>(null);
  const categories = items.filter((item) => item.CODE !== 'MI_UPS');
  return (
    <>
      {categories.length ? (
        <Carousel arrows infinite={categories.length > 1} className="mt-5 pb-5">
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
                  className="block w-full rounded-lg object-contain"
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
