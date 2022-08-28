import { Button, FormControlLabel, TextField } from '@mui/material';
import { useState } from 'react';

interface PhoneCenterProps {
  onSubmit: (data: phoneData) => void;
  onCancel: () => void;
}

export type phoneData = string;

export const PhoneCenter = ({ onSubmit, onCancel }: PhoneCenterProps) => {
  const [phoneNumber, setPhoneNumber] = useState<phoneData>('');
  const [textFieldError, setTextFieldError] = useState(false);

  const validate = (phoneNumber: phoneData) => {
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
      <FormControlLabel
        control={
          <TextField
            fullWidth
            placeholder="تلفن همراه یا تلفن ثابت با کد شهر"
            onChange={e => setPhoneNumber(e.target.value)}
            value={phoneNumber}
            error={textFieldError}
            onFocus={() => setTextFieldError(false)}
            helperText={textFieldError ? 'شماره تماس را به درستی وارد کنید.' : ''}
          />
        }
        label="شماره تماس"
        labelPlacement="top"
        className="!items-start gap-2  w-full"
      />
      <div className="flex space-s-4">
        <Button color="success" fullWidth variant="contained" disabled={!phoneNumber} onClick={handleSubmit}>
          ثبت شماره تماس
        </Button>
        <Button color="secondary" fullWidth variant="outlined" onClick={onCancel}>
          انصراف
        </Button>
      </div>
    </div>
  );
};

export default PhoneCenter;
