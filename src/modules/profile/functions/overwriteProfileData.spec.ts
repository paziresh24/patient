import { overwriteProfileData } from './overwriteProfileData';

describe('overwriteProfileData group_expertises', () => {
  const baseOverwrite = {
    provider: {},
    history: {},
    feedbacks: {},
  };

  it('derives group_expertises from drprofile expertise groups when full-profile is absent', () => {
    const { expertises } = overwriteProfileData(
      {
        ...baseOverwrite,
        expertises: [
          {
            alias_title: 'مامایی',
            groups: [{ id: 23, name: 'زنان، زایمان و نازایی', en_slug: 'obstetrics-gynecology' }],
          },
        ],
      },
      {},
    );

    expect(expertises.group_expertises).toEqual([
      { id: 23, en_slug: 'obstetrics-gynecology', icon: null, name: 'زنان، زایمان و نازایی' },
    ]);
  });

  it('prefers provider taggables over drprofile groups', () => {
    const { expertises } = overwriteProfileData(
      {
        ...baseOverwrite,
        provider: {
          expertises: [
            {
              speciality: {
                taggables: [{ tag: { id: 21, slug: 'psychology', icon: '/icon.png', title: 'روانشناسی' } }],
              },
            },
          ],
        },
        expertises: [{ groups: [{ id: 23, name: 'زنان', en_slug: 'obstetrics-gynecology' }] }],
      },
      {},
    );

    expect(expertises.group_expertises).toEqual([
      { id: 21, en_slug: 'psychology', icon: '/icon.png', name: 'روانشناسی' },
    ]);
  });

  it('falls back to source.group_expertises when no overwrite groups exist', () => {
    const { expertises } = overwriteProfileData(baseOverwrite, {
      group_expertises: [{ id: 47, en_slug: 'psychiatry', name: 'روانپزشکی' }],
    });

    expect(expertises.group_expertises).toEqual([{ id: 47, en_slug: 'psychiatry', name: 'روانپزشکی' }]);
  });
});
