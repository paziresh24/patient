import {
  canPreviewDoctorProfileImage,
  NO_DOCTOR_PROFILE_IMAGE,
  resolveDoctorProfileImageUrl,
  resolveDoctorProfileLcpImageUrl,
  toDoctorProfileLightboxSrc,
} from '@/modules/profile/utils/doctorProfileImageUrl';

describe('doctorProfileImageUrl', () => {
  it('uses full pic URL for OG', () => {
    expect(resolveDoctorProfileImageUrl({ user_id: '12345' }, null)).toBe(
      'https://pic.paziresh24.com/api/image/12345',
    );
  });

  it('uses thumb pic URL for LCP avatar', () => {
    expect(resolveDoctorProfileLcpImageUrl({ user_id: '12345' }, null)).toBe(
      'https://pic.paziresh24.com/api/image/12345?p=thumb',
    );
  });

  it('falls back to page user id', () => {
    expect(resolveDoctorProfileLcpImageUrl(undefined, '99')).toBe(
      'https://pic.paziresh24.com/api/image/99?p=thumb',
    );
  });

  it('strips thumb query for lightbox', () => {
    expect(toDoctorProfileLightboxSrc('https://pic.paziresh24.com/api/image/12345?p=thumb')).toBe(
      'https://pic.paziresh24.com/api/image/12345',
    );
  });

  it('leaves non-pic URLs unchanged for lightbox', () => {
    expect(toDoctorProfileLightboxSrc('https://cdn.example.com/doc.jpg')).toBe('https://cdn.example.com/doc.jpg');
  });

  it('blocks empty and placeholder images from preview', () => {
    expect(canPreviewDoctorProfileImage('')).toBe(false);
    expect(canPreviewDoctorProfileImage(NO_DOCTOR_PROFILE_IMAGE)).toBe(false);
    expect(canPreviewDoctorProfileImage('https://pic.paziresh24.com/api/image/1')).toBe(true);
  });
});
