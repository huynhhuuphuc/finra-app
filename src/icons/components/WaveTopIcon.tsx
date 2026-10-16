import * as React from 'react';

export interface IWaveTopIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const WaveTopIcon = ({ fill0, fill1, fill2, ...restProps }: IWaveTopIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 66.2335 142.983"
    fill="none"
    {...restProps}
  >
    <g id="top">
      <path
        id="Vector 61"
        d="M0.000171098 1.491e-05H66.2335C66.2335 1.491e-05 61.5345 19.8029 41.8435 37.48C22.1525 55.1571 18.608 70.5022 26.9359 96.8477C35.2639 123.193 0.000171098 142.983 0.000171098 142.983V1.491e-05Z"
        fill={fill0 ?? 'url(#paint0_linear_0_1715)'}
      />
      <g id="Mask Group">
        <mask
          id="mask0_0_1715"
          style={{
            maskType: 'alpha',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={67}
          height={143}
        >
          <path
            id="Vector 62"
            d="M0 0L66.2333 0C66.2333 0 61.5343 19.8029 41.8433 37.48C22.1524 55.1571 18.6078 70.5022 26.9357 96.8477C35.2637 123.193 0 142.983 0 142.983L0 0Z"
            fill={fill1 ?? 'url(#paint1_linear_0_1715)'}
          />
        </mask>
        <g mask="url(#mask0_0_1715)">
          <g id="Ellipse 282" filter="url(#filter0_f_0_1715)">
            <path
              d="M68.1833 70.7596C59.1728 101.411 41.7676 137.854 28.166 133.856C14.5644 129.857 12.5371 93.5966 19.0467 58.1957C25.5563 22.7947 58.6729 0.364822 72.2745 4.36327C85.8761 8.36171 77.1937 40.1085 68.1833 70.7596Z"
              fill={fill2 ?? 'url(#paint2_linear_0_1715)'}
            />
          </g>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_0_1715"
        x={-11.2923}
        y={-22.8659}
        width={117.395}
        height={183.794}
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
          result="effect1_foregroundBlur_0_1715"
        />
      </filter>
      <linearGradient
        id="paint0_linear_0_1715"
        x1={8.05557}
        y1={10.5168}
        x2={42.7386}
        y2={57.8423}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1715"
        x1={8.0554}
        y1={10.5168}
        x2={42.7384}
        y2={57.8422}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_0_1715"
        x1={31.7365}
        y1={54.2758}
        x2={11.1511}
        y2={42.5183}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B65FFC" />
        <stop offset={1} stopColor="#B65FFC" stopOpacity={0.21} />
      </linearGradient>
    </defs>
  </svg>
);
export default WaveTopIcon;
