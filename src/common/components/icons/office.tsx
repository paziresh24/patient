import { memo, SVGAttributes } from 'react';

export const OfficeIcon = memo(({ ...rest }: SVGAttributes<SVGSVGElement>) => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <g clipPath="url(#clip0_1_9)">
      <path d="M1 21H19" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M0.949951 21L0.999951 8.96999C0.999951 8.35999 1.28995 7.78004 1.76995 7.40004L8.77 1.95003C9.49 1.39003 10.5 1.39003 11.23 1.95003L18.23 7.39003C18.72 7.77003 19 8.34999 19 8.96999V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path d="M10 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 13H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <defs>
      <clipPath id="clip0_1_9">
        <rect width="20" height="22" fill="white" />
      </clipPath>
    </defs>
  </svg>
));

export default OfficeIcon;
