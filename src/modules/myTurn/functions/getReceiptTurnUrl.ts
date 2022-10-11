import { CENTERS } from '@/common/types/centers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface GetReceiptTurnUrl {
  slug: string;
  bookId: string;
  centerId: string;
}

export const getReceiptTurnUrl = ({ slug, bookId, centerId }: GetReceiptTurnUrl) => {
  const defaultCentersReceiptUrl = `${publicRuntimeConfig.CLINIC_BASE_URL}/booking/${slug}?id=${bookId}&center_id=${centerId}`;
  const consultCenterReceiptUrl = `${publicRuntimeConfig.CLINIC_BASE_URL}/receipt/${bookId}/`;

  return centerId === CENTERS.CONSULT ? consultCenterReceiptUrl : defaultCentersReceiptUrl;
};
