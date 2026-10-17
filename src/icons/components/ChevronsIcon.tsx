import * as React from 'react';

export interface IChevronsIconProps extends React.SVGProps<SVGSVGElement> {
  stroke0?: string;
}

const ChevronsIcon = ({ stroke0, ...restProps }: IChevronsIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 37.2071 13"
    fill="none"
    {...restProps}
  >
    <path
      id="Vector"
      d="M0.5 0.5L6.5 6.5L0.5 12.5M10.5 0.5L16.5 6.5L10.5 12.5M20.5 0.5L26.5 6.5L20.5 12.5M30.5 0.5L36.5 6.5L30.5 12.5"
      strokeLinecap="round"
      stroke={stroke0 ?? 'url(#paint0_linear_0_1066)'}
    />
    <defs>
      <linearGradient
        id="paint0_linear_0_1066"
        x1={36.5}
        y1={6.5}
        x2={0.5}
        y2={6.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset={1} stopColor="white" stopOpacity={0.15} />
      </linearGradient>
    </defs>
  </svg>
);
export default ChevronsIcon;
