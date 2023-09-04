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
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { dayToSecond } from '@/common/utils/dayToSecond';
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
import { push } from '@socialgouv/matomo-next';
import { getCookie, setCookie } from 'cookies-next';
import config from 'next/config';
import { ReactElement, useEffect, useState } from 'react';

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
}: any) => {
  useFeedbackDataStore.getState().data = feedbacks?.feedbacks ?? [];
  const { customize } = useCustomize();
  const isApplication = useApplication();
  const isWebView = useWebView();

  const addPageView = usePageView();
  const { recommendEvent } = useProfileSplunkEvent();

  // Modal
  const { handleOpen: handleOpenBeenBeforeModal, handleClose: handleCloseBeenBeforeModal, modalProps: beenBeforeModalProps } = useModal();
  const { handleOpen: handleOpenViewAsModal, modalProps: viewAsModalProps } = useModal();

  const [editable, setEditable] = useState(false);
  const [viewAdData, setViewAsData] = useState({ title: '', url: '' });
  const userInfo = useUserInfoStore(state => state.info);
  const setProfileData = useProfileDataStore(state => state.setData);
  const isShowPremiumFeatures = useShowPremiumFeatures();

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
      push(['trackEvent', 'contact', 'doctor profile']);
      addPageView.mutate({
        doctorId: information.id,
        serverId: information.server_id,
      });
      window.doctor = { ...information, centers };
      if (document.referrer.includes('google.') && !getCookie('isBeenBefore')) {
        handleOpenBeenBeforeModal();
        setCookie('isBeenBefore', true, {
          maxAge: dayToSecond(60),
          path: '/',
        });
      }
      if (information.should_recommend_other_doctors) recommendEvent('loadrecommend');
      setProfileData({ ...information, centers: [...centers], ...expertises, feedbacks });
    }
  }, [isBulk, information]);

  useEffect(() => {
    if (!!userInfo.is_doctor && slug === userInfo?.profile?.slug) {
      setEditable(true);
      splunkInstance().sendEvent({
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
  }, [userInfo.is_doctor, slug]);

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
    splunkInstance().sendEvent({
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
            pageViewCount={history?.count_of_page_view}
            displayName={information?.display_name}
            image={publicRuntimeConfig.CLINIC_BASE_URL + information?.image}
            title={information?.experience ? `${information?.experience} سال تجربه` : undefined}
            subTitle={`شماره نظام پزشکی: ${information?.medical_code}`}
            serviceList={expertises?.expertises?.map(({ alias_title }: any) => alias_title)}
            toolBarItems={toolBarItems as ToolBarItems}
            className="w-full shadow-card md:rounded-lg"
            satisfaction={customize.showRateAndReviews && feedbacks?.details?.satisfaction}
            rateCount={feedbacks?.details?.number_of_feedbacks}
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
              information,
              centers,
              expertises,
              history,
              onlineVisit,
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
                  {...{
                    id: section.id,
                    ActionButton: section.ActionButto,
                    dataAttributes: section?.dataAttributes,
                  }}
                >
                  {section.children(section?.function?.())}
                </Section>
              ))}
          </div>

          {sections({
            information,
            centers,
            expertises,
            feedbacks,
            media,
            history,
            symptomes,
            similarLinks,
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
            information,
            centers,
            expertises,
            history,
            onlineVisit,
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
        <Avatar src={publicRuntimeConfig.CLINIC_BASE_URL + information?.image} width={90} height={90} />
        <Text fontWeight="semiBold">آیا تاکنون توسط {information.display_name} ویزیت شده‌اید؟</Text>
        <div className="flex w-full space-s-3">
          <Button
            block
            onClick={() =>
              window.location.assign(
                `${publicRuntimeConfig.CLINIC_BASE_URL}/comment/?doctorName=${information.display_name}&image=${
                  information.image
                }&group_expertises=${expertises?.group_expertises?.[0]?.name ?? 'سایر'}&group_expertises_slug=${
                  expertises?.group_expertises?.[0]?.en_slug ?? 'other'
                }&expertise=${expertises?.expertises?.[0]?.alias_title}&doctor_id=${information.id}&server_id=${
                  information.server_id
                }&doctor_city=${centers.find((center: any) => center.city)[0]}&doctor_slug=${slug}`,
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
  const { title, description, slug, expertises, centers, information, feedbacks, feedbackDataWithoutPagination, host } = page.props;

  const doctorExpertise = expertises?.expertises?.[0]?.alias_title;

  const getJsonlds = () => {
    const center = centers.find((cn: any) => cn.id !== '5532');
    const date = new Date();
    const currentUrl = `/dr/${slug}`;

    return [
      {
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': '$$',
        'name': information.display_name,
        'telephone': center?.display_number,
        'description': information?.biography ? removeHtmlTagInString(information.biography) : '',
        'image': publicRuntimeConfig.CLINIC_BASE_URL + information.image,
        'isAcceptingNewPatients': true,
        'medicalSpecialty': !expertises?.group_expertises ? expertises.group_expertises?.[0]?.name : doctorExpertise,
        'duns': information?.medical_code,
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
            'ratingValue': feedbacks.details.avg_star,
            'ratingCount': feedbacks.details.number_of_feedbacks,
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
        'name': information.display_name,
        'telephone': center?.display_number,
        'image': publicRuntimeConfig.CLINIC_BASE_URL + information.image,
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
              'name': information.display_name,
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
            alt: information?.display_name,
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
