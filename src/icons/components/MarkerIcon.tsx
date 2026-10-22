import * as React from 'react';

export interface IMarkerIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
}

const MarkerIcon = ({ fill0, ...restProps }: IMarkerIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 33.7352 32.4283"
    fill="none"
    {...restProps}
  >
    <g id="Polygon 1" filter="url(#filter0_d_0_1088)">
      <path
        d="M16.8676 11.2142L22.8676 21.7142L16.8676 18.9642L10.8676 21.7142Z"
        fill={fill0 ?? '#FFCC00'}
        stroke={fill0 ?? '#FFCC00'}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_0_1088"
        x={-3.57628e-7}
        y={0}
        width={33.7353}
        height={32.4283}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx={2} dy={-2} />
        <feGaussianBlur stdDeviation={5.5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.96276 0 0 0 0 0.796534 0 0 0 0 0.131627 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_0_1088"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_0_1088"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default MarkerIcon;
