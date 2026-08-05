import {
  hasBioCredentials,
  normalizeBioCredentials,
  normalizeBioCredentialItem,
} from './normalizeBioCredentials';

describe('normalizeBioCredentials', () => {
  it('returns empty lists when bio arrays are empty', () => {
    const credentials = normalizeBioCredentials({
      about: 'x',
      degrees: [],
      honors: [],
      experiences: [],
    });
    expect(credentials).toEqual({ degrees: [], honors: [], experiences: [] });
    expect(hasBioCredentials(credentials)).toBe(false);
  });

  it('maps flexible field names', () => {
    const credentials = normalizeBioCredentials({
      degrees: [{ name: 'دکترا', university: 'تهران', year: 2010 }],
      honors: [{ title: 'جایزه', issuer: 'وزارت بهداشت', period: '1400' }],
      experiences: [
        {
          role: 'مدیرعامل',
          organization: 'پذیرش۲۴',
          start_year: 1395,
          end_year: 1404,
          description: 'توضیح',
        },
      ],
    });

    expect(hasBioCredentials(credentials)).toBe(true);
    expect(credentials.degrees[0]).toEqual({
      title: 'دکترا',
      subtitle: 'تهران',
      year: '2010',
      description: undefined,
    });
    expect(credentials.honors[0]).toMatchObject({
      title: 'جایزه',
      subtitle: 'وزارت بهداشت',
      year: '1400',
    });
    expect(credentials.experiences[0]).toMatchObject({
      title: 'مدیرعامل',
      subtitle: 'پذیرش۲۴',
      year: '1395–1404',
      description: 'توضیح',
    });
  });

  it('drops items without a title', () => {
    expect(normalizeBioCredentialItem({ organization: 'x' })).toBeNull();
    expect(normalizeBioCredentialItem('  ')).toBeNull();
    expect(normalizeBioCredentialItem('مدرک')).toEqual({ title: 'مدرک' });
  });
});
