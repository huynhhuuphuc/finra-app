import * as React from 'react';

export interface IRefreshIconProps extends React.SVGProps<SVGSVGElement> {
  fill0?: string;
}

const RefreshIcon = ({ fill0, ...restProps }: IRefreshIconProps) => (
  <svg
    preserveAspectRatio="none"
    overflow="visible"
    style={{
      display: 'block',
    }}
    width="1em"
    height="1em"
    viewBox="0 0 21.5 21.5"
    fill="none"
    {...restProps}
  >
    <g id="elements">
      <path
        id="Icon"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.75 1.5C5.64137 1.5 1.5 5.64137 1.5 10.75C1.5 15.8586 5.64137 20 10.75 20C15.8586 20 20 15.8586 20 10.75C20 10.3358 20.3358 10 20.75 10C21.1642 10 21.5 10.3358 21.5 10.75C21.5 16.6871 16.6871 21.5 10.75 21.5C4.81294 21.5 0 16.6871 0 10.75C0 4.81294 4.81294 0 10.75 0C13.5482 0 16.0972 1.06983 18.0092 2.82115V0.75C18.0092 0.335786 18.345 0 18.7592 0C19.1735 0 19.5092 0.335786 19.5092 0.75V3.88219C19.5092 4.87193 18.2787 5.32302 17.6383 4.57625C15.9437 2.68688 13.486 1.5 10.75 1.5Z"
        fill={fill0 ?? '#141B34'}
      />
    </g>
  </svg>
);
export default RefreshIcon;
