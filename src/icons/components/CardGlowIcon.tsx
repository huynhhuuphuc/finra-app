import * as React from 'react';

export interface ICardGlowIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
}

const CardGlowIcon = ({ fill0, ...restProps }: ICardGlowIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 341 301"
    fill="none"
    {...restProps}
  >
    <g id="Vector" filter="url(#filter0_f_0_1547)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M133.903 54.6153C153.596 58.4128 149.604 85.5864 168.801 90.6056C203.52 99.6835 249.36 73.3124 276.45 91.8869C299.213 107.495 279.669 137.567 268.782 159.158C258.291 179.963 238.96 196.666 216.328 211.117C191.848 226.747 163.862 254.123 133.903 245.281C100.007 235.278 102.919 198.233 88.2712 173.324C82.0022 162.663 78.3447 152.148 72.7471 141.281C66.6899 129.522 52.2834 119.637 54.1687 107.118C56.1841 93.7355 69.3425 82.9464 82.8736 74.0365C97.5502 64.3723 114.952 50.9611 133.903 54.6153Z"
        fill={fill0 ?? '#B65FFC'}
        fillOpacity={0.7}
      />
    </g>
    <defs>
      <filter
        id="filter0_f_0_1547"
        x={-2.27245e-9}
        y={-3.98834e-8}
        width={341}
        height={301}
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
        <feGaussianBlur
          stdDeviation={27}
          result="effect1_foregroundBlur_0_1547"
        />
      </filter>
    </defs>
  </svg>
);
export default CardGlowIcon;
