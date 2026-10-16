import * as React from 'react';

export interface IWaveTop2IconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const WaveTop2Icon = ({ fill0, fill1, fill2, ...restProps }: IWaveTop2IconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 80.1787 126.564"
    fill="none"
    {...restProps}
  >
    <g id="top">
      <path
        id="Vector 61"
        d="M0.000113816 4.61462e-05L80.1787 4.61462e-05C80.1787 4.61462e-05 74.4904 17.5288 50.6535 33.176C26.8166 48.8232 22.5257 62.4061 32.6071 85.7262C42.6885 109.046 0.000113816 126.564 0.000113816 126.564V4.61462e-05Z"
        fill={fill0 ?? 'url(#paint0_linear_0_1568)'}
      />
      <g id="Mask Group">
        <mask
          id="mask0_0_1568"
          style={{
            maskType: 'alpha',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={81}
          height={127}
        >
          <path
            id="Vector 62"
            d="M4.69796e-05 0L80.1787 0C80.1787 0 74.4903 17.5288 50.6534 33.176C26.8165 48.8231 22.5257 62.406 32.6071 85.7262C42.6885 109.046 4.69796e-05 126.564 4.69796e-05 126.564L4.69796e-05 0Z"
            fill={fill1 ?? 'url(#paint1_linear_0_1568)'}
          />
        </mask>
        <g mask="url(#mask0_0_1568)">
          <g id="Ellipse 282" filter="url(#filter0_f_0_1568)">
            <path
              d="M76.7655 61.711C68.4658 82.3553 51.6628 106.736 37.4319 103.677C23.2011 100.618 19.8724 75.8808 25.4196 51.9407C30.9668 28.0007 64.5261 13.5502 78.7569 16.6092C92.9877 19.6681 85.0651 41.0666 76.7655 61.711Z"
              fill={fill2 ?? 'url(#paint2_linear_0_1568)'}
            />
          </g>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_0_1568"
        x={-3.89126}
        y={-10.5666}
        width={117.255}
        height={141.274}
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
          result="effect1_foregroundBlur_0_1568"
        />
      </filter>
      <linearGradient
        id="paint0_linear_0_1568"
        x1={9.75157}
        y1={9.30912}
        x2={36.5585}
        y2={59.3337}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1568"
        x1={9.7515}
        y1={9.30907}
        x2={36.5584}
        y2={59.3337}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_0_1568"
        x1={34.3367}
        y1={48.7428}
        x2={16.3163}
        y2={29.0159}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B65FFC" />
        <stop offset={1} stopColor="#B65FFC" stopOpacity={0.21} />
      </linearGradient>
    </defs>
  </svg>
);
export default WaveTop2Icon;
