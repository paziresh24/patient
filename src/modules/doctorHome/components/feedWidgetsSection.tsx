import Skeleton from '@/common/components/atom/skeleton';

import classNames from '@/common/utils/classNames';

import type { HamdastCatalogApp } from '@/modules/hamdast/apis/appList';

import { useHamdastAppCatalog } from '@/modules/hamdast/apis/appList';

import { useUserInfoStore } from '@/modules/login/store/userInfo';

import { useMemo } from 'react';

import { DsCard, DsSectionHeader, ds } from '../designSystem';

import { useDoctorHomeAppModal } from '../hooks/useDoctorHomeAppModal';

import { useInstalledAppKeys } from '../hooks/useInstalledAppKeys';

import { useSheetRoute } from '../hooks/useSheetRoute';

import { sendDoctorHomeEvent } from '../utils/analytics';

import { groupActiveAppsByCategory } from '../utils/widgetCapabilitySections';

import { ActiveWidgetsCard } from './feedWidgets/activeWidgetsCard';

import { ToolboxIcon } from './icons';

import { ToolboxDrawer } from './toolboxDrawer';



const CardSkeleton = () => (

  <DsCard padding="none" className="overflow-hidden !shadow-sm">

    {[0, 1].map(i => (

      <div key={i}>

        <div className={classNames('border-b border-slate-100', ds.surface.neutralSoft, ds.layout.groupLabelPadding)}>

          <Skeleton h="0.625rem" w="4rem" rounded="full" />

        </div>

        {[0, 1].map(j => (

          <div

            key={j}

            className={classNames(

              'flex items-center',

              ds.layout.listRowGap,

              ds.layout.rowPadding,

              j < 1 && 'border-b border-slate-100',

            )}

          >

            <Skeleton h="2.25rem" w="2.25rem" rounded="lg" />

            <div className="min-w-0 flex-1">

              <Skeleton h="0.875rem" w="55%" rounded="full" />

              <Skeleton h="0.625rem" w="35%" rounded="full" className="mt-1" />

            </div>

          </div>

        ))}

      </div>

    ))}

  </DsCard>

);



export const FeedWidgetsSection = ({ widgetShell = false }: { widgetShell?: boolean }) => {

  const userId = useUserInfoStore(state => state.info?.id);

  const openDoctorHomeApp = useDoctorHomeAppModal();

  const toolboxSheet = useSheetRoute('toolbox');

  const { data: apps, isLoading } = useHamdastAppCatalog();

  const { installedKeys } = useInstalledAppKeys(userId);



  const groups = useMemo(

    () => (apps ? groupActiveAppsByCategory(apps, installedKeys) : []),

    [apps, installedKeys],

  );



  const openApp = (app: HamdastCatalogApp) => {

    sendDoctorHomeEvent(userId, 'widget_open', { app_key: app.app_key, title: app.title });

    openDoctorHomeApp(app.app_key);

  };



  const openToolbox = () => {

    sendDoctorHomeEvent(userId, 'tools_see_all');

    toolboxSheet.openSheet();

  };



  const sectionHeader = (

    <DsSectionHeader

      title="ابزارک‌های من"

      linkLabel="جعبه ابزار"

      linkAriaLabel="باز کردن جعبه ابزار"

      linkIcon={<ToolboxIcon size="sm" />}

      onPress={openToolbox}

    />

  );



  return (

    <>

      <section dir="rtl" className="space-y-2">

        {sectionHeader}

        {isLoading ? <CardSkeleton /> : groups.length > 0 ? (

          <ActiveWidgetsCard groups={groups} onOpenApp={openApp} widgetShell={widgetShell} />

        ) : null}

      </section>

      <ToolboxDrawer

        open={toolboxSheet.open}

        onOpenChange={open => {

          if (!open) toolboxSheet.closeSheet();

        }}

        onBeforeOpenApp={() => toolboxSheet.closeSheet('replace')}

      />

    </>

  );

};


