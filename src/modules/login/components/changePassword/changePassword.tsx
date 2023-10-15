import { useChangePassword } from '@/common/apis/services/auth/changePassword';
import { useEnablePassword } from '@/common/apis/services/auth/enablePassword';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField/textField';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { StepForgotForm } from '../../views/forgotForm';
import LoginTitleBar from '../titleBar';

interface ChangePasswordProps {
  setStep?: Dispatch<SetStateAction<StepForgotForm>>;
  mobileNumberValue: string;
  onChanged?: () => void;
}

export const ChangePassword = (props: ChangePasswordProps) => {
  const { mobileNumberValue, onChanged } = props;
  const { t } = useTranslation('login');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const changePassword = useChangePassword();
  const enablePassword = useEnablePassword();

  const handleChangePassword = async ({ password, passwordConfirmation }: { password: string; passwordConfirmation: string }) => {
    if (password !== passwordConfirmation) {
      return toast.error('رمزعبور و تکرار رمز عبور باید یکسان باشد.');
    }
    if (password.length < 4) {
      return toast.error('رمزعبور باید بیشتر از 4 کاراکتر باشد.');
    }

    try {
      await enablePassword.mutateAsync();
      await changePassword.mutateAsync({
        old_password: mobileNumberValue.substr(7, 11),
        password: password,
        password_confirmation: passwordConfirmation,
      });
      toast.success('رمزعبور تغییر کرد.');
      onChanged && onChanged();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          try {
            await changePassword.mutateAsync({
              old_password: mobileNumberValue.substr(7, 11),
              password: password,
              password_confirmation: passwordConfirmation,
            });
            toast.success('رمزعبور تغییر کرد.');
            onChanged && onChanged();
          } catch (error) {
            if (axios.isAxiosError(error)) {
              toast.error(error.response?.data?.message);
            }
          }
        }
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex flex-col">
        <LoginTitleBar
          title={t('steps.changePassword.title')}
          description={t('steps.changePassword.description', { mobileNumber: mobileNumberValue })}
        />
      </div>
      <TextField
        label="رمزعبور"
        autoComplete="off"
        onChange={e => setPassword(e.target.value)}
        type="password"
        style={{ direction: 'ltr' }}
      />
      <TextField
        label="تکرار رمزعبور"
        autoComplete="off"
        onChange={e => setPasswordConfirmation(e.target.value)}
        type="password"
        style={{ direction: 'ltr' }}
      />
      <Button
        onClick={() => handleChangePassword({ password, passwordConfirmation })}
        loading={enablePassword.isLoading || changePassword.isLoading}
      >
        {t('steps.changePassword.action')}
      </Button>
    </div>
  );
};

export default ChangePassword;
