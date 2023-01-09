import useWebView from '@/common/hooks/useWebView';
import { ReactElement } from 'react';
import Header from './header';

export const LayoutWithOutFooter = ({
  children,
  shouldShowBrand = true,
  shouldShowPromoteApp = true,
}: {
  children: ReactElement;
  shouldShowBrand?: boolean;
  shouldShowPromoteApp?: boolean;
}) => {
  const isWebView = useWebView();

  return (
    <>
      {!isWebView && <Header shouldShowBrand={shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />}
      {children}
    </>
  );
};
