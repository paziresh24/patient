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
import SearchCard from '@/modules/search/components/card/card';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { template } from 'lodash';
interface BulkServiceProps {
  displayName: string;
  expertises: any;
}

export const BulkService = ({ displayName, expertises }: BulkServiceProps) => {
  const { handleOpen, modalProps } = useModal();
  const customize = useCustomize(state => state.customize);
  const content = useFeatureValue('recommed:suggest-doctor-modal-content', {
    header: '',
    footer: '',
    cardButton: 'مشاهده صفحه',
    buttonAction: 'profile',
  });
  const searchData = useSearch({
    route: decodeURIComponent(`ir/${expertises.group_expertises[0].en_slug}`),
    query: {
      turn_type: 'consult',
    },
  });

  const substituteDoctor = searchData.data?.search?.result?.[0] ?? {};

  const headerTemplate = template(content.header);
  const footerTemplate = template(content.footer);

  return (
    <>
      {searchData.isLoading && <Skeleton w="100%" h="5rem" className="md:rounded-md" />}
      {substituteDoctor?.url && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
          <Button id="bulk-profile-button" block onClick={handleOpen}>
            <Text>دریافت نوبت</Text>
          </Button>
        </Card>
      )}
      {!searchData.isLoading && (!substituteDoctor?.url || customize.partnerKey) && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
          <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
            <ErrorIcon className="w-5 h-5" />
            <Text className="text-sm font-medium">در حال حاضر این پزشک با پذیرش24 همکاری ندارد.</Text>
          </Alert>
          <Text fontWeight="medium" fontSize="sm" className="text-slate-500">
            شما می توانید از سایر پزشکان حاذق در این حوزه نوبت بگیرید.
          </Text>
        </Card>
      )}
      <Modal bodyClassName="p-0" title="" {...modalProps}>
        {(searchData.isLoading || !substituteDoctor?.url) && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && substituteDoctor?.url && (
          <div className="flex flex-col space-y-2">
            <div
              className="p-4 pb-0"
              dangerouslySetInnerHTML={{
                __html: headerTemplate({
                  substitute_doctor: { ...substituteDoctor },
                  doctor: typeof window !== 'undefined' && window.doctor,
                }),
              }}
            />
            <a
              href={
                content.buttonAction === 'profile'
                  ? substituteDoctor.url + '?from_profile_suggest_cta=1&centerTarget=5532'
                  : substituteDoctor.url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true'
              }
            >
              <SearchCard
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
                  badges: substituteDoctor?.badges?.map?.((item: any) => ({ ...item, description: null })),
                }}
                className="shadow-none border !p-4 rounded-none border-slate-100"
                actions={[
                  {
                    text: content.cardButton ?? 'مشاهده صفحه',
                    outline: false,
                    description: '',
                  },
                ]}
              />
            </a>
            {content.footer && (
              <div
                dangerouslySetInnerHTML={{
                  __html: footerTemplate({
                    substitute_doctor: { ...substituteDoctor },
                    doctor: typeof window !== 'undefined' && window.doctor,
                  }),
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default BulkService;
