'use client';

import useResponsive from '@/common/hooks/useResponsive';
import { createContext, useContext, type ReactNode } from 'react';

export type DoctorHomeSheetLayout = 'mobile' | 'desktop';

const DoctorHomeSheetLayoutContext = createContext<DoctorHomeSheetLayout | null>(null);

/** جلوگیری از باز شدن دو شیت وقتی نسخه موبایل و دسکتاپ هم‌زمان mount هستند */
export function DoctorHomeSheetLayoutProvider({
  layout,
  children,
}: {
  layout: DoctorHomeSheetLayout;
  children: ReactNode;
}) {
  return (
    <DoctorHomeSheetLayoutContext.Provider value={layout}>{children}</DoctorHomeSheetLayoutContext.Provider>
  );
}

export function useDoctorHomeSheetHost() {
  const layout = useContext(DoctorHomeSheetLayoutContext);
  const { isDesktop, isMobile } = useResponsive();

  if (layout == null) return true;
  if (!isDesktop && !isMobile) return layout === 'mobile';
  return layout === 'desktop' ? isDesktop : isMobile;
}

export function useSheetDrawerProps(sheet: { open: boolean; closeSheet: () => void }) {
  const isHost = useDoctorHomeSheetHost();

  return {
    open: sheet.open && isHost,
    onOpenChange: (nextOpen: boolean) => {
      if (nextOpen) return;
      sheet.closeSheet();
    },
  };
}
