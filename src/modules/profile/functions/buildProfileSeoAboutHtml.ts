import { CENTERS } from '@/common/types/centers';
import { getAverageRate } from '@/modules/profile/utils/getAverageRate';
import { formatDoctorCitiesPhrase, getInPersonCenters, getPrimaryInPersonCenter } from './getDoctorCities';

interface BuildProfileSeoAboutHtmlParams {
  information: any;
  centers: any[];
  expertises: any;
  feedbacks: any;
  history: any;
  doctorExpertise: string;
  countOfPageView?: string | number;
}

const buildAddressListItems = (displayName: string, inPersonCenters: any[]) => {
  if (inPersonCenters.length === 0) {
    return `<li>آدرس مطب ${displayName}: ثبت نشده</li>
        <li>تلفن مطب ${displayName}: <span class="inline-block">ثبت نشده</span></li>`;
  }

  if (inPersonCenters.length === 1) {
    const center = inPersonCenters[0];
    const address =
      center?.address || center?.city ? `${center?.city ? `${center.city}، ` : ''}${center?.address ?? ''}`.trim() : 'ثبت نشده';
    const phone = center?.display_number_array?.[0] ? center.display_number_array[0] : 'ثبت نشده';

    return `<li>آدرس مطب ${displayName}: ${address || 'ثبت نشده'}</li>
        <li>تلفن مطب ${displayName}: <span class="inline-block">${phone}</span></li>`;
  }

  return inPersonCenters
    .map(center => {
      const address =
        center?.address || center?.city ? `${center?.city ? `${center.city}، ` : ''}${center?.address ?? ''}`.trim() : 'ثبت نشده';
      const phone = center?.display_number_array?.[0] ? center.display_number_array[0] : 'ثبت نشده';

      return `<li>آدرس مطب ${displayName} (${center?.city ?? 'ثبت نشده'}): ${address || 'ثبت نشده'}</li>
        <li>تلفن مطب ${displayName} (${center?.city ?? 'ثبت نشده'}): <span class="inline-block">${phone}</span></li>`;
    })
    .join('');
};

const buildOfficeIntro = (displayName: string, inPersonCenters: any[]) => {
  if (inPersonCenters.length === 0) {
    return `مطب ${displayName} در (ثبت نشده) واقع شده است که در صورت نیاز می‌توانید با شماره <span class="inline-block">(ثبت نشده)</span> تماس بگیرید.`;
  }

  if (inPersonCenters.length === 1) {
    const center = inPersonCenters[0];
    const phone = center?.display_number_array?.[0] ? center.display_number_array[0] : '(ثبت نشده)';

    return `مطب ${displayName} در ${center?.address ?? '(ثبت نشده)'} واقع شده است که در صورت نیاز می‌توانید با شماره <span class="inline-block">${phone}</span> تماس بگیرید.`;
  }

  const officeLocations = inPersonCenters
    .map(center => `${center.city} (${center?.address ?? 'ثبت نشده'})`)
    .join(' و ');

  return `مطب‌های ${displayName} در ${officeLocations} واقع شده‌اند که در صورت نیاز می‌توانید با شماره‌های تماس هر مطب ارتباط بگیرید.`;
};

export const buildProfileSeoAboutHtml = ({
  information,
  centers,
  expertises,
  feedbacks,
  history,
  doctorExpertise,
  countOfPageView,
}: BuildProfileSeoAboutHtmlParams) => {
  const inPersonCenters = getInPersonCenters(centers);
  const center = getPrimaryInPersonCenter(centers);
  const doctorCitiesPhrase = formatDoctorCitiesPhrase(centers);
  const expertiseLabel = doctorExpertise?.trim() || 'سایر';
  const displayName = `${information.prefix ? `${information.prefix} ` : ''}${information.display_name}`;

  const averageRate = getAverageRate(feedbacks?.details?.average_rates);
  const satisfactionText =
    !feedbacks?.details?.hide_rates && averageRate != null
      ? `؛ همچنین ${+(averageRate * 20).toFixed(0)}٪ مراجعین (${feedbacks?.details?.count_of_feedbacks ?? 0} نظر ثبت شده) از ایشان رضایت داشته‌اند. <b>نظرات ${displayName}</b> در پروفایل دکتر در پذیرش۲۴ قابل مشاهده است`
      : '';

  const freeturnBlock = center?.freeturn_text
    ? `<p>زودترین زمان رزرو نوبت از مطب ${displayName} ${center.freeturn_text} می‌باشد که می‌توانید از طریق وبسایت و یا اپلیکیشن نوبت‌دهی پذیرش۲۴ نوبت خود را به صورت اینترنتی و غیرحضوری دریافت کنید.</p>`
    : '';

  const expertiseList =
    expertises?.expertises?.map?.((item: any) => item?.alias_title)?.join('/ ') ?? expertises?.expertises?.[0]?.name ?? '';

  return `<p>${displayName}، ${expertiseLabel} ${doctorCitiesPhrase}. ${buildOfficeIntro(displayName, inPersonCenters)}</p>
        <p>تاکنون ${countOfPageView ?? convertFallbackPageView(history)} نفر از پروفایل ${displayName}، ${expertiseLabel} بازدید کرده‌اند${satisfactionText}.</p>
        ${freeturnBlock}
        <p>اگر زمان کافی برای مراجعه حضوری به پزشک مورد نظر خود را ندارید، به پروفایل پزشک در <a href="/" class="text-primary">پذیرش۲۴</a> سری بزنید و در صورت فعال بودن خدمات ویزیت آنلاین ایشان، نوبت ویزیت آنلاین خود را دریافت کنید؛ در غیر این‌صورت می‌توانید از سایر پزشکان ${expertiseLabel} <a href="/consult" class="text-primary"> ویزیت آنلاین (تلفنی و متنی)</a> نوبت بگیرید.</p>
        <p>در صورت نیاز به عکس و بیوگرافی و <b>آدرس اینستاگرام ${displayName}</b>، کانال تلگرام و وبسایت ایشان، اطلاعات موجود در پروفایل ایشان را مشاهده نمایید.</p>
        <ul>
        ${buildAddressListItems(displayName, inPersonCenters)}
        <li>تخصص ${displayName}: ${expertiseList}</li>
        </ul>
        `;
};

const convertFallbackPageView = (history: any) => history?.count_of_page_view ?? 0;

export const getProfileSeoSectionData = ({
  information,
  centers,
  expertises,
  feedbacks,
  history,
  similarLinks,
  seo,
  countOfPageView,
}: {
  information: any;
  centers: any[];
  expertises: any;
  feedbacks: any;
  history: any;
  similarLinks: any[];
  seo: any;
  countOfPageView?: string | number;
}) => {
  const center = getPrimaryInPersonCenter(centers);
  const isOnlineVisitCenter = center?.id === CENTERS.CONSULT;
  const doctorExpertise = `${expertises?.expertises?.[0]?.degree_name ?? ''} ${expertises?.expertises?.[0]?.expertise_name ?? ''}`.trim();
  const about = buildProfileSeoAboutHtml({
    information,
    centers,
    expertises,
    feedbacks,
    history,
    doctorExpertise,
    countOfPageView,
  });

  return {
    center,
    isOnlineVisitCenter,
    doctorExpertise,
    about,
    similarLinks: similarLinks?.map((item: any) => ({ name: item.caption, url: item.link })),
    breadcrumbs: seo.breadcrumbs,
  };
};
