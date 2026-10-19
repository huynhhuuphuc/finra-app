import { BackIcon } from '@/icons';
import { history } from '@umijs/max';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title?: ReactNode;
  onBack?: () => void;
  extra?: ReactNode;
  showBack?: boolean;
  align?: 'center' | 'left';
  sticky?: boolean;
};

export default function PageHeader({
  title,
  onBack,
  extra,
  showBack = true,
  align = 'center',
  sticky = true,
}: PageHeaderProps) {
  const centered = align === 'center';
  const backButton = showBack && (
    <button
      type="button"
      aria-label="Quay lại"
      className="flex size-6 shrink-0 items-center justify-center"
      onClick={onBack ?? (() => history.back())}
    >
      <BackIcon width={24} height={24} preserveAspectRatio="xMidYMid meet" />
    </button>
  );

  return (
    <header
      className={`flex h-[60px] shrink-0 items-center bg-white px-5 ${
        sticky ? 'sticky top-0 z-30' : ''
      } ${centered ? '' : 'gap-4'}`}
    >
      {centered ? (
        <div className="flex w-8 justify-start">{backButton}</div>
      ) : (
        backButton
      )}
      <h1
        className={`!mb-0 min-w-0 flex-1 truncate text-lg font-semibold leading-7 text-[#060607] ${
          centered ? 'text-center' : ''
        }`}
      >
        {title}
      </h1>
      {centered ? <div className="flex w-8 justify-end">{extra}</div> : extra}
    </header>
  );
}
