import * as React from 'react';

export interface IWaveBottom2IconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const WaveBottom2Icon = ({ fill0, fill1, fill2, ...restProps }: IWaveBottom2IconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 91.4083 142.876"
    fill="none"
    {...restProps}
  >
    <g id="bottom">
      <path
        id="Vector 61"
        d="M1.56284e-05 7.14481e-05L91.0191 0.251555C91.0191 0.251555 84.6155 19.9868 57.6039 37.5447C30.5923 55.1027 25.7631 70.3957 37.2793 96.7067C48.7954 123.018 0.389247 142.624 0.389247 142.624L1.56284e-05 7.14481e-05Z"
        fill={fill0 ?? 'url(#paint0_linear_0_1747)'}
      />
      <g id="Mask Group">
        <mask
          id="mask0_0_1747"
          style={{
            maskType: 'alpha',
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={92}
          height={143}
        >
          <path
            id="Vector 62"
            d="M0 0L91.0191 0.251483C91.0191 0.251483 84.6155 19.9867 57.6039 37.5447C30.5923 55.1026 25.7631 70.3957 37.2793 96.7066C48.7954 123.018 0.389232 142.624 0.389232 142.624L0 0Z"
            fill={fill1 ?? 'url(#paint1_linear_0_1747)'}
          />
        </mask>
        <g mask="url(#mask0_0_1747)">
          <g id="Ellipse 282" filter="url(#filter0_f_0_1747)">
            <path
              d="M87.0118 82.2779C74.8768 111.914 61.2314 139.635 43.7538 135.946C28.8939 129.637 21.0247 106.813 27.25 70.374C33.4753 33.9349 75.9218 14.5775 93.3994 18.2661C110.877 21.9546 99.1468 52.6421 87.0118 82.2779Z"
              fill={fill2 ?? 'url(#paint2_linear_0_1747)'}
            />
          </g>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_0_1747"
        x={-1.66536}
        y={-8.94928}
        width={130.699}
        height={171.996}
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
          result="effect1_foregroundBlur_0_1747"
        />
      </filter>
      <linearGradient
        id="paint0_linear_0_1747"
        x1={11.0985}
        y1={10.521}
        x2={41.1641}
        y2={67.2529}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_1747"
        x1={11.0985}
        y1={10.5209}
        x2={41.1641}
        y2={67.2528}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#320421" />
        <stop offset={1} stopColor="#502B76" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_0_1747"
        x1={36.3689}
        y1={61.8006}
        x2={0.576505}
        y2={98.6921}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B65FFC" stopOpacity={0.8} />
        <stop offset={1} stopColor="#B65FFC" stopOpacity={0.21} />
      </linearGradient>
    </defs>
  </svg>
);
export default WaveBottom2Icon;
