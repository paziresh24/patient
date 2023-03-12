import igapIcon from '@/common/assets/massagers/igap.png';
import whatsappIcon from '@/common/assets/massagers/whatsapp.png';

export type Massenger = 'igap' | 'whatsapp';

export const massengers: Record<
  Massenger,
  {
    name: string;
    icon: string;
  }
> = {
  igap: { name: 'آی گپ', icon: igapIcon.src },
  whatsapp: { name: 'واتساپ', icon: whatsappIcon.src },
};
