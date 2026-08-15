import { deriveOnlineVisitChannelTypesFromServices } from './deriveOnlineVisitChannelTypes';

describe('deriveOnlineVisitChannelTypesFromServices', () => {
  it('maps whatsapp service title to whatsapp channel (P24 messenger in Plasmic)', () => {
    expect(
      deriveOnlineVisitChannelTypesFromServices([{ alias_title: 'دکتر محدثه بشارتی - واتساپ' }]),
    ).toEqual(['whatsapp']);
  });

  it('maps eitaa titles', () => {
    expect(deriveOnlineVisitChannelTypesFromServices([{ alias_title: 'ویزیت ایتا' }]).sort()).toEqual(
      ['eitaa', 'eitaa_number'].sort(),
    );
  });

  it('returns empty when no channel hints', () => {
    expect(deriveOnlineVisitChannelTypesFromServices([{ alias_title: 'ویزیت آنلاین' }])).toEqual([]);
  });
});
