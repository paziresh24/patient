import Text from '@/common/components/atom/text/text';
import clsx from 'clsx';
import Image from 'next/image';

export type Messenger = {
  image?: string;
  id: number;
  text: string;
};

interface ChannelDetailesProps {
  title?: string;
  messengers: Messenger[];
  wrapperClassName?: string;
  className?: string;
}

export const ChannelDetailes = (props: ChannelDetailesProps) => {
  const { messengers, title, wrapperClassName, className } = props;
  return (
    <div className={clsx('flex justify-between', wrapperClassName)}>
      {!!title && <Text>{title}</Text>}
      <div className={clsx('flex justify-end gap-4', className)}>
        {messengers.map((messenger: Messenger) => (
          <div key={messenger.id} className="flex">
            <div className="flex items-center gap-2">
              {!!messenger.image && <Image src={messenger.image} alt="icon" width={30} height={30} className="max-w-6 max-h-6" />}
              <span>{messenger.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailes;
