import { CENTERS } from '@/common/types/centers';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { addCommas } from '@persian-tools/persian-tools';
import config from 'next/config';

const { publicRuntimeConfig } = config();

type BreadcrumbItem = { href?: string; text?: string };

type BuildDoctorProfileJsonLdsParams = {
  slug?: string;
  centers?: any[];
  information?: any;
  expertises?: any;
  feedbacks?: any;
  breadcrumbs?: BreadcrumbItem[];
  doctorProfileImageUrl: string;
};

function resolveSchemaGender(gender: unknown): 'Male' | 'Female' | undefined {
  if (gender == null || gender === '') return undefined;
  const asNumber = Number(gender);
  if (asNumber === 1) return 'Male';
  if (asNumber === 2) return 'Female';
  if (typeof gender === 'string') {
    const normalized = gender.trim().toLowerCase();
    if (normalized === 'male' || normalized === 'm') return 'Male';
    if (normalized === 'female' || normalized === 'f') return 'Female';
  }
  return undefined;
}

function toAbsoluteClinicUrl(pathOrUrl: string | undefined, baseUrl: string, fallbackPath: string) {
  const raw = (pathOrUrl || fallbackPath || '/').trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return `${baseUrl}${path === '/' ? '/' : path}`;
}

export function buildDoctorProfileJsonLds({
  slug,
  centers = [],
  information,
  expertises,
  feedbacks,
  breadcrumbs,
  doctorProfileImageUrl,
}: BuildDoctorProfileJsonLdsParams) {
  if (!centers?.length || !information) return [];

  const doctorExpertise = expertises?.expertises?.[0]?.alias_title;
  const center = centers?.find?.((cn: any) => cn.id !== CENTERS.CONSULT);
  const visitOnlineCenter = centers?.find?.((cn: any) => cn.id === CENTERS.CONSULT);
  const visitOnlinePrice = visitOnlineCenter?.services?.[0]?.free_price ?? 0;
  const currentUrl = `/dr/${slug}`;
  const clinicBaseUrl = publicRuntimeConfig?.CLINIC_BASE_URL ?? 'https://www.paziresh24.com';

  const getDayOfWeek = (day: number): string => {
    const dayMap: { [key: number]: string } = {
      1: 'Sunday',
      2: 'Monday',
      3: 'Tuesday',
      4: 'Wednesday',
      5: 'Thursday',
      6: 'Friday',
      7: 'Saturday',
    };
    return dayMap[day] || 'Monday';
  };

  const getOpeningHours = () => {
    if (!center?.services?.[0]?.hours_of_work) return undefined;

    const hoursByDay: { [key: string]: { opens: string; closes: string }[] } = {};

    center.services[0].hours_of_work.forEach((hour: any) => {
      const dayName = getDayOfWeek(hour.day);
      const opens = hour.from?.substring(0, 5) || '09:00';
      const closes = hour.to?.substring(0, 5) || '18:00';

      if (!hoursByDay[dayName]) {
        hoursByDay[dayName] = [];
      }
      hoursByDay[dayName].push({ opens, closes });
    });

    return Object.entries(hoursByDay).map(([dayOfWeek, hours]) => {
      const { opens, closes } = hours[0];
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens,
        closes,
      };
    });
  };

  const physicianSchema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: information?.display_name,
    alternateName: [
      information?.display_name,
      expertises?.expertises?.[0]?.alias_title
        ? `${information?.display_name} ${expertises.expertises[0].alias_title}`
        : null,
      expertises?.group_expertises?.[0]?.name
        ? `${information?.display_name} ${expertises.group_expertises[0].name}`
        : null,
    ].filter(Boolean),
    gender: resolveSchemaGender(information?.gender),
    image: doctorProfileImageUrl,
    medicalSpecialty: {
      '@type': 'MedicalSpecialty',
      name: expertises?.expertises?.[0]?.alias_title || expertises?.group_expertises?.[0]?.name || doctorExpertise,
    },
    affiliation: center
      ? {
          '@type': 'MedicalClinic',
          name: center.center_type === 1 ? `مطب ${information?.display_name}` : center.name,
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
          openingHoursSpecification: getOpeningHours(),
          geo: center.map
            ? {
                '@type': 'GeoCoordinates',
                latitude: center.map.lat,
                longitude: center.map.lon,
              }
            : undefined,
        }
      : undefined,
    priceRange: visitOnlinePrice > 0 ? `IRR ${addCommas(visitOnlinePrice)}` : '$$',
    url: clinicBaseUrl + currentUrl,
    telephone: center?.display_number?.[0] || center?.display_number,
    isAcceptingNewPatients: true,
    description: information?.biography ? removeHtmlTagInString(information?.biography) : '',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `خدمات درمانی ${information?.display_name}`,
      itemListElement:
        centers
          ?.filter((centerItem: any) => centerItem.services?.length > 0)
          ?.flatMap(
            (centerItem: any) =>
              centerItem.services?.map((service: any) => ({
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

  const fallbackBreadcrumbItems: BreadcrumbItem[] = [
    { href: '/', text: 'پذیرش۲۴' },
    { href: currentUrl, text: information?.display_name },
  ];
  const breadcrumbItems =
    Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? breadcrumbs : fallbackBreadcrumbItems;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': toAbsoluteClinicUrl(item?.href, clinicBaseUrl, currentUrl),
        name: item?.text,
      },
    })),
  };

  return [physicianSchema, breadcrumbSchema].filter(Boolean);
}
