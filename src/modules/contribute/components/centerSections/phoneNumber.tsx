import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import { Dispatch, SetStateAction, useState } from 'react';
import { useInfoVote } from '../../hooks/useInfoVote';
import { PhoneNumbers } from '../../types/phoneNumbers';
import AddButton from '../addButton';
import DislikeButton from '../dislikeButton/dislikeButton';
import { PhoneCenter, PhoneData } from '../editPhoneCenter';
import LikeButton from '../likeButton/likeButton';

interface PhoneNumberSectionProps {
  phoneNumbers: PhoneNumbers;
  setPhoneNumbers: Dispatch<SetStateAction<PhoneNumbers>>;
}

export const PhoneNumberSection = (props: PhoneNumberSectionProps) => {
  const { phoneNumbers, setPhoneNumbers } = props;
  const [addPhoneModal, setAddPhoneModal] = useState<boolean>(false);
  const { dislike, like, submit } = useInfoVote('phone_number');

  const handleAddPhoneNumber = (phoneNumberValue: PhoneData) => {
    setPhoneNumbers(prev => [...prev, { cell: phoneNumberValue, default: false }]);
    setAddPhoneModal(false);
    submit(phoneNumberValue);
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
                    className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]"
                    readOnly
                  />
                  {phoneNumbers.every(item => item?.default) && (
                    <div className="flex flex-col justify-center grid gap-2">
                      <LikeButton onClick={() => like(phoneNumber?.cell)} />
                      <DislikeButton
                        onClick={() => {
                          dislike(phoneNumber?.cell);
                          setAddPhoneModal(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {(phoneNumbers.some(item => !item?.default) || phoneNumbers.length === 0) && (
          <AddButton
            text={phoneNumbers.length > 0 ? 'افزودن شماره تماس دیگر' : 'افزودن شماره تماس جدید'}
            onClick={() => setAddPhoneModal(true)}
          />
        )}
      </div>
      <Modal title="شماره تماس پیشنهادی شما" isOpen={addPhoneModal} onClose={setAddPhoneModal}>
        <PhoneCenter onSubmit={handleAddPhoneNumber} onCancel={() => setAddPhoneModal(false)} />
      </Modal>
    </>
  );
};

export default PhoneNumberSection;
