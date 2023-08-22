import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { usePageView } from '@/common/apis/services/profile/pageView';
import Avatar from '@/common/components/atom/avatar/avatar';
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
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { dayToSecond } from '@/common/utils/dayToSecond';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
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
import { useFeatureValue } from '@growthbook/growthbook-react';
import { getCookie, setCookie } from 'cookies-next';
import config from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';

const { publicRuntimeConfig } = config();

const DoctorProfile = ({ query: { university }, initialFeedbackDate, title, breadcrumbs, overwriteData }: any) => {
  useFeedbackDataStore.getState().data = initialFeedbackDate;
  const { query, ...router } = useRouter();
  const { customize } = useCustomize();
  const addPageView = usePageView();
  const slug = query.slug as string;

  const { handleOpen: handleOpenBeenBeforeModal, handleClose: handleCloseBeenBeforeModal, modalProps: beenBeforeModalProps } = useModal();
  const { handleOpen: handleOpenViewAsModal, modalProps: viewAsModalProps } = useModal();
  const [viewAdData, setViewAsData] = useState({ title: '', url: '' });
  const { isMobile } = useResponsive();
  const listOfExpertiseAndCities = useFeatureValue<any>('profile.nosnippet-substitute-section', '');
  const userInfo = useUserInfoStore(state => state.info);
  const { recommendEvent } = useProfileSplunkEvent();
  const isWebView = useWebView();
  const isApplication = useApplication();
  const [editable, setEditable] = useState(false);
  const profile = useGetProfileData(
    { slug, ...(university && { university }) },
    {
      keepPreviousData: true,
    },
  );
  const isShowPremiumFeatures = useShowPremiumFeatures();
  const profileData = profile.data?.data;
  const centers = useMemo(
    () =>
      profileData.centers.map((center: any) => ({
        ...center,
        ...(overwriteData?.centers?.find?.(({ id }: { id: string }) => id === center?.id) ?? {}),
      })),
    [profileData, overwriteData],
  );
  const isSetDataTages =
    listOfExpertiseAndCities?.cities?.includes(profileData?.city_en_slug) &&
    listOfExpertiseAndCities?.group_expertises?.includes(profileData?.group_expertises?.[0]?.id?.toString());
  const isBulk: boolean = useMemo(
    () =>
      centers.every((center: any) => center.status === 2) ||
      centers.every((center: any) => center.services.every((service: any) => !service.hours_of_work)),
    [profileData],
  );
  useProfileDataStore.getState().data = profileData;

  useEffect(() => {
    if (isShowPremiumFeatures) {
      splunkInstance().sendEvent({
        group: 'bamdad',
        type: 'profile_page-view',
        event: {
          terminal_id: getCookie('terminal_id'),
        },
      });
    }
  }, [isShowPremiumFeatures]);

  useEffect(() => {
    if (profileData) {
      pageViewEvent({
        doctor: profileData,
        isBulk,
        isWebView: !!isWebView || !!isApplication,
      });
      addPageView.mutate({
        doctorId: profileData.id,
        serverId: profileData.server_id,
      });
      window.doctor = profileData;
      if (document.referrer.includes('google.') && !getCookie('isBeenBefore')) {
        handleOpenBeenBeforeModal();
        setCookie('isBeenBefore', true, {
          maxAge: dayToSecond(60),
          path: '/',
        });
      }
      if (profileData.should_recommend_other_doctors) recommendEvent('loadrecommend');
    }
  }, [profileData, isBulk]);

  useEffect(() => {
    if (!!userInfo.is_doctor && slug === userInfo?.profile?.slug) {
      setEditable(true);
      splunkInstance().sendEvent({
        group: 'profile',
        type: 'view-as',
        event: {
          action: 'page-view',
          doctor: profileData.display_name,
          slug,
          terminal_id: getCookie('terminal_id'),
        },
      });
    }
  }, [userInfo.is_doctor, slug]);

  const toolBarItems = useToolBarController({ slug, displayName: profileData?.display_name, documentTitle: title, editable });

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
    splunkInstance().sendEvent({
      group: 'profile',
      type: 'view-as',
      event: {
        action: `click-${key}`,
        doctor: profileData.display_name,
        slug,
        terminal_id: getCookie('terminal_id'),
      },
    });
    handleOpenViewAsModal();
  };

  return (
    <>
      <div
        className={classNames('flex flex-col items-start w-full max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10', {
          'pb-24': isApplication,
        })}
      >
        <div className="flex flex-col w-full space-y-3 md:basis-7/12">
          {editable && (
            <div className="flex items-center p-2 -mb-3 bg-slate-200 md:mb-0 md:rounded-md text-slate-600 space-s-1">
              <InfoIcon className="min-w-6" />
              <Text fontSize="sm" fontWeight="medium">
                پزشک گرامی؛ تغییرات شما بعد از <strong className="font-bold">2 ساعت</strong> در پروفایل نمایش داده می‌شود.
              </Text>
            </div>
          )}
          <Head
            pageViewCount={profileData?.number_of_visits}
            displayName={profileData?.display_name}
            image={publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image}
            title={profileData?.experience ? `${profileData?.experience} سال تجربه` : undefined}
            subTitle={`شماره نظام پزشکی: ${profileData?.medical_code}`}
            serviceList={profileData?.expertises?.map(({ alias_title, degree, expertise }: any) =>
              getDisplayDoctorExpertise({
                aliasTitle: alias_title,
                degree: degree.name,
                expertise: expertise.name,
              }),
            )}
            toolBarItems={toolBarItems as ToolBarItems}
            className="w-full shadow-card md:rounded-lg"
            satisfaction={customize.showRateAndReviews && profileData.feedbacks?.details?.satisfaction}
            rateCount={profileData.feedbacks?.details?.number_of_feedbacks}
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
                    splunkInstance().sendEvent({
                      group: 'profile',
                      type: 'view-as',
                      event: {
                        action: `click-list`,
                        doctor: profileData.display_name,
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
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white flex justify-around">
            <div onClick={() => scrollIntoViewWithOffset('#services_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                دریافت نوبت
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#center-info_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                آدرس و تلفن
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#about_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                درباره پزشک
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#reviews_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                نظرات
              </Text>
            </div>
          </nav>

          <div className="flex flex-col w-full space-y-3 md:hidden">
            {aside({
              info: profileData,
              centers,
              isBulk,
              editable,
              handleViewAs,
              customize,
              seo: { breadcrumbs, slug },
            })
              .filter(({ isShow }: any) => Boolean(isShow))
              .map((section: any, index: number) => (
                <Section
                  key={index}
                  title={section?.title ?? ''}
                  {...{ id: section.id, ActionButton: section.ActionButto, ...(isSetDataTages && { dataAttributes: section.dataAttributes }) }}
                >
                  {section.children(section?.function?.())}
                </Section>
              ))}
          </div>

          {sections({
            info: { ...profileData, biography: overwriteData.biography },
            centers,
            isBulk,
            editable,
            handleViewAs,
            customize,
            seo: { breadcrumbs, slug },
          })
            .filter(({ isShow, isShowFallback }: any) => Boolean(isShow) || Boolean(isShowFallback))
            .map((section: any, index: number) => (
              <Section key={index} title={section?.title ?? ''} {...{ id: section.id, ActionButton: section.ActionButton }}>
                {section[section.isShow ? 'children' : 'fallback']?.(section?.function?.())}
              </Section>
            ))}
        </div>

        <aside className="flex-col hidden w-full space-y-3 overflow-hidden md:flex md:basis-5/12">
          {aside({
            info: profileData,
            centers,
            isBulk,
            editable,
            handleViewAs,
            customize,
            seo: { breadcrumbs, slug },
          })
            .filter(({ isShow }: any) => Boolean(isShow))
            .map((section: any, index: number) => (
              <Section key={index} title={section?.title ?? ''} {...{ id: section.id, ActionButton: section.ActionButton }}>
                {section.children(section?.function?.())}
              </Section>
            ))}
        </aside>
      </div>
      <Modal noHeader {...beenBeforeModalProps} bodyClassName="space-y-4 flex flex-col items-center">
        <Avatar src={publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image} width={90} height={90} />
        <Text fontWeight="semiBold">آیا تاکنون توسط {profileData.display_name} ویزیت شده‌اید؟</Text>
        <div className="flex w-full space-s-3">
          <Button
            block
            onClick={() =>
              window.location.assign(
                `${publicRuntimeConfig.CLINIC_BASE_URL}/comment/?doctorName=${profileData.display_name}&image=${
                  profileData.image
                }&group_expertises=${profileData?.group_expertises?.[0]?.name ?? 'سایر'}&group_expertises_slug=${
                  profileData?.group_expertises?.[0]?.en_slug ?? 'other'
                }&expertise=${profileData?.expertises?.[0]?.expertise?.name}&doctor_id=${profileData.id}&server_id=${
                  profileData.serverId
                }&doctor_city=${centers.find((center: any) => center.city)[0]}&doctor_slug=${profileData.slug}`,
              )
            }
          >
            بله
          </Button>
          <Button variant="secondary" block onClick={handleCloseBeenBeforeModal}>
            خیر
          </Button>
        </div>
      </Modal>
      <Modal {...viewAsModalProps} title={viewAdData?.title ?? ''} fullScreen bodyClassName="p-0">
        <iframe src={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}${viewAdData?.url}`} className="w-full h-full" />
      </Modal>
    </>
  );
};

DoctorProfile.getLayout = function getLayout(page: ReactElement) {
  const { title, description, slug, query, dehydratedState, feedbackDataWithoutPagination, host } = page.props;

  const profileData = dehydratedState.queries.find((item: any) => item.queryKey[0] === ServerStateKeysEnum.DoctorFullProfile).state.data
    .data;

  const doctorExpertise = getDisplayDoctorExpertise({
    aliasTitle: profileData?.expertises?.[0]?.alias_title,
    degree: profileData?.expertises?.[0]?.degree?.name,
    expertise: profileData?.expertises?.[0]?.expertise?.name,
  });

  const getJsonlds = () => {
    const center = profileData.centers.find((cn: any) => cn.id !== '5532');
    const date = new Date();
    const currentUrl = `/dr/${slug}`;

    return [
      {
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': '$$',
        'name': profileData.display_name,
        'telephone': center?.display_number,
        'description': profileData?.biography ? removeHtmlTagInString(profileData.biography) : '',
        'image': publicRuntimeConfig.CLINIC_BASE_URL + profileData.image,
        'isAcceptingNewPatients': true,
        'medicalSpecialty': !profileData?.group_expertises ? profileData.group_expertises?.[0]?.name : doctorExpertise,
        'duns': profileData?.medical_code,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IRN',
          },
          'addressLocality': center?.city,
          'addressRegion': center?.province,
          'streetAddress': center?.address,
        },
        ...(feedbackDataWithoutPagination.length > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            'bestRating': 5,
            'worstRating': 0,
            'ratingValue': profileData.feedbacks.details.avg_star,
            'ratingCount': profileData.feedbacks.details.number_of_feedbacks,
          },
        }),
        'review':
          feedbackDataWithoutPagination?.map((item: any) => ({
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': item.user_name,
            },
            'description': item.description,
            'reviewRating': {
              '@type': 'Rating',
              'bestRating': 5,
              'worstRating': 0,
              'datePublished': `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
              'ratingValue': item.avg_star === '0.0' || item.avg_star === 0.0 ? '0.5' : item.avg_star,
            },
          })) ?? [],
      },
      {
        '@context': 'http://www.schema.org',
        '@type': 'Person',
        'jobTitle': 'physician',
        'name': profileData.display_name,
        'telephone': center?.display_number,
        'image': publicRuntimeConfig.CLINIC_BASE_URL + profileData.image,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IRN',
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
              'name': profileData.display_name,
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
            src: publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image,
            alt: profileData?.display_name,
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
