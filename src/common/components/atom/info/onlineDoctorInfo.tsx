import classNames from '@/common/utils/classNames';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo/doctorInfo';
import Badge from '../badge/badge';
import Divider from '../divider/divider';
import Text from '../text/text';

interface InfoProp {
  firstName: string;
  lastName: string;
  avatar: string;
  expertise: string;
  desciription: string;
  wrapperClassName?: string;
  isLoading?: boolean;
}

export const OnlineDoctorInfo = (props: InfoProp) => {
  const { avatar, expertise, firstName, lastName, desciription, wrapperClassName, isLoading = false } = props;

  return (
    <div
      className={classNames('flex flex-col mx-auto p-4 space-y-1 bg-white w-full  border border-solid border-primary', wrapperClassName)}
    >
      <div className="flex justify-around items-start">
        <DoctorInfo avatar={avatar} firstName={firstName} lastName={lastName} expertise={expertise} isLoading={isLoading} />
        <Badge
          text="ویزیت آنلاین"
          className="bg-[#f9f8fd] !rounded-md translate-x-[-0.5rem] translate-y-[-0.2rem] text-[0.75rem] text-[#56d4bf] p-2 whitespace-nowrap"
        />
      </div>
      {!isLoading && (
        <>
          <Divider className="!my-2" />
          <Text
            fontWeight="semiBold"
            dangerouslySetInnerHTML={{ __html: desciription }}
            className="text-[#77777c] !leading-7 text-justify lg:text-[0.75rem] text-sm"
          />
        </>
      )}
    </div>
  );
};

export default OnlineDoctorInfo;
