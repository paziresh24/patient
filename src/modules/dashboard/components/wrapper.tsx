import { ReactNode } from 'react';

export const Wrapper = ({ children }: { children: ReactNode }) => {
  return <div className="md:max-w-screen-md h-full  flex flex-col w-full mx-auto md:pt-10 md:space-s-8">{children}</div>;
};
