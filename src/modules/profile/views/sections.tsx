import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import { Fragment } from '@/common/fragment';
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
import PlasmicProfileAbout from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileAbout';
import PlasmicProfileSeo from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileSeo';
import PlasmicProfileGallery from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileGallery';
import PlasmicClaim from '.plasmic/plasmic/paziresh_24/PlasmicClaim';

const { publicRuntimeConfig } = config();

const EditButton = dynamic(() => import('../components/viewAs/editButton'));
const Biography = dynamic(() => import('./biography'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="16rem" rounded="lg" />;
  },
});
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
      ActionButton: editable && information.biography && <EditButton onClick={() => handleViewAs('gallery')} />,
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
        hamdastWidgets
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
          )),
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
        const center = centers?.find?.((item: any) => item?.center_type === 1) ?? centers?.[0];
        const isOnlineVisitCenter = center?.id === CENTERS.CONSULT;
        const doctorExpertise = `${expertises?.expertises?.[0]?.degree_name ?? ''} ${expertises?.expertises?.[0]?.expertise_name ?? ''}`;
        const about = `<p>${information.display_name}، ${doctorExpertise ?? 'سایر'} در شهر ${center?.city ?? '(ثبت نشده)'} است. مطب ${
          information.display_name
        } در ${center?.address ?? '(ثبت نشده)'} واقع شده است که در صورت نیاز می‌توانید با شماره <span class="inline-block">${
          !isOnlineVisitCenter && !!center?.display_number_array[0] ? center?.display_number_array[0] : '(ثبت نشده)'
        }</span> تماس بگیرید.</p>
        <p>تاکنون   ${convertLongToCompactNumber(history?.count_of_page_view) ?? 0} نفر از پروفایل ${information.display_name}، ${
          doctorExpertise ?? 'سایر'
        }  بازدید کرده‌اند؛ ${
          !feedbacks?.details?.hide_rates
            ? `همچنین ${
                +(
                  (+(feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                    +(feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                    +(feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
                  3
                )?.toFixed(1) * 20
              }٪ مراجعین (${feedbacks?.details?.count_of_feedbacks ?? 0} نظر ثبت شده) از ایشان رضایت داشته‌اند. <b>نظرات ${
                information.display_name
              }</b> در پروفایل دکتر در پذیرش۲۴  قابل مشاهده است.</p>`
            : ''
        }
        ${
          center?.freeturn_text
            ? `<p>زودترین زمان رزرو نوبت از مطب ${information.display_name} ${center?.freeturn_text} می‌باشد که می‌توانید از طریق وبسایت و یا اپلیکیشن نوبت‌دهی پذیرش۲۴ نوبت خود را به صورت اینترنتی و غیرحضوری دریافت کنید.</p>`
            : ''
        }
        <p>اگر زمان کافی برای مراجعه حضوری به پزشک مورد نظر خود را ندارید، به پروفایل پزشک در <a href="/" class="text-primary">پذیرش۲۴</a> سری بزنید و در صورت فعال بودن خدمات ویزیت آنلاین ایشان، نوبت ویزیت آنلاین خود را دریافت کنید؛ در غیر این‌صورت می‌توانید از سایر پزشکان ${
          doctorExpertise ?? 'سایر'
        } <a href="/consult" class="text-primary"> ویزیت آنلاین (تلفنی و متنی)</a> نوبت بگیرید.</p>
        <p>در صورت نیاز به عکس و بیوگرافی و <b>آدرس اینستاگرام ${
          information.display_name
        }</b>، کانال تلگرام و وبسایت ایشان، اطلاعات موجود در پروفایل ایشان را مشاهده نمایید.</p>
        <ui>
        <li>آدرس مطب ${information.display_name}: ${
          isOnlineVisitCenter || (!center?.address && !center?.city) ? 'ثبت نشده' : `${center?.city}، ${center?.address}`
        }</li>
        <li>تلفن مطب ${information.display_name}: <span class="inline-block">${
          isOnlineVisitCenter || !center?.display_number_array[0] ? 'ثبت نشده' : center?.display_number_array[0] ?? ''
        }</span></li>
        <li>تخصص ${information.display_name}: ${
          expertises?.expertises?.map?.((item: any) => item?.alias_title)?.join('/ ') ?? expertises?.expertises?.[0]?.name
        }</li>
        </ui>
        `;

        return {
          similarLinks: similarLinks?.map((item: any) => ({ name: item.caption, url: item.link })),
          about,
          breadcrumbs: seo.breadcrumbs,
        };
      },
      children: (props: any) => {
        const center = centers?.find?.((item: any) => item?.center_type === 1) ?? centers?.[0];
        const isOnlineVisitCenter = center?.id === CENTERS.CONSULT;
        const doctorExpertise = `${expertises?.expertises?.[0]?.degree_name ?? ''} ${expertises?.expertises?.[0]?.expertise_name ?? ''}`;

        return (
          <Fragment2
            name="ProfileSeo"
            Component={PlasmicProfileSeo}
            args={{
              information,
              feedbacks,
              center,
              isOnlineVisitCenter,
              doctorExpertise,
              countOfPageView: convertLongToCompactNumber(history?.count_of_page_view),
              bredcrumbs: seo.breadcrumbs,
              similarLinks,
              expertises,
            }}
          />
        );
      },
    },
  ] as const;
};

