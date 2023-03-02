import ChatIcon from '@/common/components/icons/chat';
import { ServiceCard } from './card';

interface OnlineVisitProps {
  title: string;
  description: string;
  buttonText: string;
  onBook: () => void;
}

export const External = (props: OnlineVisitProps) => {
  const { title, description, onBook, buttonText } = props;
  return (
    <ServiceCard
      header={{
        title,
        icon: <ChatIcon width={21} height={21} />,
      }}
      body={{
        description: [description].filter(Boolean),
      }}
      footer={{
        actions: [
          {
            text: buttonText,
            onClick: onBook,
          },
        ],
      }}
    />
  );
};

export default External;
