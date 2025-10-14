import { useSearch } from '@/common/apis/services/search/search';
import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text/text';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import SearchCard from '@/modules/search/components/card/card';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import random from 'lodash/random';
import { useEffect, useMemo } from 'react';

interface SubstituteDoctorButtonProps {
  displayName: string;
  expertises: any;
  doctorCity: string;
  buttonId?: string;
  buttonText?: string;
  autoOpenDelay?: number;
}

const SubstituteDoctorButton = ({
  displayName,
  expertises,
  doctorCity,
  buttonId = 'substitute-doctor-button',
  buttonText = 'دریافت نوبت از پزشک جایگزین',
  autoOpenDelay = 6000,
}: SubstituteDoctorButtonProps) => {
  const { handleOpen, modalProps } = useModal();
  const customize = useCustomize(state => state.customize);
  const searchData = useSearch(
    {
      route: decodeURIComponent(doctorCity),
      query: {
        turn_type: 'consult',
        text: expertises?.expertises.filter((item: any) => item.alias_title)?.[0]?.alias_title
          ? expertises?.expertises.filter((item: any) => item.alias_title)?.[0]?.alias_title
          : expertises?.expertises.filter((item: any) => item.expertise_id !== 325)?.map((expertise: any) => expertise.expertise_name)[0],
      },
    },
    {
      enabled: !customize.partnerKey,
    },
  );
  const { changeRoute } = useSearchRouting();

  const handleOpenSubstituteDoctorModal = () => {
    splunkInstance('search').sendEvent({
      group: 'profile_visit_online_doctor_recommendation',
      type: 'profile_visit_online_doctor_recommendation-open-modal',
      event: {
        slug: substituteDoctor?.url?.replace('/dr/', ''),
      },
    });
    handleOpen();
  };

  const handleClickDoctorCard = ({ url, element }: { url: string; element: any }) => {
    splunkInstance('search').sendEvent({
      group: 'profile_visit_online_doctor_recommendation',
      type: 'profile_visit_online_doctor_recommendation-click-doctor-card',
      event: {
        slug: url.replace('/dr/', ''),
      },
    });
    if (element == 'button') {
      return location.assign(url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true');
    }
    return location.assign(url + '?centerTarget=5532');
  };

  const handleClickMoreDoctors = () => {
    splunkInstance('search').sendEvent({
      group: 'profile_visit_online_doctor_recommendation',
      type: 'profile_visit_online_doctor_recommendation-click-more-doctors',
      event: {
        slug: substituteDoctor?.url?.replace('/dr/', ''),
      },
    });
    changeRoute({
      query: {
        turn_type: 'consult',
        text: expertises?.expertises?.map((expertise: any) => expertise.expertise_name)[0],
      },
      params: {
        city: 'ir',
      },
      previousQueries: false,
    });
  };

  const substituteDoctor = useMemo(() => searchData.data?.search?.result?.[random(0, 2)] ?? {}, [searchData.data]);

  useEffect(() => {
    if (substituteDoctor?.url && autoOpenDelay > 0) {
      setTimeout(() => {
        handleOpenSubstituteDoctorModal();
      }, autoOpenDelay);
    }
  }, [substituteDoctor?.url, autoOpenDelay]);

  // Don't render if partner key is present or no substitute doctor found
  if (customize.partnerKey || !substituteDoctor?.url) {
    return null;
  }

  return (
    <>
      <Button id={buttonId} block onClick={handleOpenSubstituteDoctorModal}>
        <Text>{buttonText}</Text>
      </Button>

      <Modal bodyClassName="p-3" title="" {...modalProps}>
        {(searchData.isLoading || !substituteDoctor?.url) && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && substituteDoctor?.url && (
          <div className="flex flex-col mb-2 space-y-2">
            <div className="flex bg-slate-50 border-slate-200 text-slate-900 items-center p-3 space-s-2 rounded-md border">
              <Text className="text-sm font-medium">{displayName} نوبت ندارد.</Text>
            </div>
            <div className="p-3 bg-green-600 border-green-700 text-sm font-medium text-white rounded-md border">
              طبق نظر بیماران، مشابه ترین پزشک آنلاین به {displayName}:
            </div>
            <div onClick={() => handleClickDoctorCard({ url: substituteDoctor.url, element: 'card' })}>
              <SearchCard
                avatarSize="lg"
                baseInfo={{
                  displayName: substituteDoctor.title,
                  expertise: substituteDoctor.display_expertise,
                  isVerify: true,
                  avatar: substituteDoctor.image,
                  rate: {
                    count: substituteDoctor.rates_count,
                    satisfaction: substituteDoctor.satisfaction,
                  },
                  isOnline: true,
                }}
                type="doctor"
                className="shadow-none !py-0 lg:!py-0 cursor-pointer"
                actions={[
                  {
                    text: `ویزیت آنلاین با دکتر ${substituteDoctor.title}`,
                    outline: false,
                    description: '',
                    action() {
                      handleClickDoctorCard({ url: substituteDoctor.url, element: 'button' });
                    },
                  },
                ]}
              />
            </div>
          </div>
        )}
        <Button block size="sm" className="text-xs opacity-70" variant="text" onClick={handleClickMoreDoctors}>
          مشاهده سایر پزشکان آنلاین {expertises.group_expertises[0]?.name} مشابه
        </Button>
      </Modal>
    </>
  );
};

export default SubstituteDoctorButton;
