import Button from '@/common/components/atom/button';
import { useRouter } from 'next/router';

const ErrorPage = ({ statusCode }: { statusCode: number }) => {
  const router = useRouter();

  const errors: { [key: number]: { status: number; title: string; message: string } } = {
    404: {
      status: 404,
      title: 'صفحه یافت نشد',
      message: 'متاسفیم، اما صفحه‌ای که دنبال آن هستید وجود ندارد.',
    },
    410: {
      status: 404,
      title: 'صفحه یافت نشد',
      message: 'متاسفیم، اما صفحه‌ای که دنبال آن هستید وجود ندارد.',
    },
    500: {
      status: 500,
      title: 'خطای سرور داخلی',
      message: 'مشکلی در سرور رخ داده است. لطفاً بعداً دوباره امتحان کنید.',
    },
    504: {
      status: 504,
      title: 'زمان درخواست به پایان رسید',
      message: 'سرور به موقع پاسخ نداد. لطفاً بعداً دوباره امتحان کنید.',
    },
  };

  const error = errors[statusCode] || errors[500];

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-600">{error.status}</h1>
      <h2 className="text-3xl font-semibold mt-4">{error.title}</h2>
      <p className="text-lg text-gray-600 mt-2">{error.message}</p>
      <Button className="mt-6" onClick={() => router.push('/')}>
        بازگشت به صفحه اصلی
      </Button>
    </div>
  );
};
export default ErrorPage;
