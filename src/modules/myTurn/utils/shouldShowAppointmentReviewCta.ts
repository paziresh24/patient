import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';

interface ShouldShowAppointmentReviewCtaParams {
  isDelete: boolean;
  status: BookStatus | string;
  paymentStatus: PaymentStatus | string;
  bookTimestamp?: number;
  currentTime?: number;
}

/** Clinic `from` is unix seconds; server time / Date.now may be ms. */
const toMillis = (value?: number): number | null => {
  if (value == null || !Number.isFinite(value) || value <= 0) return null;
  return value < 1e12 ? value * 1000 : value;
};

export const shouldShowAppointmentReviewCta = ({
  isDelete,
  status,
  paymentStatus,
  bookTimestamp,
  currentTime,
}: ShouldShowAppointmentReviewCtaParams): boolean => {
  if (isDelete || status === BookStatus.deleted) return false;
  if (paymentStatus === PaymentStatus.refunded) return false;
  if (status !== BookStatus.visited && status !== BookStatus.expired) return false;

  const start = toMillis(bookTimestamp);
  const now = toMillis(currentTime);
  if (start != null && now != null && start > now) return false;

  return true;
};
