/* eslint-disable react/display-name */
import { useEditSubuser } from '@/common/apis/services/auth/subuser/editSubuser';
import { useRemoveSubuser } from '@/common/apis/services/auth/subuser/removeSubuser';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import EditIcon from '@/common/components/icons/edit';
import TrashIcon from '@/common/components/icons/trash';
import useResponsive from '@/common/hooks/useResponsive';
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
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
  const { isMobile } = useResponsive();
  const { userId, name, family, cell, nationalCode, gender, refetchData } = props;
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);
  const removeSubuser = useRemoveSubuser();
  const editSubuser = useEditSubuser();
  const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);

  const handleRemove = async () => {
    const { data } = await removeSubuser.mutateAsync({
      user_id: userId,
    });

    if (data.status === 1) {
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
    if (res.data.status === 1) {
      setIsOpenEditUserModal(false);
      refetchData && refetchData();
      return;
    }
    toast.error(res.data.message);
  };
  return (
    <>
      <div className="p-5 px-0 flex-col space-y-5 md:space-y-0 md:flex-row border-b border-solid border-slate-100 flex justify-between">
        <div className="flex flex-col space-y-1">
          <Text fontWeight="semiBold">
            {name} {family}
          </Text>
          <div className="flex space-s-3">
            <Text fontSize="xs">شماره موبایل: 0{cell}</Text>
            <Text fontSize="xs">کدملی: {nationalCode}</Text>
          </div>
        </div>
        <div className="flex space-s-2 self-end">
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
