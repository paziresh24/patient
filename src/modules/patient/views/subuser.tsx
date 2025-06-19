import { useAddSubuser } from '@/common/apis/services/auth/subuser/addSubuser';
import { useGetSubuser } from '@/common/apis/services/auth/subuser/getSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Skeleton from '@/common/components/atom/skeleton';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '../components/subuser/userCard';
import { PatinetProfileForm } from './form';

export const SubuserList = () => {
  const { data, mutate, isSuccess, isLoading } = useGetSubuser();
  const addSubUser = useAddSubuser();
  const { handleOpen: handleOpenAddModal, handleClose: handleCloseAddModal, modalProps: addModalProps } = useModal();

  const { t } = useTranslation('patient/subuser');

  useEffect(() => {
    mutate();
  }, []);

  const handleOpenAddSubuserModal = () => {
    addSubUser.reset();
    handleOpenAddModal();
  };

  const handleAddSubuser = async (data: any) => {
    const res = await addSubUser.mutateAsync({
      cell: data.cell,
      family: data.family,
      name: data.name,
      national_code: data.national_code,
      is_foreigner: data.is_foreigner ? '1' : '0',
      is_foreigner_web: data.is_foreigner,
      ...(data.gender && { gender: data.gender?.value }),
    });
    if (res.data.status === ClinicStatus.SUCCESS) {
      mutate();
      handleCloseAddModal();
      return;
    }
    if (res.data.status !== ClinicStatus.FORM_VALIDATION) toast.error(res.data.message);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {isLoading && <SubUserLoading />}
        {isSuccess &&
          data?.data?.result?.map((item: any) => (
            <UserCard
              key={item.id}
              userId={item.id}
              name={item.name}
              family={item.family}
              cell={item.cell}
              nationalCode={item.national_code}
              isForeigner={item.is_foreigner ?? false}
              gender={item.gender}
              refetchData={mutate}
            />
          ))}
      </div>
      <Button className="self-center mt-5" onClick={handleOpenAddSubuserModal}>
        {t('addUser')}
      </Button>
      <Modal title={t('newUserModalTitle')} {...addModalProps}>
        <PatinetProfileForm
          loading={addSubUser.isLoading}
          onSubmit={handleAddSubuser}
          fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL', 'IS_FOREIGNER']}
          errorsField={{ ...addSubUser.data?.data?.details }}
        />
      </Modal>
    </>
  );
};

const SubUserLoading = () => {
  return (
    <div className="space-y-2">
      <Skeleton w="100%" h="6rem" rounded="lg" />
      <Skeleton w="100%" h="6rem" rounded="lg" />
      <Skeleton w="100%" h="6rem" rounded="lg" />
    </div>
  );
};
