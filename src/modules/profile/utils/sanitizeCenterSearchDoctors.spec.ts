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

  it('drops only non-object rows', () => {
    expect(sanitizeCenterSearchDoctor(null)).toBeNull();
    expect(sanitizeCenterSearchDoctor('bad')).toBeNull();
    expect(sanitizeCenterSearchDoctor([])).toBeNull();
  });

  it('keeps an all-null document as an empty renderable card', () => {
    const doctor = sanitizeCenterSearchDoctor({
      _id: 'doctor_69bb17f7-c9ce-11f0-b67f-005056a0fe3c_32',
      title: null,
      display_name: null,
      url: null,
      badges: null,
      actions: null,
    });

    expect(doctor).toMatchObject({
      id: 'doctor_69bb17f7-c9ce-11f0-b67f-005056a0fe3c_32',
      title: '',
      badges: [],
      actions: [],
    });
  });

  it('falls back to an empty id when the row has none', () => {
    expect(sanitizeCenterSearchDoctor({ title: 'بدون آیدی' })).toMatchObject({ id: '', title: 'بدون آیدی' });
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
  it('keeps empty doctors and drops only non-object rows', () => {
    const page = sanitizeCenterSearchResultPage({
      search: {
        total: 2,
        result: [{ id: '1', title: 'خوب' }, { id: '2' }, null, 'bad'],
      },
    });

    expect(page.search.result).toHaveLength(2);
    expect(page.search.result[0].title).toBe('خوب');
    expect(page.search.result[1]).toMatchObject({ id: '2', title: '', badges: [], actions: [] });
  });
});

describe('flattenCenterSearchDoctors', () => {
  it('flattens infinite-query pages and normalizes every object row', () => {
    const doctors = flattenCenterSearchDoctors([
      { search: { result: [{ id: '1', title: 'a' }] } },
      { search: { result: [{ id: '2', title: 'b' }, { id: '3' }, null] } },
    ]);

    expect(doctors).toHaveLength(3);
    expect(doctors.map(d => d.id)).toEqual(['1', '2', '3']);
    expect(doctors[2].title).toBe('');
  });
});
