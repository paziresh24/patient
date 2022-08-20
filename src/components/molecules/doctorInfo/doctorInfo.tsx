import Aavatar from '../../atoms/avatar';
import Text from '../../atoms/text';

interface DoctorInfoProps {
    /**
     * Avatar src (url)
     */
    avatar: string;
    firstName: string;
    lastName: string;
    expertise?: string;
    className?: string;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = props => {
    const { avatar, firstName, lastName, expertise, className } = props;
    return (
        <div className={`flex items-center ${className ?? ''}`}>
            <Aavatar src={avatar} />
            <div className="flex flex-col mr-4">
                <Text
                    fontSize="sm"
                    fontWeight="bold"
                    className="line-clamp-1"
                    data-testid="doctor-info__full-name"
                >
                    {firstName} {lastName}
                </Text>
                {expertise && (
                    <Text
                        fontSize="xs"
                        className="mt-2 line-clamp-1"
                        data-testid="doctor-info__expertise"
                    >
                        {expertise}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default DoctorInfo;
