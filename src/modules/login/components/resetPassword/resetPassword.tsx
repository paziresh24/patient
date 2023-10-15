import { useSendOtpCode } from '@/common/apis/services/auth/sendOtpCode';
import Button from '@/common/components/atom/button';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import PinInput from 'react-pin-input';
import { useLogin } from '../../hooks/useLogin';
import { UserInfo } from '../../store/userInfo';
import { StepForgotForm } from '../../views/forgotForm';
import LoginTitleBar from '../titleBar';

interface ResetPasswordProps {
  setStep: Dispatch<SetStateAction<StepForgotForm>>;
  mobileNumberValue: string;
  postLogin?: (userInfo: UserInfo) => void;
}

export const ResetPassword = (props: ResetPasswordProps) => {
  const { mobileNumberValue, setStep } = props;
  const { t } = useTranslation('login');
  const sendOtpCode = useSendOtpCode();
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();

  useEffect(() => {
    if (mobileNumberValue) {
      sendOtpCode.mutate({ mobile: mobileNumberValue, force: true });
    }
  }, [mobileNumberValue]);

  const handleLogin = async (password: string) => {
    try {
      await login({
        username: mobileNumberValue,
        password,
      });
      setStep('change_password');
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex flex-col">
        <LoginTitleBar title={t('steps.forgot.title')} description={t('steps.forgot.description', { mobileNumber: mobileNumberValue })} />
      </div>
      <PinInput
        length={4}
        focus
        initialValue=""
        onChange={value => setPassword(value)}
        type="numeric"
        inputMode="number"
        style={{ padding: '10px', direction: 'ltr', alignSelf: 'center' }}
        inputStyle={{ borderColor: '#cbd5e1', borderRadius: '0.6rem', margin: '0 4px' }}
        inputFocusStyle={{ borderColor: '#3861fb' }}
        onComplete={value => handleLogin(value)}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
      />

      <Button onClick={() => handleLogin(password)} loading={isLoading}>
        {t('steps.forgot.action')}
      </Button>
    </div>
  );
};

export default ResetPassword;
