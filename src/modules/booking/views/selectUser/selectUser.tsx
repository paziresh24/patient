import { useAddSubuser } from '@/common/apis/services/auth/subuser/addSubuser';
import { useGetSubuser } from '@/common/apis/services/auth/subuser/getSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Skeleton from '@/common/components/atom/skeleton';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatinetProfileForm } from '@/modules/patient/views/form';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '../../components/userCard';

interface SelectUserProps {
  onSelect: (user: any) => void;
}

export const SelectUser = (props: SelectUserProps) => {
  const { onSelect } = props;
  const userInfo = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const { data, mutate, isSuccess, isLoading, isIdle } = useGetSubuser();
  const addSubUser = useAddSubuser();
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [userSelected, setUserSelected] = useState(userInfo.id);

  useEffect(() => {
    if (!isLogin) {
      setTimeout(
        () =>
          handleOpenLoginModal({
            state: true,
            closable: false,
          }),
        0,
      );
    }
    if (isLogin && userInfo) {
      mutate();
      setUserSelected(userInfo.id);
      onSelect(userInfo);
    }
  }, [isLogin, userInfo]);

  const handleOpenAddSubuserModal = () => {
    addSubUser.reset();
    setIsOpenAddUserModal(true);
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
      setIsOpenAddUserModal(false);
      return;
    }
    toast.error(res.data.message);
  };

  const handleSelectUser = (id: string) => {
    setUserSelected(id);
    onSelect(data?.data?.result?.find((item: any) => item.id === id) ?? userInfo);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col w-full space-y-3">
        {(isLoading || isIdle) && <SubUserLoading />}
        {isSuccess && (
          <>
            <UserCard
              userId={userInfo.id ?? ''}
              name={userInfo.name ?? ''}
              family={userInfo.family ?? ''}
              cell={userInfo.username ?? ''}
              nationalCode={userInfo.national_code ?? ''}
              isForeigner={userInfo.is_foreigner ?? false}
              gender={userInfo.gender ?? ''}
              refetchData={mutate}
              onSelect={id => handleSelectUser(id)}
              select={userInfo.id === userSelected}
              type="user"
            />
            {data?.data?.result?.map((item: any) => (
              <UserCard
                key={item.id}
                userId={item.id}
                name={item.name}
                family={item.family}
                cell={item.cell}
                nationalCode={item.national_code}
                isForeigner={item.is_foreigner == '1'}
                gender={item.gender}
                refetchData={mutate}
                onSelect={id => handleSelectUser(id)}
                select={item.id === userSelected}
                type="subUser"
              />
            ))}
          </>
        )}
      </div>
      <Button className="self-center" variant="secondary" onClick={handleOpenAddSubuserModal}>
        دریافت نوبت برای فرد دیگر
      </Button>
      <Modal title="کاربر جدید" isOpen={isOpenAddUserModal} onClose={setIsOpenAddUserModal}>
        <PatinetProfileForm
          loading={addSubUser.isLoading}
          onSubmit={handleAddSubuser}
          fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL']}
          errorsField={{ ...addSubUser.data?.data?.details }}
        />
      </Modal>
    </div>
  );
};

const SubUserLoading = () => {
  return (
    <div className="space-y-2">
      <Skeleton w="100%" h="5rem" rounded="lg" />
      <Skeleton w="100%" h="5rem" rounded="lg" />
      <Skeleton w="100%" h="5rem" rounded="lg" />
    </div>
  );
};

export default SelectUser;
