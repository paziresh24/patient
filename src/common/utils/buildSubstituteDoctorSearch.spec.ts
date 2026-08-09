import buildSubstituteDoctorSearch, { buildSubstituteDoctorSearchText } from './buildSubstituteDoctorSearch';

describe('buildSubstituteDoctorSearch', () => {
  it('never sends the profile doctor city — the online-visit pool is nationwide (ghane finding #68)', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'چشم پزشکی', alias_title: 'متخصص چشم پزشکی' }]).route).toBe(
      'ir',
    );
  });

  it('keeps the consult turn type', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'قلب و عروق' }]).query.turn_type).toBe('consult');
  });

  it('prefers the first expertise that has an alias_title', () => {
    expect(
      buildSubstituteDoctorSearchText([
        { expertise_name: 'پزشکی', expertise_id: 325 },
        { expertise_name: 'پوست', alias_title: 'متخصص پوست، مو، زیبایی و لیزر' },
      ]),
    ).toBe('متخصص پوست، مو، زیبایی و لیزر');
  });

  it('falls back to the expertise name and skips the generic 325 row', () => {
    expect(
      buildSubstituteDoctorSearchText([
        { expertise_name: 'دکترای پزشکی', expertise_id: 325 },
        { expertise_name: 'چشم پزشکی', expertise_id: 146 },
      ]),
    ).toBe('چشم پزشکی');
  });

  it('returns an empty text when there is nothing to search with (caller renders nothing)', () => {
    expect(buildSubstituteDoctorSearchText([])).toBe('');
    expect(buildSubstituteDoctorSearchText(undefined)).toBe('');
  });
});
