import useCustomize from '@/common/hooks/useCustomize';
import clsx from 'clsx';
import { ReactElement } from 'react';
import BottomNavigation from './bottomNavigation';
import Header from './header';

export const LayoutWithOutFooter = ({
  children,
  shouldShowBrand = true,
  shouldShowPromoteApp = true,
  showBottomNavigation = true,
  showHeader = true,
}: {
  children: ReactElement;
  shouldShowBrand?: boolean;
  shouldShowPromoteApp?: boolean;
  showBottomNavigation?: boolean;
  showHeader?: boolean;
}) => {
  const customize = useCustomize(state => state.customize);

  return (
    <div className={clsx({ 'pb-16 md:pb-0': showBottomNavigation })}>
      {customize.showHeader && showHeader && (
        <Header shouldShowBrand={customize.showBrandLogoInHomePage || shouldShowBrand} shouldShowPromoteApp={shouldShowPromoteApp} />
      )}
      {children}
      {showBottomNavigation && <BottomNavigation />}
    </div>
  );
};
