import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface GetReceiptTurnUrlProps {
  bookId: string;
  centerId: string;
}

export const getReceiptTurnUrl = ({ bookId, centerId }: GetReceiptTurnUrlProps) => {
  const defaultCentersReceiptUrl = `${publicRuntimeConfig.CLINIC_BASE_URL}/receipt/${centerId}/${bookId}/`;

  return defaultCentersReceiptUrl;
};
