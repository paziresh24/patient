jest.mock('@/common/utils/isPwa', () => ({ isPWA: jest.fn(() => false) }));
jest.mock('cookies-next', () => ({ getCookie: jest.fn(() => 'terminal-test') }));
jest.mock('@/common/services/splunk', () => ({
  splunkInstance: jest.fn(() => ({
    sendEvent: jest.fn(),
  })),
}));

describe('trackRaviReviewEvent', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN;
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN;
    } else {
      process.env.NEXT_PUBLIC_RAVI_SPLUNK_HEC_TOKEN = originalEnv;
    }
  });

  it('POSTs beacon to /ravi/v1/ops/ravi-events when HEC token is unset', async () => {
    const { trackRaviReviewEvent } = await import('./trackRaviReviewEvent');

    await trackRaviReviewEvent({
      event_type: 'review_list_load',
      slug: 'دکتر-نمونه-1',
      page: 1,
      sort: 'default_order',
      filter: 'all',
      count: 3,
      ok: true,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toContain('/ravi/v1/ops/ravi-events');
    expect(init).toEqual(
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const body = JSON.parse(String(init.body));
    expect(body).toEqual(
      expect.objectContaining({
        event_type: 'review_list_load',
        slug: 'دکتر-نمونه-1',
        page: 1,
        sort: 'default_order',
        filter: 'all',
        count: 3,
        ok: true,
        source: 'patient_web',
        terminal_id: 'terminal-test',
      }),
    );
  });
});
