/* eslint-disable react/display-name */
import { useEditSubuser } from '@/common/apis/services/auth/subuser/editSubuser';
import { useRemoveSubuser } from '@/common/apis/services/auth/subuser/removeSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import EditIcon from '@/common/components/icons/edit';
import TrashIcon from '@/common/components/icons/trash';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { memo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { PatinetProfileForm } from '../../views/form';

interface UserCardProps {
  name: string;
  family: string;
  cell: string;
  nationalCode: string;
  userId: string;
  gender: string;
  refetchData?: () => void;
}

export const UserCard = memo((props: UserCardProps) => {
  const { userId, name, family, cell, nationalCode, gender, refetchData } = props;
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const removeSubuser = useRemoveSubuser();
  const editSubuser = useEditSubuser();
  const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);

  const handleRemove = async () => {
    const { data } = await removeSubuser.mutateAsync({
      user_id: userId,
    });

    if (data.status === ClinicStatus.SUCCESS) {
      setIsOpenRemoveModal(false);
      refetchData && refetchData();
      return;
    }
    toast.error(data.message);
  };

  const handleOpenEditUserModal = () => {
    editSubuser.reset();
    setIsOpenEditUserModal(true);
  };

  const handleEditUser = async (data: any) => {
    const res = await editSubuser.mutateAsync({
      ...data,
      gender: data.gender.value,
      id: userId,
    });
    if (res.data.status === ClinicStatus.SUCCESS) {
      setIsOpenEditUserModal(false);
      refetchData && refetchData();
      return;
    }
    toast.error(res.data.message);
  };
  return (
    <>
      <div className="flex flex-col justify-between p-5 px-0 space-y-5 border-b border-solid md:space-y-0 md:flex-row border-slate-100">
        <div className="flex flex-col space-y-1">
          <Text fontWeight="semiBold">
            {name} {family}
          </Text>
          <div className="flex space-s-3">
            <Text fontSize="xs">شماره موبایل: {cell}</Text>
            <Text fontSize="xs">کدملی: {nationalCode}</Text>
          </div>
        </div>
        <div className="flex self-end space-s-2">
          <Button onClick={handleOpenEditUserModal} size="sm" variant="secondary" icon={<EditIcon />}>
            ویرایش
          </Button>
          <Button onClick={() => setIsOpenRemoveModal(true)} size="sm" variant="secondary" icon={<TrashIcon />}>
            حذف
          </Button>
        </div>
      </div>
      <Modal title="از حذف کاربر مطمئن هستید؟" isOpen={isOpenRemoveModal} onClose={setIsOpenRemoveModal}>
        <div className="flex space-s-3">
          <Button block onClick={handleRemove} loading={removeSubuser.isLoading}>
            حذف
          </Button>
          <Button block variant="secondary" onClick={() => setIsOpenRemoveModal(false)}>
            انصراف
          </Button>
        </div>
      </Modal>
      <Modal title="ویرایش کاربر" isOpen={isOpenEditUserModal} onClose={setIsOpenEditUserModal}>
        <PatinetProfileForm
          fields={['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL']}
          defaultValues={{
            NAME: name,
            FAMILY: family,
            NATIONAL_CODE: nationalCode,
            GENDER: gender,
            CELL: cell,
          }}
          onSubmit={handleEditUser}
          loading={editSubuser.isLoading}
          errorsField={{ ...editSubuser.data?.data?.details }}
        />
      </Modal>
    </>
  );
});

export default UserCard;
