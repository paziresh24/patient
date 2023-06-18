import eitaaIcon from '@/common/assets/messenger/eitaa.png';
import igapIcon from '@/common/assets/messenger/igap.png';
import whatsappIcon from '@/common/assets/messenger/whatsapp.png';
export type Messenger = 'igap' | 'whatsapp' | 'eitaa';

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
};
