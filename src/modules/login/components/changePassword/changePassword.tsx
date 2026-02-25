import { useSetPassword } from '@/common/apis/services/auth/setPassword';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField/textField';
import { getErrorMessage } from '@/common/utils/errorHandler';
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
  const setPasswordMutation = useSetPassword();

  const handleChangePassword = async ({ password, passwordConfirmation }: { password: string; passwordConfirmation: string }) => {
    if (password !== passwordConfirmation) {
      return toast.error('رمزعبور و تکرار رمز عبور باید یکسان باشد.');
    }
    if (password.length < 4) {
      return toast.error('رمزعبور باید بیشتر از 4 کاراکتر باشد.');
    }

    try {
      const { data } = await setPasswordMutation.mutateAsync({ password });
      const success = data?.success === true || data?.success === 'true';
      if (success) {
        toast.success(data?.message || 'رمز عبور با موفقیت تغییر کرد');
        onChanged && onChanged();
      } else {
        toast.error(data?.message || 'تغییر رمز عبور ناموفق بود.');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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
        loading={setPasswordMutation.isLoading}
      >
        {t('steps.changePassword.action')}
      </Button>
    </div>
  );
};

export default ChangePassword;
