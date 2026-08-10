import {
  resolveDoctorProfileImageUrl,
  resolveDoctorProfileLcpImageUrl,
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
});
