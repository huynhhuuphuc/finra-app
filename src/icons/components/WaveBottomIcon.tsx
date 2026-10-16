import * as React from 'react';

export interface IWaveBottomIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const WaveBottomIcon = ({ fill0, fill1, fill2, ...restProps }: IWaveBottomIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 97.3363 157.528"
    fill="none"
    {...restProps}
  >
    <g id="bottom">
      <path
        id="Vector 61"
        d="M0.000171098 1.491e-05H97.3363C97.3363 1.491e-05 90.4307 21.8173 61.4929 41.2925C32.5551 60.7678 27.3461 77.6738 39.5848 106.699C51.8235 135.725 0.000171098 157.528 0.000171098 157.528V1.491e-05Z"
        fill={fill0 ?? 'url(#paint0_linear_0_1737)'}
      />
      <g id="Mask Group">
        <mask
          id="mask0_0_1737"
          style={{
            maskType: 'alpha',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={98}
          height={158}
        >
          <path
            id="Vector 62"
            d="M0 0L97.3361 0C97.3361 0 90.4305 21.8172 61.4927 41.2925C32.555 60.7678 27.3459 77.6738 39.5846 106.699C51.8233 135.725 0 157.528 0 157.528L0 0Z"
            fill={fill1 ?? 'url(#paint1_linear_0_1737)'}
          />
        </mask>
        <g mask="url(#mask0_0_1737)">
          <g id="Ellipse 282" filter="url(#filter0_f_0_1737)">
            <path
              d="M91.199 91.3215C75.8288 123.927 51.9717 157.342 32.969 151.934C13.9663 146.526 20.7573 96.6065 32.969 58.6436C45.1807 20.6806 83.5592 14.0777 102.562 19.4858C121.565 24.8939 106.569 58.7159 91.199 91.3215Z"
              fill={fill2 ?? 'url(#paint2_linear_0_1737)'}
              fillOpacity={0.9}
            />
          </g>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_0_1737"
        x={-5.64127}
        y={-8.93378}
        width={143.888}
        height={188.216}
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
          stdDeviation={13.3847}
          result="effect1_foregroundBlur_0_1737"
        />
      </filter>
      <linearGradient
        id="paint0_linear_0_1737"
        x1={11.8383}
        y1={11.5866}
        x2={45.6603}
        y2={73.1473}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1737"
        x1={11.8382}
        y1={11.5866}
        x2={45.6602}
        y2={73.1473}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_0_1737"
        x1={48.4449}
        y1={67.4639}
        x2={3.6743}
        y2={64.0419}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B65FFC" />
        <stop offset={1} stopColor="#B65FFC" stopOpacity={0.21} />
      </linearGradient>
    </defs>
  </svg>
);
export default WaveBottomIcon;
