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

  it('builds profile from drprofile when full-profile is null', () => {
    const profile = composeBookingProfile({
      slugInfo: {
        id: 1,
        slug: 'dr-test',
        owner_id: 'owner-1',
        server_id: 1,
        type: 'doctor',
        user_id: 10,
      },
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
      fullProfile: null,
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
  });

  it('fills gap fields from full-profile but settings and insurances from dedicated APIs', () => {
    const profile = composeBookingProfile({
      slugInfo: {
        id: 1,
        slug: 'dr-test',
        owner_id: 'owner-1',
        server_id: 1,
        type: 'doctor',
        user_id: 10,
      },
      fullName: { name: 'علی', family: 'تست' },
      expertise: [],
      doctorCenters,
      fullProfile: {
        id: 'fp-id',
        online_visit_channel_types: ['whatsapp'],
        feedback_visit: { two_weeks_data: [] },
        expertises: [{ expertise: { name: 'از-fp' }, expertise_groups: [{ en_slug: 'fp' }] }],
        centers: [
          {
            id: 'center-1',
            user_center_id: 'ucid-from-fp',
            server_id: 99,
            settings: { booking_enable_insurance: '0' },
            insurances: [{ id: 'fp-insurance', name: 'از-fp' }],
            user_center_desk: 'میز',
            freeturn: 123,
            freeturn_text: 'امروز',
            freeturns_info: [],
            services: [{ id: 'svc-1' }],
            is_active: true,
            waiting_time_info: { waiting_time_title: '۱۵ دقیقه' },
          },
        ],
      },
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
    expect(profile?.centers[0].user_center_desk).toBeNull();
    expect(profile?.centers[0].freeturn).toBeNull();
    expect(profile?.centers[0].services).toEqual([]);
    expect(profile?.centers[0].settings).toEqual({
      booking_enable_insurance: '1',
      booking_new_turn_suggestion_type: 'only_first_turn',
      booking_paging_from_clinic: null,
    });
    expect(profile?.online_visit_channel_types).toBeNull();
    expect(profile?.feedback_visit).toBeNull();
    expect(profile?.waiting_time_info).toBeNull();
    expect(profile?.centers[0].waiting_time_info).toBeNull();
  });

  it('uses drprofile online-channels and ignores full-profile online_visit_channel_types', () => {
    const profile = composeBookingProfile({
      slugInfo: {
        id: 1,
        slug: 'dr-test',
        owner_id: 'owner-1',
        server_id: 1,
        type: 'doctor',
        user_id: 10,
      },
      fullName: { name: 'علی', family: 'تست' },
      doctorCenters,
      fullProfile: {
        online_visit_channel_types: ['whatsapp'],
      },
      onlineVisitChannelTypes: ['eitaa', 'secure_call'],
    });

    expect(profile?.online_visit_channel_types).toEqual(['eitaa', 'secure_call']);
  });

  it('ignores full-profile settings and insurances when dedicated API data is missing', () => {
    const profile = composeBookingProfile({
      slugInfo: {
        id: 1,
        slug: 'dr-test',
        owner_id: 'owner-1',
        server_id: 1,
        type: 'doctor',
        user_id: 10,
      },
      fullName: { name: 'علی', family: 'تست' },
      doctorCenters,
      fullProfile: {
        centers: [
          {
            id: 'center-1',
            settings: { booking_enable_insurance: '1' },
            insurances: [{ id: 'fp-insurance', name: 'تامین' }],
          },
        ],
      },
    });

    expect(profile?.centers[0].settings).toBeNull();
    expect(profile?.centers[0].insurances).toBeNull();
    expect(profile?.centers[0].user_center_desk).toBeNull();
  });

  it('returns null when no sources are available', () => {
    expect(composeBookingProfile({})).toBeNull();
  });
});
