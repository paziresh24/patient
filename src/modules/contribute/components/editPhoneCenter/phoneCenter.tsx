import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import { useState } from 'react';

interface PhoneCenterProps {
  onSubmit: (data: PhoneData) => void;
  onCancel: () => void;
}

export type PhoneData = string;

export const PhoneCenter = ({ onSubmit, onCancel }: PhoneCenterProps) => {
  const [phoneNumber, setPhoneNumber] = useState<PhoneData>('');
  const [textFieldError, setTextFieldError] = useState(false);

  const validate = (phoneNumber: PhoneData) => {
    if (phoneNumber.length > 11 || phoneNumber.length < 9) {
      setTextFieldError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate(phoneNumber)) return false;
    onSubmit(phoneNumber);
  };

  return (
    <div className="flex flex-col space-y-5">
      <TextField
        placeholder="تلفن همراه یا تلفن ثابت با کد شهر"
        onChange={e => setPhoneNumber(e.target.value)}
        value={phoneNumber}
        error={textFieldError}
        onFocus={() => setTextFieldError(false)}
        helperText={textFieldError ? 'شماره تماس را به درستی وارد کنید.' : ''}
        inputMode="numeric"
        label="شماره تماس"
        size="small"
      />

      <div className="flex space-s-4">
        <Button block variant="primary" disabled={!phoneNumber} onClick={handleSubmit}>
          ثبت شماره تماس
        </Button>
        <Button color="secondary" block variant="secondary" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
};

export default PhoneCenter;
