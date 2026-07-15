import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card/card';
import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import { ReactNode } from 'react';
import ServiceBulletList from './serviceBulletList';

type ServiceCardVariant = 'default' | 'presence' | 'onlineVisit';

interface ServiceCardProps {
  variant?: ServiceCardVariant;
  header?: {
    icon?: ReactNode;
    title: string;
    subtitle?: string;
    hint?: ReactNode;
  };
  body?: {
    description?: Array<string | undefined>;
    content?: ReactNode;
    bulletTone?: 'default' | 'enhanced';
  };
  alert?: ReactNode;
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

const variantStyles: Record<
  ServiceCardVariant,
  {
    card: string;
    header: string;
    icon: string;
    titleSize: 'sm' | 'base';
    titleClass?: string;
    button: string;
  }
> = {
  default: {
    card: 'border-slate-100',
    header: 'border-b border-slate-100',
    icon: 'h-9 w-9 bg-primary/10',
    titleSize: 'sm',
    button: '',
  },
  presence: {
    card: 'border-slate-100',
    header: 'border-b border-slate-100 bg-slate-50/60',
    icon: 'h-10 w-10 bg-primary/10',
    titleSize: 'sm',
    button: '',
  },
  onlineVisit: {
    card: 'border-primary/25 ring-1 ring-primary/10 shadow-md',
    header: 'border-b border-primary/15 bg-gradient-to-l from-primary/[0.08] via-sky-50/40 to-white',
    icon: 'h-10 w-10 bg-primary/15 ring-1 ring-primary/10',
    titleSize: 'base',
    titleClass: 'text-primary',
    button: '!h-12 !font-semibold shadow-md shadow-primary/15',
  },
};

export const ServiceCard = (props: ServiceCardProps) => {
  const { header, footer, body, alert, variant = 'default' } = props;
  const styles = variantStyles[variant];
  const isOnlineVisit = variant === 'onlineVisit';

  return (
    <Card
      className={classNames(
        'space-y-3 overflow-hidden !rounded-2xl border !p-0 !py-4 shadow-card md:!rounded-2xl',
        styles.card,
      )}
    >
      {header && (
        <div className={classNames('flex items-start justify-between gap-3 px-4 pb-4 pt-0.5', styles.header)}>
          <div className="flex min-w-0 items-start gap-2.5">
            {header.icon && (
              <div
                className={classNames(
                  'flex shrink-0 items-center justify-center rounded-xl text-primary',
                  styles.icon,
                )}
              >
                {header.icon}
              </div>
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
              <Text fontWeight="bold" fontSize={styles.titleSize} className={styles.titleClass}>
                {header.title}
              </Text>
              {header.subtitle && (
                <Text fontSize="xs" className="text-slate-500">
                  {header.subtitle}
                </Text>
              )}
            </div>
          </div>
          {header.hint && (
            <Text fontWeight="semiBold" fontSize="sm" className="shrink-0 text-slate-900">
              {header.hint}
            </Text>
          )}
        </div>
      )}
      {body?.content}
      <ServiceBulletList items={body?.description ?? []} tone={body?.bulletTone ?? (isOnlineVisit ? 'enhanced' : 'default')} />
      {alert && <div className="px-4">{alert}</div>}
      {footer && (
        <div className="space-y-3 px-4 pb-0.5">
          {footer.actions?.map((action, index) => (
            <Button
              block
              key={index}
              loading={action.loading}
              variant={isOnlineVisit ? 'primary' : undefined}
              {...(action.icon && { icon: action.icon })}
              onClick={action.onClick}
              className={classNames(styles.button, action.className ?? '')}
            >
              <div className="flex w-full items-center justify-between">
                <Text fontWeight={isOnlineVisit ? 'semiBold' : undefined}>{action.text}</Text>
                <div className="flex items-center space-s-3">
                  {action.hint && <Text fontWeight="semiBold">{action.hint}</Text>}
                  <ChevronIcon dir="left" />
                </div>
              </div>
            </Button>
          ))}
          {footer.component}
        </div>
      )}
    </Card>
  );
};

export default ServiceCard;
