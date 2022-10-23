import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
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
  const [addPhoneModal, setAddPhoneModal] = useState<boolean>(false);

  const handleAddPhoneNumber = (phoneNumberValue: PhoneData) => {
    if (phoneNumbers.every(items => items.cell !== phoneNumberValue)) {
      setPhoneNumbers(prev => [...prev, { cell: phoneNumberValue, default: false, status: 'add' }]);
      setAddPhoneModal(false);
      return;
    }
    toast.warning('این شماره قبلا وارد شده است.');
  };
  const editPhoneNumber = (value: string) => {
    setAddPhoneModal(true);
    setPhoneDataForEdit(value);
  };

  const getStatus = (phoneNumber: PhoneNumber) => {
    return phoneNumbers.find(({ cell }: Pick<PhoneNumber, 'cell'>) => cell === phoneNumber.cell)?.status;
  };

  const handlePhoneStatus = (phoneNumber: PhoneNumber, type: 'like' | 'dislike') => {
    setPhoneNumbers(phoneNumbers.map(item => ({ ...item, ...(item.cell === phoneNumber.cell && { status: type }) })));
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {phoneNumbers.length > 0 && (
          <>
            <div className="flex flex-col space-y-3 w-full">
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
                      handlePhoneStatus(phoneNumber, 'dislike');
                    }}
                  />
                  {phoneNumber.default && (
                    <div className="flex flex-col justify-center grid gap-2">
                      <LikeButton
                        onClick={() => {
                          handlePhoneStatus(phoneNumber, 'like');
                        }}
                        currentColor={getStatus(phoneNumber) === 'like' ? '#00c700' : '#22282F'}
                      />
                      <DislikeButton
                        onClick={() => {
                          handlePhoneStatus(phoneNumber, 'dislike');
                          setAddPhoneModal(true);
                        }}
                        currentColor={getStatus(phoneNumber) === 'dislike' ? '#ff0000' : '#22282F'}
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
            onClick={() => setAddPhoneModal(true)}
          />
        )}
      </div>
      <Modal
        title="شماره تماس پیشنهادی شما"
        isOpen={addPhoneModal}
        onClose={() => {
          setAddPhoneModal(false);
          setPhoneDataForEdit(null);
        }}
      >
        <PhoneCenter
          onSubmit={handleAddPhoneNumber}
          onCancel={() => setAddPhoneModal(false)}
          {...(phoneDataForEdit && { defaultPhone: phoneDataForEdit })}
        />
      </Modal>
    </>
  );
};

export default PhoneNumberSection;
