import { BackIcon } from '@/icons';
import { history } from '@umijs/max';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  extra?: ReactNode;
};

export default function PageHeader({ title, onBack, extra }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center bg-white px-5">
      <div className="flex w-8 justify-start">
        <button
          type="button"
          aria-label="Quay lại"
          className="flex size-6 items-center justify-center"
          onClick={onBack ?? (() => history.back())}
        >
          <BackIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
          />
        </button>
      </div>
      <h1 className="!mb-0 flex-1 text-center text-lg font-semibold leading-7 text-[#060607]">
        {title}
      </h1>
      <div className="flex w-8 justify-end">{extra}</div>
    </header>
  );
}
