import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';
import { getDoctorRateStats } from './doctorRate';

jest.mock('@/common/apis/services/reviews/rateDoctor', () => ({
  fetchDoctorRate: jest.fn(),
}));

const mockedFetchDoctorRate = fetchDoctorRate as jest.Mock;

describe('getDoctorRateStats', () => {
  beforeEach(() => {
    mockedFetchDoctorRate.mockReset();
  });

  it('maps count_rates from /ravi/v1/rate/doctor/{slug}', async () => {
    mockedFetchDoctorRate.mockResolvedValue({
      quality_of_treatment: 4,
      doctor_encounter: 4,
      explanation_of_issue: 3.7,
      count_rates: 502,
      comments_count: 485,
    });

    await expect(getDoctorRateStats('dr-test')).resolves.toEqual({
      rating: 3.9,
      rateCount: 502,
    });
  });

  it('falls back to comments_count when count_rates is missing', async () => {
    mockedFetchDoctorRate.mockResolvedValue({
      quality_of_treatment: 5,
      doctor_encounter: 5,
      explanation_of_issue: 5,
      comments_count: 485,
    });

    await expect(getDoctorRateStats('dr-test')).resolves.toEqual({
      rating: 5,
      rateCount: 485,
    });
  });

  it('falls back to rate_count when count_rates and comments_count are missing', async () => {
    mockedFetchDoctorRate.mockResolvedValue({
      quality_of_treatment: 5,
      doctor_encounter: 5,
      explanation_of_issue: 5,
      rate_count: 12,
    });

    await expect(getDoctorRateStats('dr-test')).resolves.toEqual({
      rating: 5,
      rateCount: 12,
    });
  });
});
