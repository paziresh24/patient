import { memo, type SVGAttributes } from 'react';

/** Six-dot grip / drag-handle (2×3). */
const GripIcon = memo(({ width = 14, height = 14, ...rest }: SVGAttributes<SVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle cx="5" cy="3" r="1.5" />
    <circle cx="11" cy="3" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    <circle cx="11" cy="8" r="1.5" />
    <circle cx="5" cy="13" r="1.5" />
    <circle cx="11" cy="13" r="1.5" />
  </svg>
));

export default GripIcon;
