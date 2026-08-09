import {
  findLegacyCenterForMsLocation,
  mergeMsLocationsWithLegacyBooking,
} from './mergeMsLocationsWithLegacyBooking';

describe('findLegacyCenterForMsLocation', () => {
  it('matches by id', () => {
    const legacy = [{ id: 'abc', name: 'مطب تست', services: [{ id: 1 }] }];
    expect(findLegacyCenterForMsLocation({ id: 'abc', name: 'دیگر' }, legacy)?.id).toBe('abc');
  });

  it('matches by normalized name', () => {
    const legacy = [{ id: '1', name: 'مطب دکتر ساجدی', services: [] }];
    expect(findLegacyCenterForMsLocation({ id: 'ms-9', name: 'دکتر ساجدی' }, legacy)?.id).toBe('1');
  });
});

describe('mergeMsLocationsWithLegacyBooking', () => {
  it('keeps MS address/phone and legacy services', () => {
    const ms = [
      {
        id: 'legacy-1',
        name: 'مطب ساجدی',
        address: 'یزد خیابان جدید',
        display_number: ['09120000000'],
        tell: ['09120000000'],
        city: { name: 'یزد', slug: 'yazd' },
      },
    ];
    const legacy = [
      {
        id: 'legacy-1',
        name: 'مطب دکتر ساجدی',
        address: 'آدرس قدیمی',
        tell: ['035123'],
        services: [{ id: 'svc-1', hours_of_work: [{ day: 1 }] }],
        freeturn_text: 'فردا',
        user_center_id: 'uc-1',
      },
    ];

    const merged = mergeMsLocationsWithLegacyBooking(ms, legacy);
    expect(merged).toHaveLength(1);
    expect(merged[0].address).toBe('یزد خیابان جدید');
    expect(merged[0].display_number).toEqual(['09120000000']);
    expect(merged[0].id).toBe('legacy-1');
    expect(merged[0].services?.[0]?.id).toBe('svc-1');
    expect(merged[0].freeturn_text).toBe('فردا');
    expect(merged[0].user_center_id).toBe('uc-1');
  });

  it('falls back to legacy when MS locations empty', () => {
    const legacy = [{ id: 'l1', name: 'مطب', address: 'x', services: [] }];
    expect(mergeMsLocationsWithLegacyBooking([], legacy)).toEqual(legacy);
  });

  it('pairs single MS office with single legacy office even if MS also has online', () => {
    const ms = [
      { id: '2', name: 'مطب دکتر ابوالفضل ساجدی', address: 'آدرس جدید', tell: ['09'], type_id: 1 },
      { id: '6', name: 'ویزیت آنلاین پذیرش24', address: 'آنلاین', tell: ['021'], type_id: 1 },
    ];
    const legacy = [
      {
        id: 'uuid-legacy',
        name: 'مطب',
        center_type: 1,
        services: [{ id: 'svc' }],
        freeturn_text: 'فردا ۱۰',
        user_center_id: 'uc',
      },
      { id: '5532', name: 'ویزیت آنلاین پذیرش24', center_type: 1, services: [{ id: 'on' }] },
    ];
    const merged = mergeMsLocationsWithLegacyBooking(ms, legacy);
    expect(merged[0].address).toBe('آدرس جدید');
    expect(merged[0].id).toBe('uuid-legacy');
    expect(merged[0].services).toHaveLength(1);
    expect(merged[1].id).toBe('5532');
    expect(merged[1].services).toHaveLength(1);
  });

  it('shows MS-only location when no legacy match', () => {
    const ms = [{ id: 'ms-only', name: 'مطب نو', address: 'آدرس نو', tell: ['09'] }];
    const merged = mergeMsLocationsWithLegacyBooking(ms, [
      { id: 'h1', name: 'بیمارستان مرکزی', center_type: 2, services: [] },
    ]);
    expect(merged[0].address).toBe('آدرس نو');
    expect(merged[0].services).toEqual([]);
    expect(merged[0].id).toBe('ms-only');
  });
});
