import React, { memo } from 'react';

interface Props extends React.SVGAttributes<SVGElement> {
  dir: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  width?: string;
  height?: string;
  style?: React.StyleHTMLAttributes<SVGAElement>;
  className?: string;
}

const rotateDegrees = {
  top: '270deg',
  bottom: '90deg',
  left: '180deg',
  right: '360deg',
};
export const ChevronIcon = memo(({ dir = 'left', ...rest }: Props) => (
  <svg
    width="8"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotateDegrees[dir]})` }}
    {...rest}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.658146 0.39655C0.95104 0.103657 1.42591 0.103657 1.71881 0.39655L6.21881 4.89655C6.5117 5.18944 6.5117 5.66432 6.21881 5.95721L1.71881 10.4572C1.42591 10.7501 0.95104 10.7501 0.658146 10.4572C0.365253 10.1643 0.365253 9.68944 0.658146 9.39655L4.62782 5.42688L0.658146 1.45721C0.365253 1.16432 0.365253 0.689443 0.658146 0.39655Z"
      fill="currentColor"
    />
  </svg>
));

export default ChevronIcon;
