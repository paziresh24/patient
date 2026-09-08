import {
  buildAboutBiographyWithMedicalCode,
  formatCouncilMedicalCodeLine,
  stripCouncilMedicalCodeFromBiography,
} from './buildAboutBiographyWithMedicalCode';

describe('buildAboutBiographyWithMedicalCode', () => {
  it('prepends the medical-code line to biography html', () => {
    expect(buildAboutBiographyWithMedicalCode('<p>bio</p>', '123456')).toBe(
      '<p>کدنظام پزشکی: 123456</p><p>bio</p>',
    );
  });

  it('still shows the line when biography is empty', () => {
    expect(buildAboutBiographyWithMedicalCode('', 'م-60681')).toBe('<p>کدنظام پزشکی: م-60681</p>');
    expect(buildAboutBiographyWithMedicalCode(null, '123456')).toBe('<p>کدنظام پزشکی: 123456</p>');
  });

  it('does not keep a saved line inside biography html', () => {
    const bio = '<p>کدنظام پزشکی: 123456</p><p>bio</p>';
    expect(buildAboutBiographyWithMedicalCode(bio, '123456')).toBe('<p>کدنظام پزشکی: 123456</p><p>bio</p>');
    expect(stripCouncilMedicalCodeFromBiography(bio)).toBe('<p>bio</p>');
  });

  it('formats the sample copy', () => {
    expect(formatCouncilMedicalCodeLine('123456')).toBe('کدنظام پزشکی: 123456');
  });
});
