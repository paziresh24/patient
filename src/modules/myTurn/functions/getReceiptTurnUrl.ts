import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getReceiptTurnUrl = (bookId: string) => {
  const defaultCentersReceiptUrl = `${publicRuntimeConfig.CLINIC_BASE_URL}/receipt/${bookId}/`;

  return defaultCentersReceiptUrl;
};
