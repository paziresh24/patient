import useCustomize from '@/common/hooks/useCustomize';
import { ReactElement } from 'react';
import BottomNavigation from './bottomNavigation';
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
  const customize = useCustomize(state => state.customize);

  return (
    <>
      {customize.showHeader && (
        <Header shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />
      )}
      {children}
      <BottomNavigation />
    </>
  );
};
