import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text/text';
import { usePartnerSubstituteSearch } from '@/common/apis/services/search/search';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import SearchCard from '@/modules/search/components/card/card';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import random from 'lodash/random';
import { useMemo } from 'react';

interface PartnerSubstituteDoctorButtonProps {
  displayName: string;
  expertises: any;
  doctorCity: string;
  buttonId?: string;
  buttonText?: string;
}

const PartnerSubstituteDoctorButton = ({
  displayName,
  expertises,
  doctorCity,
  buttonId = 'partner-substitute-doctor-button',
  buttonText = 'دریافت نوبت از پزشک جایگزین',
}: PartnerSubstituteDoctorButtonProps) => {
  const { handleOpen, modalProps } = useModal();
  const customize = useCustomize(state => state.customize);
  const university = customize?.partnerKey ?? '';

  const expertiseSlug = useMemo(() => {
    const slug = expertises?.expertises?.[0]?.slug;
    if (slug) return slug.startsWith('exp-') ? slug : `exp-${slug}`;
    const groupSlug = expertises?.group_expertises?.[0]?.en_slug;
    if (groupSlug) return groupSlug.startsWith('exp-') ? groupSlug : `exp-${groupSlug}`;
    return 'exp-internal-diseases';
  }, [expertises]);

  const cityEnSlug = doctorCity || 'ir';

  const searchData = usePartnerSubstituteSearch(
    {
      city_en_slug: cityEnSlug,
      university,
      expertise_slug: expertiseSlug,
    },
    {
      enabled: !!university && !!modalProps.isOpen && !!expertiseSlug,
    },
  );
  const { changeRoute } = useSearchRouting();

  const substituteDoctor = useMemo(() => {
    const results = searchData.data?.search?.result ?? [];
    if (results.length === 0) return {};
    return results[random(0, Math.min(2, results.length - 1))] ?? {};
  }, [searchData.data]);

  if (!customize?.partnerKey) {
    return null;
  }

  const handleClickDoctorCard = ({ url }: { url: string }) => {
    location.assign(url);
  };

  const handleClickMoreDoctors = () => {
    changeRoute({
      query: {
        university,
        ref: 'hospital_team_substitution',
      },
      params: {
        city: doctorCity || 'ir',
        category: expertiseSlug,
      },
      previousQueries: false,
      overWrite: true,
    });
  };

  return (
    <>
      <Button id={buttonId} block onClick={handleOpen}>
        <Text>{buttonText}</Text>
      </Button>

      <Modal bodyClassName="p-3" title="" {...modalProps}>
        {(searchData.isLoading || searchData.isFetching) && (
          <div className="flex justify-center w-full">
            <Loading className="w-8 h-8 my-8 " />
          </div>
        )}
        {searchData.isSuccess && searchData.data?.search?.result?.length > 0 && (
          <div className="flex flex-col mb-2 space-y-2">
            <div className="flex bg-slate-50 border-slate-200 text-slate-900 items-center p-3 space-s-2 rounded-md border">
              <Text className="text-sm font-medium">{displayName} نوبت ندارد.</Text>
            </div>
            <div className="p-3 bg-green-600 border-green-700 text-sm font-medium text-white rounded-md border">
              طبق نظر بیماران، مشابه‌ترین پزشک به {displayName}:
            </div>
            <div onClick={() => substituteDoctor?.url && handleClickDoctorCard({ url: substituteDoctor.url })}>
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
                    text: `دریافت نوبت از دکتر ${substituteDoctor.title}`,
                    outline: false,
                    description: '',
                    action() {
                      substituteDoctor?.url && handleClickDoctorCard({ url: substituteDoctor.url });
                    },
                  },
                ]}
              />
            </div>
          </div>
        )}
        <Button block size="sm" className="text-xs opacity-70" variant="text" onClick={handleClickMoreDoctors}>
          مشاهده سایر پزشکان
        </Button>
      </Modal>
    </>
  );
};

export default PartnerSubstituteDoctorButton;
