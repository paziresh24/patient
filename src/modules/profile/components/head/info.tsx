import Avatar from '@/common/components/atom/avatar/avatar';
import Text from '@/common/components/atom/text/text';
import DoctorIcon from '@/common/components/icons/doctor';

interface InfoProps {
  image: string;
  displayName: string;
  title?: string;
  subTitle?: string;
}

export const Info = (props: InfoProps) => {
  const { image, displayName, title, subTitle } = props;
  return (
    <div className="flex p-4 rounded-xl bg-slate-50">
      <div className="flex items-center space-s-3">
        <Avatar width={85} height={85} className="border-2 border-slate-200" src={image} />
        <div className="flex flex-col space-y-2">
          <Text fontSize="lg" fontWeight="bold">
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
