import { useRegister } from '@/common/apis/services/auth/register';
import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import { digitsFaToEn, phoneNumberValidator } from '@persian-tools/persian-tools';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface MobileNumberProps {
  title?: string;
  description?: string;
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  setMobileNumberValue: Dispatch<SetStateAction<string>>;
}

export const MobileNumber = (props: MobileNumberProps) => {
  const { mobileNumberValue, setMobileNumberValue, setStep, title, description } = props;
  const register = useRegister();
  const resetPassword = useResetPassword();
  const [isFieldError, setIsFieldError] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumberValidator(mobileNumberValue)) {
      setIsFieldError(true);
      return;
    }
    const { data: registerRes } = await register.mutateAsync({
      cell: +mobileNumberValue,
    });
    if (registerRes.status === 0) {
      return toast.error(registerRes.details['تلفن همراه']);
    }
    const { data: resetPasswordRes } = await resetPassword.mutateAsync({
      cell: +mobileNumberValue,
    });
    if (resetPasswordRes.status === 1) {
      return setStep('otp_code');
    }
    if (resetPasswordRes.status === 39) {
      toast.error(resetPasswordRes.message);
      return setStep('otp_code');
    }
    toast.error(resetPasswordRes.message);
  };

  return (
    <form className="flex flex-col space-y-5" onSubmit={handleRegister}>
      <LoginTitleBar title={title ?? 'ورود/ثبت نام'} description={description ?? 'لطفا شماره موبايل خود را وارد کنيد'} />
      <TextField
        label="شماره موبایل"
        onChange={e =>
          e.target.value.startsWith('9') && e.target.value.length >= 3
            ? setMobileNumberValue(digitsFaToEn(`0${e.target.value}`))
            : setMobileNumberValue(digitsFaToEn(e.target.value))
        }
        value={mobileNumberValue}
        style={{ direction: 'ltr' }}
        placeholder="09"
        helperText="مثال:*******0912"
        onFocus={() => setIsFieldError(false)}
        error={isFieldError}
        autoFocus
      />

      <Button disabled={!mobileNumberValue} type="submit" loading={register.isLoading || resetPassword.isLoading}>
        دریافت کد تایید
      </Button>
    </form>
  );
};

export default MobileNumber;
