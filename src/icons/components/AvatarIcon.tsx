import * as React from 'react';

export interface IAvatarIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const AvatarIcon = ({ fill0, fill1, fill2, ...restProps }: IAvatarIconProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    {...restProps}
  >
    <rect width={24} height={24} rx={12} fill={fill0 ?? '#9BA2AE'} />
    <circle cx={12} cy={9} r={3.5} fill={fill1 ?? '#FFFFFF'} />
    <path
      d="M5.1 20.8C6.05 16.35 8.55 14.2 12 14.2C15.45 14.2 17.95 16.35 18.9 20.8H5.1Z"
      fill={fill2 ?? '#FFFFFF'}
    />
  </svg>
);
export default AvatarIcon;
