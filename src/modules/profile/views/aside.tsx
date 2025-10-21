import Button from '@/common/components/atom/button/button';
import EditIcon from '@/common/components/icons/edit';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CentersInfo from './centersInfo';
import Services from './services';
import pick from 'lodash/pick';
import { Fragment } from '@/common/fragment';
import BookingGlobalContextsProvider from '../../../../.plasmic/plasmic/paziresh_24_booking/PlasmicGlobalContextsProvider';
import { FragmentRateReview } from './rateReview/fragmentRateReview';
import { ActionButton } from './centersInfo/actionButton';
import Hamdast from '@/modules/hamdast/render';
import IframeHamdast from '@/modules/hamdast/iframe-render';
import { isEmpty } from 'lodash';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { SamanBooking } from '@/modules/samanBooking';

const RecommendWrapper = dynamic(() => import('./recommend'));

export const Aside = (data: any) => {
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

  const isSamanBookingEnabled = useFeatureIsOn('saman-booking');

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
      isShow: !customize.partnerKey && !!fragmentComponents?.risman && isBulk,
      children: (props: any) => (
        <Fragment
          name="Risman"
          props={{
            data: fragmentComponents?.risman,
          }}
        />
      ),
    },
    {
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
      isShow: information?.should_recommend_other_doctors && centers[0] && expertises?.expertises?.[0],
      function: () => {
        return {
          doctorId: information.id,
          city: { name: centers[0].city, en_slug: information.city_en_slug },
          groupExpertise: expertises.group_expertises[0],
          expertises: expertises.expertises,
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
                  group_expertises: expertises.group_expertises?.[0]?.name ?? 'سایر',
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
      isShow: customize.showRateAndReviews && fragmentComponents?.raviComponentTopOrderProfile,
      children: (props: any) => (
        <div className="md:hidden flex flex-col gap-y-3">
          <FragmentRateReview profileData={profileData} />
        </div>
      ),
    },
    // Centers Info
    {
      id: 'phone-and-address',
      isShow: centers?.some?.((center: any) => center.id !== CENTERS.CONSULT),
      function: () => {
        return {
          centers: centers
            .filter((center: any) => center.id !== CENTERS.CONSULT)
            .map((center: any) => ({
              id: center.id,
              userCenterId: center.user_center_id,
              address: center.address,
              city: center.city,
              slug: center.center_type === 1 ? `/dr/${seo.slug}` : `/center/${center.slug}`,
              description: center.description,
              phoneNumbers: center?.display_number_array,
              name: center.center_type !== 1 ? center.name : `مطب ${information?.display_name}`,
              location: center.map,
            })),
          onEventPhoneNumber: (centerId: any) => {
            const center = centers.find((center: any) => center.id === centerId);
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
                    expertise: expertises.expertises[0].alias_title,
                    group_expertise: expertises.group_expertises[0].name,
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
                    expertise: expertises.expertises[0].alias_title,
                    group_expertise: expertises.group_expertises[0].name,
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
        <BookingGlobalContextsProvider>
          <Fragment
            name="AddressesWrapper"
            props={{
              ...profileData,
              slug: seo.slug,
              children: centers
                .filter((center: any) => center.id !== CENTERS.CONSULT)
                .map((center: any) => (
                  <Fragment
                    key={center.id}
                    name="AddressesCard"
                    props={{
                      ...profileData,
                      title: center.name,
                      map: center.map,
                      centerId: center.id,
                      address: center.address,
                      city: center.city,
                      displayNumberArray: center.display_number_array,
                      slug: center.slug,
                      centerType: center.center_type == 1 ? 'office' : 'hospital',
                      description: center.description?.trim(),
                      userCenterId: center.user_center_id,
                      centerName: center.name,
                      children: hamdastWidgets.some(
                        (widget: any) =>
                          widget?.placement?.includes?.('center_info') &&
                          widget.placements_metadata?.center_info?.center_ids?.includes?.(center.id),
                      ) ? (
                        <div className="flex flex-col w-full gap-2">
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
                      ) : null,
                    }}
                  />
                )),
            }}
          />
        </BookingGlobalContextsProvider>
      ),
    },
    {
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
