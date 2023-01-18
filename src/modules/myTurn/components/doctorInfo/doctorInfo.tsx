import Skeleton from '@/common/components/atom/skeleton';
import Aavatar from '@/components/atom/avatar';
import Text from '@/components/atom/text';

interface DoctorInfoProps {
  /**
   * Avatar src (url)
   */
  avatar: string;
  firstName: string;
  lastName: string;
  expertise?: string;
  className?: string;
  isLoading?: boolean;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = props => {
  const { avatar, firstName, lastName, expertise, className, isLoading = false } = props;
  return (
    <div className={`flex items-center space-s-3 ${className ?? ''}`}>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <Aavatar src={avatar} />
          <div className="flex flex-col">
            <Text fontSize="sm" fontWeight="bold" className="line-clamp-1" data-testid="doctor-info__full-name">
              {firstName} {lastName}
            </Text>
            {expertise && (
              <Text fontSize="xs" className="mt-2 line-clamp-1" data-testid="doctor-info__expertise">
                {expertise}
              </Text>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <>
      <Skeleton w="4.4rem" h="4.4rem" rounded="full" />
      <div className="flex flex-col mr-4 space-y-3">
        <Skeleton w="7rem" h="1rem" rounded="full" />
        <Skeleton w="4rem" h="1rem" rounded="full" />
      </div>
    </>
  );
};

export default DoctorInfo;
