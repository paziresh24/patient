import { memo, SVGAttributes } from 'react';

export const CheckIcon = memo(({ ...rest }: SVGAttributes<SVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.8405 3.44714C14.1458 3.72703 14.1664 4.20146 13.8865 4.5068L6.55319 12.5068C6.41496 12.6576 6.22113 12.7454 6.01662 12.7498C5.8121 12.7543 5.61464 12.675 5.47 12.5303L2.13666 9.197C1.84377 8.90411 1.84377 8.42923 2.13666 8.13634C2.42956 7.84345 2.90443 7.84345 3.19732 8.13634L5.97677 10.9158L12.7808 3.49321C13.0607 3.18787 13.5351 3.16724 13.8405 3.44714Z"
      fill="currentColor"
    />
  </svg>
));

export default CheckIcon;
