import { normalizeDoctorOnlineChannels } from './normalizeDoctorOnlineChannels';

describe('normalizeDoctorOnlineChannels', () => {
  it('keeps a string array payload', () => {
    expect(normalizeDoctorOnlineChannels(['whatsapp', 'secure_call'])).toEqual(['whatsapp', 'secure_call']);
  });

  it('unwraps data / online_visit_channel_types envelopes', () => {
    expect(normalizeDoctorOnlineChannels({ data: ['eitaa'] })).toEqual(['eitaa']);
    expect(normalizeDoctorOnlineChannels({ online_visit_channel_types: ['whatsapp'] })).toEqual(['whatsapp']);
  });

  it('drops non-string values', () => {
    expect(normalizeDoctorOnlineChannels(['whatsapp', 1, '', null])).toEqual(['whatsapp']);
    expect(normalizeDoctorOnlineChannels(null)).toEqual([]);
  });
});
