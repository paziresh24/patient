import Text from '@/common/components/atom/text/text';
import clsx from 'clsx';
import MessengerIcon from './messengerIcon';

export type Messenger = {
  image?: string;
  id: number;
  text: string;
  channelKey?: string;
};

interface ChannelDetailesProps {
  title?: string;
  messengers?: Messenger[];
  wrapperClassName?: string;
  className?: string;
  emphasized?: boolean;
}

export const ChannelDetailes = (props: ChannelDetailesProps) => {
  const { messengers, title, wrapperClassName, className, emphasized } = props;

  return (
    <div className={clsx('flex flex-wrap items-center justify-between gap-2', wrapperClassName)}>
      {!!title && (
        <Text fontWeight={emphasized ? 'bold' : 'semiBold'} fontSize="sm" className={emphasized ? 'text-primary' : undefined}>
          {title}
        </Text>
      )}
      <div className={clsx('flex flex-wrap justify-end gap-2', className)}>
        {messengers?.filter(Boolean).map((messenger: Messenger) => (
          <div
            key={messenger.id ?? messenger.text}
            className={clsx(
              'flex min-h-[2rem] items-center gap-2',
              emphasized && 'rounded-full border border-white/80 bg-white py-1 pl-1 pr-2.5 shadow-sm',
            )}
          >
            <MessengerIcon src={messenger.image} alt={messenger.text} />
            <Text fontSize="sm" fontWeight={emphasized ? 'semiBold' : undefined}>
              {messenger.text}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailes;
