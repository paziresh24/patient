import { useEffect, useState } from 'react';
import MobileNumber from '../components/mobileNumber';
import OtpCode from '../components/otpCode';
import Password from '../components/password/password';
import { UserInfo } from '../store/userInfo';
import { splunkInstance } from '@/common/services/splunk';
export type StepLoginForm = 'mobile_number' | 'otp_code' | 'password';

interface LoginFormProps {
  title?: string;
  description?: string;
  postLogin?: (userInfo: UserInfo) => void;
}

export const LoginForm = ({ title, description, postLogin }: LoginFormProps) => {
  const [step, setStep] = useState<StepLoginForm>('mobile_number');
  const [mobileNumberValue, setMobileNumberValue] = useState('');
  const [retryGetPasswordNumber, setRetryGetPasswordNumber] = useState(1);

  useEffect(() => {
    splunkInstance('gozargah').sendEvent({
      group: 'legacy-login-steps',
      type: 'load',
    });
    window?.clarity?.('upgrade', 'LoginModal');
  }, []);

  return (
    <div className="flex flex-col justify-center h-full space-y-5">
      {step === 'mobile_number' && (
        <MobileNumber
          title={title}
          description={description}
          setStep={setStep}
          setMobileNumberValue={setMobileNumberValue}
          mobileNumberValue={mobileNumberValue}
        />
      )}
      {step === 'otp_code' && (
        <OtpCode
          setStep={setStep}
          mobileNumberValue={mobileNumberValue}
          postLogin={postLogin}
          setRetryGetPasswordNumber={setRetryGetPasswordNumber}
          retryGetPasswordNumber={retryGetPasswordNumber}
        />
      )}
      {step === 'password' && <Password setStep={setStep} mobileNumberValue={mobileNumberValue} postLogin={postLogin} />}
    </div>
  );
};

export default LoginForm;
