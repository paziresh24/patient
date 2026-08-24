import { render, screen } from '@testing-library/react';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import TurnBody from './body';

jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../../location/location', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../turnDetails', () => ({
  __esModule: true,
  default: () => null,
}));

const raviLink =
  'https://ravi-front-ravi.p24cloud.ir/ravi/v2/survay/office?user_id=2123019&book_id=book-1&server_id=1&doctor_slug=dr-test&center_id=123';

const past = 1_700_000_000;
const now = 1_800_000_000;
const future = 1_900_000_000;

const baseProps = {
  detailsData: [{ id: 1, name: 'کد پیگیری', value: '1' }],
  status: BookStatus.visited,
  feedbackUrl: raviLink,
  location: { lat: 0, lng: 0, address: 'تهران' },
  centerType: CenterType.clinic,
  id: 'book-1',
  doctorInfo: { slug: 'dr-test' },
  centerId: '123',
  paymentStatus: PaymentStatus.paid,
  isDelete: false,
  hasReviewed: false,
  bookTimestamp: past,
  currentTime: now,
};

describe('TurnBody review CTA', () => {
  it('shows ثبت نظر for a past visited appointment without a review', () => {
    render(<TurnBody {...baseProps} />);
    expect(screen.getByTestId('appointment-review-cta')).toHaveTextContent('ثبت نظر');
    expect(screen.getByTestId('appointment-review-cta')).toHaveAttribute('href', raviLink);
  });

  it('shows ویرایش نظر when the patient already submitted a review', () => {
    render(<TurnBody {...baseProps} hasReviewed />);
    expect(screen.getByTestId('appointment-review-cta')).toHaveTextContent('ویرایش نظر');
  });

  it('hides the CTA when the appointment is deleted', () => {
    render(<TurnBody {...baseProps} isDelete />);
    expect(screen.queryByTestId('appointment-review-cta')).not.toBeInTheDocument();
  });

  it('hides the CTA when the visit time has not arrived', () => {
    const { rerender } = render(
      <TurnBody {...baseProps} status={BookStatus.notVisited} bookTimestamp={future} />,
    );
    expect(screen.queryByTestId('appointment-review-cta')).not.toBeInTheDocument();
    rerender(<TurnBody {...baseProps} bookTimestamp={future} />);
    expect(screen.queryByTestId('appointment-review-cta')).not.toBeInTheDocument();
  });
});
