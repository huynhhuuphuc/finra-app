import * as React from 'react';

export interface IStepDoneIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
}

const StepDoneIcon = ({ fill0, fill1, ...restProps }: IStepDoneIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 36 36"
    fill="none"
    {...restProps}
  >
    <g id="Step Text - Horizontal">
      <circle id="Circle" cx={18} cy={18} r={18} fill={fill0 ?? '#B65FFC'} />
      <path
        id="Vector"
        d="M27.75 11.9621L16.829 25.6172L8.25 18.4672L9.86868 16.5248L16.4648 22.0207L25.7772 10.3839L27.75 11.9621V11.9621Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fill1 ?? 'white'}
      />
    </g>
  </svg>
);
export default StepDoneIcon;
