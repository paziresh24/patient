import eitaaIcon from '@/common/assets/messenger/eitaa.png';
import igapIcon from '@/common/assets/messenger/igap.png';
import pazireshMessageIcon from '@/common/assets/messenger/paziresh-message.jpg';
import whatsappIcon from '@/common/assets/messenger/whatsapp.png';
import { Messenger } from './channelDetailes';

type FeatureChannel = {
  id?: number;
  text?: string;
  name?: string;
  image?: string | null;
};

type FeatureChannelMap = Record<string, FeatureChannel>;

const LOCAL_MESSENGER_IMAGES: Record<string, string> = {
  eitaa: eitaaIcon.src,
  whatsapp: whatsappIcon.src,
  igap: igapIcon.src,
};

const DISPLAY_NAMES: Record<string, string> = {
  eitaa: 'ایتا',
  whatsapp: 'پیام‌رسان پذیرش۲۴',
  igap: 'آی‌گپ',
};

const HIDDEN_CHANNELS = new Set(['phone', 'secure_call']);

export const normalizeMessengerChannel = (channel: string): string => {
  if (channel.endsWith('_number')) {
    return channel.replace(/_number$/, '');
  }
  return channel;
};

const resolveMessengerImage = (channel: string): string | undefined => {
  return LOCAL_MESSENGER_IMAGES[channel] ?? (channel === 'whatsapp' ? pazireshMessageIcon.src : undefined);
};

const resolveMessengerText = (channel: string, featureChannels: FeatureChannelMap, rawChannel: string): string => {
  const feature = featureChannels[rawChannel] ?? featureChannels[channel];

  if (feature?.text) return feature.text;
  if (feature?.name) return feature.name;

  return DISPLAY_NAMES[channel] ?? '';
};

export const resolveOnlineVisitMessengers = (
  channels: string[] | undefined,
  featureChannels: FeatureChannelMap = {},
): Messenger[] => {
  if (!channels?.length) return [];

  const seen = new Set<string>();

  return channels
    .filter(channel => !HIDDEN_CHANNELS.has(channel) && !HIDDEN_CHANNELS.has(normalizeMessengerChannel(channel)))
    .map(rawChannel => ({
      rawChannel,
      channel: normalizeMessengerChannel(rawChannel),
    }))
    .filter(({ rawChannel, channel }) => {
      if (seen.has(channel)) return false;
      seen.add(channel);

      const feature = featureChannels[rawChannel] ?? featureChannels[channel];
      return Boolean(DISPLAY_NAMES[channel] || LOCAL_MESSENGER_IMAGES[channel] || feature?.text || feature?.name);
    })
    .map(({ rawChannel, channel }, index) => {
      const feature = featureChannels[rawChannel] ?? featureChannels[channel];

      return {
        id: feature?.id ?? index,
        text: resolveMessengerText(channel, featureChannels, rawChannel) || DISPLAY_NAMES[channel] || '',
        image: resolveMessengerImage(channel),
        channelKey: channel,
      };
    })
    .filter((item): item is Messenger => Boolean(item?.text));
};

export const humanizeServiceDuration = (duration?: string) => {
  if (!duration) return null;

  const [hours = '0', minutes = '0', seconds = '0'] = duration.split(':');
  const h = Number(hours);
  const m = Number(minutes);
  const s = Number(seconds);

  if (h === 0 && m === 0) return `${s} ثانیه`;
  if (h === 0) return `${m} دقیقه`;
  if (m === 0) return `${h} ساعت`;
  return `${h} ساعت و ${m} دقیقه`;
};
