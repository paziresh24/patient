import useWebView from '@/common/hooks/useWebView';
import { ReactElement } from 'react';
import Header from './header';

export const LayoutWithOutFooter = ({ children, shouldShowBrand = true }: { children: ReactElement; shouldShowBrand?: boolean }) => {
  const isWebView = useWebView();

  return (
    <>
      {!isWebView && <Header shouldShowBrand={shouldShowBrand} />}
      {children}
    </>
  );
};
