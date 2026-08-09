import { normalizeProfileApiBearerToken } from './normalizeProfileApiBearerToken';

describe('normalizeProfileApiBearerToken', () => {
  it('keeps static driver tokens as-is', () => {
    expect(normalizeProfileApiBearerToken('test')).toBe('test');
    expect(normalizeProfileApiBearerToken('write')).toBe('write');
    expect(normalizeProfileApiBearerToken('admin')).toBe('admin');
  });

  it('strips a single accidental Bearer prefix', () => {
    expect(normalizeProfileApiBearerToken('Bearer test')).toBe('test');
    expect(normalizeProfileApiBearerToken('bearer abc.def')).toBe('abc.def');
  });

  it('trims empty values', () => {
    expect(normalizeProfileApiBearerToken('')).toBe('');
    expect(normalizeProfileApiBearerToken('   ')).toBe('');
  });
});
