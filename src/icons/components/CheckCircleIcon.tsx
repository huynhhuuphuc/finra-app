import * as React from 'react';

export interface ICheckCircleIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
  fill1?: string;
  fill2?: string;
}

const CheckCircleIcon = ({ fill0, fill1, fill2, ...restProps }: ICheckCircleIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 16.125 16.125"
    fill="none"
    {...restProps}
  >
    <g id="elements">
      <path
        id="Tone"
        d="M15.5625 8.0625C15.5625 3.92036 12.2046 0.5625 8.0625 0.5625C3.92036 0.5625 0.5625 3.92036 0.5625 8.0625C0.5625 12.2046 3.92036 15.5625 8.0625 15.5625C12.2046 15.5625 15.5625 12.2046 15.5625 8.0625Z"
        fill={fill0 ?? '#B65FFC'}
      />
      <g id="Icon">
        <path
          d="M11.4771 6.1926C11.6871 5.96359 11.6716 5.60778 11.4426 5.39785C11.2136 5.18793 10.8578 5.2034 10.6479 5.43241L6.91983 9.49934L5.46025 8.03976C5.24058 7.82009 4.88442 7.82009 4.66475 8.03976C4.44508 8.25943 4.44508 8.61558 4.66475 8.83525L6.53975 10.7103C6.64824 10.8187 6.79633 10.8782 6.94972 10.8749C7.10311 10.8715 7.24848 10.8057 7.35215 10.6926L11.4771 6.1926Z"
          fill={fill1 ?? 'white'}
        />
        <path
          d="M8.0625 16.125C3.6097 16.125 0 12.5153 0 8.0625C0 3.6097 3.6097 0 8.0625 0C12.5153 0 16.125 3.6097 16.125 8.0625C16.125 12.5153 12.5153 16.125 8.0625 16.125ZM1.125 8.0625C1.125 11.894 4.23102 15 8.0625 15C11.894 15 15 11.894 15 8.0625C15 4.23102 11.894 1.125 8.0625 1.125C4.23102 1.125 1.125 4.23102 1.125 8.0625Z"
          fillRule="evenodd"
          clipRule="evenodd"
          fill={fill2 ?? 'white'}
        />
      </g>
    </g>
  </svg>
);
export default CheckCircleIcon;
