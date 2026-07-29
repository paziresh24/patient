import { renderHook } from '@testing-library/react';
import useCustomize from '@/common/hooks/useCustomize';
import { useShowPlasmicSuggestion } from './useShowPlasmicSuggestion';

let featureValue: boolean = true;
jest.mock('@growthbook/growthbook-react', () => ({
  useFeatureValue: () => featureValue,
}));

const setPartner = (partnerKey?: string) => {
  useCustomize.setState({ customize: { ...(useCustomize.getState().customize as any), partnerKey } } as any);
};

describe('useShowPlasmicSuggestion', () => {
  beforeEach(() => {
    featureValue = true;
  });

  it('سایت اصلی: همیشه UIِ جدید', () => {
    setPartner(undefined);
    expect(renderHook(() => useShowPlasmicSuggestion()).result.current).toBe(true);
  });

  it('سایت اختصاصی: پیش‌فرض UIِ جدید (نه فرمتِ قدیمی)', () => {
    setPartner('mui');
    expect(renderHook(() => useShowPlasmicSuggestion()).result.current).toBe(true);
  });

  it('سایت اختصاصی: kill-switch می‌تواند برگرداند به UIِ قدیمی', () => {
    setPartner('mui');
    featureValue = false;
    expect(renderHook(() => useShowPlasmicSuggestion()).result.current).toBe(false);
  });
});
