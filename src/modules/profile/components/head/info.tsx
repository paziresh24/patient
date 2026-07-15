import Avatar from '@/common/components/atom/avatar/avatar';
import Text from '@/common/components/atom/text/text';
import DoctorIcon from '@/common/components/icons/doctor';
import EditIcon from '@/common/components/icons/edit';
import classNames from '@/common/utils/classNames';
import EditButton from '../viewAs/editButton';

interface InfoProps {
  image: string;
  imageAlt?: string;
  displayName: string;
  title?: string;
  subTitle?: string;
  editable?: boolean;
  editAction?: () => void;
  className?: string;
}

export const Info = (props: InfoProps) => {
  const { image, imageAlt, displayName, title, subTitle, editable, editAction, className } = props;

  return (
    <div className={classNames('relative mt-4 flex flex-col gap-4 md:flex-row md:items-start', className)}>
      <div className="mx-auto shrink-0 md:mx-0">
        <div
          className={classNames(
            'relative rounded-full bg-gradient-to-br from-primary/15 via-white to-sky-50 p-1 shadow-lg ring-2 ring-white',
            {
              'cursor-pointer': editable,
            },
          )}
          {...(editable && { onClick: editAction })}
        >
          <Avatar
            width={104}
            height={104}
            className="h-[104px] w-[104px] border-[3px] border-white shadow-md md:h-[120px] md:w-[120px]"
            src={image}
            alt={imageAlt ?? displayName}
            name={displayName}
          />
          {editable && (
            <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
              <EditIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center text-center md:items-start md:text-right">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <DoctorIcon width={16} height={16} />
          پزشک
        </span>

        <Text as="h1" fontSize="lg" fontWeight="bold" className="leading-8 text-slate-900 md:text-2xl md:leading-9">
          {displayName}
        </Text>

        {title && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-700 md:justify-start">
            <DoctorIcon width={16} height={16} className="shrink-0 text-primary" />
            <Text fontSize="sm" fontWeight="semiBold">
              {title}
            </Text>
          </div>
        )}

        {subTitle && (
          <Text fontSize="sm" className="mt-1 text-slate-500">
            {subTitle}
          </Text>
        )}
      </div>

      {editable && <EditButton className="absolute left-0 top-0 md:left-4" onClick={editAction} />}
    </div>
  );
};

export default Info;
