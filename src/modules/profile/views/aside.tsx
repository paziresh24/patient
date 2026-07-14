import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Services from './services';
import pick from 'lodash/pick';
import { FragmentRateReview } from './rateReview/fragmentRateReview';
import Hamdast from '@/modules/hamdast/render';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { SamanBooking } from '@/modules/samanBooking';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import useClientReady from '@/common/hooks/useClientReady';
import PhoneIcon from '@/common/components/icons/phone';
import CentersInfo from './centersInfo';
import ProfileSectionCard from './profileSectionCard';
import RismanCard from './risman/rismanCard';

const RecommendWrapper = dynamic(() => import('./recommend'));

const getDoctorExpertiseMeta = (expertises: any) => ({
  expertise: expertises?.expertises?.[0]?.alias_title ?? 'سایر',
  groupExpertise: expertises?.group_expertises?.[0]?.name ?? 'سایر',
});

export const useAsideSections = (data: any) => {
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
    isBulk,
    onlineVisit,
    waitingTimeInfo,
    fragmentComponents,
    hamdast,
    hamdastWidgetsData,
    hamdastWidgets,
    user_id,
  } = data;

  const isClientReady = useClientReady();
  const isSamanBookingFlag = useFeatureIsOn('saman-booking');
  const isSamanBookingEnabled = isClientReady && isSamanBookingFlag;

  const profileData = pick(data, [
    'information',
    'centers',
    'expertises',
    'feedbacks',
    'media',
    'waitingTimeInfo',
    'history',
    'symptomes',
    'seo',
    'onlineVisit',
    'user_id',
  ]);

  return [
    {
      id: 'saman-booking',
      isShow: isSamanBookingEnabled,
      function: () => {
        return {
          expertises,
          doctorCity: information.city_en_slug,
        };
      },
      children: (props: any) => <SamanBooking {...props} slug={seo.slug} displayName={information.display_name} {...props} />,
    },
    {
      id: 'book-me',
      isShow: centers?.length > 0 && !isSamanBookingEnabled,
      function: () => {
        return {
          id: information.id,
          doctor: information,
          expertises,
          onlineVisit,
          centers,
          waitingTimeInfo,
          slug: seo.slug,
          profileData,
          isBulk,
        };
      },
      children: (props: any) => <Services {...props} enabledWidgets={hamdastWidgets} dontShowDeactiveBox={!!fragmentComponents?.risman} />,
    },
    {
      id: 'risman',
      noWrapper: true,
      isShow: !customize?.partnerKey && !!fragmentComponents?.risman && isBulk,
      children: () => <RismanCard data={fragmentComponents?.risman} slug={seo.slug} />,
    },
    {
      id: 'hamdast-services',
      isShow: !customize?.partnerKey,
      noWrapper: true,
      children: () =>
        hamdastWidgets
          ?.filter((widget: any) => widget?.placement?.includes?.('services'))
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
    // Rcommend
    {
      id: 'recommend',
      isShow: information?.should_recommend_other_doctors && centers?.[0] && expertises?.expertises?.[0],
      function: () => {
        return {
          doctorId: information.id,
          city: { name: centers?.[0]?.city, en_slug: information.city_en_slug },
          groupExpertise: expertises?.group_expertises?.[0],
          expertises: expertises?.expertises ?? [],
          clickRecommendEvent: (doctor: any, elementName?: string, elementContent?: string) => {
            splunkInstance('doctor-profile').sendEvent({
              group: 'recommend',
              type: 'clickrecommend',
              event: {
                data: {
                  terminal_id: getCookie('terminal_id'),
                  user_agent: window.navigator.userAgent,
                  page_url: window.location.pathname,
                  referrer: document.referrer,
                  group_expertises: expertises?.group_expertises?.[0]?.name ?? 'سایر',
                  doctor_name: information.display_name,
                  centers_types: centers.map((center: any) => center.center_type_name),
                  server_id: information.server_id,
                  recommendations: doctor,
                  element_name: elementName,
                  element_content: elementContent,
                },
              },
            });
          },
        };
      },
      children: (props: any) => <RecommendWrapper {...props} />,
      dataAttributes: { 'data-nosnippet': 'true' },
    },
    // Reviews
    {
      id: 'reviews',
      noWrapper: true,
      isShow: customize.showRateAndReviews,
      children: () => (
        <div className="flex flex-col gap-y-3 md:hidden">
          <FragmentRateReview profileData={profileData} />
        </div>
      ),
    },
    // Centers Info
    {
      id: 'phone-and-address',
      noWrapper: true,
      isShow: centers?.some?.((center: any) => center.id !== CENTERS.CONSULT),
      function: () => {
        const inPersonCenters = centers.filter((center: any) => center.id !== CENTERS.CONSULT);

        return {
          centers: inPersonCenters.map((center: any) => {
            const resolveUserCenterId = () => {
              const candidates = [
                center.user_center_id,
                ...(center.services ?? []).map((service: { user_center_id?: string | number }) => service.user_center_id),
              ];
              return candidates.find(value => {
                if (value === null || value === undefined) return false;
                const normalized = String(value).trim();
                return Boolean(normalized) && normalized !== '-1' && normalized !== '0';
              });
            };

            return {
              id: center.id,
              userCenterId: resolveUserCenterId(),
              address: center.address,
              city: center.city,
              slug: center.center_type === 1 ? `/dr/${seo.slug}` : `/center/${center.slug}`,
              description: removeHtmlTagInString(center.description ?? '').trim(),
              phoneNumbers: center?.display_number_array,
              name: center.center_type !== 1 ? center.name : `مطب ${information?.display_name}`,
              location: center.map,
              services: center.services,
              extra: hamdastWidgets?.some?.(
                (widget: any) =>
                  widget?.placement?.includes?.('center_info') &&
                  widget.placements_metadata?.center_info?.center_ids?.includes?.(center.id),
              ) ? (
                <div className="flex w-full flex-col gap-2 border-t border-slate-100 pt-3">
                  {hamdastWidgets
                    ?.filter(
                      (widget: any) =>
                        widget?.placement?.includes?.('center_info') &&
                        widget.placements_metadata?.center_info?.center_ids?.includes?.(center.id),
                    )
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
                          center_id: center.id,
                        }}
                      />
                    ))}
                </div>
              ) : undefined,
            };
          }),
          onEventPhoneNumber: (centerId: any) => {
            const center = centers.find((center: any) => center.id === centerId);
            const doctorMeta = getDoctorExpertiseMeta(expertises);
            splunkInstance('doctor-profile').sendEvent({
              group: 'doctor profile',
              type: 'see center phone',
              event: {
                data: {
                  doctor: {
                    full_name: information.display_name,
                    server_id: information.server_id,
                    slug: seo.slug,
                    id: information.id,
                    expertise: doctorMeta.expertise,
                    group_expertise: doctorMeta.groupExpertise,
                  },
                  center: {
                    center_status: center?.status,
                    center_type: center?.center_type,
                    center_name: center?.name,
                    city_en_slug: center?.city_en_slug,
                  },
                  user: {
                    terminal_id: getCookie('terminal_id'),
                  },
                },
              },
            });
          },
          onEventAddress: (centerId: any) => {
            const center = centers.find((center: any) => center.id === centerId);
            const doctorMeta = getDoctorExpertiseMeta(expertises);
            splunkInstance('doctor-profile').sendEvent({
              group: 'doctor profile',
              type: 'see center map',
              event: {
                data: {
                  doctor: {
                    full_name: information.display_name,
                    server_id: information.server_id,
                    slug: seo.slug,
                    id: information.id,
                    expertise: doctorMeta.expertise,
                    group_expertise: doctorMeta.groupExpertise,
                  },
                  center: {
                    center_status: center?.status,
                    center_type: center?.center_type,
                    center_name: center?.name,
                    city_en_slug: center?.city_en_slug,
                  },
                  user: {
                    terminal_id: getCookie('terminal_id'),
                  },
                },
              },
            });
          },
        };
      },
      children: (props: any) => (
        <ProfileSectionCard
          id="phone-and-address"
          title="آدرس و تلفن تماس"
          icon={<PhoneIcon width={18} height={18} />}
        >
          <CentersInfo
            className="mx-4 !p-0 md:mx-0"
            centers={props.centers}
            onEventPhoneNumber={props.onEventPhoneNumber}
            onEventAddress={props.onEventAddress}
          />
        </ProfileSectionCard>
      ),
    },
    {
      id: 'hamdast-sidebar',
      isShow: !customize?.partnerKey,
      noWrapper: true,
      children: () =>
        hamdastWidgets
          ?.filter((widget: any) => widget?.placement?.includes?.('sidebar'))
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
  ];
};

