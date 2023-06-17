import { memo, SVGAttributes } from 'react';

export const RefreshIcon = memo(({ ...rest }: SVGAttributes<SVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 4 16 4 16M3 12C3 7.02944 7 3 12 3C18 3 21 8 21 8M21 8V3.5M21 8H17M4 16H8.06448M4 16V20.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export default RefreshIcon;
