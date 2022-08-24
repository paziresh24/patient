/* eslint-disable @next/next/no-img-element */
import Text from "@/components/atoms/text";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import heroVector from "@/images/contribute/hero.svg";
import Button from "@mui/lab/LoadingButton";
import { useGetProfileData } from "@/apis/profile/getData/hook";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useProfileDataStore } from "src/store/profileData";
import heart from "@/images/contribute/heart.svg";
import idCard from "@/images/contribute/idCard.svg";
import doctor from "@/images/contribute/doctor.svg";
import { useGetUser } from "@/apis/auth/me/hook";
import { useUserDataStore } from "src/store/userData";

interface PageProps {
  slug: string;
}

const Home = ({ slug }: PageProps) => {
  const router = useRouter();
  const getProfileData = useGetProfileData({
    slug,
  });
  const getUserData = useGetUser();
  const setProfileData = useProfileDataStore((state) => state.setData);
  const setUserData = useUserDataStore((state) => state.setUser);

  useEffect(() => {
    if (getProfileData.isSuccess) {
      setProfileData(getProfileData.data.data.data);
    }
    if (getUserData.isSuccess) {
      setUserData(getUserData.data.data.data);
    }
  }, [getProfileData.status, getUserData.isSuccess]);

  const handleNextPage = () => {
    router.push({
      pathname: "/contribute/menu",
      query: { slug },
    });
  };

  return (
    <div>
      <Head>
        <title>مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی</title>
      </Head>

      <main
        className="flex flex-col justify-between p-5"
        style={{
          background: "linear-gradient(180deg, #F4F8FB 62.04%, rgba(244, 248, 251, 0) 78.36%)",
        }}
      >
        <div className="flex flex-col space-y-5">
          <img src={heroVector.src} alt="" className="self-center" />
          <Text fontWeight="bold" className="text-center">
            با مشارکت در تکمیل اطلاعات پزشکان و مراکز درمانی، به 5 میلیون بیمارِ پذیرش 24 کمک کنید.
          </Text>
          <div className="flex items-center space-s-2">
            <img src={heart.src} alt="" className="-mt-5" width={25} />
            <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-500">
              شما می توانید با مشارکت در هر یک از موارد زیر، در کمک و یاری به دیگر بیماران قدمی
              بردارید.
            </Text>
          </div>
          <div className="bg-white shadow-xl shadow-blue-50 flex flex-col rounded-2xl p-6 space-y-4">
            <div className="flex space-s-4">
              <img src={idCard.src} className="w-7 h-7" alt="" />
              <div className="flex flex-col space-y-2">
                <Text fontWeight="semiBold" fontSize="sm">
                  اطلاعات پزشک مورد نظر خود را بروز کنید
                </Text>
                <Text fontWeight="light" fontSize="sm" className="text-slate-500">
                  شما می توانید اطلاعات تماس و آدرس مرکز درمانی پزشک مورد نظر خود را ویرایش کنید.
                </Text>
              </div>
            </div>
            <div className="flex space-s-4">
              <img src={doctor.src} className="w-7 h-7" alt="" />
              <div className="flex flex-col space-y-2">
                <Text fontWeight="semiBold" fontSize="sm">
                  گزارش روش های دریافت نوبت
                </Text>
                <Text fontWeight="light" fontSize="sm" className="text-slate-500">
                  شما می توانید روش های دریافت نوبت از پزشک مورد نظرتان را با دیگر بیماران به اشتراک
                  بگذارید.
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 right-0 w-full p-5 shadow-lg">
          <Button
            fullWidth
            variant="contained"
            onClick={handleNextPage}
            loading={getProfileData.isLoading || getUserData.isLoading}
          >
            متوجه شدم
          </Button>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug: string = context.query?.slug as string;
  if (!slug) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      slug,
    },
  };
};

export default Home;
