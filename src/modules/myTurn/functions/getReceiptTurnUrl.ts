import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface getReceiptTurnUrlProps {
  bookId: string;
  centerId: string;
}

export const getReceiptTurnUrl = ({ bookId, centerId }: getReceiptTurnUrlProps) => {
  const defaultCentersReceiptUrl = `${publicRuntimeConfig.CLINIC_BASE_URL}/receipt/${centerId}/${bookId}/`;

  return defaultCentersReceiptUrl;
};
