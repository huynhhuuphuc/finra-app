import * as React from 'react';

export interface IBannerTailIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
}

const BannerTailIcon = ({ fill0, ...restProps }: IBannerTailIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 230 88.3837"
    fill="none"
    {...restProps}
  >
    <g id="Rectangle 31244" filter="url(#filter0_i_0_1186)">
      <path
        d="M0 0H230V37.5837C230 40.855 228.008 43.7966 224.971 45.0116L117.971 87.8116C116.064 88.5745 113.936 88.5745 112.029 87.8115L5.02887 45.0115C1.9916 43.7966 0 40.855 0 37.5837V0Z"
        fill={fill0 ?? '#511C55'}
      />
    </g>
    <defs>
      <filter
        id="filter0_i_0_1186"
        x={0}
        y={0}
        width={230}
        height={94.3837}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={6} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.16 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_0_1186"
        />
      </filter>
    </defs>
  </svg>
);
export default BannerTailIcon;
