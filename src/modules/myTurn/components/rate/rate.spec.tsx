import { render, screen } from '@testing-library/react';

import Rate from './rate';

const raviLink =
  'https://ravi-front-ravi.p24cloud.ir/ravi/v2/survay/office?user_id=2123019&book_id=book-1&server_id=1&doctor_slug=dr-test&center_id=123';

describe('Rate', () => {
  it('links to the Ravi survey and shows ثبت نظر before a review exists', () => {
    render(<Rate link={raviLink} bookId="1" centerId="c1" doctorSlug="test-doctor" />);
    const cta = screen.getByTestId('appointment-review-cta');
    expect(cta).toHaveAttribute('href', raviLink);
    expect(cta).toHaveTextContent('ثبت نظر');
    expect(screen.getByText('هنوز به این پزشک امتیازی نداده اید.')).toBeInTheDocument();
  });

  it('shows ویرایش نظر when the patient already submitted a review', () => {
    render(<Rate link={raviLink} bookId="1" centerId="c1" doctorSlug="test-doctor" hasReviewed />);
    expect(screen.getByTestId('appointment-review-cta')).toHaveTextContent('ویرایش نظر');
    expect(screen.getByText('نظر شما ثبت شده است.')).toBeInTheDocument();
  });
});
