import {
  flattenCenterSearchDoctors,
  sanitizeCenterSearchDoctor,
  sanitizeCenterSearchResultPage,
} from './sanitizeCenterSearchDoctors';

describe('sanitizeCenterSearchDoctor', () => {
  it('keeps valid doctor rows', () => {
    const doctor = sanitizeCenterSearchDoctor({
      _id: 'abc',
      title: 'دکتر تست',
      badges: [{ title: 'نوبت' }],
      actions: [{ title: 'نوبت', url: '/dr/x' }],
    });

    expect(doctor).toMatchObject({
      id: 'abc',
      title: 'دکتر تست',
      badges: [{ title: 'نوبت' }],
      actions: [{ title: 'نوبت', url: '/dr/x' }],
    });
  });

  it('drops rows without id or title', () => {
    expect(sanitizeCenterSearchDoctor(null)).toBeNull();
    expect(sanitizeCenterSearchDoctor({ title: 'بدون آیدی' })).toBeNull();
    expect(sanitizeCenterSearchDoctor({ id: '1' })).toBeNull();
  });

  it('normalizes non-array badges/actions that would crash .filter in UI', () => {
    const doctor = sanitizeCenterSearchDoctor({
      id: '1',
      title: 'دکتر',
      badges: { title: 'broken' },
      actions: 'broken',
    });

    expect(doctor?.badges).toEqual([]);
    expect(doctor?.actions).toEqual([]);
  });
});

describe('sanitizeCenterSearchResultPage', () => {
  it('filters invalid doctors from a search page', () => {
    const page = sanitizeCenterSearchResultPage({
      search: {
        total: 2,
        result: [{ id: '1', title: 'خوب' }, { id: '2' }, null, 'bad'],
      },
    });

    expect(page.search.result).toHaveLength(1);
    expect(page.search.result[0].title).toBe('خوب');
  });
});

describe('flattenCenterSearchDoctors', () => {
  it('flattens infinite-query pages and skips invalid rows', () => {
    const doctors = flattenCenterSearchDoctors([
      { search: { result: [{ id: '1', title: 'a' }] } },
      { search: { result: [{ id: '2', title: 'b' }, { id: '3' }] } },
    ]);

    expect(doctors).toHaveLength(2);
    expect(doctors.map(d => d.id)).toEqual(['1', '2']);
  });
});
