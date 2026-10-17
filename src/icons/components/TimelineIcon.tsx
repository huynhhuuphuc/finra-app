import * as React from 'react';

export interface ITimelineIconProps extends React.SVGProps<SVGSVGElement> {
  stroke0?: string;
}

const TimelineIcon = ({ stroke0, ...restProps }: ITimelineIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 45 480"
    fill="none"
    {...restProps}
  >
    <path
      id="Vector 2865"
      d="M43.2599 0C43.2599 48.3325 43.1822 130.133 43.1822 191.637C43.8972 234.863 43.1822 303.95 43.1822 336.626C43.1822 408.871 1.5 383.675 1.5 480"
      strokeWidth={3}
      stroke={stroke0 ?? 'url(#paint0_linear_0_1187)'}
    />
    <defs>
      <linearGradient
        id="paint0_linear_0_1187"
        x1={1.5}
        y1={0}
        x2={-2.40451}
        y2={479.968}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.15743} stopColor="white" />
        <stop offset={0.284176} stopColor="#B65FFC" />
        <stop offset={0.615905} stopColor="#B65FFC" stopOpacity={0.4} />
        <stop offset={1} stopColor="white" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);
export default TimelineIcon;
