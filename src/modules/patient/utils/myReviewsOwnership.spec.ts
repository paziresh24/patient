import { splitAppointmentsByOwner } from './myReviewsOwnership';

describe('splitAppointmentsByOwner', () => {
  const owner = '3040353195';

  it('keeps the logged-in patient appointment and drops a sub-user booking', () => {
    const result = splitAppointmentsByOwner(
      [
        { bookId: 'own', patientNationalCode: '3040353195' },
        { bookId: 'subuser-zahra', patientNationalCode: '0924636394' },
      ],
      owner,
    );

    expect(result.owned.map(item => item.bookId)).toEqual(['own']);
    expect([...result.excludedBookIds]).toEqual(['subuser-zahra']);
  });

  it('keeps appointments when national code is missing so own visits are not dropped', () => {
    const result = splitAppointmentsByOwner([{ bookId: 'unknown' }], owner);

    expect(result.owned).toHaveLength(1);
    expect(result.excludedBookIds.size).toBe(0);
  });
});
