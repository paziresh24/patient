import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';
import { getRateDetailsData } from './getRateDetailsData';

jest.mock('@/common/apis/services/reviews/rateDoctor', () => ({
  fetchDoctorRate: jest.fn(),
}));

const mockedFetchDoctorRate = fetchDoctorRate as jest.Mock;

describe('getRateDetailsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps /ravi/v1/rate/doctor/{slug} and uses comments_count', async () => {
    mockedFetchDoctorRate.mockResolvedValueOnce({
      doctor_encounter: 4.974051896207585,
      explanation_of_issue: 4.956175298804781,
      quality_of_treatment: 4.95816733067729,
      hide_rates: null,
      comments_count: 485,
      count_rates: 502,
      doctor_slug: 'دکتر-زهرا-رجبلی',
    });

    await expect(getRateDetailsData({ slug: 'دکتر-زهرا-رجبلی' })).resolves.toEqual({
      averageRates: {
        average_quality_of_treatment: '5.0',
        average_doctor_encounter: '5.0',
        average_explanation_of_issue: '5.0',
      },
      hide_rates: false,
      countOfFeedbacks: 485,
    });

    expect(mockedFetchDoctorRate).toHaveBeenCalledWith('دکتر-زهرا-رجبلی');
  });

  it('returns empty details when RATE_NOT_FOUND', async () => {
    mockedFetchDoctorRate.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: { code: 'RATE_NOT_FOUND' } } },
    });

    await expect(getRateDetailsData({ slug: 'missing' })).resolves.toEqual({
      averageRates: {
        average_quality_of_treatment: null,
        average_doctor_encounter: null,
        average_explanation_of_issue: null,
      },
      hide_rates: false,
      countOfFeedbacks: null,
    });
  });
});
