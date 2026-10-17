import type { HomeCategory } from '@/api/core/home';
import { PAGE_URL } from '@/constants/pathUrl';
import useHomeData from '@/hooks/useHomeData';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import { history } from '@umijs/max';
import { Button } from 'antd';

const FALLBACK_BANNER = '/images/home/product-card.png';

function ProductCard({ item }: { item: HomeCategory }) {
  return (
    <article className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(10,10,11,0.06)]">
      <img
        src={item.URL_BANNER || FALLBACK_BANNER}
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
          onClick={() => history.push(PAGE_URL.productCooperate)}
        >
          <p className="!mb-0 truncate text-base font-semibold leading-6 text-[#060607]">
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
              `${PAGE_URL.productDetail}?code=${encodeURIComponent(item.CODE)}`,
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
  const home = useHomeData();
  const items = home.categories.data ?? [];

  return (
    <div className="min-h-full bg-[#f7f7f8] px-4 pb-6 pt-2 text-[#060607]">
      <h1 className="!mb-4 text-center text-lg font-semibold leading-7">
        Sản phẩm hợp tác
      </h1>
      <ProfileStatus
        loading={home.hasSession && home.categories.isPending}
        error={home.categories.error}
        retry={home.categories.refetch}
      />
      {home.categories.isSuccess && items.length === 0 ? (
        <p className="text-center text-sm text-[rgba(10,10,11,0.55)]">
          Chưa có sản phẩm.
        </p>
      ) : null}
      {home.categories.isSuccess ? (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <ProductCard key={item.CODE || index} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
