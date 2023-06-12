import eitaaIcon from '@/common/assets/messenger/eitaa.png';
import igapIcon from '@/common/assets/messenger/igap.png';
import paziresh24Messenger from '@/common/assets/messenger/paziresh-message.jpg';
import whatsappIcon from '@/common/assets/messenger/whatsapp.png';
export type Messenger = 'igap' | 'whatsapp' | 'eitaa' | 'rocketchat';

export const messengers: Record<
  Messenger,
  {
    name: string;
    icon: string;
  }
> = {
  igap: { name: 'آی گپ', icon: igapIcon.src },
  eitaa: { name: 'ایتا', icon: eitaaIcon.src },
  whatsapp: { name: 'واتساپ', icon: whatsappIcon.src },
  rocketchat: { name: 'پیام رسان پذیرش24', icon: paziresh24Messenger.src },
};
