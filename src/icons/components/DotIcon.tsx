import * as React from 'react';

export interface IDotIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
}

const DotIcon = ({ fill0, ...restProps }: IDotIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 4 4"
    fill="none"
    {...restProps}
  >
    <circle id="Ellipse 210" cx={2} cy={2} r={2} fill={fill0 ?? 'white'} />
  </svg>
);
export default DotIcon;
