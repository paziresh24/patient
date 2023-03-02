import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import { ReactNode } from 'react';

interface ServiceCardProps {
  header?: {
    icon?: ReactNode;
    title: string;
    hint?: string;
  };
  body?: {
    description: Array<string | undefined>;
  };
  footer?: {
    actions?: {
      text: string;
      onClick: () => void;
      loading?: boolean;
    }[];
  };
}

export const ServiceCard = (props: ServiceCardProps) => {
  const { header, footer, body } = props;
  return (
    <Card className="!p-0 !py-4 space-y-3 !rounded-none md:!rounded-lg">
      {header && (
        <div className="flex items-center justify-between px-4 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center space-s-2">
            {header.icon}
            <Text fontWeight="bold" fontSize="sm">
              {header.title}
            </Text>
          </div>
          {header.hint && (
            <Text fontWeight="semiBold" fontSize="sm">
              {header.hint}
            </Text>
          )}
        </div>
      )}
      {body && body.description?.length > 0 && (
        <div className="flex flex-col px-2 py-1 mx-4 space-y-2 border-r-2 border-slate-200">
          {body.description?.map(item => (
            <Text fontSize="sm" key={item} dangerouslySetInnerHTML={{ __html: item ?? '' }} />
          ))}
        </div>
      )}
      {footer && (
        <div className="px-4">
          {footer.actions?.map((action, index) => (
            <Button block key={index} loading={action.loading} onClick={action.onClick}>
              {action.text}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
