import { fetchAssetSummary, parseAmount } from '@/api/core/assets';
import { formatHomeMoney } from '@/api/core/home';
import {
  fetchExtendOptions,
  fetchInvestmentProducts,
  fetchPartnerInfo,
  fetchProductConfiguration,
  fetchProductConfirmation,
  fetchProductFee,
  validateInvestmentAmount,
  type InvestmentProduct,
  type ProductConfirmation,
} from '@/api/core/products';
import { PAGE_URL } from '@/constants/pathUrl';
import useCustomerProfile from '@/hooks/useCustomerProfile';
import useCustomerSession from '@/hooks/useCustomerSession';
import { BackIcon, EyeIcon } from '@/icons';
import ProfileStatus from '@/pages/Account/components/ProfileStatus';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { history, useSearchParams } from '@umijs/max';
import { Button, Input, Modal, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';

const paymentName = (type?: string) =>
  type === 'KKH_01'
    ? 'Không kỳ hạn'
    : type === 'TL_01'
    ? 'Cuối kỳ'
    : type === 'TL_02'
    ? 'Hàng tháng'
    : type || 'Gói khác';
const rate = (value: unknown) => {
  const amount = parseAmount(value);
  return amount === null ? '—' : amount.toLocaleString('vi-VN') + '%/năm';
};

export default function ProductDetail() {
  const [params] = useSearchParams();
  const code = params.get('code') || '';
  const session = useCustomerSession();
  const profile = useCustomerProfile();
  const queryClient = useQueryClient();
  const scope = JSON.stringify([code, session.customerCode, session.token]);
  const enabled = session.hasSession && Boolean(code) && code !== 'MI_UPS';
  const [selection, setSelection] = useState<{
    scope: string;
    code: string;
  } | null>(null);
  const [input, setInput] = useState<{
    scope: string;
    productCode: string;
    value: string;
  } | null>(null);
  const [saleDraft, setSaleDraft] = useState<{
    scope: string;
    value: string;
  } | null>(null);
  const [saleSearch, setSaleSearch] = useState<{
    scope: string;
    value: string;
  } | null>(null);
  const saleInput = saleDraft?.scope === scope ? saleDraft.value : '';
  const saleLookup = saleSearch?.scope === scope ? saleSearch.value : '';
  const setSaleInput = (value: string) => setSaleDraft({ scope, value });
  const setSaleLookup = (value: string) => setSaleSearch({ scope, value });
  const [hidden, setHidden] = useState(false);
  const [preview, setPreview] = useState<{
    signature: string;
    data: ProductConfirmation;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [seeMore, setSeeMore] = useState(false);
  const [extensionRequested, setExtensionRequested] = useState(false);
  const [extension, setExtension] = useState<string | undefined>();
  const productsQuery = useInfiniteQuery({
    queryKey: [
      'investment-products',
      code,
      session.customerCode,
      session.token,
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      fetchInvestmentProducts(code, pageParam, signal),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length ? pages.length + 1 : undefined,
    enabled,
    retry: false,
  });
  const products = [
    ...new Map(
      (productsQuery.data?.pages.flat() || []).map((product) => [
        product.PRODUCT_CODE,
        product,
      ]),
    ).values(),
  ];
  const selected =
    products.find(
      (product) =>
        selection?.scope === scope && selection.code === product.PRODUCT_CODE,
    ) || products[0];
  const amount =
    input?.scope === scope && input.productCode === selected?.PRODUCT_CODE
      ? input.value
      : String(parseAmount(selected?.CAP_MIN) ?? '');
  const setAmount = (value: string) =>
    selected && setInput({ scope, productCode: selected.PRODUCT_CODE, value });
  const choose = (product: InvestmentProduct) => {
    setSelection({ scope, code: product.PRODUCT_CODE });
    setInput(null);
    setExtension(undefined);
  };
  const types = [...new Set(products.map((product) => product.PRODUCT_TYPE))];
  const visibleProducts = products.filter(
    (product) => product.PRODUCT_TYPE === selected?.PRODUCT_TYPE,
  );
  const categories = queryClient.getQueryData<
    { CODE: string; NAME?: string }[]
  >(['home-categories', session.customerCode, session.token]);
  const title =
    params.get('name') ||
    categories?.find((category) => category.CODE === code)?.NAME ||
    code ||
    'Hợp tác';
  const summaryQuery = useQuery({
    queryKey: ['asset-summary', session.customerCode, session.token],
    queryFn: ({ signal }) => fetchAssetSummary(session.customerCode, signal),
    enabled,
    retry: false,
  });
  const configQuery = useQuery({
    queryKey: ['product-configuration', session.customerCode, session.token],
    queryFn: ({ signal }) => fetchProductConfiguration(signal),
    enabled,
    retry: false,
  });
  const shield = Boolean(
    configQuery.data?.['finra-shield']?.product_code &&
      configQuery.data['finra-shield'].product_code === code,
  );
  const validation = validateInvestmentAmount(
    selected,
    amount,
    summaryQuery.data?.CASH_BALANCE,
  );
  const [debounced, setDebounced] = useState('');
  const feeSignature = JSON.stringify([scope, selected?.PRODUCT_CODE, amount]);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(feeSignature), 200);
    return () => clearTimeout(timer);
  }, [feeSignature]);
  const feeQuery = useQuery({
    queryKey: ['product-fee', scope, selected?.PRODUCT_CODE, amount],
    queryFn: ({ signal }) =>
      fetchProductFee(selected!.PRODUCT_CODE, Number(amount), signal),
    enabled:
      enabled &&
      configQuery.isSuccess &&
      !shield &&
      !validation &&
      debounced === feeSignature,
    retry: false,
  });
  const referral = profile.profile?.C_MARKETING_ID_BACK || '';
  const defaultSale = useQuery({
    queryKey: ['default-sale', session.customerCode, session.token, referral],
    queryFn: ({ signal }) => fetchPartnerInfo({ SALE_ID: referral }, signal),
    enabled: enabled && Boolean(referral),
    retry: false,
  });
  const saleQuery = useQuery({
    queryKey: ['sale-lookup', scope, saleLookup],
    queryFn: ({ signal }) =>
      fetchPartnerInfo(
        saleLookup.length === 4
          ? { SALE_ID: saleLookup }
          : { C_PHONE: saleLookup },
        signal,
      ),
    enabled: enabled && Boolean(saleLookup),
    retry: false,
  });
  const typedSale = saleInput.trim();
  const sale = typedSale
    ? typedSale === saleLookup
      ? saleQuery.data
      : null
    : defaultSale.data;
  const saleValid = typedSale
    ? Boolean(sale?.saleCode)
    : !referral || defaultSale.isSuccess;
  const signature = JSON.stringify([feeSignature, typedSale, sale?.saleCode]);
  useEffect(() => {
    setPreviewError(null);
  }, [signature]);
  const currentSignature = useRef(signature);
  currentSignature.current = signature;
  const previewOpen = preview?.signature === signature;
  const needsExtension =
    selected?.PRODUCT_TYPE !== 'KKH_01' &&
    String(selected?.EXTEND_FLAG) === '1';
  const extendsQuery = useQuery({
    queryKey: ['extend-options', scope, selected?.PRODUCT_TYPE],
    queryFn: ({ signal }) =>
      fetchExtendOptions(selected!.PRODUCT_TYPE!, signal),
    enabled:
      enabled &&
      Boolean(
        previewOpen &&
          needsExtension &&
          extensionRequested &&
          selected?.PRODUCT_TYPE,
      ),
    retry: false,
  });
  const canContinue =
    enabled &&
    productsQuery.isSuccess &&
    !validation &&
    saleValid &&
    profile.isSuccess &&
    configQuery.isSuccess &&
    !shield &&
    feeQuery.isSuccess &&
    Boolean(feeQuery.data) &&
    debounced === feeSignature &&
    !feeQuery.isFetching &&
    !summaryQuery.isError &&
    !previewLoading;
  const currentFee =
    !validation &&
    !feeQuery.isFetching &&
    feeQuery.isSuccess &&
    debounced === feeSignature
      ? feeQuery.data
      : null;
  const continueToPreview = async () => {
    if (!canContinue) return;
    const requestSignature = signature;
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const data = await queryClient.fetchQuery({
        queryKey: [
          'product-confirmation',
          scope,
          selected!.PRODUCT_CODE,
          amount,
        ],
        queryFn: ({ signal }) =>
          fetchProductConfirmation(
            selected!.PRODUCT_CODE,
            Number(amount),
            signal,
          ),
        staleTime: 0,
        retry: false,
      });
      if (currentSignature.current === requestSignature) {
        setPreview({ signature: requestSignature, data });
        setSeeMore(false);
        setExtensionRequested(false);
        setExtension(undefined);
      }
    } catch (error) {
      if (currentSignature.current === requestSignature)
        setPreviewError(
          error instanceof Error
            ? error.message
            : 'Không thể tải xác nhận sản phẩm.',
        );
    } finally {
      setPreviewLoading(false);
    }
  };
  const refresh = () => {
    setSelection(null);
    setInput(null);
    setPreview(null);
    void queryClient.resetQueries({
      queryKey: [
        'investment-products',
        code,
        session.customerCode,
        session.token,
      ],
      exact: true,
    });
    void summaryQuery.refetch();
  };

  return (
    <div className="min-h-full bg-white pb-28 text-[#060607]">
      <header
        className="px-5 pb-8"
        style={{
          background: 'linear-gradient(241deg, #c06ae4 8%, #4d24c6 100%)',
        }}
      >
        <div className="flex h-[60px] items-center gap-3">
          <button
            type="button"
            aria-label="Quay lại"
            onClick={() => history.push(PAGE_URL.products)}
          >
            <BackIcon width={24} height={24} stroke0="#ffffff" />
          </button>
          <h1 className="!mb-0 flex-1 text-center text-lg font-semibold text-white">
            {title}
          </h1>
          <button
            type="button"
            className="text-sm text-white"
            onClick={refresh}
            disabled={!enabled || productsQuery.isFetching}
          >
            Làm mới
          </button>
        </div>
      </header>
      <div className="relative z-10 -mt-6 space-y-4 px-5">
        {!code && <p role="alert">Vui lòng chọn danh mục từ trang Sản phẩm.</p>}
        {code === 'MI_UPS' && <p>Chưa hỗ trợ sản phẩm MI.</p>}
        <ProfileStatus
          loading={enabled && productsQuery.isPending}
          error={productsQuery.error}
          retry={productsQuery.refetch}
        />
        {enabled && (
          <>
            <section className="flex items-center justify-between rounded-xl bg-white p-3 shadow-md">
              <div>
                <p className="!mb-0 text-xs text-gray-500">Số dư khả dụng</p>
                <p className="!mb-0 text-lg font-semibold">
                  {formatHomeMoney(summaryQuery.data?.CASH_BALANCE, hidden)}
                </p>
              </div>
              <button
                type="button"
                aria-label={hidden ? 'Hiện số tiền' : 'Ẩn số tiền'}
                onClick={() => setHidden(!hidden)}
              >
                <EyeIcon width={18} height={18} />
              </button>
            </section>
            <ProfileStatus
              loading={summaryQuery.isPending}
              error={summaryQuery.error}
              retry={summaryQuery.refetch}
            />
            <ProfileStatus
              loading={profile.isPending}
              error={profile.error}
              retry={profile.refetch}
            />
            {productsQuery.isSuccess && !products.length && (
              <p>Không có dữ liệu.</p>
            )}
            {products.length > 0 && (
              <>
                <h2 className="!mb-1 text-sm font-semibold">
                  Hình thức nhận lợi nhuận
                </h2>
                <div className="flex gap-2 overflow-x-auto">
                  {types.map((type) => (
                    <button
                      type="button"
                      key={type || 'other'}
                      onClick={() => {
                        const first = products.find(
                          (product) => product.PRODUCT_TYPE === type,
                        );
                        if (first) choose(first);
                      }}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm ${
                        selected?.PRODUCT_TYPE === type
                          ? 'bg-[#b65ffc] text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {paymentName(type)}
                    </button>
                  ))}
                </div>
                <h2 className="!mb-1 text-sm font-semibold">
                  Kỳ hạn & lợi nhuận
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {visibleProducts.map((product) => (
                    <button
                      type="button"
                      key={product.PRODUCT_CODE}
                      onClick={() => choose(product)}
                      className={`min-w-[120px] shrink-0 rounded-xl border p-3 text-left ${
                        selected?.PRODUCT_CODE === product.PRODUCT_CODE
                          ? 'border-[#b65ffc] bg-[#b65ffc] text-white'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {product.PRODUCT_NAME || product.PRODUCT_CODE}
                      </span>
                      <span className="block text-xs">
                        {product.TERM || '—'}
                      </span>
                      <span className="block text-sm font-semibold">
                        {rate(product.FEE_RATE)}
                      </span>
                    </button>
                  ))}
                </div>
                {productsQuery.hasNextPage && (
                  <Button
                    loading={productsQuery.isFetchingNextPage}
                    onClick={() => {
                      void productsQuery.fetchNextPage();
                    }}
                  >
                    Tải thêm gói
                  </Button>
                )}
                <ProfileStatus
                  loading={configQuery.isPending}
                  error={configQuery.error}
                  retry={configQuery.refetch}
                />
                {shield ? (
                  <p className="rounded-lg bg-purple-50 p-3 text-sm">
                    Gói này cần chọn căn hộ và thông tin bất động sản trước khi
                    hợp tác. Luồng chọn căn hộ chưa được kết nối.
                  </p>
                ) : (
                  <>
                    <section>
                      <label
                        className="mb-2 block text-sm font-semibold"
                        htmlFor="investment-amount"
                      >
                        Số tiền hợp tác
                      </label>
                      <Input
                        id="investment-amount"
                        inputMode="numeric"
                        value={
                          amount ? Number(amount).toLocaleString('vi-VN') : ''
                        }
                        onChange={(event) =>
                          setAmount(
                            event.target.value.replace(/\D/g, '').slice(0, 15),
                          )
                        }
                        suffix="đ"
                        size="large"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Tối thiểu {formatHomeMoney(selected?.CAP_MIN)} ·{' '}
                        {String(selected?.CAP_MAX) === '-1'
                          ? 'Không giới hạn tối đa'
                          : 'Tối đa ' + formatHomeMoney(selected?.CAP_MAX)}
                      </p>
                      {validation && (
                        <p role="alert" className="text-xs text-red-600">
                          {validation}
                        </p>
                      )}
                    </section>
                    <section className="rounded-xl border border-[#b65ffc] p-3">
                      <h2 className="text-sm font-semibold">
                        {selected?.PRODUCT_NAME || 'Gói đang chọn'}
                      </h2>
                      <p className="text-xs">
                        Kỳ hạn: {selected?.TERM || '—'} ·{' '}
                        {rate(selected?.FEE_RATE)}
                      </p>
                      <ProfileStatus
                        loading={
                          !validation &&
                          configQuery.isSuccess &&
                          (feeQuery.isFetching || debounced !== feeSignature)
                        }
                        error={feeQuery.error}
                        retry={feeQuery.refetch}
                      />
                      <div className="flex justify-between text-sm">
                        <span>Lợi nhuận dự kiến</span>
                        <b>
                          {currentFee
                            ? formatHomeMoney(
                                currentFee.INTEREST_RECEIVED,
                                hidden,
                                true,
                                true,
                              )
                            : '—'}
                        </b>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Ngày dự kiến</span>
                        <b>{currentFee ? currentFee.EXPIRE_DAY || '—' : '—'}</b>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Rút trước hạn:{' '}
                        {String(selected?.LIQUID_TYPE) === '1'
                          ? 'Cho phép'
                          : 'Không cho phép'}{' '}
                        · Gia hạn:{' '}
                        {String(selected?.EXTEND_FLAG) === '0'
                          ? 'Không cho phép'
                          : 'Cho phép'}
                      </p>
                    </section>
                    <section className="rounded-xl border border-gray-200 p-3">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="sale-referral"
                      >
                        Sales giới thiệu (nếu có)
                      </label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          id="sale-referral"
                          value={saleInput}
                          placeholder="Mã hoặc số điện thoại Sale"
                          onChange={(event) => setSaleInput(event.target.value)}
                        />
                        <Button
                          disabled={!typedSale}
                          loading={saleQuery.isFetching}
                          onClick={() => {
                            if (saleLookup === typedSale)
                              void saleQuery.refetch();
                            else setSaleLookup(typedSale);
                          }}
                        >
                          Tra cứu
                        </Button>
                      </div>
                      {typedSale && !saleValid && !saleQuery.isFetching && (
                        <p className="mt-2 text-xs text-red-600">
                          Hãy tra cứu và chọn Sale hợp lệ trước khi tiếp tục.
                        </p>
                      )}
                      <ProfileStatus
                        loading={Boolean(
                          !typedSale && referral && defaultSale.isPending,
                        )}
                        error={typedSale ? saleQuery.error : defaultSale.error}
                        retry={
                          typedSale ? saleQuery.refetch : defaultSale.refetch
                        }
                      />
                      {sale && (
                        <p className="mt-2 text-sm">
                          {sale.saleName} · {sale.saleCode}
                          {sale.saleName?.toUpperCase() !== 'FINRA CAPITAL' &&
                          sale.phoneNumber
                            ? ' · ' + sale.phoneNumber
                            : ''}
                        </p>
                      )}
                    </section>
                  </>
                )}
              </>
            )}
          </>
        )}
        {previewError && (
          <p role="alert" className="text-sm text-red-600">
            {previewError}
          </p>
        )}
      </div>
      {enabled && !shield && (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-5 pb-4 pt-3 shadow-lg">
          <Button
            type="primary"
            block
            disabled={!canContinue}
            loading={previewLoading}
            onClick={continueToPreview}
            className="!h-12 !rounded-xl !bg-[#b65ffc]"
          >
            Tiếp tục
          </Button>
        </div>
      )}
      <Modal
        open={Boolean(previewOpen)}
        title="Thông tin xác nhận hợp tác"
        onCancel={() => setPreview(null)}
        footer={<Button onClick={() => setPreview(null)}>Đóng</Button>}
      >
        {previewOpen && preview && (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-3 text-sm">
              <dt>Nhóm sản phẩm</dt>
              <dd>{preview.data.WEB_PRODUCT_TYPE_NAME || '—'}</dd>
              <dt>Số tiền hợp tác</dt>
              <dd>{formatHomeMoney(Number(amount))}</dd>
              <dt>Lợi nhuận trước thuế</dt>
              <dd>{rate(preview.data.FEE_RATE)}</dd>
              <dt>Ngày bắt đầu</dt>
              <dd>{preview.data.OPEN_DATE || '—'}</dd>
              {selected?.PRODUCT_TYPE === 'KKH_01' && (
                <>
                  <dt>Ngày trả lợi nhuận</dt>
                  <dd>Ngày {preview.data.DAY_PAY || '—'} hàng tháng</dd>
                  <dt>Thanh toán về</dt>
                  <dd>Tài khoản khả dụng</dd>
                </>
              )}
              {needsExtension && (
                <>
                  <dt>Gói gia hạn</dt>
                  <dd>
                    <Select
                      className="w-full"
                      placeholder="Chọn gói gia hạn"
                      value={extension}
                      loading={extendsQuery.isFetching}
                      onOpenChange={(open) => {
                        if (open) setExtensionRequested(true);
                      }}
                      onChange={setExtension}
                      options={extendsQuery.data?.map((option) => ({
                        value: option.EXTEND_TYPE,
                        label: option.EXTEND_NAME || option.EXTEND_TYPE,
                      }))}
                    />
                    <ProfileStatus
                      loading={false}
                      error={extendsQuery.error}
                      retry={extendsQuery.refetch}
                    />
                  </dd>
                </>
              )}
              {seeMore && (
                <>
                  {selected?.PRODUCT_TYPE === 'TL_01' && (
                    <>
                      <dt>Ngày kết thúc</dt>
                      <dd>{preview.data.EXPIRE_DATE || '—'}</dd>
                    </>
                  )}
                  {selected?.PRODUCT_TYPE === 'TL_02' ? (
                    <>
                      <dt>Ngày đến hạn</dt>
                      <dd>{preview.data.EXPIRE_DATE || '—'}</dd>
                      <dt>Ngày trả LN gần nhất</dt>
                      <dd>{preview.data.INTEREST_DATE || '—'}</dd>
                      <dt>LN kỳ gần nhất</dt>
                      <dd>
                        {formatHomeMoney(preview.data.INTEREST_RECEIVED_NEAR)}
                      </dd>
                      <dt>Tổng lợi nhuận</dt>
                      <dd>
                        {formatHomeMoney(preview.data.INTEREST_RECEIVED_SUM)}
                      </dd>
                    </>
                  ) : (
                    <>
                      <dt>Lợi nhuận dự kiến</dt>
                      <dd>{formatHomeMoney(preview.data.INTEREST_RECEIVED)}</dd>
                    </>
                  )}
                  {selected?.PRODUCT_TYPE !== 'KKH_01' &&
                    String(selected?.EXTEND_FLAG) === '0' && (
                      <>
                        <dt>Tự động gia hạn gốc</dt>
                        <dd>
                          {String(preview.data.AUTO_EXTEND) === '1'
                            ? 'Có'
                            : 'Không'}
                        </dd>
                      </>
                    )}
                  {sale && (
                    <>
                      <dt>Sale giới thiệu</dt>
                      <dd>
                        {sale.saleName} · {sale.saleCode}
                      </dd>
                    </>
                  )}
                </>
              )}
            </dl>
            <button
              type="button"
              className="mt-3 text-sm text-[#b65ffc]"
              onClick={() => setSeeMore(!seeMore)}
            >
              {seeMore ? 'Thu gọn' : 'Xem thêm'}
            </button>
            <p className="mt-4 text-xs text-gray-500">
              Đây là thông tin đối chiếu trước hợp tác; chưa tạo hoặc ký hợp
              đồng.
            </p>
          </>
        )}
      </Modal>
    </div>
  );
}
