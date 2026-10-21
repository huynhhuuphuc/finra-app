import {
  ArrowRight01Icon,
  CallingIcon,
  CatalogueIcon,
  SaveEnergy01Icon,
} from '@/icons';
import {
  BarChartOutlined,
  BulbOutlined,
  CloseOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { useState, type ReactNode } from 'react';

type Sheet = 'guide' | 'support';

const PRODUCT_INTRO_URL = 'https://finra.com.vn';

const GUIDE_ITEMS: { label: string; icon: ReactNode; url: string }[] = [
  {
    label: 'Mở tài khoản',
    icon: <BulbOutlined />,
    url: 'https://finra.com.vn/hdsd/dang-nhap-va-tai-khoan/huong-dan-mo-tai-khoan-tren-app-finra',
  },
  {
    label: 'Nộp tiền',
    icon: <WalletOutlined />,
    url: 'https://finra.com.vn/hdsd/nap-rut-tien/huong-dan-nop-tien-vao-app-finra',
  },
  {
    label: 'Giao dịch đầu tư',
    icon: <BarChartOutlined />,
    url: 'https://finra.com.vn/hdsd/san-pham/huong-dan-giao-dich-dau-tu',
  },
  {
    label: 'Rút tiền',
    icon: <CreditCardOutlined />,
    url: 'https://finra.com.vn/hdsd/nap-rut-tien/huong-dan-rut-tien-tren-app-finra',
  },
];

const PURPLE = '#B65FFC';

export default function LoginShortcuts() {
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState<Sheet>('guide');

  const show = (next: Sheet) => {
    setSheet(next);
    setOpen(true);
  };

  return (
    <>
      <div className="login-shortcuts">
        <a
          href={PRODUCT_INTRO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="login-shortcut"
        >
          <span className="login-shortcut-icon">
            <SaveEnergy01Icon
              width={20}
              height={20}
              preserveAspectRatio="xMidYMid meet"
            />
          </span>
          Giới thiệu
          <br />
          sản phẩm
        </a>
        <button
          type="button"
          className="login-shortcut"
          onClick={() => show('guide')}
        >
          <span className="login-shortcut-icon">
            <CatalogueIcon
              width={20}
              height={20}
              preserveAspectRatio="xMidYMid meet"
            />
          </span>
          Hướng dẫn
          <br />
          sử dụng
        </button>
        <button
          type="button"
          className="login-shortcut"
          onClick={() => show('support')}
        >
          <span className="login-shortcut-icon">
            <CallingIcon
              width={20}
              height={20}
              preserveAspectRatio="xMidYMid meet"
            />
          </span>
          Liên hệ
          <br />
          hỗ trợ
        </button>
      </div>

      <Drawer
        placement="bottom"
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        destroyOnHidden
        size="auto"
        getContainer={() =>
          document.querySelector('.login-page') ?? document.body
        }
        rootClassName="login-drawer"
        styles={{
          body: { padding: '8px 20px 16px' },
          section: { borderRadius: '16px 16px 0 0' },
        }}
      >
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#d9d9d9]" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="!mb-0 text-base font-semibold leading-6 text-[#060607]">
            {sheet === 'support' ? 'Liên hệ hỗ trợ' : 'Hướng dẫn sử dụng'}
          </h2>
          <button
            type="button"
            aria-label="Đóng"
            className="flex size-8 items-center justify-center text-[#060607]"
            onClick={() => setOpen(false)}
          >
            <CloseOutlined />
          </button>
        </div>

        {sheet === 'guide' ? (
          <div className="flex flex-col gap-3">
            {GUIDE_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#e7e7e7] px-3 py-3 active:bg-[#f7f7f7]"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#f6ebff] text-lg text-[#b65ffc]">
                  {item.icon}
                </span>
                <span className="flex-1 text-sm font-semibold text-[#060607]">
                  {item.label}
                </span>
                <ArrowRight01Icon
                  width={16}
                  height={16}
                  preserveAspectRatio="xMidYMid meet"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-[#e7e7e7] px-3 py-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#f6ebff]">
              <CallingIcon
                width={20}
                height={20}
                preserveAspectRatio="xMidYMid meet"
                fill0={PURPLE}
                fill1={PURPLE}
                fill2={PURPLE}
                fill3={PURPLE}
                fill4={PURPLE}
                fill5={PURPLE}
                fill6={PURPLE}
                fill7={PURPLE}
                fill8={PURPLE}
              />
            </span>
            <div>
              <p className="!mb-0 text-sm leading-5 text-[#060607]">
                Hotline hỗ trợ Khách hàng
              </p>
              <a
                href="tel:19005082"
                className="text-lg font-semibold leading-7 text-[#5b4dff] underline"
              >
                1900.5082
              </a>
            </div>
          </div>
        )}

        <Button
          block
          className="!mt-4 !h-12 !rounded-xl !border-0 !bg-[#e7e7e7] !text-sm !font-semibold !text-[#060607] !shadow-none"
          onClick={() => setOpen(false)}
        >
          Đóng
        </Button>
      </Drawer>
    </>
  );
}
