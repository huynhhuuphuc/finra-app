import { CheckOutlined, TranslationOutlined } from '@ant-design/icons';
import { getLocale, setLocale, useIntl } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { useEffect, useState } from 'react';

const languages = [
  {
    key: 'vi-VN',
    label: 'Tiếng Việt',
    icon: '🇻🇳',
  },
  {
    key: 'en-US',
    label: 'English',
    icon: '🇺🇸',
  },
];

export default function SelectLang() {
  const intl = useIntl();
  const [currentLang, setCurrentLang] = useState(getLocale() || 'vi-VN');

  useEffect(() => {
    setCurrentLang(getLocale() || 'vi-VN');
  }, [intl.locale]);

  const handleLanguageChange = (key: string) => {
    setLocale(key, false);
    setCurrentLang(key);
  };

  const items: MenuProps['items'] = languages.map((lang) => ({
    key: lang.key,
    label: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{lang.icon}</span>
          <span>{lang.label}</span>
        </div>
        {currentLang === lang.key && (
          <CheckOutlined style={{ color: '#1890ff' }} />
        )}
      </div>
    ),
    onClick: () => handleLanguageChange(lang.key),
  }));

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
        }}
        className="hover:bg-gray-100"
      >
        <TranslationOutlined className="text-xl" />
      </div>
    </Dropdown>
  );
}
