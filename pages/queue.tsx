import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Text from "@/components/atoms/text";
import Queue from "@/components/molecules/queue";

interface AppointmentsProps {
  isWebView: boolean;
}

export const QueuePage: React.FC<AppointmentsProps> = ({ isWebView }) => {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <title>شماره نوبت من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col container mx-auto bg-white h-screen">
        {isWebView && (
          <div className="h-14 w-full flex items-center px-5 bg-white shadow-card fixed top-0 right-0 z-10">
            <Text fontWeight="bold">شماره نوبت من</Text>
          </div>
        )}
        <div className={`p-5 space-y-3 ${isWebView ? "pt-20" : ""} w-full lg:w-2/4 self-center`}>
          <Queue bookId={query.book_id as string} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isWebView: boolean = context.query?.isWebView ? true : false;
  return {
    props: {
      isWebView,
    },
  };
};

export default QueuePage;
