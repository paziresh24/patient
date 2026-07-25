import { formatCallTimer } from './useVoiceCall';

describe('formatCallTimer', () => {
  it('pads minutes and seconds', () => {
    expect(formatCallTimer(0)).toBe('00:00');
    expect(formatCallTimer(65)).toBe('01:05');
    expect(formatCallTimer(600)).toBe('10:00');
  });
});
