import { useLogin } from '@/common/apis/services/auth/login';
import Button from '@/common/components/atom/button';
import Timer from '@/common/components/atom/timer';
import axios from 'axios';
import { Dispatch, SetStateAction, useLayoutEffect, useState } from 'react';
import PinInput from 'react-pin-input';
import { toast } from 'react-toastify';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface OtpCodeProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  setMobileNumberValue: Dispatch<SetStateAction<string>>;
  postLogin?: () => void;
}

export const OtpCode = (props: OtpCodeProps) => {
  const { mobileNumberValue, setStep, postLogin } = props;
  const login = useLogin();
  const [password, setPassword] = useState('');
  const [timeTarget, setTimeTarget] = useState(0);

  useLayoutEffect(() => {
    const date = new Date();
    date.setMinutes(new Date().getMinutes() + 2);
    setTimeTarget(date.getTime() / 1000);
  }, []);

  const handleLogin = async (password: string) => {
    try {
      const { data } = await login.mutateAsync({
        username: +mobileNumberValue,
        password,
      });

      if (data.status === 1) {
        postLogin && postLogin();
        return;
      }
      toast.error(data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative">
        <LoginTitleBar title="کد تایید" description={`لطفا کد ارسال شده به شماره ${mobileNumberValue} را وارد نمایید.`} />
        <button className="absolute left-0 top-0 bg-slate-100 px-5 py-1 rounded-md">
          <Timer target={timeTarget} className="!text-slate-500 font-medium" />
        </button>
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
      <Button size="sm" variant="text" className="underline !text-slate-500" onClick={() => setStep('mobile_number')}>
        ویرایش شماره موبایل
      </Button>

      <Button onClick={() => handleLogin(password)} loading={login.isLoading}>
        ورود
      </Button>
    </div>
  );
};

export default OtpCode;
