import Text from '@/common/components/atom/text/text';
import clsx from 'clsx';

export type Messenger = {
  image?: string;
  id: number;
  text: string;
};

interface ChannelDetailesProps {
  title?: string;
  messengers?: Messenger[];
  wrapperClassName?: string;
  className?: string;
}

/** Plain <img> — this HTML is often injected via renderToString (Next/Image breaks alts there). */
export const ChannelDetailes = (props: ChannelDetailesProps) => {
  const { messengers, title, wrapperClassName, className } = props;
  const list = (messengers ?? []).filter((m): m is Messenger => !!m && (!!m.text || !!m.image));

  return (
    <div className={clsx('flex justify-between', wrapperClassName)}>
      {!!title && <Text>{title}</Text>}
      <div className={clsx('flex justify-end gap-4', className)}>
        {list.map((messenger, index) => {
          const label = (messenger.text || 'پیام‌رسان').trim();
          return (
            <div key={messenger.id ?? index} className="flex">
              <div className="flex items-center gap-2">
                {!!messenger.image && (
                  <img src={messenger.image} alt={label} width={24} height={24} className="max-w-6 max-h-6 object-contain" />
                )}
                <span>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelDetailes;
