import { ds } from './tokens';

describe('doctor-home motion tokens', () => {
  it('does not leave enter animations stuck at opacity-0 when motion is reduced', () => {
    for (const token of [ds.motion.enter, ds.motion.sheetEnter, ds.motion.originEnter]) {
      expect(token).toContain('motion-reduce:opacity-100');
    }
  });
});
