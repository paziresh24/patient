import { apiGatewayClient, raviApisClient } from '@/common/apis/client';
import { fetchDoctorRate } from '@/common/apis/services/reviews/rateDoctor';
import {
  deleteFeedback,
  editFeedback,
  fetchFeedbackReply,
  fetchRateSummary,
  fetchReviewPage,
  fetchShareCommentUrl,
  reportFeedback,
  submitLikeRate,
} from './api';

jest.mock('@/common/apis/client', () => ({
  apiGatewayClient: { get: jest.fn(), post: jest.fn() },
  raviApisClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/common/apis/services/reviews/rateDoctor', () => ({
  fetchDoctorRate: jest.fn(),
}));

jest.mock('@/common/utils/formatRelativeFeedbackTime', () => ({
  enrichReviewResponseWithRelativeTime: (list: unknown[]) => list,
}));

const mockedGet = raviApisClient.get as jest.Mock;
const mockedPost = raviApisClient.post as jest.Mock;
const mockedPatch = raviApisClient.patch as jest.Mock;
const mockedDelete = raviApisClient.delete as jest.Mock;
const mockedFetchDoctorRate = fetchDoctorRate as jest.Mock;

const mockedGatewayGet = apiGatewayClient.get as jest.Mock;
const mockedGatewayPost = apiGatewayClient.post as jest.Mock;

describe('rate-and-review api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchRateSummary maps doctor rate response', async () => {
    mockedFetchDoctorRate.mockResolvedValueOnce({
      hide_rates: true,
      count_rates: 502,
      comments_count: 485,
      doctor_encounter: 4.1,
      explanation_of_issue: 4.3,
      quality_of_treatment: 4.5,
    });

    await expect(fetchRateSummary('dr-test')).resolves.toEqual({
      hideRates: true,
      count: 502,
      items: [
        { label: 'برخورد مناسب', value: 4.1 },
        { label: 'توضیح در هنگام ویزیت', value: 4.3 },
        { label: 'مهارت و تخصص', value: 4.5 },
      ],
    });

    expect(mockedFetchDoctorRate).toHaveBeenCalledWith('dr-test');
  });

  it('fetchRateSummary uses count_rates not comments_count', async () => {
    mockedFetchDoctorRate.mockResolvedValueOnce({
      count_rates: 502,
      comments_count: 485,
      doctor_encounter: 4.9,
      explanation_of_issue: 4.9,
      quality_of_treatment: 4.9,
    });

    await expect(fetchRateSummary('دکتر-زهرا-رجبلی')).resolves.toMatchObject({
      count: 502,
    });
  });

  it('fetchRateSummary maps hide field when hide_rates is absent', async () => {
    mockedFetchDoctorRate.mockResolvedValueOnce({
      hide: 1,
      count_rates: 3,
      doctor_encounter: 4,
      explanation_of_issue: 4,
      quality_of_treatment: 4,
    });

    await expect(fetchRateSummary('dr-hide')).resolves.toMatchObject({
      hideRates: true,
      count: 3,
    });
  });

  it('fetchRateSummary returns null when doctor rate summary is not found', async () => {
    mockedFetchDoctorRate.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: { code: 'RATE_NOT_FOUND', message: 'doctor rate summary not found' } } },
    });

    await expect(fetchRateSummary('dr-missing')).resolves.toBeNull();
  });

  it('fetchReviewPage requests feedbacks with filter params', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: [{ id: '1', description: 'test' }],
        meta: { offset: 0, total: 1, hasNext: false },
      },
    });

    const page = await fetchReviewPage('dr-test', {
      offset: 0,
      limit: 10,
      filter: 'negative',
      centerId: 'c1',
    });

    expect(mockedGet).toHaveBeenCalledWith('/ravi/v1/feedbacks/doctors/dr-test', {
      params: {
        filter: 'negative',
        limit: 10,
        offset: 0,
        user_id: undefined,
        center_id: 'c1',
      },
    });
    expect(page.list).toHaveLength(1);
    expect(page.hasMore).toBe(false);
  });

  it('submitLikeRate posts to ravi-apis feedbacks likes endpoint', async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: {} });
    await submitLikeRate({ feedbackId: 'fb-like', rate: 3, userId: '2123019' });
    expect(mockedPost).toHaveBeenCalledWith(
      '/ravi/v1/feedbacks/fb-like/likes',
      { rate: 3, user_id: '2123019' },
      { withCredentials: true },
    );
  });

  it('editFeedback patches description', async () => {
    mockedPatch.mockResolvedValueOnce({ data: {} });
    await editFeedback({ feedbackId: 'fb-1', description: 'updated' });
    expect(mockedPatch).toHaveBeenCalledWith(
      '/ravi/v2/feedbacks?id=fb-1',
      { description: 'updated' },
      { withCredentials: true },
    );
  });

  it('deleteFeedback calls delete endpoint', async () => {
    mockedDelete.mockResolvedValueOnce({ data: {} });
    await deleteFeedback('fb-2');
    expect(mockedDelete).toHaveBeenCalledWith('/ravi/v1/feedbacks/fb-2', { withCredentials: true });
  });

  it('reportFeedback posts to ravi v3 report endpoint', async () => {
    mockedGatewayPost.mockResolvedValueOnce({ data: { ok: true } });
    await reportFeedback({
      feedbackId: 'fb-3',
      slug: 'dr-test',
      feedbackDescription: 'متن نظر',
      reportDescription: 'توضیح بیشتر',
      reportReason: 'موارد دیگر',
      userId: '2123019',
    });

    expect(mockedGatewayPost).toHaveBeenCalledWith(
      '/ravi/v3/report',
      {
        user_id: '2123019',
        slug: 'dr-test',
        feedback_id: 'fb-3',
        feedback_description: 'متن نظر',
        report_description: 'توضیح بیشتر',
        report_reason: 'موارد دیگر',
      },
      { withCredentials: true },
    );
  });

  it('reportFeedback omits user_id when user is not logged in', async () => {
    mockedGatewayPost.mockResolvedValueOnce({ data: { ok: true } });
    await reportFeedback({
      feedbackId: 'fb-4',
      slug: 'dr-test',
      feedbackDescription: 'متن نظر',
      reportDescription: '',
      reportReason: 'غیرواقعی',
    });

    expect(mockedGatewayPost).toHaveBeenCalledWith(
      '/ravi/v3/report',
      {
        slug: 'dr-test',
        feedback_id: 'fb-4',
        feedback_description: 'متن نظر',
        report_description: '',
        report_reason: 'غیرواقعی',
      },
      { withCredentials: true },
    );
  });

  it('fetchFeedbackReply requests ravi_get_reply with plasmic where filters', async () => {
    mockedGatewayGet.mockResolvedValueOnce({
      data: {
        list: [{ Id: 'reply-1', description: 'پاسخ پزشک', user_id: 'doc-9' }],
      },
    });

    await expect(fetchFeedbackReply('dr-test', 'fb-10')).resolves.toEqual({
      id: 'reply-1',
      description: 'پاسخ پزشک',
      userId: 'doc-9',
    });

    expect(mockedGatewayGet).toHaveBeenCalledWith('/ravi/v1/ravi_get_reply', {
      params: {
        where:
          '(doctor_slug,eq,dr-test)~and(reply_to_feedback_id,eq,fb-10)~and(show,eq,1)~and(delete,eq,0)~and(description,isnot,null)',
        limit: 1,
        offset: 0,
        sort: '-created_at',
      },
    });
  });

  it('fetchFeedbackReply returns null when reply has no description', async () => {
    mockedGatewayGet.mockResolvedValueOnce({ data: { list: [{ Id: 'reply-2' }] } });
    await expect(fetchFeedbackReply('dr-test', 'fb-11')).resolves.toBeNull();
  });

  it('fetchShareCommentUrl requests ravi-apis share doctors endpoint', async () => {
    mockedGet.mockResolvedValueOnce({ data: { url: 'https://l.p4z.ir/wTAEYT' } });

    await expect(fetchShareCommentUrl('dr-mdehghani', '5693691')).resolves.toBe('https://l.p4z.ir/wTAEYT');

    expect(mockedGet).toHaveBeenCalledWith('/ravi/v1/share/doctors/dr-mdehghani/5693691');
  });

  it('fetchShareCommentUrl returns null when url is missing', async () => {
    mockedGet.mockResolvedValueOnce({ data: {} });
    await expect(fetchShareCommentUrl('dr-test', '123')).resolves.toBeNull();
  });
});
