import { useRegister } from '@/common/apis/services/auth/register';
import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { phoneNumberValidator } from '@/common/utils/phoneNumberValidator';
import { digitsFaToEn } from '@persian-tools/persian-tools';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
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
  const { t } = useTranslation('login');
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
    if (resetPasswordRes.status === ClinicStatus.SUCCESS || resetPasswordRes.status === 39) {
      if (resetPasswordRes.status === 39) toast.error(resetPasswordRes.message);
      if (resetPasswordRes?.result?.has_static_password) return setStep('password');
      return setStep('otp_code');
    }

    toast.error(resetPasswordRes.message);
  };

  return (
    <form className="flex flex-col space-y-5" onSubmit={handleRegister}>
      <LoginTitleBar title={title ?? t('steps.mobileNumber.title')} description={description ?? t('steps.mobileNumber.description')} />
      <TextField
        label={t('steps.mobileNumber.phoneNumberFieldLable')}
        onChange={e =>
          e.target.value.startsWith('9') && e.target.value.length >= 3
            ? setMobileNumberValue(digitsFaToEn(`0${e.target.value.trim()}`))
            : setMobileNumberValue(digitsFaToEn(e.target.value.trim()))
        }
        value={mobileNumberValue}
        style={{ direction: 'ltr' }}
        placeholder="09"
        helperText={t('steps.mobileNumber.exampleHint')}
        onFocus={() => setIsFieldError(false)}
        error={isFieldError}
        autoFocus
        type="tel"
        inputMode="numeric"
        disabled={register.isLoading || resetPassword.isLoading}
      />

      <Button disabled={!mobileNumberValue} type="submit" loading={register.isLoading || resetPassword.isLoading}>
        {t('steps.mobileNumber.action')}
      </Button>
    </form>
  );
};

export default MobileNumber;
