import { memo, SVGAttributes } from 'react';

export const StatusIcon = memo(({ ...rest }: SVGAttributes<SVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <circle cx="8" cy="8" r="8" fill="#BDF0E0" />
    <circle cx="8" cy="8" r="4" fill="#0BB07B" />
  </svg>
));

export default StatusIcon;
