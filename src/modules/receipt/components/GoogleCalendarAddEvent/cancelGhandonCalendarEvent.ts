import { apiGatewayClient } from '@/common/apis/client';
import { ADD_EVENT_API_PATH } from './constants';

export type CancelGhandonCalendarEventParams = {
  user_id?: string | null;
  book_id?: string | null;
};

/**
 * Fire-and-forget Ghandon cancel_event. Never throws to callers; errors are logged only.
 */
export const cancelGhandonCalendarEvent = ({ user_id, book_id }: CancelGhandonCalendarEventParams): void => {
  const normalizedUserId = user_id?.toString().trim() ?? '';
  const normalizedBookId = book_id?.toString().trim() ?? '';

  if (!normalizedUserId || !normalizedBookId) {
    console.warn('[Ghandon-Front] Aborting cancel_event. Missing user_id or book_id:', {
      user_id: normalizedUserId,
      book_id: normalizedBookId,
    });
    return;
  }

  const payload = {
    action: 'cancel_event',
    user_id: normalizedUserId,
    book_id: normalizedBookId,
  };

  console.info(`[Ghandon-Front] Dispatching 'cancel_event' for Book ID [${normalizedBookId}]`);

  void apiGatewayClient
    .post(ADD_EVENT_API_PATH, payload, {
      baseURL: process.env.NEXT_PUBLIC_GHANDON_API_BASE_URL,
      withCredentials: true,
    })
    .then(response => {
      console.info(`[Ghandon-Front] Backend response for 'cancel_event' received successfully:`, response.data);
    })
    .catch((error: unknown) => {
      console.error(`[Ghandon-Front] Error encountered in cancel_event:`, error);
    });
};
