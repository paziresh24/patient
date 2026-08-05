import { act, render } from '@testing-library/react';
import { GrowthBook } from '@growthbook/growthbook';
import { createLiveFeatures, GrowthbookGlobalContext, LIVE_FEATURES_FLAG } from './growthbookGlobalContext';

/**
 * DR-08 §۲۸.۹ — حالتِ «خواندنِ زنده» پشتِ kill-switch.
 *
 * عمداً با **SDKِ واقعیِ GrowthBook** نوشته شده (نه stub)، چون مهم‌ترین گاردِ این فایل شرطِ
 * واقعیِ فلگِ `search-semantic-search` است: `search_query` با طولِ ≥۳۵ کاراکتر. اگر مقدارِ
 * این فلگ لحظه‌ی زدنِ Enter کهنه باشد، جستجو به مسیرِ اشتباه می‌رود.
 */
const FEATURES: any = {
  [LIVE_FEATURES_FLAG]: { defaultValue: true },
  'search-semantic-search': {
    defaultValue: false,
    rules: [{ condition: { search_query: { $regex: '^.{35,}$' } }, force: true }],
  },
  'plain-string-flag': { defaultValue: 'off' },
};

const gb: any = new GrowthBook({ enabled: true });
gb.setFeatures(FEATURES);
gb.setAttributes({ id: 't-1' });
gb.ready = true;
gb.loadFeatures = () => Promise.resolve();
gb.subscribe = () => () => undefined;
gb.refreshFeatures = () => Promise.resolve();

const gbRef: any = { current: gb };

jest.mock('src/pages/_app', () => ({
  get growthbook() {
    return gbRef.current;
  },
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { GROWTHBOOK_API_HOST: 'https://gb.test', GROWTHBOOK_CLIENT_KEY: 'sdk-test' },
}));
jest.mock('cookies-next', () => ({ getCookie: () => 't-1' }));
jest.mock('@/common/hooks/useDoctorHomeRedirect', () => ({ isDoctorUser: () => false }));
jest.mock('@/modules/login/store/userInfo', () => ({ useUserInfoStore: (s: any) => s({ info: undefined }) }));

let consumerRenders = 0;
let lastData: any;
let actions: any;

jest.mock('@plasmicapp/host', () => {
  const React = require('react');
  const Consumer = React.memo(function Consumer() {
    consumerRenders++;
    return null;
  });
  return {
    DataProvider: ({ data, children }: any) => {
      lastData = data;
      return React.createElement(
        React.Fragment,
        null,
        Array.from({ length: 50 }, (_u, i) => React.createElement(Consumer, { key: i, data })),
        children,
      );
    },
    GlobalActionsProvider: ({ actions: a, children }: any) => {
      actions = a;
      return children;
    },
  };
});

const renderCtx = () =>
  render(
    <GrowthbookGlobalContext apiHost="x" clientKey="y">
      <span />
    </GrowthbookGlobalContext>,
  );

const LONG_QUERY = 'د'.repeat(40); // ≥۳۵ کاراکتر ⇒ فلگ باید true شود
const SHORT_QUERY = 'دکتر قلب';

const setLiveMode = (on: boolean) => {
  gb.setFeatures({ ...FEATURES, [LIVE_FEATURES_FLAG]: { defaultValue: on } });
};

describe('حالتِ زنده — خاموش (پیش‌فرض): رفتارِ امروز دست‌نخورده', () => {
  beforeEach(() => {
    setLiveMode(false);
    gb.setAttributes({ id: 't-1' });
    consumerRenders = 0;
  });

  it('features یک snapshotِ ساده است و Object.keys/entries کار می‌کند', () => {
    renderCtx();
    expect(Object.keys(lastData.features)).toEqual(expect.arrayContaining(['search-semantic-search']));
    expect(lastData.features['plain-string-flag']).toBe('off');
  });

  it('کوئریِ بلند فلگ را روشن می‌کند (رفتارِ مرجع)', () => {
    renderCtx();
    act(() => actions.setAttributes({ search_query: LONG_QUERY }));
    expect(lastData.features['search-semantic-search']).toBe(true);
  });
});

describe('حالتِ زنده — روشن', () => {
  beforeEach(() => {
    setLiveMode(true);
    gb.setAttributes({ id: 't-1' });
    consumerRenders = 0;
  });

  /** ⛔ گاردِ اصلی: همان چیزی که debounceِ ساده می‌شکست. */
  it('کوئریِ ≥۳۵ کاراکتر **بلافاصله** فلگ را true می‌کند — بدونِ انتظار برای رندر', () => {
    renderCtx();
    act(() => actions.setAttributes({ search_query: LONG_QUERY }));
    // هیچ رندری لازم نیست؛ همان لحظه خوانده می‌شود (این‌جا `act` را عمداً دور نمی‌زنیم)
    expect(lastData.features['search-semantic-search']).toBe(true);
  });

  it('کوئریِ کوتاه فلگ را روشن نمی‌کند', () => {
    renderCtx();
    act(() => actions.setAttributes({ search_query: SHORT_QUERY }));
    expect(lastData.features['search-semantic-search']).toBe(false);
  });

  it('attributes هم زنده خوانده می‌شود', () => {
    renderCtx();
    act(() => actions.setAttributes({ search_query: SHORT_QUERY }));
    expect(lastData.attributes.search_query).toBe(SHORT_QUERY);
  });

  /** گاردِ launcher: آن‌جا با Object.entries روی features پیمایش می‌شود. */
  it('Object.keys / Object.entries / in روی featuresِ زنده کار می‌کند', () => {
    renderCtx();
    const keys = Object.keys(lastData.features);
    expect(keys).toEqual(expect.arrayContaining(['search-semantic-search', 'plain-string-flag']));
    const entries = Object.entries(lastData.features);
    expect(entries.length).toBe(keys.length);
    expect(Object.fromEntries(entries)['plain-string-flag']).toBe('off');
    expect('plain-string-flag' in lastData.features).toBe(true);
    expect('no-such-flag' in lastData.features).toBe(false);
    expect(lastData.features['no-such-flag']).toBeUndefined();
  });

  it('JSON.stringify روی featuresِ زنده throw نمی‌کند', () => {
    renderCtx();
    expect(() => JSON.stringify(lastData.features)).not.toThrow();
  });

  /** هدفِ اصلیِ اهرمِ ۳. */
  it('تایپ‌کردن هیچ رندری به مصرف‌کننده‌ها تحمیل نمی‌کند', () => {
    renderCtx();
    consumerRenders = 0;
    const text = 'دکتر قلب تهران';
    act(() => {
      text.split('').forEach((_c, i) => actions.setAttributes({ search_query: text.slice(0, i + 1) }));
    });
    expect(consumerRenders).toBe(0);
  });

  it('هویتِ actions ثابت می‌ماند (مصرف‌کننده‌های GlobalActions هم رندر نمی‌شوند)', () => {
    renderCtx();
    const before = actions;
    act(() => actions.setAttributes({ search_query: 'x' }));
    expect(actions).toBe(before);
  });
});

describe('createLiveFeatures — واحد', () => {
  it('boolean از isOn و غیرboolean از getFeatureValue می‌آید', () => {
    setLiveMode(true);
    const live = createLiveFeatures(gb);
    expect(live['plain-string-flag']).toBe('off');
    expect(typeof live['search-semantic-search']).toBe('boolean');
  });

  it('با عوض‌شدنِ attribute، مقدار بدونِ ساختِ دوباره تازه می‌شود', () => {
    setLiveMode(true);
    const live = createLiveFeatures(gb);
    gb.setAttributes({ id: 't-1', search_query: SHORT_QUERY });
    expect(live['search-semantic-search']).toBe(false);
    gb.setAttributes({ id: 't-1', search_query: LONG_QUERY });
    expect(live['search-semantic-search']).toBe(true);
  });
});
