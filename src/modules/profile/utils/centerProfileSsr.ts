import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';

export type CenterCrawlDoctor = {
  name: string;
  url: string;
  expertise?: string;
};

const DAY_OF_WEEK_MAP: Record<number, string> = {
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday',
};

export const getCenterCanonicalPath = (slug: string) => `/center/${encodeURIComponent(slug)}/`;

export const getCenterCanonicalUrl = (slug: string, baseUrl: string) => `${baseUrl}${getCenterCanonicalPath(slug)}`;

export const buildCenterDocumentDescription = (name: string, city?: string) =>
  `آدرس، شماره تلفن و اطلاعات تماس ${name}${city ? ` در ${city}` : ''} با امکان رزرو نوبت آنلاین در پذیرش۲۴`;

const CENTER_SEARCH_PATH = `/s/ir/?result_type=${encodeURIComponent('فقط کلینیک‌ها و بیمارستان‌ها')}`;

export const buildCenterSeoAbout = (name: string) => `<p>
   این صفحه به عنوان وب‌سایت نوبت‌دهی اینترنتی
   <strong>${name}</strong>
   جهت مشاهده خدمات و دریافت نوبت آنلاین پزشکان فعال در این مرکز درمانی از طریق
   <a href="/" class="font-bold">پذیرش ۲۴</a>
   طراحی شده است. در این صفحه می‌توانید لیست پزشکان، آدرس، شماره تماس و اطلاعات تکمیلی مرکز را مشاهده کنید.
</p>
<p>
   برای رزرو نوبت، پزشک مورد نظر را انتخاب کرده و زمان خالی را از میان نوبت‌های اعلام‌شده برگزینید.
   در صورت غیرفعال بودن نوبت‌دهی برخی پزشکان، می‌توانید از
   <a href="/consult" class="font-bold">مشاوره آنلاین پذیرش۲۴</a>
   استفاده کنید.
</p>
<p>
   اگر اطلاعات این صفحه نیاز به اصلاح دارد، از طریق
   <a class="font-bold" href="/home/support-form/">صفحه پشتیبانی</a>
   با ما در ارتباط باشید.
</p>`;

export const buildCenterSeoSectionData = ({
  name,
  slug,
  expertiseLabels,
  groupExpertises,
}: {
  name: string;
  slug: string;
  expertiseLabels?: string[];
  groupExpertises?: any[];
}) => {
  const similarLinks =
    groupExpertises?.length
      ? groupExpertises
          .filter((item: any) => item?.name || item?.alias_title)
          .slice(0, 20)
          .map((item: any) => ({
            name: item.name || item.alias_title,
            url: item.url || `/s/ir/?text=${encodeURIComponent(item.name || item.alias_title || '')}`,
          }))
      : expertiseLabels?.slice(0, 20).map(label => ({
          name: label,
          url: `/s/ir/?text=${encodeURIComponent(label)}`,
        })) ?? [];

  return {
    about: buildCenterSeoAbout(name),
    breadcrumbs: [
      { text: 'پذیرش۲۴', href: '/' },
      { text: 'مراکز درمانی', href: CENTER_SEARCH_PATH },
      { text: name, href: getCenterCanonicalPath(slug) },
    ],
    similarLinks,
  };
};

const extractExpertiseLabels = (data: any): string[] => {
  const fromExpertises = data?.expertises?.map((item: any) => item?.alias_title).filter(Boolean) ?? [];
  if (fromExpertises.length) return fromExpertises.slice(0, 30);

  const fromGroups =
    data?.group_expertises?.map((item: any) => item?.name || item?.alias_title || item?.title).filter(Boolean) ?? [];

  return fromGroups.slice(0, 30);
};

export const extractCenterOpeningHours = (services: any[] | undefined) => {
  const hoursOfWork = services?.[0]?.hours_of_work;
  if (!Array.isArray(hoursOfWork) || !hoursOfWork.length) return undefined;

  const hoursByDay: Record<string, { opens: string; closes: string }[]> = {};

  hoursOfWork.forEach((hour: any) => {
    const dayName = DAY_OF_WEEK_MAP[hour.day];
    if (!dayName) return;

    const opens = hour.from?.substring(0, 5) || '09:00';
    const closes = hour.to?.substring(0, 5) || '18:00';

    hoursByDay[dayName] ??= [];
    hoursByDay[dayName].push({ opens, closes });
  });

  return Object.entries(hoursByDay).map(([dayOfWeek, hours]) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek,
    opens: hours[0].opens,
    closes: hours[0].closes,
  }));
};

export const slimCenterSlugProfileResponse = (response: any) => {
  const data = response?.result?.data;
  if (!data) return response;

  const openingHoursSpecification = extractCenterOpeningHours(data.services);
  const socialLinks = Array.isArray(data.social)
    ? data.social.map((item: any) => item?.url).filter(Boolean)
    : [];

  const slimData = {
    id: data.id,
    server_id: data.server_id,
    name: data.name,
    slug: data.slug,
    city: data.city,
    province: data.province,
    address: data.address,
    tell: data.tell,
    map: data.map,
    biography: data.biography,
    desk: data.desk,
    image: data.image,
    number_of_visits: data.number_of_visits,
    social: socialLinks,
    rate: data.rate,
    satisfaction: data.satisfaction,
    rates_count: data.rates_count,
    doctors_count: Array.isArray(data.doctors) ? data.doctors.length : 0,
    group_expertises_count: Array.isArray(data.group_expertises) ? data.group_expertises.length : 0,
    expertise_labels: extractExpertiseLabels(data),
    opening_hours_spec: openingHoursSpecification,
  };

  return {
    ...response,
    result: {
      ...response.result,
      data: slimData,
    },
  };
};

export const mapSearchResultsToCrawlDoctors = (searchResult: any[] | undefined, limit = 10): CenterCrawlDoctor[] =>
  (searchResult ?? []).slice(0, limit).map((doctor: any) => ({
    name: doctor.title,
    url: doctor.url,
    expertise: doctor.display_expertise,
  }));

export const buildCenterJsonLd = ({
  profileData,
  canonicalUrl,
  cdnBaseUrl,
  baseUrl,
  crawlDoctors = [],
}: {
  profileData: any;
  canonicalUrl: string;
  cdnBaseUrl: string;
  baseUrl: string;
  crawlDoctors?: CenterCrawlDoctor[];
}) => {
  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      priceRange: '$$',
      name: profileData.name,
      telephone: profileData.tell,
      description: profileData.biography ? removeHtmlTagInString(profileData.biography) : '',
      image: cdnBaseUrl + profileData.image,
      isAcceptingNewPatients: true,
      url: canonicalUrl,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IR',
        addressLocality: profileData.city,
        addressRegion: profileData.province,
        streetAddress: profileData.address,
      },
      ...(profileData.map?.lat &&
        profileData.map?.lon && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: profileData.map.lat,
            longitude: profileData.map.lon,
          },
        }),
      ...(profileData.opening_hours_spec?.length && {
        openingHoursSpecification: profileData.opening_hours_spec,
      }),
      ...(Array.isArray(profileData.social) &&
        profileData.social.length > 0 && {
          sameAs: profileData.social,
        }),
      ...((profileData.rates_count ?? 0) > 0 &&
        profileData.satisfaction != null && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(profileData.satisfaction),
            reviewCount: profileData.rates_count,
            bestRating: 100,
            worstRating: 0,
          },
        }),
    },
    {
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
            name: profileData.name,
          },
        },
      ],
    },
  ];

  if (crawlDoctors.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `پزشکان ${profileData.name}`,
      itemListElement: crawlDoctors.map((doctor, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: doctor.name,
        url: doctor.url?.startsWith('http') ? doctor.url : `${baseUrl}${doctor.url}`,
      })),
    });
  }

  return schemas;
};
