import { useAddSubuser } from '@/common/apis/services/auth/subuser/addSubuser';
import { useGetSubuser } from '@/common/apis/services/auth/subuser/getSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Skeleton from '@/common/components/atom/skeleton';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { UserInfo, useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormFields, PatinetProfileForm } from '@/modules/patient/views/form';
import orderBy from 'lodash/orderBy';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '../../components/userCard';

interface SelectUserProps {
  onSelect: (user: any) => void;
  className?: string;
  shouldShowMessengers: boolean;
}

export const SelectUser = (props: SelectUserProps) => {
  const { onSelect, className, shouldShowMessengers } = props;
  const userInfo = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const isUserPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const { data, mutate, isSuccess, isLoading, isIdle } = useGetSubuser();
  const addSubUser = useAddSubuser();
  const { handleOpen: handleOpenAddUserModal, handleClose: handleCloseAddUserModal, modalProps: addUserModalProps } = useModal();
  const [userSelected, setUserSelected] = useState(userInfo.id);

  useEffect(() => {
    if (!isLogin && !isUserPending) {
      setTimeout(
        () =>
          handleOpenLoginModal({
            state: true,
            closable: false,
          }),
        0,
      );
    }
    if (isLogin && userInfo && !isUserPending) {
      mutate();
      setUserSelected(userInfo.id);
      handleSelectUser(userInfo);
    }

    return () => {
      handleOpenLoginModal({
        state: false,
      });
    };
  }, [isLogin, userInfo, isUserPending]);

  const handleOpenAddSubuserModal = () => {
    addSubUser.reset();
    handleOpenAddUserModal();
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
      handleCloseAddUserModal();
      handleSelectUser(res.data.result);
      return;
    }
    if (res.data.status !== ClinicStatus.FORM_VALIDATION) toast.error(res.data.message);
  };

  const handleSelectUser = (user: UserInfo, messengerType?: string) => {
    setUserSelected(user.id);
    onSelect({ ...user, ...(messengerType && { messengerType }) });
  };

  const getUserWithId = (id: string) => {
    return data?.data?.result?.find((item: any) => item.id === id) ?? userInfo;
  };

  return (
    <div className={classNames('flex flex-col space-y-6', className)}>
      <div className="flex flex-col w-full space-y-3">
        {(isLoading || isIdle) && <SubUserLoading />}
        {isSuccess && (
          <>
            <UserCard
              userId={userInfo.id ?? ''}
              name={userInfo.name ?? ''}
              family={userInfo.family ?? ''}
              cell={userInfo.cell ?? ''}
              nationalCode={userInfo.national_code ?? ''}
              isForeigner={userInfo.is_foreigner ?? false}
              gender={userInfo.gender ?? ''}
              refetchData={mutate}
              onSelect={(id, payload) => handleSelectUser(getUserWithId(id), payload?.messengerType as string)}
              select={userInfo.id === userSelected}
              type="user"
              shouldShowMessengers={shouldShowMessengers}
            />
            {orderBy(data?.data?.result, 'created_at', 'desc')?.map((item: any) => (
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
                onSelect={(id, payload) => handleSelectUser(getUserWithId(id), payload?.messengerType as string)}
                select={item.id === userSelected}
                type="subUser"
                shouldShowMessengers={shouldShowMessengers}
              />
            ))}
          </>
        )}
      </div>
      <Button className="self-center" variant="secondary" onClick={handleOpenAddSubuserModal}>
        دریافت نوبت برای فرد دیگر
      </Button>
      <Modal title="کاربر جدید" {...addUserModalProps}>
        <PatinetProfileForm
          loading={addSubUser.isLoading}
          onSubmit={handleAddSubuser}
          fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL', 'IS_FOREIGNER'] as FormFields}
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
