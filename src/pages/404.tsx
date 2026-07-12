import ErrorPage from '@/modules/profile/components/errorPage';
import { useRouter } from 'next/router';

const NotFound = () => {
  const router = useRouter();

  return <ErrorPage statusCode={404} refresh={() => router.reload()} profileType="doctor" />;
};

export default NotFound;
