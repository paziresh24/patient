import { useRemoveBook } from '@/common/apis/services/booking/removeBook';
import useShare from '@/common/hooks/useShare';
import { getReceiptTurnUrl } from '@/modules/myTurn/functions/getReceiptTurnUrl';
import { useWebView } from './../../../../common/hooks/useWebView';

export const useBookAction = () => {
  const share = useShare();
  const removeBookApi = useRemoveBook();
  const isWebView = useWebView();

  const shareTurn = ({ bookId, title, text, centerId }: { bookId: string; title: string; text: string; centerId: string }) => {
    const link = getReceiptTurnUrl({ bookId, centerId });
    share({
      title: title,
      text: text,
      url: link,
    });
  };

  const centerMap = ({ lat, lon }: { lat: string; lon: string }) => {
    window.open(`https://neshan.org/maps/routing/car/destination/${lat},${lon}`);
  };

  return { shareTurn, removeBookApi, centerMap };
};
