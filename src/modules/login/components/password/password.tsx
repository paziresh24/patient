import Button from '@/common/components/atom/button';
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
import { splunkInstance } from '@/common/services/splunk';
import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { getErrorMessage } from '@/common/utils/errorHandler';

interface PasswordProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  postLogin?: (userInfo: UserInfo) => void;
}

export const Password = (props: PasswordProps) => {
  const { mobileNumberValue, postLogin, setStep } = props;
  const { t } = useTranslation('login');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();
  const resetPassword = useResetPassword();

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

  const handleRequestOtp = async () => {
    try {
      const { data: resetPasswordRes } = await resetPassword.mutateAsync({
        cell: +mobileNumberValue,
      });
      if (resetPasswordRes.status === ClinicStatus.SUCCESS || resetPasswordRes.status === 39) {
        if (resetPasswordRes.status === 39) {
          toast.error(resetPasswordRes.message || 'خطا در ارسال کد تایید');
        }
        setStep('otp_code');
      } else {
        toast.error(resetPasswordRes.message || 'خطا در ارسال کد تایید');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <LoginTitleBar
          title={t('steps.password.title')}
          description={t('steps.password.description', { mobileNumber: mobileNumberValue })}
        />
      </div>

      <div className="flex flex-col space-y-4">
        <TextField
          onKeyDown={event => event.key === 'Enter' && handleLogin(password)}
          autoComplete="off"
          onChange={e => setPassword(e.target.value)}
          type="password"
          style={{ direction: 'ltr' }}
          className="text-left"
          autoFocus
        />

        {/* دکمه اصلی: توپر و با اولویت بالا */}
        <Button
          onClick={() => handleLogin(password)}
          loading={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold"
        >
          {t('steps.password.action')}
        </Button>
      </div>
      {/* لینک فراموشی رمز - به عنوان یک متن کوچک زیر دکمه */}
      <Link
        href={`/login/forgot?mobile_number=${mobileNumberValue}`}
        as="/login/forgot"
        className="mt-4 flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 transition-all"
        onClick={() => {
          splunkInstance('gozargah').sendEvent({
            group: 'legacy-login-steps',
            type: 'forget-static-password',
          });
        }}
      >
        <PasswordIcon className="w-4 h-4 opacity-70" />
        <span className="text-xs font-medium">{t('steps.password.forgotPassword')}</span>
      </Link>

      {/* جداکننده ظریف (Divider) برای تفکیک دو دنیای متفاوت ورود */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="px-3 text-slate-300 text-[10px]">یا</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      {/* دکمه OTP: کاملاً متنی و ثانویه */}
      <button
        type="button"
        onClick={handleRequestOtp}
        disabled={resetPassword.isLoading}
        className="flex items-center justify-center gap-2 py-2 text-blue-500 hover:text-blue-700 font-medium transition-colors"
      >
        {resetPassword.isLoading ? (
          <span className="text-xs text-slate-400 italic">در حال ارسال...</span>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="text-xs">دریافت رمز یکبار مصرف از طریق پیامک</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Password;
