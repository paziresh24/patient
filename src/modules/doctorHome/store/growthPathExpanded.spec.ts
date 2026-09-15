import { useGrowthPathExpandedStore } from './growthPathExpanded';

describe('useGrowthPathExpandedStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useGrowthPathExpandedStore.setState({ isExpanded: true, hydrated: false });
  });

  it('defaults expanded and persists collapse', () => {
    expect(useGrowthPathExpandedStore.getState().isExpanded).toBe(true);
    useGrowthPathExpandedStore.getState().toggle();
    expect(useGrowthPathExpandedStore.getState().isExpanded).toBe(false);
    expect(localStorage.getItem('doctor-home-growth-path-expanded')).toBe('0');
  });

  it('stays closed after hydrate when previously collapsed', () => {
    localStorage.setItem('doctor-home-growth-path-expanded', '0');
    useGrowthPathExpandedStore.getState().hydrate();
    expect(useGrowthPathExpandedStore.getState().isExpanded).toBe(false);
  });

  it('hydrates open when no preference is stored', () => {
    useGrowthPathExpandedStore.getState().hydrate();
    expect(useGrowthPathExpandedStore.getState().isExpanded).toBe(true);
  });
});
