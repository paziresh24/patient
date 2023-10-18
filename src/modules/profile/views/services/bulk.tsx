import { useSearch } from '@/common/apis/services/search/search';
import Button from '@/common/components/atom/button';
import Card from '@/common/components/atom/card';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text/text';
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
  const content = useFeatureValue('recommed:suggest-doctor-modal-content', { header: '', footer: '', cardButton: 'مشاهده صفحه' });
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
      <Card className="space-y-3 !rounded-none md:!rounded-lg">
        <Button id="bulk-profile-button" block onClick={handleOpen}>
          <Text>دریافت نوبت</Text>
        </Button>
      </Card>
      <Modal bodyClassName="p-0" title="" {...modalProps}>
        {searchData.isLoading && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && substituteDoctor && (
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
            <a href={substituteDoctor.url + '?from_profile_suggest_cta=1&centerTarget=5532'}>
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
                  badges: substituteDoctor.badges.map((item: any) => ({ ...item, description: null })),
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
