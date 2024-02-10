import { useIncrementPageView } from '@/common/apis/services/profile/incrementPageView';
import { usePageView } from '@/common/apis/services/profile/pageView';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal/modal';
import Section from '@/common/components/atom/section/section';
import Text from '@/common/components/atom/text/text';
import CalenderIcon from '@/common/components/icons/calender';
import InfoIcon from '@/common/components/icons/info';
import ReceiptIcon from '@/common/components/icons/receipt';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useShowPremiumFeatures } from '@/modules/bamdad/hooks/useShowPremiumFeatures';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ToolBarItems } from '@/modules/profile/components/head/toolBar';
import { pageViewEvent } from '@/modules/profile/events/pageView';
import { getProfileServerSideProps } from '@/modules/profile/functions/getProfileServerSideProps';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useToolBarController } from '@/modules/profile/hooks/useToolBarController';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { aside } from '@/modules/profile/views/aside';
import Head from '@/modules/profile/views/head/head';
import { sections } from '@/modules/profile/views/sections';
import { addCommas } from '@persian-tools/persian-tools';
import { getCookie } from 'cookies-next';
import flatMapDeep from 'lodash/flatMapDeep';
import config from 'next/config';
import { ReactElement, useEffect, useState } from 'react';
import { growthbook } from '../_app';

const { publicRuntimeConfig } = config();

const DoctorProfile = ({
  slug,
  title,
  breadcrumbs,
  information,
  centers,
  media,
  symptomes,
  history,
  onlineVisit,
  similarLinks,
  isBulk,
  expertises,
  feedbacks,
  waitingTimeInfo,
  dontShowRateAndReviewMessage,
  shouldUseIncrementPageView,
  fragmentComponents,
}: any) => {
  useFeedbackDataStore.getState().data = feedbacks?.feedbacks ?? [];
  const { customize } = useCustomize();
  const isApplication = useApplication();
  const isWebView = useWebView();

  const addPageView = usePageView();
  const incrementPageView = useIncrementPageView();

  const { recommendEvent } = useProfileSplunkEvent();

  // Modal
  const { handleOpen: handleOpenViewAsModal, modalProps: viewAsModalProps } = useModal();

  const [editable, setEditable] = useState(false);
  const [viewAdData, setViewAsData] = useState({ title: '', url: '' });
  const userInfo = useUserInfoStore(state => state.info);
  const setProfileData = useProfileDataStore(state => state.setData);

  useEffect(() => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      slug,
    });
    return () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: undefined,
      });
    };
  }, [slug]);

  useEffect(() => {
    if (information) {
      pageViewEvent({
        information,
        centers,
        expertises,
        history,
        feedbacks,
        isBulk,
        isWebView: !!isWebView || !!isApplication,
      });
      if (shouldUseIncrementPageView) {
        incrementPageView.mutate({
          provider_id: information.provider_id,
        });
      }

      addPageView.mutate({
        doctorId: information.id,
        serverId: information.server_id,
      });

      window.doctor = { ...information, centers, expertises, isBulk, slug, history };

      if (information.should_recommend_other_doctors) recommendEvent('loadrecommend');
      setProfileData({ ...information, centers: [...centers], ...expertises, feedbacks });
    }
  }, [isBulk, information]);

  useEffect(() => {
    if (userInfo.provider?.job_title === 'doctor' && slug === userInfo?.provider?.slug) {
      setEditable(true);
      splunkInstance('doctor-profile').sendEvent({
        group: 'profile',
        type: 'view-as',
        event: {
          action: 'page-view',
          doctor: information.display_name,
          slug,
          terminal_id: getCookie('terminal_id'),
        },
      });
    }
  }, [userInfo, slug]);

  const toolBarItems = useToolBarController({ slug, displayName: information?.display_name, documentTitle: title, editable });

  const handleViewAs = (key: 'information' | 'gallery' | 'biography' | 'services' | 'workHours') => {
    const views = {
      information: {
        title: 'ویرایش اطلاعات فردی',
        url: '/profile/info?isWebView=1&secretary_phone=off&biography=off&sticky=on',
      },
      biography: {
        title: 'ویرایش توضیحات و بیوگرافی',
        url: '/profile/biography?isWebView=1&sticky=on',
      },
      services: {
        title: 'ویرایش تخصص',
        url: '/profile/expertises?isWebView=1&sticky=on',
      },
      gallery: {
        title: 'ویرایش تصاویر گالری',
        url: '/profile/gallery?isWebView=1',
      },
      workHours: {
        title: 'ویرایش ساعت کاری',
        url: '/setting/workhours?isWebView=1&sticky=on',
      },
    };
    setViewAsData({
      ...views[key],
    });
    splunkInstance('doctor-profile').sendEvent({
      group: 'profile',
      type: 'view-as',
      event: {
        action: `click-${key}`,
        doctor: information.display_name,
        slug,
        terminal_id: getCookie('terminal_id'),
      },
    });
    handleOpenViewAsModal();
  };

  const profileData = {
    information: {
      ...(information ?? {}),
      display_name: information?.display_name,
    },
    centers,
    expertises,
    history,
    onlineVisit,
    waitingTimeInfo,
    feedbacks,
    media,
    symptomes,
    similarLinks,
    isBulk,
    editable,
    handleViewAs,
    customize,
    seo: { breadcrumbs, slug },
  };

  return (
    <>
      <main
        key={information.id}
        className="flex flex-col items-start w-full max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10 pwa:pb-24"
      >
        <section className="flex flex-col w-full space-y-3 md:basis-7/12">
          {editable && (
            <div className="flex items-center p-2 -mb-3 bg-slate-200 md:mb-0 md:rounded-md text-slate-600 space-s-1">
              <InfoIcon className="min-w-6" />
              <Text fontSize="sm" fontWeight="medium">
                پزشک گرامی؛ تغییرات شما بعد از <strong className="font-bold">2 ساعت</strong> در پروفایل نمایش داده می‌شود.
              </Text>
            </div>
          )}
          <Head
            pageViewCount={profileData.history?.count_of_page_view}
            displayName={profileData.information.display_name}
            image={publicRuntimeConfig.CLINIC_BASE_URL + profileData.information?.image}
            imageAlt={`${information.prefix} ${information.display_name}`}
            title={information?.experience ? `${profileData.information?.experience} سال تجربه` : undefined}
            subTitle={`شماره نظام پزشکی: ${profileData.information?.employee_id}`}
            serviceList={flatMapDeep(profileData.expertises?.expertises?.map(({ alias_title }: any) => alias_title.split('|')))}
            toolBarItems={toolBarItems as ToolBarItems}
            className="w-full shadow-card md:rounded-lg"
            satisfaction={
              customize.showRateAndReviews && !dontShowRateAndReviewMessage && profileData.feedbacks?.details?.satisfaction_percent
            }
            rateCount={profileData.feedbacks?.details?.count_of_feedbacks}
            editable={editable}
            servicesEditAction={() => handleViewAs('services')}
            infoEditAction={() => handleViewAs('information')}
          >
            {editable && (
              <div className="flex mx-4 space-s-2">
                <Button
                  size="sm"
                  icon={<ReceiptIcon className="w-6 h-6" />}
                  onClick={() => {
                    window.open(publicRuntimeConfig.DOCTOR_APP_BASE_URL);
                    splunkInstance('doctor-profile').sendEvent({
                      group: 'profile',
                      type: 'view-as',
                      event: {
                        action: `click-list`,
                        doctor: information.display_name,
                        slug,
                        terminal_id: getCookie('terminal_id'),
                      },
                    });
                  }}
                >
                  لیست مراجعین
                </Button>
                <Button size="sm" variant="secondary" icon={<CalenderIcon className="w-6 h-6" />} onClick={() => handleViewAs('workHours')}>
                  ساعت کاری
                </Button>
              </div>
            )}
          </Head>
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white">
            <ul className="flex justify-around">
              <li>
                <a
                  href="#book-me"
                  onClick={e => {
                    e.preventDefault();
                    scrollIntoViewWithOffset('#book-me', 90);
                  }}
                  title="دریافت نوبت"
                  className="text-sm font-medium"
                >
                  دریافت نوبت
                </a>
              </li>
              {profileData.centers.some((center: any) => center.id !== CENTERS.CONSULT) && (
                <li>
                  <a
                    href="#phone-and-address"
                    onClick={e => {
                      e.preventDefault();
                      scrollIntoViewWithOffset('#phone-and-address', 90);
                    }}
                    title="آدرس و تلفن"
                    className="text-sm font-medium"
                  >
                    آدرس و تلفن
                  </a>
                </li>
              )}
              <li>
                <a
                  href="#about-me"
                  onClick={e => {
                    e.preventDefault();
                    scrollIntoViewWithOffset('#about-me', 90);
                  }}
                  title="درباره من"
                  className="text-sm font-medium"
                >
                  درباره من
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={e => {
                    e.preventDefault();
                    scrollIntoViewWithOffset('#reviews', 90);
                  }}
                  title="نظرات"
                  className="text-sm font-medium"
                >
                  نظرات
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col w-full space-y-3 md:hidden">
            {aside({ ...profileData, fragmentComponents })
              .filter(({ isShow }: any) => Boolean(isShow))
              .map((section: any, index: number) => (
                <Section key={index} {...section}>
                  {section.children(section?.function?.())}
                </Section>
              ))}
          </div>

          {sections({ ...profileData, fragmentComponents })
            .filter(({ isShow, isShowFallback }: any) => Boolean(isShow) || Boolean(isShowFallback))
            .map((section: any, index: number) => (
              <Section key={index} {...section}>
                {section[section.isShow ? 'children' : 'fallback']?.(section?.function?.())}
              </Section>
            ))}
        </section>

        <aside className="flex-col hidden w-full space-y-3 md:flex md:basis-5/12">
          {aside({ ...profileData, fragmentComponents })
            .filter(({ isShow }: any) => Boolean(isShow))
            .map((section: any, index: number) => (
              <Section key={index} {...section}>
                {section.children(section?.function?.())}
              </Section>
            ))}
        </aside>
      </main>
      <Modal {...viewAsModalProps} title={viewAdData?.title ?? ''} fullScreen bodyClassName="p-0">
        <iframe src={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}${viewAdData?.url}`} className="w-full h-full" />
      </Modal>
    </>
  );
};

DoctorProfile.getLayout = function getLayout(page: ReactElement) {
  const { title, description, slug, expertises, centers, information, feedbacks, host } = page.props;

  const doctorExpertise = expertises?.expertises?.[0]?.alias_title;

  const getJsonlds = () => {
    const center = centers.find((cn: any) => cn.id !== CENTERS.CONSULT);
    const visitOnlineCenter = centers.find((cn: any) => cn.id === CENTERS.CONSULT);
    const visitOnlinePrice = visitOnlineCenter?.services?.[0]?.free_price ?? 0;
    const currentUrl = `/dr/${slug}`;

    return [
      {
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': visitOnlinePrice > 0 ? `IRR ${addCommas(visitOnlinePrice)}` : '$$',
        'name': `${information.prefix} ${information.display_name}`,
        'telephone': center?.display_number,
        'description': information?.biography ? removeHtmlTagInString(information.biography) : '',
        'image': publicRuntimeConfig.CLINIC_BASE_URL + information.image,
        'isAcceptingNewPatients': true,
        'medicalSpecialty': !expertises?.group_expertises ? expertises.group_expertises?.[0]?.name : doctorExpertise,
        'duns': information?.employee_id,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IR',
          },
          'addressLocality': center?.city,
          'addressRegion': center?.province,
          'streetAddress': center?.address,
        },
        ...(feedbacks.details.satisfaction && {
          aggregateRating: {
            '@type': 'AggregateRating',
            'bestRating': 5,
            'worstRating': 0,
            'ratingCount': feedbacks.details.count_of_feedbacks,
            'ratingValue': feedbacks.details.satisfaction,
          },
        }),
      },
      {
        '@context': 'http://www.schema.org',
        '@type': 'Person',
        'jobTitle': 'physician',
        'name': `${information.prefix} ${information.display_name}`,
        'telephone': center?.display_number,
        'image': publicRuntimeConfig.CLINIC_BASE_URL + information.image,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IR',
          },
          'addressLocality': center?.city,
          'addressRegion': center?.province,
          'streetAddress': center?.address,
        },
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@id': `${publicRuntimeConfig.CLINIC_BASE_URL}/`,
              'name': 'پذیرش۲۴',
            },
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'item': {
              '@id': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
              'name': `${information.prefix} ${information.display_name}`,
            },
          },
        ],
      },
    ];
  };

  return (
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} shouldShowPromoteApp={false} {...page.props.config}>
      <Seo
        title={title}
        description={description}
        jsonlds={getJsonlds()}
        openGraph={{
          image: {
            src: publicRuntimeConfig.CLINIC_BASE_URL + information?.image,
            alt: `${information.prefix} ${information.display_name}`,
            type: 'image/jpg',
          },
        }}
        host={host}
      />
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = getProfileServerSideProps;

export default DoctorProfile;
