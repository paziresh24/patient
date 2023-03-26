import Avatar from '@/common/components/atom/avatar/avatar';
import Text from '@/common/components/atom/text/text';
import DoctorIcon from '@/common/components/icons/doctor';
import EditIcon from '@/common/components/icons/edit';

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
    <div className="flex p-4 rounded-xl bg-slate-50 relative">
      {editable && <EditIcon className="absolute left-4 w-5 h-5 cursor-pointer" onClick={editAction} />}
      <div className="flex items-center space-s-3">
        <Avatar width={85} height={85} className="border-2 border-slate-200" src={image} />
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
          <Text fontSize="xs">{subTitle}</Text>
        </div>
      </div>
    </div>
  );
};

export default Info;
