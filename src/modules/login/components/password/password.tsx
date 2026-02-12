import { digitsFaToEn } from '@persian-tools/persian-tools';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField/textField';
import PasswordIcon from '@/common/components/icons/password';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLogin } from '../../hooks/useLogin';
import { UserInfo } from '../../store/userInfo';
import LoginTitleBar from '../titleBar';
import { splunkInstance } from '@/common/services/splunk';

interface PasswordProps {
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

      splunkInstance('gozargah').sendEvent({
        group: 'legacy-login-steps',
        type: 'login-with-static-password',
      });
      postLogin && postLogin(data);
    } catch (error) {
      toast.error((error as any)?.message || 'خطایی پیش آمده است. لطفاً دوباره تلاش کنید.');
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
        value={password}
        onKeyDown={event => event.key === 'Enter' && handleLogin(password)}
        autoComplete="off"
        onChange={e => setPassword(digitsFaToEn(e.target.value))}
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
        onClick={() => {
          splunkInstance('gozargah').sendEvent({
            group: 'legacy-login-steps',
            type: 'forget-static-password',
          });
        }}
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
