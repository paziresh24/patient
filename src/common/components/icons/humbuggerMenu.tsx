import { SVGAttributes } from 'react';

const HumbuggerMenu = ({ ...rest }: SVGAttributes<SVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>icon</title>
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
};

export default HumbuggerMenu;
