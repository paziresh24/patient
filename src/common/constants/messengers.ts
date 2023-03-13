import igapIcon from '@/common/assets/messenger/igap.png';
import whatsappIcon from '@/common/assets/messenger/whatsapp.png';

export type Messenger = 'igap' | 'whatsapp';

export const messengers: Record<
  Messenger,
  {
    name: string;
    icon: string;
  }
> = {
  igap: { name: 'آی گپ', icon: igapIcon.src },
  whatsapp: { name: 'واتساپ', icon: whatsappIcon.src },
};
