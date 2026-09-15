import buildSubstituteDoctorSearch, {
  buildSubstituteDoctorSearchText,
  SUBSTITUTE_DOCTOR_SEARCH_REF,
} from './buildSubstituteDoctorSearch';

describe('buildSubstituteDoctorSearch', () => {
  it('sends a ref so the request reaches query understanding (ghane finding #68)', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'چشم پزشکی' }], 'bojnurd').query.ref).toBe(
      SUBSTITUTE_DOCTOR_SEARCH_REF,
    );
  });

  it('keeps the doctor city — it is a personalization signal, not the bug', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'چشم پزشکی' }], 'bojnurd').route).toBe('bojnurd');
  });

  it('falls back to nationwide when the doctor has no city', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'چشم پزشکی' }], null).route).toBe('ir');
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'چشم پزشکی' }], undefined).route).toBe('ir');
  });

  it('keeps the consult turn type', () => {
    expect(buildSubstituteDoctorSearch([{ expertise_name: 'قلب و عروق' }], 'ir').query.turn_type).toBe('consult');
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
