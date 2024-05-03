import { useSearch } from '@/common/apis/services/search/search';
import Alert from '@/common/components/atom/alert';
import Button from '@/common/components/atom/button';
import Card from '@/common/components/atom/card';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text/text';
import ErrorIcon from '@/common/components/icons/error';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import SearchCard from '@/modules/search/components/card/card';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import random from 'lodash/random';
import { useMemo } from 'react';
interface BulkServiceProps {
  displayName: string;
  expertises: any;
}

export const BulkService = ({ displayName, expertises }: BulkServiceProps) => {
  const { handleOpen, modalProps } = useModal();
  const customize = useCustomize(state => state.customize);
  const searchData = useSearch(
    {
      route: decodeURIComponent(`ir/${expertises.group_expertises[0].en_slug}`),
      query: {
        turn_type: 'consult',
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
    });
    handleOpen();
  };

  const handleClickDcotorCardDoctor = ({ url }: { url: string }) => {
    splunkInstance('search').sendEvent({
      group: 'profile_visit_online_doctor_recommendation',
      type: 'profile_visit_online_doctor_recommendation-click-doctor-card',
      event: {
        slug: url.replace('/dr/', ''),
      },
    });
    location.assign(url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true');
  };

  const handleClickMoreDoctors = () => {
    splunkInstance('search').sendEvent({
      group: 'profile_visit_online_doctor_recommendation',
      type: 'profile_visit_online_doctor_recommendation-click-more-doctors',
    });
    changeRoute({
      query: {
        turn_type: 'consult',
      },
      params: {
        city: 'ir',
        category: expertises.group_expertises[0].en_slug,
      },
      previousQueries: false,
    });
  };

  const substituteDoctor = useMemo(() => searchData.data?.search?.result?.[random(0, 2)] ?? {}, [searchData.data]);

  return (
    <>
      {searchData.isLoading && !customize.partnerKey && <Skeleton w="100%" h="5rem" className="md:rounded-md" />}
      {substituteDoctor?.url && !customize.partnerKey && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
          <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
            <Text className="text-sm font-medium">درحال حاضر نوبت جدیدی برای {displayName} تعریف نشده است.</Text>
          </Alert>
          <Button id="bulk-profile-button" block onClick={handleOpenSubstituteDoctorModal}>
            <Text>دریافت نوبت از پزشک جایگزین</Text>
          </Button>
        </Card>
      )}
      {(!searchData.isLoading || customize.partnerKey) && !substituteDoctor?.url && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
          <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
            <ErrorIcon className="w-5 h-5" />
            <Text className="text-sm font-medium">درحال حاضر نوبت جدیدی برای {displayName} تعریف نشده است.</Text>
          </Alert>
          <Text fontWeight="medium" fontSize="sm" className="text-slate-500">
            شما می توانید از سایر پزشکان حاذق در این حوزه نوبت بگیرید.
          </Text>
        </Card>
      )}
      <Modal bodyClassName="p-3" title="" {...modalProps}>
        {(searchData.isLoading || !substituteDoctor?.url) && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && substituteDoctor?.url && (
          <div className="flex flex-col mb-2 space-y-2">
            <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
              <Text className="text-sm font-medium">درحال حاضر نوبت جدیدی برای {displayName} تعریف نشده است.</Text>
            </Alert>
            <Alert severity="success" className="p-3 text-sm font-medium text-green-700">
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
          مشاهده سایر پزشکان آنلاین {expertises.group_expertises[0]?.name}
        </Button>
      </Modal>
    </>
  );
};

export default BulkService;
