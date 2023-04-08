import { useLogin } from '@/common/apis/services/auth/login';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField/textField';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useServerQuery from '@/common/hooks/useServerQuery';
import { dayToSecond } from '@/common/utils/dayToSecond';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserInfoStore } from '../../store/userInfo';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface PasswordProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  postLogin?: () => void;
}

export const Password = (props: PasswordProps) => {
  const { mobileNumberValue, postLogin } = props;
  const { t } = useTranslation('login');
  const login = useLogin();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [password, setPassword] = useState('');
  const university = useServerQuery(state => state.queries.university);
  const getDoctorProfile = useGetDoctorProfile();

  const handleLogin = async (password: string) => {
    try {
      const { data } = await login.mutateAsync({
        username: +mobileNumberValue,
        password,
      });

      if (data.status === ClinicStatus.SUCCESS) {
        setCookie('certificate', data.certificate, {
          path: '/',
          maxAge: dayToSecond(60),
        });

        if (university)
          setCookie('token', data.token, {
            path: '/',
            maxAge: dayToSecond(60),
          });

        if (window?.Android) window.Android.login(data.certificate);

        let profile = {};
        if (data.is_doctor) {
          try {
            const { data } = await getDoctorProfile.mutateAsync();
            profile = data.data;
          } catch (error) {
            console.error(error);
          }
        }

        setUserInfo({
          is_doctor: data.is_doctor,
          profile,
          ...data.result,
        });

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
      <div className="relative flex flex-col">
        <LoginTitleBar
          title={t('steps.password.title')}
          description={t('steps.password.description', { mobileNumber: mobileNumberValue })}
        />
      </div>
      <TextField onChange={e => setPassword(e.target.value)} type="password" style={{ direction: 'ltr' }} autoFocus />
      <Button onClick={() => handleLogin(password)} loading={login.isLoading || getDoctorProfile.isLoading}>
        {t('steps.password.action')}
      </Button>
    </div>
  );
};

export default Password;
