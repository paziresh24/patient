import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import useCustomize from '@/common/hooks/useCustomize';
import { ApiRequest } from './api-request';

jest.mock('@plasmicapp/host', () => ({
  useSelector: () => undefined,
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn(() => Promise.resolve({ data: {} })), isAxiosError: () => false },
}));

const get = (axios as any).get as jest.Mock;

const renderRequest = (url: string, params?: any) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ApiRequest url={url} method="GET" params={params} loadingDisplay={null} errorDisplay={null}>
        <span>ok</span>
      </ApiRequest>
    </QueryClientProvider>,
  );
};

const setPartner = (partnerKey?: string) => {
  useCustomize.setState({ customize: { ...(useCustomize.getState().customize as any), partnerKey } } as any);
};

describe('ApiRequest — scopeِ سایت‌های اختصاصی', () => {
  beforeEach(() => {
    get.mockClear();
    setPartner(undefined);
  });

  it('سایت اصلی: هیچ universityای اضافه نمی‌شود', async () => {
    renderRequest('https://apigw.paziresh24.com/seapi/v1/suggestion?q=x');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params?.university).toBeUndefined();
  });

  it('سایت اختصاصی: به suggestion تزریق می‌شود', async () => {
    setPartner('mui');
    renderRequest('https://apigw.paziresh24.com/seapi/v1/suggestion?q=x');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params.university).toBe('mui');
  });

  it('سایت اختصاصی: به searchِ نتایج هم تزریق می‌شود', async () => {
    setPartner('mui');
    renderRequest('https://apigw.paziresh24.com/seapi/v1/search/ir/?text=x');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params.university).toBe('mui');
  });

  it('سایت اختصاصی: به QS (پیشنهادِ پرس‌وجو) هم تزریق می‌شود', async () => {
    setPartner('mui');
    renderRequest('https://apigw.paziresh24.com/v1/searchia-api/v2/qs/index/slim_clinic_query_su?query=x');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params.university).toBe('mui');
  });

  it('URLهای غیرِ سرچ دست‌نخورده می‌مانند', async () => {
    setPartner('mui');
    renderRequest('https://apigw.paziresh24.com/ravi/v1/rate?where=x');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params?.university).toBeUndefined();
  });

  it('اگر خودِ URL یا paramsها university داشته باشند، override نمی‌شود', async () => {
    setPartner('mui');
    renderRequest('https://apigw.paziresh24.com/seapi/v1/suggestion?q=x&university=tums');
    await waitFor(() => expect(get).toHaveBeenCalled());
    expect(get.mock.calls[0][1].params?.university).toBeUndefined();
  });
});
