import { parseDoctorCenters } from './parseDoctorCenters';

describe('parseDoctorCenters', () => {
  it('returns arrays as-is, including empty', () => {
    expect(parseDoctorCenters([{ id: '1' }])).toEqual([{ id: '1' }]);
    expect(parseDoctorCenters([])).toEqual([]);
  });

  it('unwraps common envelopes', () => {
    expect(parseDoctorCenters({ data: [{ id: '1' }] })).toEqual([{ id: '1' }]);
    expect(parseDoctorCenters({ result: [{ id: '2' }] })).toEqual([{ id: '2' }]);
  });

  it('returns null for failed catch-shaped objects so callers keep doctor identity', () => {
    expect(parseDoctorCenters({})).toBeNull();
    expect(parseDoctorCenters(null)).toBeNull();
  });
});
