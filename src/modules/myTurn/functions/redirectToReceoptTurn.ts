import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

interface RedirectToReceoptTurn {
  slug: string;
  bookId: string;
  centerId: string;
}

export const redirectToReceoptTurn = ({ slug, bookId, centerId }: RedirectToReceoptTurn) => {
  return window.open(`${publicRuntimeConfig.CLINIC_BASE_URL}/booking/${slug}?id=${bookId}&center_id=${centerId}`, '_blank');
};
