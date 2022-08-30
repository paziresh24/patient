import { useRegister } from '@/common/apis/services/auth/register';
import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import { Dispatch, SetStateAction } from 'react';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface MobileNumberProps {
  title?: string;
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  setMobileNumberValue: Dispatch<SetStateAction<string>>;
}

export const MobileNumber = (props: MobileNumberProps) => {
  const { mobileNumberValue, setMobileNumberValue, setStep, title } = props;
  const register = useRegister();
  const resetPassword = useResetPassword();

  const handleRegister = async () => {
    await register.mutateAsync({
      cell: +mobileNumberValue,
    });
    await resetPassword.mutateAsync({
      cell: +mobileNumberValue,
    });
    setStep('otp_code');
  };

  return (
    <div className="flex flex-col space-y-5">
      <LoginTitleBar title="ورود/ثبت نام" description={title ?? 'لطفا شماره موبايل خود را وارد کنيد'} />
      <TextField
        label="شماره موبایل"
        onChange={e =>
          e.target.value.startsWith('0') || e.target.value.length < 3
            ? setMobileNumberValue(e.target.value)
            : setMobileNumberValue(`0${e.target.value}`)
        }
        value={mobileNumberValue}
        style={{ direction: 'ltr' }}
        placeholder="09"
        helperText="مثال:*******0912"
      />
      <Button disabled={!mobileNumberValue} onClick={handleRegister} loading={register.isLoading || resetPassword.isLoading}>
        دریافت کد تایید
      </Button>
    </div>
  );
};

export default MobileNumber;
