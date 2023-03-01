import Divider from '@/common/components/atom/divider/divider';
import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import PhoneIcon from '@/common/components/icons/phone';
import classNames from '@/common/utils/classNames';
import { Center } from '../../types/selectCenter';
import PhoneNumberList from '../phoneNumberList/phoneNumberList';

interface CenterCardProps extends Center {
  onClick: (center: Center) => void;
}

export const CenterCard = (props: CenterCardProps) => {
  const { onClick, ...center } = props;
  const { id, isDisable, name, type, address, freeturn, phoneNumbers, availableTime, isAvailable = true } = center;

  return (
    <>
      <div
        onClick={() => !isDisable && isAvailable && onClick(center)}
        className={classNames('w-full rounded-lg border border-slate-200 cursor-pointer shadow-sm', {
          'cursor-auto': isDisable || !isAvailable,
        })}
      >
        <div className="p-4">
          <div className="flex items-center w-full">
            <div
              className={classNames('py-[0.5rem] rounded-md', {
                'bg-[#3861FB]/[0.2]': type === 'office' && !isDisable && isAvailable,
                'bg-[#FF620A]/[0.2]': type === 'hospital' && !isDisable && isAvailable,
                'bg-[#27BDA0]/[0.2]': type === 'consult' && !isDisable && isAvailable,
                'bg-slate-200 text-slate-500': isDisable || !isAvailable,
              })}
            >
              {type === 'office' && <OfficeIcon className="w-10 h-6" />}
              {type === 'hospital' && <HospitalIcon className="w-10 h-6" />}
              {type === 'consult' && <PhoneIcon className="w-10 h-6" />}
            </div>
            <div
              className={classNames(
                'mr-2 flex justify-between items-center text-black w-full p-[0.65rem] rounded-md  text-sm font-medium',
                {
                  'bg-[#3861FB]/[0.2]': type === 'office' && !isDisable && isAvailable,
                  'bg-[#FF620A]/[0.2]': type === 'hospital' && !isDisable && isAvailable,
                  'bg-[#27BDA0]/[0.2]': type === 'consult' && !isDisable && isAvailable,
                  'bg-slate-200 !text-slate-500': isDisable || !isAvailable,
                },
              )}
            >
              <Text className="line-clamp-1">{name}</Text>
              <ChevronIcon dir="left" className="min-w-fit" />
            </div>
          </div>
          {!!address && (
            <Text fontSize="sm" className="block w-full mt-4 text-slate-400 line-clamp-1">
              {address}
            </Text>
          )}
        </div>
        {freeturn && !isDisable && isAvailable && (
          <>
            <Divider />
            <div className="flex justify-between w-full p-4">
              <Text className="text-black/">{type === 'consult' ? 'زمان پاسخگویی' : 'اولین نوبت خالی'}:</Text>
              <Text className="block text-slate-500">{freeturn}</Text>
            </div>
          </>
        )}
        {!isAvailable && availableTime && (
          <>
            <Divider />
            <div className="w-full p-4">
              <Text fontSize="sm" align="center" fontWeight="medium" className="block text-slate-500">
                زمان نوبت دهی پزشک به پایان رسیده است!
              </Text>
            </div>
            <Divider />
            <div className="flex justify-between w-full p-4">
              <Text className="text-black/">نوبت دهی اینترنتی:</Text>
              <Text className="block text-slate-500">{availableTime}</Text>
            </div>
          </>
        )}
        {isDisable && (
          <>
            <Divider />
            <div className="w-full p-4">
              <Text fontSize="sm" align="center" fontWeight="medium" className="block text-slate-500">
                نوبت دهی اینترنتی در این {type === 'office' ? 'مطب' : 'مرکز'} غیر فعال است.
              </Text>
              <PhoneNumberList phoneNumbers={phoneNumbers} type={type} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CenterCard;
