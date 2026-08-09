import { apiGatewayClient } from '@/common/apis/client';
import { UserInfo } from '@/modules/login/store/userInfo';
import { useQuery } from '@tanstack/react-query';

type WalletCenter = { id?: string; type_id?: number };

const fetchCenterBalance = async (centerId: string) => {
  const path =
    centerId === '5532'
      ? '/katibe/v1/transactions/balance/p24'
      : `/katibe/v1/transactions/balance/p24?centerid=${centerId}&account=organization`;
  const { data } = await apiGatewayClient.get<{ data?: { balance?: number } }>(path);
  return Number(data?.data?.balance ?? 0);
};

const getWalletCenters = (centers: WalletCenter[]) =>
  centers.filter(center => center.id && (center.id === '5532' || center.type_id === 1));

export const getDoctorWalletBalance = async (user?: UserInfo, centerId?: string | null) => {
  if (centerId) {
    return fetchCenterBalance(centerId);
  }

  const centers = user?.provider?.centers ?? [];
  const walletCenters = getWalletCenters(centers);

  if (!walletCenters.length) {
    return fetchCenterBalance('5532');
  }

  const balances = await Promise.all(walletCenters.map(center => fetchCenterBalance(String(center.id))));
  return balances.reduce((sum, balance) => sum + balance, 0);
};

export const useDoctorWalletBalance = (user?: UserInfo, enabled = true, centerId?: string | null) => {
  const centerIds = (user?.provider?.centers ?? []).map(center => center.id).join(',');

  return useQuery(
    ['doctorHome', 'walletBalance', user?.id, centerIds, centerId ?? 'all'],
    () => getDoctorWalletBalance(user, centerId),
    {
      enabled: enabled && !!user?.id,
      staleTime: 60 * 1000,
      retry: 1,
    },
  );
};
