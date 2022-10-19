import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Header from './header';

export const LayoutWithOutFooter = ({ children, shouldShowBrand = true }: { children: ReactElement; shouldShowBrand?: boolean }) => {
  const { query } = useRouter();

  return (
    <>
      {!query.isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
    </>
  );
};
