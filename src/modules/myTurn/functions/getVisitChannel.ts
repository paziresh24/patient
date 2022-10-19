interface GetVisitChannel {
  type: 'igap' | 'whatsapp';
  username: string;
}

export const channels = {
  igap: { prefixUrl: 'https://web.igap.net/app?q=@', name: 'آی گپ' },
  whatsapp: { prefixUrl: 'https://wa.me/98', name: 'واتس اپ' },
};

export const getVisitChannel = ({ type, username }: GetVisitChannel) => {
  return {
    ...channels[type],
    url: channels[type].prefixUrl + username,
  };
};
