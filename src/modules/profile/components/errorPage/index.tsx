import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import Seo from '@/common/components/layouts/seo';
import { splunkInstance } from '@/common/services/splunk';
import { useSearchStore } from '@/modules/search/store/search';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { DOCTOR_SEARCH_PATH } from '@/modules/profile/utils/doctorProfileSsr';

const CENTER_SEARCH_PATH = `/s/ir/?result_type=${encodeURIComponent('فقط کلینیک‌ها و بیمارستان‌ها')}`;

type ErrorPageProps = {
  message?: string;
  statusCode?: number;
  refresh: () => void;
  profileType?: 'center' | 'doctor';
};

const ErrorPage = ({ statusCode, refresh, message, profileType = 'doctor' }: ErrorPageProps) => {
  const router = useRouter();
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const splunkSource = profileType === 'center' ? 'center-profile' : 'doctor-profile';

  useEffect(() => {
    splunkInstance(splunkSource).sendEvent({
      group: 'profile_error',
      type: 'profile_error_client_side',
      event: {
        handle_error_status: statusCode,
        profile_type: profileType,
      },
    });
  }, []);

  const errors: { [key: number]: { status: number; title: string; message: string } } = {
    404: {
      status: 404,
      title: profileType === 'center' ? 'مرکز درمانی یافت نشد' : 'پزشک یافت نشد',
      message:
        profileType === 'center'
          ? 'متأسفیم، مرکز درمانی که دنبال آن هستید در پذیرش۲۴ وجود ندارد یا حذف شده است.'
          : 'متأسفیم، پزشکی که دنبال آن هستید در پذیرش۲۴ وجود ندارد یا حذف شده است.',
    },
    410: {
      status: 404,
      title: profileType === 'center' ? 'مرکز درمانی یافت نشد' : 'پزشک یافت نشد',
      message:
        profileType === 'center'
          ? 'این مرکز درمانی دیگر در پذیرش۲۴ فعال نیست.'
          : 'این پزشک دیگر در پذیرش۲۴ فعال نیست.',
    },
    500: {
      status: 500,
      title: 'مشکلی پیش آمده است',
      message: 'مشکلی در سرور رخ داده است. لطفاً بعداً دوباره امتحان کنید.',
    },
    502: {
      status: 502,
      title: 'مشکلی پیش آمده است',
      message: 'مشکلی در سرور رخ داده است. لطفاً بعداً دوباره امتحان کنید.',
    },
    504: {
      status: 504,
      title: 'زمان درخواست به پایان رسید',
      message: 'سرور به موقع پاسخ نداد. لطفاً بعداً دوباره امتحان کنید.',
    },
  };

  const error: any = statusCode ? errors[statusCode ?? 500] || errors[500] : {};
  const isNotFound = [404, 410].includes(statusCode ?? 0);

  return (
    <>
      {isNotFound && (
        <Seo
          title={error.title ?? 'صفحه یافت نشد'}
          description={message || error?.message}
          noIndex
          titleWithBrandName
        />
      )}
      <div className="flex flex-col items-center justify-center flex-grow min-h-[50vh] px-4 py-10">
      <div className="flex flex-col items-center w-full max-w-lg p-8 text-center bg-white shadow-card rounded-2xl space-y-4">
        {error.status && (
          <Text as="span" className="text-6xl font-bold text-red-500 leading-none">
            {error.status}
          </Text>
        )}
        {error.title && (
          <Text as="h1" fontWeight="bold" className="text-2xl md:text-3xl">
            {error.title}
          </Text>
        )}
        <Text className="text-base text-slate-600 leading-relaxed">{message || error?.message}</Text>
        <div className="flex flex-col w-full gap-3 pt-2 sm:flex-row sm:justify-center">
          {!isNotFound && (
            <Button className="w-full sm:w-auto" onClick={refresh}>
              تلاش مجدد
            </Button>
          )}
          {isNotFound && profileType === 'doctor' && (
            <>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsOpenSuggestion(true);
                }}
              >
                جستجوی پزشک
              </Button>
              <Link href={DOCTOR_SEARCH_PATH} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">
                  مشاهده لیست پزشکان
                </Button>
              </Link>
            </>
          )}
          {isNotFound && profileType === 'center' && (
            <>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsOpenSuggestion(true);
                }}
              >
                جستجوی مراکز درمانی
              </Button>
              <Link href={CENTER_SEARCH_PATH} className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">
                  مشاهده لیست مراکز
                </Button>
              </Link>
            </>
          )}
          {isNotFound && (
            <Button variant="secondary" className="w-full sm:w-auto" onClick={() => router.push('/')}>
              بازگشت به صفحه اصلی
            </Button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ErrorPage;
