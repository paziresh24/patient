import { buildRaviSurveyUrl } from './buildRaviSurveyUrl';

describe('buildRaviSurveyUrl', () => {
  it('generates an office survey link for an appointment', () => {
    expect(
      buildRaviSurveyUrl({
        userId: 2123019,
        bookId: 'book-1',
        doctorSlug: 'dr-test',
        centerId: 123,
        doctorId: 456,
      }),
    ).toBe(
      'https://ravi-front-ravi.p24cloud.ir/ravi/v2/survay/office?user_id=2123019&book_id=book-1&doctor_slug=dr-test&center_id=123&doctor_id=456',
    );
  });

  it('generates the online-visit survey link for center 5532', () => {
    expect(
      buildRaviSurveyUrl({
        userId: 2123019,
        bookId: 'book-2',
        doctorSlug: 'dr-online',
        centerId: '5532',
      }),
    ).toContain('/ravi/v2/survay/online-visit?');
  });
});
