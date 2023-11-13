import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';
import { ReactNode } from 'react';

interface ServiceCardProps {
  header?: {
    icon?: ReactNode;
    title: string;
    hint?: ReactNode;
  };
  body?: {
    description: Array<string | undefined>;
  };
  footer?: {
    component?: ReactNode;
    actions?: {
      text: string;
      onClick: () => void;
      loading?: boolean;
      hint?: string;
      icon?: ReactNode;
      className?: string;
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
        <ul className="flex flex-col px-2 list-disc pr-7 py-1 mx-4 space-y-1 border-r-2 border-slate-200">
          {body.description?.map(item => (
            <li key={item}>
              <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: item ?? '' }} />
            </li>
          ))}
        </ul>
      )}
      {footer && (
        <div className="px-4">
          {footer.actions?.map((action, index) => (
            <Button
              block
              key={index}
              loading={action.loading}
              {...(action.icon && { icon: action.icon })}
              onClick={action.onClick}
              className={action.className ?? ''}
            >
              <div className="flex items-center justify-between w-full">
                <Text>{action.text}</Text>
                <div className="flex items-center space-s-3">
                  {action.hint && <Text>{action.hint}</Text>}
                  <ChevronIcon dir="left" />
                </div>
              </div>
            </Button>
          ))}
          {footer && footer.component}
        </div>
      )}
    </Card>
  );
};

export default ServiceCard;
