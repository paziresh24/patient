import { buildDoctorExpertiseChips } from './buildDoctorExpertiseChips';

describe('buildDoctorExpertiseChips', () => {
  it('matches search display_expertise and ignores pipe alias dumps', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title:
            'چکاپ بارداری|سزارین|خونریزی رحم|سرطان دهانه رحم|سرطان زنان|افتادگی رحم|',
          degree_name: 'متخصص',
          expertise_name: 'زنان و زایمان',
        },
      ]),
    ).toEqual(['متخصص زنان و زایمان']);
  });

  it('appends keyword tags like search keyword_tags_user_priority_1', () => {
    expect(
      buildDoctorExpertiseChips(
        [
          {
            alias_title: 'چکاپ بارداری|سزارین|',
            degree_name: 'متخصص',
            expertise_name: 'زنان و زایمان',
          },
        ],
        {
          keywordTags: ['بیماری های زنان', 'زایمان', 'جراحی زیبایی واژن زنان'],
        },
      ),
    ).toEqual(['متخصص زنان و زایمان', 'بیماری های زنان', 'زایمان', 'جراحی زیبایی واژن زنان']);
  });

  it('keeps a clean alias as a single chip when degree/expertise missing', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title: 'فوق تخصص غدد درون ریز و متابولیسم',
        },
      ]),
    ).toEqual(['فوق تخصص غدد درون ریز و متابولیسم']);
  });

  it('prefers degree + expertise over a clean alias (search display_expertise)', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title: 'فوق تخصص غدد درون ریز و متابولیسم',
          degree_name: 'فوق تخصص',
          expertise_name: 'غدد درون ریز و متابولیسم',
        },
      ]),
    ).toEqual(['فوق تخصص غدد درون ریز و متابولیسم']);
  });

  it('falls back to degree + expertise when alias is empty', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title: '',
          degree_name: 'متخصص',
          expertise_name: 'قلب و عروق',
        },
      ]),
    ).toEqual(['متخصص قلب و عروق']);
  });

  it('uses only the first pipe part when degree/expertise are missing', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title: 'خدمت الف|خدمت ب|خدمت ج|خدمت د',
        },
      ]),
    ).toEqual(['خدمت الف']);
  });

  it('does not use lonely degree as main when expertise_name is empty', () => {
    expect(
      buildDoctorExpertiseChips([
        {
          alias_title: 'چکاپ بارداری|سزارین|خونریزی رحم|سرطان زنان',
          degree_name: 'متخصص',
          expertise_name: '',
        },
      ]),
    ).toEqual(['چکاپ بارداری']);
  });
});
