import Avatar from '@/common/components/atom/avatar';
import Loading from '@/common/components/atom/loading';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import DoctorIcon from '@/common/components/icons/doctor';
import EditIcon from '@/common/components/icons/edit';
import HeadphoneIcon from '@/common/components/icons/headphone';
import LogoutIcon from '@/common/components/icons/logout';
import ReceiptIcon from '@/common/components/icons/receipt';
import SecuritySafeIcon from '@/common/components/icons/securitySafe';
import ShareIcon from '@/common/components/icons/share';
import UsersIcon from '@/common/components/icons/users';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import config from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
const { publicRuntimeConfig } = config();

export const PatinetProfile = () => {
  const router = useRouter();
  const userInfo = useUserInfoStore(state => state.info);
  const loginPending = useUserInfoStore(state => state.pending);
  const logout = useUserInfoStore(state => state.logout);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const isApplication = useApplication();
  const share = useShare();
  const { customize } = useCustomize();

  const openLoginForm = (link?: string) => {
    !isLogin &&
      !loginPending &&
      handleOpenLoginModal({
        state: true,
        postLogin() {
          if (link) router.push(link);
        },
      });
  };

  const openPrivateLink = (link: string) => {
    if (!isLogin) return openLoginForm(link);
    router.push(link);
  };

  return (
    <>
      <Seo title="پروفایل من" noIndex />

      {isApplication && <AppBar title="پروفایل من" />}

      {loginPending ? (
        <div className="h-full flex justify-center items-center flex-grow">
          <Loading />
        </div>
      ) : (
        <div className="mb-10">
          {isLogin && (
            <div className="flex flex-col p-5 bg-white shadow-sm">
              <Link href="/patient/profile?referrer=profile" className="flex items-center space-s-5">
                <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo.image ?? ''} />
                <div className="flex flex-col space-y-2">
                  {loginPending ? (
                    <>
                      <Skeleton h="1rem" w="8rem" rounded="full" />
                      <Skeleton h="1rem" rounded="full" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Text fontWeight="bold" className="line-clamp-1">
                          {userInfo.name} {userInfo.family}
                        </Text>
                        <EditIcon className="w-5 h-5" />
                      </div>
                      <Text fontSize="sm">{userInfo.username}</Text>
                    </>
                  )}
                </div>
              </Link>
            </div>
          )}
          {!isLogin && (
            <div className="flex flex-col mt-2 bg-white shadow-sm">
              <div
                onClick={() => openLoginForm()}
                className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="M2 12H14.88" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M12.65 8.6499L16 11.9999L12.65 15.3499"
                    stroke="#292D32"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <Text fontWeight="medium" fontSize="sm">
                  ورورد به حساب کاربری
                </Text>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-2 bg-white shadow-sm">
            <div
              onClick={() => openPrivateLink('/patient/appointments?referrer=profile')}
              className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
            >
              <CalenderIcon />
              <Text fontWeight="medium" fontSize="sm">
                نوبت های من
              </Text>
            </div>
            {customize.bookMark && (
              <div
                onClick={() => openPrivateLink('/patient/bookmarks?referrer=profile')}
                className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
              >
                <BookmarkIcon />
                <Text fontWeight="medium" fontSize="sm">
                  لیست پزشکان من
                </Text>
              </div>
            )}
            <div
              onClick={() => openPrivateLink('/patient/subuser?referrer=profile')}
              className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
            >
              <UsersIcon />
              <Text fontWeight="medium" fontSize="sm">
                کاربران زیرمجموعه
              </Text>
            </div>
          </div>

          <div className="flex flex-col mt-2 bg-white shadow-sm">
            <Link
              href={`${publicRuntimeConfig.CLINIC_BASE_URL}/home/privacy-policy/`}
              className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
            >
              <SecuritySafeIcon />
              <Text fontWeight="medium" fontSize="sm">
                حریم خصوصی
              </Text>
            </Link>
            <Link
              href={`${publicRuntimeConfig.CLINIC_BASE_URL}/home/rules/`}
              className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
            >
              <ReceiptIcon />
              <Text fontWeight="medium" fontSize="sm">
                شرایط استفاده
              </Text>
            </Link>
          </div>
          <div className="flex flex-col mt-2 bg-white shadow-sm">
            {customize.showSupport && (
              <a
                href="https://support.paziresh24.com/"
                className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
              >
                <HeadphoneIcon />
                <Text fontWeight="medium" fontSize="sm">
                  ارتباط با پشتیبانی
                </Text>
              </a>
            )}
            {customize.showSupplierRegister && (
              <Link
                href={`${publicRuntimeConfig.CLINIC_BASE_URL}/home/fordoctors/`}
                className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
              >
                <DoctorIcon />
                <Text fontWeight="medium" fontSize="sm">
                  پزشک یا منشی هستید؟
                </Text>
              </Link>
            )}
            {customize.showShareApp && (
              <div
                className="flex items-center px-5 py-4 border-b space-s-2 whitespace-nowrap border-slate-100"
                onClick={() => {
                  share({ url: 'https://www.paziresh24.com/app' });
                }}
              >
                <ShareIcon />
                <Text fontWeight="medium" fontSize="sm">
                  معرفی پذیرش24 به دوستان
                </Text>
              </div>
            )}
            {isLogin && (
              <div
                className="flex items-center px-5 py-4 border-b cursor-pointer space-s-2 whitespace-nowrap border-slate-100"
                onClick={logout}
              >
                <LogoutIcon />
                <Text fontWeight="medium" fontSize="sm">
                  خروج
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

PatinetProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default PatinetProfile;
