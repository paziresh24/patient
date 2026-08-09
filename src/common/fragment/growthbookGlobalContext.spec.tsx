import { act, render } from '@testing-library/react';
import { GrowthbookGlobalContext } from './growthbookGlobalContext';

const featureDefinitions: Record<string, any> = {
  boolFlag: { defaultValue: false },
  stringFlag: { defaultValue: 'off' },
  numberFlag: { defaultValue: 0 },
};

const evaluated: Record<string, any> = {
  boolFlag: true,
  stringFlag: 'on',
  numberFlag: 42,
};

let attributes: Record<string, any> = {};

const growthbookMock = {
  ready: true,
  getFeatures: jest.fn(() => featureDefinitions),
  isOn: jest.fn((name: string) => !!evaluated[name]),
  getFeatureValue: jest.fn((name: string) => evaluated[name]),
  getAttributes: jest.fn(() => attributes),
  setAttributes: jest.fn((next: Record<string, any>) => {
    attributes = next;
  }),
  refreshFeatures: jest.fn(),
  loadFeatures: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
};

jest.mock('src/pages/_app', () => ({
  get growthbook() {
    return growthbookMock;
  },
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { GROWTHBOOK_API_HOST: 'https://gb.test', GROWTHBOOK_CLIENT_KEY: 'sdk-test' },
}));

jest.mock('cookies-next', () => ({ getCookie: () => 'terminal-1' }));

jest.mock('@/common/hooks/useDoctorHomeRedirect', () => ({ isDoctorUser: () => false }));

jest.mock('@/modules/login/store/userInfo', () => ({
  useUserInfoStore: (selector: any) => selector({ info: undefined }),
}));

const renders: { data: any }[] = [];
let capturedActions: any;

jest.mock('@plasmicapp/host', () => ({
  DataProvider: ({ data, children }: any) => {
    renders.push({ data });
    return <>{children}</>;
  },
  GlobalActionsProvider: ({ actions, children }: any) => {
    capturedActions = actions;
    return <>{children}</>;
  },
}));

const renderContext = () =>
  render(
    <GrowthbookGlobalContext apiHost="https://gb.test" clientKey="sdk-test">
      <span>child</span>
    </GrowthbookGlobalContext>,
  );

// شبیه‌سازیِ همان کاری که کادرِ جستجوی Plasmic به‌ازای *هر حرف* می‌کند
const typeOneCharacter = (query: string) =>
  act(() => {
    capturedActions.setAttributes({ ...attributes, search_query: query });
  });

describe('GrowthbookGlobalContext — هزینه‌ی هر کلیدفشار (DR-08 §۲۸)', () => {
  beforeEach(() => {
    renders.length = 0;
    attributes = {};
    evaluated.boolFlag = true;
    evaluated.stringFlag = 'on';
    evaluated.numberFlag = 42;
    Object.values(growthbookMock).forEach(value => (value as any)?.mockClear?.());
  });

  it('مقدارِ فلگ‌ها مثلِ قبل resolve می‌شود (boolean از isOn، بقیه از getFeatureValue)', () => {
    renderContext();

    const { features } = renders[renders.length - 1].data;
    expect(features).toEqual({ boolFlag: true, stringFlag: 'on', numberFlag: 42 });
    expect(growthbookMock.isOn).toHaveBeenCalledWith('boolFlag');
    expect(growthbookMock.getFeatureValue).toHaveBeenCalledWith('stringFlag', undefined);
  });

  it('getFeatures به‌ازای هر فلگ صدا زده نمی‌شود — یک بار برای کلِ ساخت کافی است', () => {
    renderContext();
    'دکتر'.split('').forEach((_, index) => typeOneCharacter('دکتر'.slice(0, index + 1)));

    // حداکثر یک فراخوانی به‌ازای هر بار ساختهٔ features (نه به‌ازای هر فلگ)
    expect(growthbookMock.getFeatures.mock.calls.length).toBeLessThanOrEqual(renders.length);
  });

  it('تایپ‌کردن هیچ refreshFeatures (درخواستِ شبکه) نمی‌زند', () => {
    renderContext();
    growthbookMock.refreshFeatures.mockClear();

    'دکتر'.split('').forEach((_, index) => typeOneCharacter('دکتر'.slice(0, index + 1)));

    expect(growthbookMock.refreshFeatures).not.toHaveBeenCalled();
  });

  it('وقتی هیچ فلگی عوض نشده، هویتِ features ثابت می‌ماند (درختِ Plasmic بی‌دلیل رندر نمی‌شود)', () => {
    renderContext();
    const before = renders[renders.length - 1].data.features;

    'دکتر'.split('').forEach((_, index) => typeOneCharacter('دکتر'.slice(0, index + 1)));

    expect(renders[renders.length - 1].data.features).toBe(before);
  });

  it('ولی اگر مقدارِ یک فلگ واقعاً عوض شود، features به‌روز می‌شود (کشِ کور نمی‌سازیم)', () => {
    renderContext();
    const before = renders[renders.length - 1].data.features;

    evaluated.boolFlag = false;
    typeOneCharacter('د');

    const after = renders[renders.length - 1].data.features;
    expect(after).not.toBe(before);
    expect(after.boolFlag).toBe(false);
  });

  it('attributes همچنان به GrowthBook می‌رسد (search_query گم نمی‌شود)', () => {
    renderContext();

    typeOneCharacter('دکتر قلب');

    expect(growthbookMock.setAttributes).toHaveBeenLastCalledWith(
      expect.objectContaining({ search_query: 'دکتر قلب', id: 'terminal-1' }),
    );
  });
});
