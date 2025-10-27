import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import Timer from '@/common/components/atom/timer';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { getErrorMessage } from '@/common/utils/errorHandler';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import PinInput from 'react-pin-input';
import { useLogin } from '../../hooks/useLogin';
import { UserInfo } from '../../store/userInfo';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';
import { splunkInstance } from '@/common/services/splunk';
import { isEqual } from 'lodash';
interface OtpCodeProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  postLogin?: (userInfo: UserInfo) => void;
  setRetryGetPasswordNumber: Dispatch<SetStateAction<number>>;
  retryGetPasswordNumber: number;
}

export const OtpCode = (props: OtpCodeProps) => {
  const { mobileNumberValue, setStep, postLogin, retryGetPasswordNumber, setRetryGetPasswordNumber } = props;
  const { t } = useTranslation('login');
  const { login, isLoading } = useLogin();
  const resetPassword = useResetPassword();
  const [password, setPassword] = useState('');
  const [shouldShowResetButton, setShouldShowResetButton] = useState(false);

  const pinInputRef = useRef<any>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const getOtpFromSms = async () => {
      if ('OTPCredential' in window && 'credentials' in navigator) {
        try {
          const content = await (navigator.credentials.get as any)({
            otp: { transport: ['sms'] },
            signal: abortController.signal,
          });

          if (content && content.code) {
            setPassword(content.code);
            if (pinInputRef.current) {
              pinInputRef.current.value = content.code;

              const valueArr = (content.code || '').toString().split('');

              if (isEqual(valueArr, pinInputRef.current.values)) return;

              for (let i = 0; i < pinInputRef.current.elements.length; i++) {
                pinInputRef.current.elements[i].update(valueArr[i] || '', true);
              }
            }
          }
        } catch (err) {
          console.warn('Web OTP API error:', err);
        }
      }
    };

    getOtpFromSms();

    return () => abortController.abort();
  }, []);

  const handleLogin = async (password: string) => {
    try {
      const data = await login({
        username: mobileNumberValue,
        password,
      });
      splunkInstance('gozargah').sendEvent({
        group: 'legacy-login-steps',
        type: 'login-with-otp-code',
      });

      postLogin && postLogin(data);
    } catch (error) {
      toast.error((error as any)?.message || 'خطایی پیش آمده است. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleReset = async () => {
    if (!shouldShowResetButton) return;
    setShouldShowResetButton(false);

    try {
      const { data: resetPasswordRes } = await resetPassword.mutateAsync({
        cell: +mobileNumberValue,
        number_reset_password: retryGetPasswordNumber + 1,
      });

      splunkInstance('gozargah').sendEvent({
        group: 'legacy-login-steps',
        type: 'resend-otp-code',
        event: {
          number_reset_password: retryGetPasswordNumber + 1,
        },
      });

      setRetryGetPasswordNumber(prev => ++prev);

      if (resetPasswordRes.status === ClinicStatus.SUCCESS) {
        return;
      }

      if (resetPasswordRes.status === 39) {
        const errorMessage = resetPasswordRes.message || 'خطا در ارسال مجدد کد تایید';
        toast.error(errorMessage);
        return setStep('otp_code');
      }

      const errorMessage = resetPasswordRes.message || 'خطا در ارسال مجدد کد تایید';
      toast.error(errorMessage);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex flex-col">
        <LoginTitleBar title={t('steps.otpCode.title')} description={t('steps.otpCode.description', { mobileNumber: mobileNumberValue })} />
        <button className="absolute top-0 self-end px-5 py-1 rounded-md bg-slate-100" onClick={handleReset}>
          {shouldShowResetButton ? (
            <Text fontWeight="semiBold" fontSize="sm">
              {retryGetPasswordNumber >= 1 ? t('steps.otpCode.voiceCallWay') : t('steps.otpCode.resend')}
            </Text>
          ) : (
            <Timer target={60} defaultTime="00:59" ended={() => setShouldShowResetButton(true)} className="!text-slate-500 font-medium" />
          )}
        </button>
      </div>
      <PinInput
        ref={pinInputRef}
        length={4}
        focus
        initialValue={''}
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
      <Button size="sm" variant="text" className="underline !text-slate-500" onClick={() => setStep('mobile_number')}>
        {t('steps.otpCode.changeMobileNumber')}
      </Button>

      <Button onClick={() => handleLogin(password)} loading={isLoading}>
        {t('steps.otpCode.action')}
      </Button>
    </div>
  );
};

export default OtpCode;
