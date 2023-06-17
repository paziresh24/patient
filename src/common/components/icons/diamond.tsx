import { memo, SVGAttributes } from 'react';

const DiamondIcon = memo(({ ...rest }: SVGAttributes<SVGElement>) => (
  <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M1 6.66667L5.48652 1.33982C5.66787 1.1245 5.93653 1 6.21981 1H9.59091M1 6.66667L11.5 18M1 6.66667H7.68182M9.59091 1H13.4091M9.59091 1L7.68182 6.66667M11.5 18L22 6.66667M11.5 18L7.68182 6.66667M11.5 18L15.3182 6.66667M7.68182 6.66667H15.3182M22 6.66667L17.5135 1.33982C17.3321 1.1245 17.0635 1 16.7802 1H13.4091M22 6.66667H15.3182M15.3182 6.66667L13.4091 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export default DiamondIcon;
