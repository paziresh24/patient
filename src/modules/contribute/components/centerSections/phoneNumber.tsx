import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { PhoneNumber } from '../../types/phoneNumber';
import AddButton from '../addButton';
import DislikeButton from '../dislikeButton/dislikeButton';
import { PhoneCenter, PhoneData } from '../editPhoneCenter';
import LikeButton from '../likeButton/likeButton';

interface PhoneNumberSectionProps {
  phoneNumbers: PhoneNumber[];
  setPhoneNumbers: Dispatch<SetStateAction<PhoneNumber[]>>;
}

export const PhoneNumberSection = (props: PhoneNumberSectionProps) => {
  const { phoneNumbers, setPhoneNumbers } = props;
  const [phoneDataForEdit, setPhoneDataForEdit] = useState<string | null>(null);
  const {
    handleOpen: handleOpenAddPhoneModalModal,
    handleClose: handleCloseAddPhoneModalModal,
    modalProps: addPhoneModalProps,
  } = useModal();

  const userData = useUserInfoStore(state => state.info);

  const handleAddPhoneNumber = (phoneNumberValue: PhoneData) => {
    if (phoneNumbers.every(items => items.cell !== phoneNumberValue) && phoneNumberValue != userData?.cell) {
      phoneDataForEdit && handlePhoneStatus(phoneNumbers.find(items => items.cell == phoneDataForEdit)!, 'dislike');
      setPhoneNumbers(prev => [...prev, { cell: phoneNumberValue, default: false, status: 'add' }]);
      handleCloseAddPhoneModalModal();
      return;
    }
    phoneNumberValue == userData?.cell ? toast.error('لطفا شماره تلفن مرکز را وارد کنید.') : toast.error('این شماره قبلا وارد شده است.');
  };

  const editPhoneNumber = (value: string) => {
    handleOpenAddPhoneModalModal();
    setPhoneDataForEdit(value);
  };

  const getStatus = (phoneNumber: PhoneNumber) => {
    return phoneNumbers.find(({ cell }: Pick<PhoneNumber, 'cell'>) => cell === phoneNumber.cell)?.status;
  };

  const handlePhoneStatus = (phoneNumber: PhoneNumber, type: 'like' | 'dislike') => {
    setPhoneNumbers(
      phoneNumbers.map(item => ({ ...item, ...(item.cell === phoneNumber.cell && { status: item?.status !== type ? type : undefined }) })),
    );
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {phoneNumbers.length > 0 && (
          <>
            <div className="flex flex-col w-full space-y-3">
              <Text fontSize="sm" fontWeight="medium">
                شماره تماس مرکز درمانی
              </Text>
              {phoneNumbers?.map(phoneNumber => (
                <div className="flex items-center space-s-2" key={phoneNumber.cell}>
                  <TextField
                    size="small"
                    defaultValue={phoneNumber.cell}
                    className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE] text-left"
                    readOnly
                    onClick={() => {
                      phoneNumber.default && editPhoneNumber(phoneNumber.cell);
                    }}
                  />
                  {phoneNumber.default && (
                    <div className="flex grid flex-col justify-center gap-2">
                      <LikeButton
                        onClick={() => {
                          handlePhoneStatus(phoneNumber, 'like');
                        }}
                        fill={getStatus(phoneNumber) === 'like'}
                      />
                      <DislikeButton
                        onClick={() => {
                          handlePhoneStatus(phoneNumber, 'dislike');
                          (phoneNumber.status === 'like' || !phoneNumber.status) && handleOpenAddPhoneModalModal();
                        }}
                        fill={getStatus(phoneNumber) === 'dislike'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {(phoneNumbers.some(item => !item?.default) || phoneNumbers.length >= 0) && (
          <AddButton
            text={phoneNumbers.length > 0 ? 'افزودن شماره تماس دیگر' : 'افزودن شماره تماس جدید'}
            onClick={() => handleOpenAddPhoneModalModal()}
          />
        )}
      </div>
      <Modal
        title="شماره تماس پیشنهادی شما"
        {...addPhoneModalProps}
        onClose={() => {
          addPhoneModalProps.onClose();
          setPhoneDataForEdit(null);
        }}
      >
        <PhoneCenter
          onSubmit={handleAddPhoneNumber}
          onCancel={() => handleCloseAddPhoneModalModal()}
          {...(phoneDataForEdit && { defaultPhone: phoneDataForEdit })}
        />
      </Modal>
    </>
  );
};

export default PhoneNumberSection;
