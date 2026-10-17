import * as React from 'react';

export interface IBackIconProps extends React.SVGProps<SVGSVGElement> {
  stroke0?: string;
}

const BackIcon = ({ stroke0, ...restProps }: IBackIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    {...restProps}
  >
    <g id="Back Button Icon">
      <path
        id="Vector"
        d="M20 12H4M10 18L4 12L10 6"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={stroke0 ?? '#50505F'}
      />
    </g>
  </svg>
);
export default BackIcon;
