import { composeBookingProfile } from './composeBookingProfile';

describe('composeBookingProfile', () => {
  const doctorCenters = [
    {
      id: 'center-1',
      name: 'Clinic',
      display_number: ['021'],
      tell: ['021'],
      address: 'Tehran',
      type_id: 1,
      status: 1,
      server_id: 1,
      user_center_id: 'ucid-from-centers',
      active_booking: true,
      has_bookable_services: true,
      city: { id: 1, name: 'Tehran', slug: 'tehran', province: { id: 1, name: 'Tehran', slug: 'tehran' } },
      location: { lat: 1, lon: 2 },
    },
  ];

  const slugInfo = {
    id: 1,
    slug: 'dr-test',
    owner_id: 'owner-1',
    server_id: 1,
    type: 'doctor',
    user_id: 10,
  };

  it('builds profile from drprofile sources', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: { name: 'علی', family: 'تست' },
      expertise: [
        {
          id: 'e1',
          alias_title: '',
          graduation_date: null,
          expertise: { id: 1, name: 'عمومی', slug: 'general' },
          degree: { id: 1, name: 'دکترا' },
          groups: [{ id: 1, name: 'عمومی', en_slug: 'general' }],
        },
      ],
      doctorCenters,
    });

    expect(profile?.id).toBe('owner-1');
    expect(profile?.display_name).toBe('علی تست');
    expect(profile?.centers).toHaveLength(1);
    expect(profile?.centers[0].user_center_id).toBe('ucid-from-centers');
    expect(profile?.centers[0].server_id).toBe(1);
    expect(profile?.centers[0].settings).toBeNull();
    expect(profile?.centers[0].insurances).toBeNull();
    expect(profile?.centers[0].user_center_desk).toBeNull();
    expect(profile?.centers[0].freeturn).toBeNull();
    expect(profile?.centers[0].waiting_time_info).toBeNull();
    expect(profile?.online_visit_channel_types).toBeNull();
    expect(profile?.feedback_visit).toBeNull();
    expect(profile?.expertises?.[0]?.expertise_groups?.[0]?.en_slug).toBe('general');
    expect(profile?.city_en_slug).toBe('tehran');
  });

  it('uses dedicated settings and insurances APIs on centers', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: { name: 'علی', family: 'تست' },
      expertise: [],
      doctorCenters,
      settingsByCenterId: {
        'center-1': {
          booking_enable_insurance: '1',
          booking_new_turn_suggestion_type: 'only_first_turn',
          booking_paging_from_clinic: null,
        },
      },
      insurancesByCenterId: {
        'center-1': [{ id: 'dr-insurance', name: 'تامین' }],
      },
    });

    expect(profile?.centers[0].user_center_id).toBe('ucid-from-centers');
    expect(profile?.centers[0].server_id).toBe(1);
    expect(profile?.centers[0].insurances).toEqual([{ id: 'dr-insurance', name: 'تامین' }]);
    expect(profile?.centers[0].settings).toEqual({
      booking_enable_insurance: '1',
      booking_new_turn_suggestion_type: 'only_first_turn',
      booking_paging_from_clinic: null,
    });
    expect(profile?.expertises).toBeNull();
    expect(profile?.online_visit_channel_types).toBeNull();
    expect(profile?.feedback_visit).toBeNull();
    expect(profile?.waiting_time_info).toBeNull();
  });

  it('uses drprofile online-channels when provided', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: { name: 'علی', family: 'تست' },
      doctorCenters,
      onlineVisitChannelTypes: ['eitaa', 'secure_call'],
    });

    expect(profile?.online_visit_channel_types).toEqual(['eitaa', 'secure_call']);
  });

  it('uses empty strings for missing name fields and null for other missing sources', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: null,
      expertise: null,
      doctorCenters,
    });

    expect(profile?.name).toBe('');
    expect(profile?.family).toBe('');
    expect(profile?.display_name).toBe('');
    expect(profile?.expertises).toBeNull();
    expect(profile?.online_visit_channel_types).toBeNull();
    expect(profile?.centers).toHaveLength(1);
  });

  it('leaves settings and insurances null when dedicated API data is missing', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: { name: 'علی', family: 'تست' },
      doctorCenters,
    });

    expect(profile?.centers[0].settings).toBeNull();
    expect(profile?.centers[0].insurances).toBeNull();
    expect(profile?.centers[0].user_center_desk).toBeNull();
  });

  it('returns empty centers when the centers API has no rows', () => {
    const profile = composeBookingProfile({
      slugInfo,
      fullName: { name: 'علی', family: 'تست' },
      doctorCenters: [],
    });

    expect(profile?.centers).toEqual([]);
    expect(profile?.city_en_slug).toBeNull();
  });

  it('returns null when no sources are available', () => {
    expect(composeBookingProfile({})).toBeNull();
    expect(composeBookingProfile({ fullName: { name: 'علی', family: 'تست' } })).toBeNull();
  });
});
