import { useState } from 'react';
import MobileNumber from '../components/mobileNumber';
import OtpCode from '../components/otpCode';

export type StepLoginForm = 'mobile_number' | 'otp_code';

interface LoginFormProps {
  title?: string;
  postLogin?: () => void;
}

export const LoginForm = ({ title, postLogin }: LoginFormProps) => {
  const [step, setStep] = useState<StepLoginForm>('mobile_number');
  const [mobileNumberValue, setMobileNumberValue] = useState('');
  return (
    <div className="flex flex-col justify-center h-full space-y-5">
      {step === 'mobile_number' && (
        <MobileNumber title={title} setStep={setStep} setMobileNumberValue={setMobileNumberValue} mobileNumberValue={mobileNumberValue} />
      )}
      {step === 'otp_code' && (
        <OtpCode
          setStep={setStep}
          setMobileNumberValue={setMobileNumberValue}
          mobileNumberValue={mobileNumberValue}
          postLogin={postLogin}
        />
      )}
    </div>
  );
};

export default LoginForm;
