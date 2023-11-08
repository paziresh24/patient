import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField/textField';
import PasswordIcon from '@/common/components/icons/password';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLogin } from '../../hooks/useLogin';
import { UserInfo } from '../../store/userInfo';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface PasswordProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  postLogin?: (userInfo: UserInfo) => void;
}

export const Password = (props: PasswordProps) => {
  const { mobileNumberValue, postLogin } = props;
  const { t } = useTranslation('login');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();

  const handleLogin = async (password: string) => {
    try {
      const data = await login({
        username: mobileNumberValue,
        password,
      });

      postLogin && postLogin(data);
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex flex-col">
        <LoginTitleBar
          title={t('steps.password.title')}
          description={t('steps.password.description', { mobileNumber: mobileNumberValue })}
        />
      </div>
      <TextField
        onKeyDown={event => event.key === 'Enter' && handleLogin(password)}
        autoComplete="off"
        onChange={e => setPassword(e.target.value)}
        type="password"
        style={{ direction: 'ltr' }}
        autoFocus
      />
      <Button onClick={() => handleLogin(password)} loading={isLoading}>
        {t('steps.password.action')}
      </Button>
      <Link
        href={`/login/forgot?mobile_number=${mobileNumberValue}`}
        as="/login/forgot"
        className="flex !mt-4 items-center space-s-1 text-slate-500"
      >
        <PasswordIcon className="w-5 h-5" />
        <Text fontSize="xs" fontWeight="medium">
          {t('steps.password.forgotPassword')}
        </Text>
      </Link>
    </div>
  );
};

export default Password;
