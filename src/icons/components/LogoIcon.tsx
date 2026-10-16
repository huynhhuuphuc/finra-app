import * as React from 'react';

export interface ILogoIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const LogoIcon = ({ fill0, fill1, fill2, ...restProps }: ILogoIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 25.6721 38.3977"
    fill="none"
    {...restProps}
  >
    <g id="Group">
      <path
        id="Vector"
        d="M21.957 13.6838H3.05062C1.37452 13.6838 0.0336413 15.0123 0.0336413 16.6729V35.405C0.0336413 38.0621 3.28527 39.3906 5.19603 37.5307L24.1024 18.7986C25.9797 16.9054 24.6388 13.6838 21.957 13.6838Z"
        fill={fill0 ?? 'url(#paint0_linear_0_255)'}
      />
      <path
        id="Vector_2"
        d="M22.5603 0H3.11754C1.40792 0 0 1.36173 0 3.08881V22.3523C0 25.0758 3.3522 26.4707 5.29647 24.5112L24.7392 5.24765C26.717 3.3213 25.3426 0 22.5603 0Z"
        fill={fill1 ?? 'url(#paint1_linear_0_255)'}
      />
      <path
        id="Vector_3"
        d="M5.33004 24.5112L16.2582 13.6838H3.05055C1.37445 13.6838 0.0335694 15.0123 0.0335694 16.6729V22.3191C4.74131e-05 25.0758 3.35225 26.4375 5.33004 24.5112Z"
        fill={fill2 ?? '#2F7BF2'}
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_0_255"
        x1={22.109}
        y1={14.8854}
        x2={-0.288279}
        y2={28.2578}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C06AE4" />
        <stop offset={1} stopColor="#4D24C6" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_0_255"
        x1={25.0137}
        y1={0.869566}
        x2={0.117108}
        y2={15.4178}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FDC2" />
        <stop offset={1} stopColor="#00C3DE" />
      </linearGradient>
    </defs>
  </svg>
);
export default LogoIcon;
