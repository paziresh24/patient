import Breadcrumbs from '@/common/components/atom/breadcrumbs';
import Card from '@/common/components/atom/card';
import Divider from '@/common/components/atom/divider';
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { HTMLAttributes, ReactNode } from 'react';

type BreadcrumbItem = {
  text: string;
  href?: string;
};

type LegalPageLayoutProps = {
  breadcrumbs: BreadcrumbItem[];
  title: ReactNode;
  headerExtra?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  lang?: string;
  dir?: 'rtl' | 'ltr';
  headerVariant?: 'card' | 'plain';
};

export const legalCardClassName = '!rounded-2xl !p-0 overflow-hidden';
export const legalCardBodyClassName = 'p-4 md:p-5';
export const legalStackClassName = 'flex flex-col gap-5 md:gap-6';
export const legalBodyStackClassName = 'flex flex-col gap-3';

export const LegalPageLayout = ({
  breadcrumbs,
  title,
  headerExtra,
  intro,
  children,
  lang,
  dir,
  headerVariant = 'card',
}: LegalPageLayoutProps) => {
  const isPlainHeader = headerVariant === 'plain';

  return (
    <div className="w-full min-h-full bg-[#F2F3F5]" lang={lang} dir={dir}>
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:max-w-4xl md:px-6 md:py-8">
        <Breadcrumbs className="mb-4 md:mb-5" items={breadcrumbs} dir={dir ?? 'rtl'} />

        {isPlainHeader ? (
          <header className="mb-5 md:mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-3">
                {title}
                {intro}
              </div>
              {headerExtra}
            </div>
          </header>
        ) : (
          <Card className={classNames(legalCardClassName, 'mb-5 shadow-card')}>
            <div className={legalCardBodyClassName}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">{title}</div>
                {headerExtra}
              </div>
              {intro && (
                <>
                  <Divider className="!my-4" />
                  {intro}
                </>
              )}
            </div>
          </Card>
        )}

        <div className={legalStackClassName}>{children}</div>
      </div>
    </div>
  );
};

export const LegalPageTitle = ({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) => (
  <Text as="h1" fontWeight="bold" fontSize="xl" className={classNames('text-slate-900 md:text-2xl', className)} {...rest}>
    {children}
  </Text>
);

export const LegalSectionTitle = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Text as="h2" fontWeight="bold" fontSize="sm" className={classNames('text-slate-900 md:text-base', className)}>
    {children}
  </Text>
);

export const LegalSectionCard = ({
  id,
  title,
  children,
  className,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <section id={id} className={classNames('scroll-mt-20', className)}>
    <Card className="!overflow-hidden !rounded-2xl !p-0 shadow-card">
      <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-3.5 md:px-5">
        <LegalSectionTitle>{title}</LegalSectionTitle>
      </div>
      {children}
    </Card>
  </section>
);

export default LegalPageLayout;
