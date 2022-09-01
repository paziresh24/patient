import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Header from './header';

export const LayoutWithOutFooter = ({ children }: { children: ReactElement }) => {
  const { query } = useRouter();

  return (
    <>
      {!query.isWebView && <Header />}
      {children}
    </>
  );
};
