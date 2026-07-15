import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import DoctorIcon from '@/common/components/icons/doctor';
import EyeIcon from '@/common/components/icons/eye';
import { CENTERS } from '@/common/types/centers';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import pick from 'lodash/pick';
import config from 'next/config';
import dynamic from 'next/dynamic';
import { FragmentRateReview } from './rateReview/fragmentRateReview';
import Hamdast from '@/modules/hamdast/render';
import ProfileFallback from '@/modules/hamdast/profileFallback';
import { getProfileSeoSectionData } from '@/modules/profile/functions/buildProfileSeoAboutHtml';
import ProfileSectionCard from './profileSectionCard';

const { publicRuntimeConfig } = config();

const EditButton = dynamic(() => import('../components/viewAs/editButton'));
const Biography = dynamic(() => import('./biography'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="16rem" rounded="lg" />;
  },
});
const OwnPage = dynamic(() => import('./ownPage'));
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
      isShow: information.biography,
      isShowFallback: !information.biography && editable,
      children: () => (
        <ProfileSectionCard
          title="درباره پزشک"
          id="about"
          icon={<DoctorIcon width={18} height={18} />}
          action={editable && information.biography && <EditButton onClick={() => handleViewAs('biography')} />}
        >
          <div className="[&_*]:text-sm [&_*]:tracking-normal [&_*]:leading-normal [&_h1]:font-bold [&_h2]:font-bold [&_p]:font-normal">
            <Biography
              content={information.biography}
              className="mx-4 rounded-xl border border-slate-100 bg-white md:mx-0"
            />
          </div>
        </ProfileSectionCard>
      ),
      fallback: () => (
        <ProfileSectionCard title="درباره پزشک" icon={<DoctorIcon width={18} height={18} />}>
          <div
            onClick={() => handleViewAs('biography')}
            className="mx-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-5 text-slate-400 transition-all hover:bg-slate-50 space-s-2 md:mx-0"
          >
            <AddIcon className="h-5 w-5" />
            <Text fontWeight="medium">نوشتن بیوگرافی</Text>
          </div>
        </ProfileSectionCard>
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
      noWrapper: true,
      isShow: customize.showGalleryProfile && media?.gallery?.length > 0,
      isShowFallback: editable,
      function: () => {
        const items = media?.gallery;
        const reformattedItems = items?.map((item: any) => publicRuntimeConfig.CDN_BASE_URL + item.image) ?? [];
        return {
          items: reformattedItems,
        };
      },
      children: (props: any) => (
        <ProfileSectionCard
          title="تصاویر"
          icon={<EyeIcon width={18} height={18} />}
          action={editable && media?.gallery?.length > 0 && <EditButton onClick={() => handleViewAs('gallery')} />}
        >
          <Gallery items={props?.items ?? []} className="mx-4 rounded-xl border border-slate-100 bg-white md:mx-0" />
        </ProfileSectionCard>
      ),
      fallback: () => (
        <ProfileSectionCard title="تصاویر" icon={<EyeIcon width={18} height={18} />}>
          <div
            onClick={() => handleViewAs('gallery')}
            className="mx-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-5 text-slate-400 transition-all hover:bg-slate-50 space-s-2 md:mx-0"
          >
            <AddIcon className="h-5 w-5" />
            <Text fontWeight="medium">افزودن تصویر</Text>
          </div>
        </ProfileSectionCard>
      ),
    },
    // Waiting Time Statistics
    {
      title: 'نمودار زمان انتظار بیماران ویزیت آنلاین',
      isShow:
        customize.showWaitingTimeStatistics &&
        (feedbacks?.statistics?.find((s: { center_id: string }) => s.center_id === CENTERS.CONSULT)?.statistics?.length ?? 0) >
          0,
      function: () => {
        const consultStatistics = feedbacks?.statistics?.find(
          (s: { center_id: string }) => s.center_id === CENTERS.CONSULT,
        )?.statistics;

        return {
          slug: seo.slug,
          statistics: consultStatistics ?? [],
        };
      },
      children: (props: any) => <WaitingTimeStatistics className="p-4 bg-white md:rounded-lg" {...props} />,
    },
    // Own Page
    {
      isShow:
        !customize?.partnerKey &&
        centers?.length > 0 &&
        centers.every((center: { status: number }) => center.status === 2),
      noWrapper: true,
      children: () => <OwnPage fullname={information.display_name} />,
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
    // Reviews (desktop — mobile renders from aside at page bottom)
    {
      id: 'reviews',
      noWrapper: true,
      isShow: customize.showRateAndReviews,
      children: () => (
        <div className="hidden flex-col gap-y-3 md:flex">
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
      children: (props: any) => (
        <ProfileSeoBox
          profileType="doctor"
          about={props?.about}
          breadcrumbs={props?.breadcrumbs}
          similarLinks={props?.similarLinks}
        />
      ),
    },
  ] as const;
};

