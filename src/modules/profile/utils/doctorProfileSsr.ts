import { CENTERS } from '@/common/types/centers';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { addCommas } from '@persian-tools/persian-tools';
import { extractCenterOpeningHours } from './centerProfileSsr';

export const NO_DOCTOR_PROFILE_IMAGE = 'https://cdn.paziresh24.com/getImage/p24/search-men/noimage.png';

export const DOCTOR_SEARCH_PATH = '/s/ir/';

export const getDoctorCanonicalPath = (slug: string) => `/dr/${encodeURIComponent(slug)}/`;

export const getDoctorCanonicalUrl = (slug: string, baseUrl: string) => `${baseUrl}${getDoctorCanonicalPath(slug)}`;

export const resolveDoctorProfileImageUrl = (
  information: { user_id?: string | null } | undefined,
  pageUserId?: string | null,
) => {
  const userId = information?.user_id ?? pageUserId;
  if (userId) {
    return `https://pic.paziresh24.com/api/image/${userId}`;
  }
  return NO_DOCTOR_PROFILE_IMAGE;
};

const slimCenterServices = (services: any[] | undefined) =>
  services?.map(service => ({
    id: service.id,
    user_center_id: service.user_center_id,
    free_price: service.free_price,
    duration: service.duration,
    title: service.title,
    alias_title: service.alias_title,
    can_request: service.can_request,
    hours_of_work: service.hours_of_work,
  }));

const slimCenters = (centers: any[] | undefined) =>
  centers?.map(center => ({
    id: center.id,
    user_center_id: center.user_center_id,
    name: center.name,
    address: center.address,
    city: center.city,
    province: center.province,
    tell: center.tell,
    tell_array: center.tell_array,
    display_number: center.display_number,
    display_number_array: center.display_number_array,
    map: center.map,
    status: center.status,
    center_type: center.center_type,
    center_type_name: center.center_type_name,
    server_id: center.server_id,
    slug: center.slug,
    is_center: center.is_center,
    is_only_in_app: center.is_only_in_app,
    services: slimCenterServices(center.services),
  }));

const slimHamdastWidgetsData = (widgetsData: Record<string, unknown> | undefined) => {
  if (!widgetsData || typeof widgetsData !== 'object') return widgetsData;

  return Object.fromEntries(
    Object.entries(widgetsData).map(([key, value]) => {
      if (!value || typeof value !== 'object') return [key, value];

      const widgetValue = value as Record<string, unknown>;
      const { html, scripts, raw_html, inline_scripts, ...rest } = widgetValue;
      return [key, rest];
    }),
  );
};

export const slimDoctorProfileProps = <T extends Record<string, any>>(props: T): T => {
  if (!props || typeof props !== 'object') return props;

  const feedbackList = props.feedbacks?.feedbacks?.list;
  const slimmedFeedbacks =
    Array.isArray(feedbackList) && feedbackList.length > 10
      ? {
          ...props.feedbacks,
          feedbacks: {
            ...props.feedbacks.feedbacks,
            list: feedbackList.slice(0, 10),
          },
        }
      : props.feedbacks;

  return {
    ...props,
    feedbacks: slimmedFeedbacks,
    media: props.media
      ? {
          ...props.media,
          gallery: Array.isArray(props.media.gallery) ? props.media.gallery.slice(0, 12) : props.media.gallery,
        }
      : props.media,
    symptomes: Array.isArray(props.symptomes) ? props.symptomes.slice(0, 8) : props.symptomes,
    similarLinks: Array.isArray(props.similarLinks) ? props.similarLinks.slice(0, 15) : props.similarLinks,
    centers: slimCenters(props.centers),
    hamdastWidgetsData: slimHamdastWidgetsData(props.hamdastWidgetsData),
  };
};

export const buildDoctorJsonLd = ({
  information,
  expertises,
  centers = [],
  feedbacks,
  slug,
  baseUrl,
  userId,
}: {
  information?: any;
  expertises?: any;
  centers?: any[];
  feedbacks?: any;
  slug: string;
  baseUrl: string;
  userId?: string | null;
}) => {
  if (!information?.display_name || !slug) return [];

  const doctorProfileImageUrl = resolveDoctorProfileImageUrl(information, userId);
  const center = centers.find((cn: any) => cn.id !== CENTERS.CONSULT);
  const visitOnlineCenter = centers.find((cn: any) => cn.id === CENTERS.CONSULT);
  const visitOnlinePrice = visitOnlineCenter?.services?.[0]?.free_price ?? 0;
  const canonicalUrl = getDoctorCanonicalUrl(slug, baseUrl);
  const doctorExpertise = expertises?.expertises?.[0]?.alias_title;
  const openingHoursSpecification = extractCenterOpeningHours(center?.services);

  const physicianSchema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: information.display_name,
    alternateName: [
      information.display_name,
      expertises?.expertises?.[0]?.alias_title
        ? `${information.display_name} ${expertises.expertises[0].alias_title}`
        : null,
      expertises?.group_expertises?.[0]?.name
        ? `${information.display_name} ${expertises.group_expertises[0].name}`
        : null,
    ].filter(Boolean),
    gender: information.gender === '1' ? 'Male' : information.gender === '2' ? 'Female' : undefined,
    image: doctorProfileImageUrl,
    medicalSpecialty: {
      '@type': 'MedicalSpecialty',
      name: expertises?.expertises?.[0]?.alias_title || expertises?.group_expertises?.[0]?.name || doctorExpertise,
    },
    ...(center && {
      affiliation: {
        '@type': 'MedicalClinic',
        name: center.center_type === 1 ? `مطب ${information.display_name}` : center.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: center.address,
          addressLocality: center.city,
          addressRegion: center.province,
          addressCountry: 'IR',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: center.display_number?.[0] || center.display_number,
          contactType: 'appointment',
          availableLanguage: ['fa'],
        },
        ...(openingHoursSpecification?.length && { openingHoursSpecification }),
        ...(center.map?.lat &&
          center.map?.lon && {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: center.map.lat,
              longitude: center.map.lon,
            },
          }),
      },
    }),
    priceRange: visitOnlinePrice > 0 ? `IRR ${addCommas(visitOnlinePrice)}` : '$$',
    url: canonicalUrl,
    telephone: center?.display_number?.[0] || center?.display_number,
    isAcceptingNewPatients: true,
    description: information.biography ? removeHtmlTagInString(information.biography) : '',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `خدمات درمانی ${information.display_name}`,
      itemListElement:
        centers
          .filter((c: any) => c.services?.length > 0)
          .flatMap(
            (c: any) =>
              c.services?.map((service: any) => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'MedicalProcedure',
                  name: service.title || service.alias_title,
                  description: service.description || `خدمات ${service.title || service.alias_title}`,
                  price: service.free_price ? addCommas(service.free_price) : undefined,
                  priceCurrency: 'IRR',
                  availability: 'https://schema.org/InStock',
                },
              })) ?? [],
          ) ?? [],
    },
    ...(!feedbacks?.details?.hide_rates &&
      (feedbacks?.details?.count_of_feedbacks ?? 0) > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: +(
            (+(feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
              +(feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
              +(feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
            3
          ).toFixed(1),
          reviewCount: feedbacks?.details?.count_of_feedbacks ?? 0,
          bestRating: 5,
          worstRating: 0,
        },
        review:
          feedbacks?.feedbacks?.list
            ?.filter((item: any) => !!item?.avg_rate_value)
            ?.slice(0, 5)
            ?.map?.((feedback: any) => ({
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: feedback?.user_display_name?.split?.(' ')?.[0] ?? 'کاربر پذیرش24',
              },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: feedback?.avg_rate_value ?? 0,
                bestRating: 5,
                worstRating: 0,
              },
              reviewBody: feedback?.description,
              datePublished: feedback?.created_at?.split(' ')?.[0],
            })) ?? [],
      }),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': `${baseUrl}/`,
          name: 'پذیرش۲۴',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@id': canonicalUrl,
          name: information.display_name,
        },
      },
    ],
  };

  return [physicianSchema, breadcrumbSchema];
};
