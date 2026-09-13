import { readAppointmentPlatform } from './appointmentPlatform';

describe('readAppointmentPlatform', () => {
  it('reads p_name from platform object', () => {
    expect(
      readAppointmentPlatform({
        platform: { name: 'snappdoctor', p_name: 'اسنپ‌دکتر', icon: 'https://cdn/snapp.png' },
      }),
    ).toEqual({ label: 'اسنپ‌دکتر', icon: 'https://cdn/snapp.png' });
  });

  it('reads JSON string platform', () => {
    expect(readAppointmentPlatform({ platform: '{"p_name":"پذیرش۲۴","name":"paziresh24"}' })).toEqual({
      label: 'پذیرش۲۴',
    });
  });

  it('ignores center.site website urls', () => {
    expect(readAppointmentPlatform({ center: { site: 'https://clinic.ir' } }).label).toBeUndefined();
  });
});
