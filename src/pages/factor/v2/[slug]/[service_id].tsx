import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { useDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { useDoctorExpertise } from '@/common/hooks/useDoctorExpertise';
import { useDoctorFullName } from '@/common/hooks/useDoctorFullName';
import { CENTERS } from '@/common/types/centers';
import DoctorInvoiceNotice from '@/modules/booking/components/factor/doctorInvoiceNotice';
import {
  mapDoctorCenterServices,
  resolveBookableServiceId,
} from '@/modules/booking/functions/mapDoctorCenterServices';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo } from 'react';

const Factor = () => {
  const {
    query: { slug, service_id },
  } = useRouter();
  const doctorSlug = slug as string;
  const requestedServiceId = service_id as string | undefined;

  const { data: centers } = useQuery(
    [ServerStateKeysEnum.DoctorCenters, doctorSlug],
    () => getDoctorCenters(doctorSlug),
    {
      enabled: !!doctorSlug,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );
  const consultCenter = useMemo(
    () => centers?.find(item => String(item.id) === String(CENTERS.CONSULT)),
    [centers],
  );
  const { data: consultServices, isSuccess: consultServicesReady } = useDoctorCenterServices(
    doctorSlug,
    CENTERS.CONSULT,
    { enabled: !!doctorSlug && !!consultCenter },
  );
  const resolvedServiceId = useMemo(() => {
    if (!consultServicesReady || !consultServices?.length) {
      return requestedServiceId;
    }
    const mapped = mapDoctorCenterServices(consultServices, consultCenter?.user_center_id);
    return resolveBookableServiceId(requestedServiceId, mapped) ?? requestedServiceId;
  }, [consultServicesReady, consultServices, consultCenter?.user_center_id, requestedServiceId]);
  const { data: fullName } = useDoctorFullName(doctorSlug);
  const { data: expertises } = useDoctorExpertise(doctorSlug);

  const isLogin = useUserInfoStore(state => state.isLogin);
  const isPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();

  const userCenterId = useMemo(
    () => centers?.find(item => String(item.id) === String(CENTERS.CONSULT))?.user_center_id,
    [centers],
  );
  const doctorName = useMemo(
    () => [fullName?.name, fullName?.family].filter(Boolean).join(' '),
    [fullName?.name, fullName?.family],
  );
  const groupExpertise = expertises?.[0]?.groups?.[0]?.name;

  useEffect(() => {
    if (!isPending && !isLogin) {
      handleOpenLoginModal({ state: true, closable: false });
    }
  }, [isLogin, isPending]);

  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10 mb-[5rem]">
        <div className="w-full md:basis-4/6 z-10">
          <FactorWrapper
            centerId={'5532'}
            serviceId={resolvedServiceId}
            userCenterId={userCenterId}
            doctorName={doctorName}
            groupExpertise={groupExpertise}
          />
        </div>
        <DoctorInvoiceNotice slug={doctorSlug} serviceId={resolvedServiceId as string} userCenterId={userCenterId} />
      </div>
    </>
  );
};

Factor.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} showBottomNavigation={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Factor;
