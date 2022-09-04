import LoginForm from '@/modules/login/views/loginForm';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="h-screen p-8 bg-white flex justify-center items-center">
      <div className="w-96">
        <LoginForm postLogin={() => router.push('/')} />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default LoginPage;
