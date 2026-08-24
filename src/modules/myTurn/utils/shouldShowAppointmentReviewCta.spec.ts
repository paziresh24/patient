import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { shouldShowAppointmentReviewCta } from './shouldShowAppointmentReviewCta';

const past = 1_700_000_000;
const now = 1_800_000_000;
const future = 1_900_000_000;

const base = {
  isDelete: false,
  status: BookStatus.visited,
  paymentStatus: PaymentStatus.paid,
  bookTimestamp: past,
  currentTime: now,
};

describe('shouldShowAppointmentReviewCta', () => {
  it('shows for a past visited appointment', () => {
    expect(shouldShowAppointmentReviewCta(base)).toBe(true);
  });

  it('shows for a past expired appointment', () => {
    expect(shouldShowAppointmentReviewCta({ ...base, status: BookStatus.expired })).toBe(true);
  });

  it('hides when the appointment is deleted', () => {
    expect(shouldShowAppointmentReviewCta({ ...base, isDelete: true })).toBe(false);
    expect(shouldShowAppointmentReviewCta({ ...base, status: BookStatus.deleted })).toBe(false);
  });

  it('hides when the visit time has not arrived', () => {
    expect(
      shouldShowAppointmentReviewCta({
        ...base,
        status: BookStatus.notVisited,
        bookTimestamp: future,
      }),
    ).toBe(false);
    expect(shouldShowAppointmentReviewCta({ ...base, bookTimestamp: future })).toBe(false);
  });

  it('hides refunded appointments even after the visit', () => {
    expect(shouldShowAppointmentReviewCta({ ...base, paymentStatus: PaymentStatus.refunded })).toBe(false);
  });
});
