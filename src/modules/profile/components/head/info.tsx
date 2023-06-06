import Avatar from '@/common/components/atom/avatar/avatar';
import Text from '@/common/components/atom/text/text';
import DoctorIcon from '@/common/components/icons/doctor';
import EditIcon from '@/common/components/icons/edit';
import classNames from '@/common/utils/classNames';
import Image from 'next/image';
import EditButton from '../viewAs/editButton';

interface InfoProps {
  image: string;
  displayName: string;
  title?: string;
  subTitle?: string;
  editable?: boolean;
  editAction?: () => void;
}

export const Info = (props: InfoProps) => {
  const { image, displayName, title, subTitle, editable, editAction } = props;
  return (
    <div
      className={classNames('relative flex p-4 rounded-lg bg-slate-50', {
        'border-2 border-slate-200 border-dashed': editable,
      })}
    >
      <div className="flex items-center space-s-3">
        <div
          className={classNames('relative', {
            'cursor-pointer': editable,
          })}
          {...(editable && {
            onClick: editAction,
          })}
        >
          <Avatar as={Image} priority={true} width={85} height={85} className="border-2 border-slate-200" src={image} />
          {editable && (
            <div className="absolute right-0 flex items-center justify-center w-6 h-6 border-2 rounded-full bg-slate-50 bottom-1 border-slate-200">
              <EditIcon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Text as="h1" fontSize="lg" fontWeight="bold">
            {displayName}
          </Text>
          {title && (
            <div className="flex items-center space-s-1">
              <DoctorIcon width={20} height={20} />
              <Text fontSize="sm" fontWeight="bold">
                {title}
              </Text>
            </div>
          )}
          <Text fontSize="xs" className="whitespace-nowrap">
            {subTitle}
          </Text>
        </div>
      </div>
      {editable && <EditButton className="md:absolute left-4" onClick={editAction} />}
    </div>
  );
};

export default Info;
