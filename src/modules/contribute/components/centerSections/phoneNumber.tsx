import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import { Dispatch, SetStateAction, useState } from 'react';
import AddButton from '../addButton';
import { PhoneCenter, PhoneData } from '../editPhoneCenter';
import RemoveButton from '../removeButton';

interface PhoneNumberSectionProps {
  phoneNumbers: string[];
  setPhoneNumbers: Dispatch<SetStateAction<string[]>>;
}

export const PhoneNumberSection = (props: PhoneNumberSectionProps) => {
  const { phoneNumbers, setPhoneNumbers } = props;
  const [addPhoneModal, setAddPhoneModal] = useState<boolean>(false);

  const handleAddPhoneNumber = (phoneNumberValue: PhoneData) => {
    setPhoneNumbers(prev => [...prev, phoneNumberValue]);
    setAddPhoneModal(false);
  };

  const handleRemoveField = (index: number) => {
    const removedFieldWithIndex = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(removedFieldWithIndex);
  };
  console.log(phoneNumbers);

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {phoneNumbers.length > 0 && (
          <>
            <div className="flex flex-col space-y-3 w-full">
              <Text fontSize="sm" fontWeight="medium">
                شماره تماس
              </Text>
              {phoneNumbers?.map((phoneNumber, index) => (
                <div className="flex items-center space-s-2" key={phoneNumber}>
                  <TextField size="small" defaultValue={phoneNumber} className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]" />
                  <RemoveButton onClick={() => handleRemoveField(index)} />
                </div>
              ))}
            </div>
          </>
        )}
        <AddButton
          text={phoneNumbers.length > 0 ? 'افزودن شماره تماس دیگر' : 'افزودن شماره تماس جدید'}
          onClick={() => setAddPhoneModal(true)}
        />
      </div>
      <Modal isOpen={addPhoneModal} onClose={setAddPhoneModal}>
        <PhoneCenter onSubmit={handleAddPhoneNumber} onCancel={() => setAddPhoneModal(false)} />
      </Modal>
    </>
  );
};

export default PhoneNumberSection;
