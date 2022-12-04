import { useAddSubuser } from '@/common/apis/services/auth/subuser/addSubuser';
import { useGetSubuser } from '@/common/apis/services/auth/subuser/getSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { PatinetProfileForm } from '@/modules/patient/views/form';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserCard from '../../components/userCard';

interface SelectUserProps {
  onSubmit: (user: any) => void;
  loading: boolean;
}

export const SelectUser = (props: SelectUserProps) => {
  const { onSubmit, loading } = props;
  const userInfo = useUserInfoStore(state => state.info);
  const { data, mutate, isSuccess, isLoading } = useGetSubuser();
  const addSubUser = useAddSubuser();
  const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false);
  const [userSelected, setUserSelected] = useState(userInfo.id);

  useEffect(() => {
    mutate();
  }, []);

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
      ...(data.gender && { gender: data.gender?.value }),
    });
    if (res.data.status === 1) {
      mutate();
      setIsOpenAddUserModal(false);
      return;
    }
    toast.error(res.data.message);
  };

  const handleSubmit = () => {
    onSubmit(data?.data?.result?.find((item: any) => item.id === userSelected) ?? userInfo);
  };

  return (
    <div className="flex flex-col space-y-6">
      <Text fontWeight="bold">لطفا بیمار را انتخاب کنید</Text>
      <div className="flex flex-col w-full space-y-3">
        {isLoading && <SubUserLoading />}
        {isSuccess && (
          <>
            <UserCard
              userId={userInfo.id ?? ''}
              name={userInfo.name ?? ''}
              family={userInfo.family ?? ''}
              cell={userInfo.username ?? ''}
              nationalCode={userInfo.national_code ?? ''}
              gender={userInfo.gender ?? ''}
              refetchData={mutate}
              onSelect={id => setUserSelected(id)}
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
                gender={item.gender}
                refetchData={mutate}
                onSelect={id => setUserSelected(id)}
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
      <Button className="self-end w-40" onClick={handleSubmit} loading={loading || isLoading}>
        ادامه
      </Button>
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
