import { useState } from 'react';
import ChangePassword from '../components/changePassword';
import ResetPassword from '../components/resetPassword';

export type StepForgotForm = 'change_password' | 'otp_code';

interface ForgotFormProps {
  title?: string;
  description?: string;
  postLogin?: () => void;
  mobileNumber: string;
}

export const ForgotForm = ({ postLogin, mobileNumber }: ForgotFormProps) => {
  const [step, setStep] = useState<StepForgotForm>('otp_code');

  return (
    <div className="flex flex-col justify-center h-full space-y-5">
      {step === 'otp_code' && <ResetPassword setStep={setStep} mobileNumberValue={mobileNumber} />}
      {step === 'change_password' && <ChangePassword mobileNumberValue={mobileNumber} onChanged={() => postLogin?.()} />}
    </div>
  );
};

export default ForgotForm;
