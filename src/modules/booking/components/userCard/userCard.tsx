import { useEditSubuser } from '@/common/apis/services/auth/subuser/editSubuser';
import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Modal from '@/common/components/atom/modal';
import EditIcon from '@/common/components/icons/edit';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormFields, PatinetProfileForm } from '@/modules/patient/views/form';
import { useMemo, useState } from 'react';
import Select from '../select';

interface UserCardProps {
  name: string;
  family: string;
  cell: string;
  nationalCode: string;
  userId: string;
  gender: string;
  refetchData?: () => void;
  select: boolean;
  onSelect: (id: string) => void;
  type: 'user' | 'subUser';
}

export const UserCard = (props: UserCardProps) => {
  const { userId, name, family, cell, nationalCode, gender, refetchData, select, onSelect, type } = props;

  const editSubuser = useEditSubuser();
  const updateUser = useUpdateUser();
  const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const fields: FormFields = useMemo(
    () => (type === 'subUser' ? ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL'] : ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE']),
    [type],
  );

  const handleEditUser = async (data: any) => {
    if (type === 'user') {
      const res = await updateUser.mutateAsync({
        ...data,
        gender: data.gender.value,
      });
      if (res.data.status === 1) {
        setIsOpenEditUserModal(false);
        setUserInfo(res.data.result);
        return;
      }
      return;
    }
    const res = await editSubuser.mutateAsync({
      ...data,
      gender: data.gender.value,
      id: userId,
    });
    if (res.data.status === 1) {
      refetchData && refetchData();
      return;
    }
  };
  return (
    <>
      <Select
        title={`${name} ${family}`}
        subTitle={cell}
        selected={select}
        onSelect={() => onSelect(userId)}
        actionText="ویرایش"
        actionIcon={<EditIcon width={18} height={18} />}
        action={() => {
          setIsOpenEditUserModal(true);
          editSubuser.reset();
          updateUser.reset();
        }}
      />
      <Modal title="ویرایش کاربر" isOpen={isOpenEditUserModal} onClose={setIsOpenEditUserModal}>
        <PatinetProfileForm
          fields={fields}
          defaultValues={{
            NAME: name,
            FAMILY: family,
            NATIONAL_CODE: nationalCode,
            GENDER: gender,
            CELL: cell,
          }}
          onSubmit={handleEditUser}
          loading={editSubuser.isLoading || updateUser.isLoading}
          errorsField={{
            ...(type === 'subUser'
              ? { ...editSubuser.data?.data?.details }
              : {
                  ...updateUser.data?.data?.details,
                }),
          }}
        />
      </Modal>
    </>
  );
};

export default UserCard;
