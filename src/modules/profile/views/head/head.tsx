import Chips from '@/common/components/atom/chips/chips';
import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import EyeIcon from '@/common/components/icons/eye';
import classNames from '@/common/utils/classNames';
import { convertLongToCompactNumber } from '@/common/utils/convertLongToCompactNumber';
import ToolBar, { ToolBarItems } from '../../components/head/toolBar';
import EditButton from '../../components/viewAs/editButton';
import { ReactNode } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import Info from '../../components/head/info';

interface HeadProps {
  image: string;
  imageAlt?: string;
  displayName: string;
  title?: string;
  subTitle: string;
  serviceList?: string[];
  pageViewCount?: number;
  toolBarItems?: ToolBarItems;
  className?: string;
  editable?: boolean;
  infoEditAction?: () => void;
  servicesEditAction?: () => void;
  children?: ReactNode;
}

export const Head = (props: HeadProps) => {
  const {
    displayName,
    image,
    imageAlt,
    title,
    subTitle,
    serviceList,
    pageViewCount,
    toolBarItems,
    className,
    editable,
    infoEditAction,
    servicesEditAction,
    children,
  } = props;

  return (
    <section className={classNames('overflow-hidden bg-white shadow-card md:rounded-2xl', className)}>
      <div className="relative bg-gradient-to-l from-primary/10 via-sky-50/80 to-white px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
        <div className="relative flex items-center justify-between gap-3">
          {toolBarItems && <ToolBar items={toolBarItems} />}
          {pageViewCount != null && pageViewCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-slate-600 shadow-sm">
              <EyeIcon width={18} height={18} />
              <Text fontSize="sm" fontWeight="medium">
                {convertLongToCompactNumber(pageViewCount)} بازدید
              </Text>
            </div>
          )}
        </div>

        <Info
          image={image}
          imageAlt={imageAlt}
          displayName={displayName}
          title={title}
          subTitle={subTitle}
          editable={editable}
          editAction={infoEditAction}
        />
      </div>

      {serviceList?.length === 0 && editable && (
        <div className="border-t border-slate-100 px-4 py-4 md:px-6">
          <div
            onClick={servicesEditAction}
            className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-4 text-slate-400 transition-all hover:bg-slate-100/80 space-s-2"
          >
            <AddIcon className="h-5 w-5" />
            <Text fontWeight="medium">افزودن تخصص</Text>
          </div>
        </div>
      )}

      {!!serviceList?.length && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 md:px-6">
          <Text fontSize="xs" fontWeight="semiBold" className="mb-3 text-slate-500">
            تخصص‌ها
          </Text>
          <ScrollContainer
            className={classNames('flex items-center gap-2 pb-0.5', {
              'justify-center': serviceList.length === 1,
            })}
          >
            {editable && <EditButton className="ml-1 shrink-0" onClick={servicesEditAction} />}
            {serviceList.map(service => (
              <Chips
                key={service}
                className="min-w-fit w-max whitespace-nowrap !rounded-full border border-primary/20 !bg-white !px-3.5 !py-1.5 !text-sm !text-slate-700 shadow-sm"
              >
                {service}
              </Chips>
            ))}
          </ScrollContainer>
        </div>
      )}

      {children}
    </section>
  );
};

export default Head;
