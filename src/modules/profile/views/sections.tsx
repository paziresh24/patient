import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import { CENTERS } from '@/common/types/centers';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import pick from 'lodash/pick';
import config from 'next/config';
import dynamic from 'next/dynamic';
import { FragmentRateReview } from './rateReview/fragmentRateReview';
import ProfileGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_profile/PlasmicGlobalContextsProvider';
import classNames from '@/common/utils/classNames';
import Hamdast from '@/modules/hamdast/render';
import { Fragment2 } from '@/common/fragment/fragment2';
import ProfileFallback from '@/modules/hamdast/profileFallback';
import { getProfileSeoSectionData } from '@/modules/profile/functions/buildProfileSeoAboutHtml';

const { publicRuntimeConfig } = config();

const EditButton = dynamic(() => import('../components/viewAs/editButton'));
const Biography = dynamic(() => import('./biography'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="16rem" rounded="lg" />;
  },
});
const PlasmicProfileAbout = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout'));
const PlasmicProfileSeo = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileSeo'));
const PlasmicProfileGallery = dynamic(() => import('.plasmic/plasmic/paziresh_24_profile/PlasmicProfileGallery'));
const PlasmicClaim = dynamic(() => import('.plasmic/plasmic/paziresh_24/PlasmicClaim'));
const WaitingTimeStatistics = dynamic(() => import('./waitingTimeStatistics'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="8rem" rounded="lg" />;
  },
});
const Gallery = dynamic(() => import('./gallery'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="8rem" rounded="lg" />;
  },
});
const RateReview = dynamic(() => import('./rateReview'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="30rem" rounded="lg" />;
  },
});
const ProfileSeoBox = dynamic(() => import('./seoBox'));

export const sections = (data: any) => {
  const {
    information,
    centers,
    expertises,
    feedbacks,
    media,
    history,
    symptomes,
    similarLinks,
    customize,
    editable,
    handleViewAs,
    seo,
    onlineVisit,
    fragmentComponents,
    hamdastWidgetsData,
    hamdastWidgets,
    user_id,
  } = data;

  const profileData = pick(data, [
    'information',
    'centers',
    'expertises',
    'feedbacks',
    'media',
    'history',
    'symptomes',
    'onlineVisit',
    'seo',
    'user_id',
  ]);

  return [
    // About
    {
      noWrapper: true,
      ActionButton: editable && information.biography && <EditButton onClick={() => handleViewAs('biography')} />,
      isShow: information.biography,
      isShowFallback: !information.biography && editable,
      children: (props: any) => (
        <ProfileGlobalContextsProvider>
          <div className="[&_*]:text-sm [&_*]:tracking-normal [&_*]:leading-normal [&_h1]:font-bold [&_h2]:font-bold [&_p]:font-normal ">
            <Fragment2 name="ProfileAbout" Component={PlasmicProfileAbout} args={{ ...profileData }} />
          </div>
        </ProfileGlobalContextsProvider>
      ),
      fallback: (props: any) => (
        <div
          onClick={() => handleViewAs('biography')}
          className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
        >
          <AddIcon className="w-5 h-5" />
          <Text fontWeight="medium">نوشتن بیوگرافی</Text>
        </div>
      ),
    },
    {
      isShow: !customize?.partnerKey,
      noWrapper: true,
      children: () =>
        hamdastWidgets
          ?.filter((widget: any) => widget?.placement?.includes?.('section_one'))
          ?.map((widget: any) => (
            <Hamdast
              key={widget.id}
              id={widget.id}
              app={widget?.app}
              backendData={hamdastWidgetsData?.[widget.id] ?? undefined}
              profileData={profileData}
              widgetData={{
                placement: widget?.placement,
                placement_metadata: widget.placements_metadata,
              }}
            />
          )),
    },
    // Video
    {
      isShow: media?.aparat && media?.aparat !== '0',
      children: (props: any) => <div className="overflow-hidden md:rounded-lg" dangerouslySetInnerHTML={{ __html: media?.aparat }} />,
    },
    // Gallery
    {
      ActionButton: editable && media?.gallery?.length > 0 && <EditButton onClick={() => handleViewAs('gallery')} />,
      isShow: customize.showGalleryProfile && media?.gallery?.length > 0,
      isShowFallback: editable,
      function: () => {
        const items = media?.gallery;
        const reformattedItems = items?.map((item: any) => publicRuntimeConfig.CDN_BASE_URL + item.image) ?? [];
        return {
          items: reformattedItems,
        };
      },
      children: (props: any) => {
        const items = media?.gallery;
        const reformattedItems = items?.map((item: any) => publicRuntimeConfig.CDN_BASE_URL + item.image) ?? [];

        return (
          <Fragment2
            name="ProfileGallery"
            Component={PlasmicProfileGallery}
            args={{
              gallery: reformattedItems,
            }}
          />
        );
      },
      fallback: (props: any) => (
        <div
          onClick={() => handleViewAs('gallery')}
          className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
        >
          <AddIcon className="w-5 h-5" />
          <Text fontWeight="medium">افزودن تصویر</Text>
        </div>
      ),
    },
    // Waiting Time Statistics
    {
      title: 'نمودار زمان انتظار بیماران ویزیت آنلاین',
      isShow:
        customize.showWaitingTimeStatistics &&
        feedbacks?.statistics?.find((s: { center_id: string }) => s.center_id === CENTERS.CONSULT)?.statistics?.length > 0,
      function: () => {
        return {
          slug: seo.slug,
          statistics: feedbacks?.statistics.find((s: { center_id: string }) => s.center_id === CENTERS.CONSULT).statistics,
        };
      },
      children: (props: any) => <WaitingTimeStatistics className="p-4 bg-white md:rounded-lg" {...props} />,
    },
    // Own Page
    {
      isShow: !customize?.partnerKey && centers?.length > 0,
      noWrapper: true,
      children: () => <Fragment2 name="Claim" Component={PlasmicClaim} args={{ ...profileData }} />,
    },
    {
      isShow: !customize?.partnerKey,
      noWrapper: true,
      children: () =>
      (<>
        {hamdastWidgets
          ?.filter((widget: any) => widget?.placement?.includes?.('section_two'))
          ?.map((widget: any) => (
            <Hamdast
              key={widget.id}
              id={widget.id}
              app={widget?.app}
              backendData={hamdastWidgetsData?.[widget.id] ?? undefined}
              profileData={profileData}
              widgetData={{
                placement: widget?.placement,
                placement_metadata: widget.placements_metadata,
              }}
            />
          ))}


        <ProfileFallback isInstall={hamdastWidgets?.some((widget: any) => widget.app == 'bimehnama')} app='bimehnama' title='بیمه‌های طرف قرارداد' editLabel="ویرایش بیمه‌های طرف قرارداد" addLabel='افزودن بیمه‌های طرف قرارداد' profileData={profileData} />
      </>)
    },
    // Reviews
    {
      id: 'reviews',
      isShow: customize.showRateAndReviews,
      children: (props: any) => (
        <div
          className={classNames('flex flex-col gap-y-3', {
            '!hidden md:!flex': fragmentComponents?.raviComponentTopOrderProfile,
          })}
        >
          <FragmentRateReview profileData={profileData} />
        </div>
      ),
    },
    {
      isShow: !customize?.partnerKey,
      noWrapper: true,
      children: () =>
        hamdastWidgets
          ?.filter((widget: any) => widget?.placement?.includes?.('section_three'))
          ?.map((widget: any) => (
            <Hamdast
              key={widget.id}
              id={widget.id}
              app={widget?.app}
              backendData={hamdastWidgetsData?.[widget.id] ?? undefined}
              profileData={profileData}
              widgetData={{
                placement: widget?.placement,
                placement_metadata: widget.placements_metadata,
              }}
            />
          )),
    },
    // Seo Box
    {
      isShow: customize.showSeoBoxs,
      function: () => {
        const countOfPageView = convertLongToCompactNumber(history?.count_of_page_view);
        const seoSectionData = getProfileSeoSectionData({
          information,
          centers,
          expertises,
          feedbacks,
          history,
          similarLinks,
          seo,
          countOfPageView,
        });

        return {
          similarLinks: seoSectionData.similarLinks,
          about: seoSectionData.about,
          breadcrumbs: seoSectionData.breadcrumbs,
        };
      },
      children: () => {
        const countOfPageView = convertLongToCompactNumber(history?.count_of_page_view);
        const seoSectionData = getProfileSeoSectionData({
          information,
          centers,
          expertises,
          feedbacks,
          history,
          similarLinks,
          seo,
          countOfPageView,
        });

        return (
          <Fragment2
            name="ProfileSeo"
            Component={PlasmicProfileSeo}
            args={{
              information,
              feedbacks,
              center: seoSectionData.center,
              isOnlineVisitCenter: seoSectionData.isOnlineVisitCenter,
              doctorExpertise: seoSectionData.doctorExpertise,
              countOfPageView,
              bredcrumbs: seo.breadcrumbs,
              similarLinks,
              expertises,
              about: seoSectionData.about,
            }}
          />
        );
      },
    },
  ] as const;
};

