import type { HomeCategory } from '@/api/core/home';
import PageHeader from '@/components/PageHeader';
import { PAGE_URL } from '@/constants/pathUrl';
import useProductCategories from '@/hooks/useProductCategories';
import { LinkSquareIcon } from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { history } from '@umijs/max';
import { Button } from 'antd';

const FALLBACK_BANNER = '/images/home/product-card.png';

function ProductCard({ item }: { item: HomeCategory }) {
  return (
    <article className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(10,10,11,0.06)]">
      <img
        src={
          /^https?:\/\//i.test(item.URL_BANNER || '')
            ? item.URL_BANNER
            : FALLBACK_BANNER
        }
        alt=""
        className="aspect-[16/9] w-full rounded-xl object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_BANNER;
        }}
      />
      <div className="mt-3 flex items-center justify-between gap-3 px-3 pb-3">
        <button
          type="button"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
          onClick={() =>
            history.push(
              `${PAGE_URL.productDetail}?code=${encodeURIComponent(
                item.CODE,
              )}&name=${encodeURIComponent(item.NAME || '')}`,
            )
          }
        >
          <p className="!mb-0 line-clamp-2 text-base font-semibold leading-6 text-[#060607]">
            {item.NAME || item.CODE}
          </p>
          {item.DESCRIPTION ? (
            <p className="!mb-0 mt-0.5 text-xs leading-4 text-[#ff4d7a]">
              {item.DESCRIPTION}
            </p>
          ) : null}
        </button>
        <Button
          type="primary"
          className="!h-9 !shrink-0 !rounded-xl !border-0 !bg-[#b65ffc] !px-5 !text-sm !shadow-none"
          onClick={() =>
            history.push(
              `${PAGE_URL.productDetail}?code=${encodeURIComponent(
                item.CODE,
              )}&name=${encodeURIComponent(item.NAME || '')}`,
            )
          }
        >
          Hợp tác
        </Button>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const categories = useProductCategories();
  const items = (categories.data ?? []).filter(
    (item) => item.CODE !== 'MI_UPS',
  );

  return (
    <div className="min-h-full bg-[#f7f7f8] pb-6 text-[#060607]">
      <PageHeader
        title="Sản phẩm hợp tác"
        showBack={false}
        extra={
          <button
            type="button"
            aria-label="Làm mới"
            disabled={categories.isFetching}
            onClick={() => {
              void categories.refetch();
            }}
            className="flex size-8 items-center justify-center rounded border border-[#8e8e8f] disabled:opacity-40"
          >
            <LinkSquareIcon
              width={16.25}
              height={16.25}
              preserveAspectRatio="xMidYMid meet"
            />
          </button>
        }
      />
      <div className="px-4 pt-4">
        <ProfileStatus
          loading={categories.isFetching}
          error={categories.error}
          retry={categories.refetch}
        />
        {categories.isSuccess && items.length === 0 ? (
          <p className="text-center text-sm text-[rgba(10,10,11,0.55)]">
            Không có dữ liệu.
          </p>
        ) : null}
        {categories.isSuccess ? (
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <ProductCard key={item.CODE || index} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
