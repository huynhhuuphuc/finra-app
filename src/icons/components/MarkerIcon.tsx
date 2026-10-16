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
        d="M14.0013 13.5003C14.4514 12.7207 15.6219 12.8863 15.8381 13.7601L16.9159 18.116C16.9612 18.2991 17.0573 18.4656 17.1932 18.5964L20.4266 21.7077C21.0753 22.3319 20.6334 23.4283 19.7332 23.4283H10.0015C9.23169 23.4283 8.75057 22.5949 9.13547 21.9283L14.0013 13.5003Z"
        fill={fill0 ?? '#FFCC00'}
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
