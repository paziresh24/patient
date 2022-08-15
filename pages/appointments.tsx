import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useInView } from "react-intersection-observer";

import Turn from "@/components/organisms/turn";
import Text from "@/components/atoms/text";
import Skeleton from "@/components/atoms/skeleton";
import EmptyState from "@/components/atoms/emptyState";
import Loading from "@/components/atoms/loading";

import { useGetBooks } from "@/apis/getBooks/hook";
import { useBookStore } from "@/store";
import { CenterType } from "@/types/centerType";
import getDisplayDoctorExpertise from "@/utils/getDisplayDoctorExpertise";
import { BookStatus } from "@/types/bookStatus";
import { Tab, Tabs } from "@/components/atoms/tabs";

interface AppointmentsProps {
  isWebView: boolean;
}

type BookType = "book" | "book_request";

export const Appointments: React.FC<AppointmentsProps> = ({ isWebView }) => {
  const [page, setPage] = useState<number>(1);
  const { books, addBooks, setBooks } = useBookStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [type, setType] = useState<BookType>("book");

  const getBooks = useGetBooks({
    page,
    return_type: type,
  });

  const [ref, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) setPage((prevState) => prevState + 1);
  }, [inView]);

  useEffect(() => {
    getBooks.remove();
    getBooks.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type]);

  useEffect(() => {
    if (getBooks.isSuccess) {
      setIsLoading(false);
      getBooks.data?.data?.length > 0 && addBooks(getBooks.data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBooks.status]);

  const handleChangeType = (type: BookType) => {
    setPage(1);
    setBooks([]);
    setIsLoading(true);
    setType(type);
  };

  return (
    <>
      <Head>
        <title>نوبت های من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {isWebView && (
        <div className="h-14 w-full flex items-center px-5 bg-white z-10 sticky border-b border-slate-200 border-solid">
          <Text fontWeight="bold">نوبت های من</Text>
        </div>
      )}

      <div className="w-full lg:flex justify-center bg-white shadow-card md:shadow-none sticky top-0 z-10 border-b border-slate-200 border-solid">
        <Tabs
          value={type}
          onChange={(value) => handleChangeType(value as BookType)}
          className="container mx-auto lg:w-2/5"
        >
          <Tab value="book" label="نوبت ها" className="w-full lg:w-auto" />
          <Tab value="book_request" label="درخواست ها" className="w-full lg:w-auto" />
        </Tabs>
      </div>
      <div className="flex flex-col">
        <div
          className={`p-0 space-y-2 pt-3 w-full lg:w-2/5 self-center`}
          data-testid="appointments-container"
        >
          {isLoading && (
            <>
              <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
              <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
              <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
              <Skeleton w="100%" h="15rem" className="rounded-none md:rounded-lg" />
            </>
          )}
          {!isLoading && books.length === 0 && <EmptyState text="نوبتی وجود ندارد." />}
          {books.length > 0 &&
            books.map((turn) => (
              <Turn
                key={turn.book_id}
                status={turn.delete === 1 ? BookStatus.deleted : turn.book_status}
                id={turn.book_id}
                centerType={
                  turn.center?.center_type === 1
                    ? CenterType.clinic
                    : turn.center?.id === "5532"
                    ? CenterType.consult
                    : CenterType.hospital
                }
                centerInfo={{
                  centerId: turn.center?.id,
                  centerType: turn.center?.center_type,
                  hasPaging: turn.center?.settings?.booking_paging_from_clinic,
                }}
                doctorInfo={{
                  avatar: turn.doctor_info?.image,
                  firstName: turn.doctor_info?.name,
                  lastName: turn.doctor_info?.family,
                  expertise: getDisplayDoctorExpertise({
                    aliasTitle: turn.doctor_info?.expertises?.[0]?.alias_title,
                    degree: turn.doctor_info?.expertises?.[0]?.degree?.name,
                    expertise: turn.doctor_info?.expertises?.[0]?.expertise?.name,
                  }),
                  slug: turn.doctor_info?.slug,
                  whatsapp: turn.whatsapp,
                }}
                patientInfo={{
                  nationalCode: turn.patient_info?.national_code,
                }}
                turnDetails={{
                  bookTime: turn.from,
                  waitingTime: turn.doctor_info?.waiting_time_info?.waiting_time_title,
                  trackingCode: turn.ref_id,
                  centerName: turn.center?.name,
                  patientName: `${turn.patient_info?.name ?? ""} ${
                    turn.patient_info?.family ?? ""
                  }`,
                }}
                location={{
                  lat: turn.center?.map?.lat,
                  lng: turn.center?.map?.lon,
                  address: turn.center?.address,
                }}
                feedbackUrl={turn.feed_back_url}
                prescription={{
                  ...turn.prescription,
                }}
              />
            ))}
          {!isLoading && getBooks.data?.status !== 204 && (
            <div ref={ref} className="w-full flex justify-center py-8">
              <Loading />
            </div>
          )}
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

export default Appointments;
