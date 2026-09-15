import { collectCenterBookingPlatforms } from './centerBookingPlatforms';

const payload = {
  items: [
    {
      id: 'c1',
      meta_data: {
        platforms: [
          { id: 'p24', name: 'paziresh24', p_name: 'پذیرش۲۴', icon: 'https://cdn/p24.png' },
          { id: 'dto', name: 'doctoreto', p_name: 'دکترتو', icon: 'https://cdn/dto.png' },
        ],
      },
    },
    {
      id: 'c2',
      meta_data: {
        platforms: [{ id: 'dto', name: 'doctoreto', p_name: 'دکترتو', icon: 'https://cdn/dto.png' }],
      },
    },
  ],
};

describe('collectCenterBookingPlatforms', () => {
  it('returns unique platforms from all centers', () => {
    expect(collectCenterBookingPlatforms(payload).map(p => p.name)).toEqual(['پذیرش۲۴', 'دکترتو']);
  });

  it('puts پذیرش۲۴ first even when it arrives later', () => {
    const reversed = {
      items: [
        {
          id: 'c1',
          meta_data: {
            platforms: [
              { id: 'dto', name: 'doctoreto', p_name: 'دکترتو', icon: 'https://cdn/dto.png' },
              { id: 'p24', name: 'paziresh24', p_name: 'پذیرش۲۴', icon: 'https://cdn/p24.png' },
            ],
          },
        },
      ],
    };
    expect(collectCenterBookingPlatforms(reversed).map(p => p.name)).toEqual(['پذیرش۲۴', 'دکترتو']);
  });

  it('scopes platforms to the selected center', () => {
    expect(collectCenterBookingPlatforms(payload, 'c2').map(p => p.id)).toEqual(['dto']);
  });

  it('returns empty when centers have no platforms', () => {
    expect(collectCenterBookingPlatforms({ items: [{ id: 'c1' }] })).toEqual([]);
  });
});
