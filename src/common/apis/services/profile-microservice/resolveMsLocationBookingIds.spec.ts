import {
  isInternalMsLocationPk,
  isMsOnlineVisitLocation,
  resolveMsLocationBookingIds,
} from './resolveMsLocationBookingIds';

describe('resolveMsLocationBookingIds', () => {
  it('uses external_ids.center_id UUID for booking', () => {
    const result = resolveMsLocationBookingIds({
      id: '13',
      name: 'مطب دکتر ساجدی',
      external_ids: {
        center_id: '9f9a1285-a711-4418-8e92-a40d4bec2f94',
        user_center_id: '9f9a1285-d5dc-4e68-81bf-4bd0c587b170',
      },
    });
    expect(result.bookingCenterId).toBe('9f9a1285-a711-4418-8e92-a40d4bec2f94');
    expect(result.userCenterId).toBe('9f9a1285-d5dc-4e68-81bf-4bd0c587b170');
    expect(result.msLocationId).toBe('13');
  });

  it('maps online visit location to 5532', () => {
    const result = resolveMsLocationBookingIds({
      id: '14',
      name: 'ویزیت آنلاین پذیرش24',
    });
    expect(result.bookingCenterId).toBe('5532');
    expect(result.msLocationId).toBe('14');
  });

  it('does not treat internal MS pk as booking center id', () => {
    const result = resolveMsLocationBookingIds({
      id: '13',
      name: 'مطب',
    });
    expect(result.bookingCenterId).toBeNull();
    expect(result.msLocationId).toBe('13');
  });

  it('detects internal MS pk', () => {
    expect(isInternalMsLocationPk('13', '13')).toBe(true);
    expect(isInternalMsLocationPk('9f9a1285-a711-4418-8e92-a40d4bec2f94', '13')).toBe(false);
  });

  it('detects online visit by name', () => {
    expect(isMsOnlineVisitLocation({ name: 'ویزیت آنلاین پذیرش24' })).toBe(true);
    expect(isMsOnlineVisitLocation({ name: 'مطب دکتر' })).toBe(false);
  });
});
