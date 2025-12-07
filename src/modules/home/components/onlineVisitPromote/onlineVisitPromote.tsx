import { useSearch } from '@/common/apis/services/search/search';
import Alert from '@/common/components/atom/alert';
import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import ChevronIcon from '@/common/components/icons/chevron';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import optimizeLogging from '@/common/utils/optimizeLogging';
import SearchCard from '@/modules/search/components/card/card';
import random from 'lodash/random';
import { useMemo } from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const OnlineVisitPromote = () => {
  const { handleOpen, handleClose, modalProps } = useModal();

  const searchData = useSearch({
    route: decodeURIComponent(`ir/general-practitioner`),
    query: {
      turn_type: 'consult',
      limit: 3,
    },
  });

  const substituteDoctor = useMemo(() => searchData.data?.search?.result?.[random(0, 2)] ?? {}, [searchData.data]);

  const handleOpenSubstituteDoctorModal = () => {
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'home_visit_online_doctor_recommendation',
        type: 'home_visit_online_doctor_recommendation-open-modal',
      });
    });
    handleOpen();
  };

  const handleClickDcotorCardDoctor = ({ url }: { url: string }) => {
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'home_visit_online_doctor_recommendation',
        type: 'home_visit_online_doctor_recommendation-click-doctor-card',
        event: {
          slug: url.replace('/dr/', ''),
        },
      });
    });
    location.assign(url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true');
  };

  const handleClickMoreDoctors = () => {
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'home_visit_online_doctor_recommendation',
        type: 'home_visit_online_doctor_recommendation-click-more-doctors',
      });
    });
    handleClose();
    location.assign('/consult?from_recommend_section=1');
  };

  return (
    <>
      <div className="fixed bottom-[5.5rem] md:flex justify-center w-full px-4 z-10">
        <Button
          onClick={handleOpenSubstituteDoctorModal}
          className="rounded-full font-semibold text-[.8rem] bg-[#f9f9f9] border-[#e1e0e0] text-slate-700/80  w-full md:w-auto justify-between"
          variant="secondary"
        >
          می‌خواهم همین الان با پزشک گفتگو کنم
          <div className="flex items-center gap-3">
            <div className="flex items-center ">
              {searchData.data?.search?.result?.map((item: any) => (
                <Avatar
                  key={item?.id}
                  src={publicRuntimeConfig.CDN_BASE_URL + item.image}
                  className="-ml-2 border-2 border-white"
                  width={25}
                  height={25}
                ></Avatar>
              ))}
            </div>
            <ChevronIcon dir="left" className="mr-1" />
          </div>
        </Button>
      </div>

      <Modal bodyClassName="p-3" title="" {...modalProps}>
        {(searchData.isLoading || !substituteDoctor?.url) && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && substituteDoctor?.url && (
          <div className="flex flex-col space-y-2 mb-2">
            <Alert severity="success" className="p-3 text-green-700 text-sm font-medium">
              بدون خروج از منزل، آنلاین ویزیت شوید.
            </Alert>
            <div onClick={() => handleClickDcotorCardDoctor({ url: substituteDoctor.url })}>
              <SearchCard
                avatarSize="lg"
                baseInfo={{
                  displayName: substituteDoctor.title,
                  expertise: substituteDoctor.display_expertise,
                  experience: substituteDoctor.experience,
                  isVerify: true,
                  avatar: substituteDoctor.image,
                  rate: {
                    count: substituteDoctor.rates_count,
                    satisfaction: substituteDoctor.satisfaction,
                  },
                  isOnline: true,
                }}
                type="doctor"
                details={{
                  badges: [
                    {
                      title: 'تضمین بازپرداخت مبلغ ویزیت در صورت نارضایتی',
                      icon: 'shield-icon',
                      type: 'error',
                    },
                  ],
                }}
                className="shadow-none !py-0 lg:!py-0 cursor-pointer"
                actions={[
                  {
                    text: `گفتگو با ${substituteDoctor.title}`,
                    outline: false,
                    description: '',
                  },
                ]}
              />
            </div>
          </div>
        )}
        <Button block size="sm" className="text-xs opacity-70" variant="text" onClick={handleClickMoreDoctors}>
          مشاهده سایر پزشکان آنلاین
        </Button>
      </Modal>
    </>
  );
};

export default OnlineVisitPromote;
