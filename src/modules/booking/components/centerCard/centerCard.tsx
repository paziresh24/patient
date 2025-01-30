import Divider from '@/common/components/atom/divider/divider';
import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import PhoneIcon from '@/common/components/icons/phone';
import classNames from '@/common/utils/classNames';
import Notification from '@/modules/profile/components/notification/notification';
import { Center } from '../../types/selectCenter';
import PhoneNumberList from '../phoneNumberList/phoneNumberList';

interface CenterCardProps extends Center {
  onClick: (center: Center) => void;
}

export const CenterCard = (props: CenterCardProps) => {
  const { onClick, ...center } = props;
  const { id, isDisable, name, type, address, freeturn, phoneNumbers, availableTime, isAvailable = true, waitingTimeInfo } = center;

  return (
    <>
      <div
        onClick={() => !isDisable && isAvailable && onClick(center)}
        className={classNames('w-full rounded-lg border border-slate-200 cursor-pointer shadow-sm', {
          'cursor-default': isDisable || !isAvailable,
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
              <ChevronIcon dir="left" className="min-w-2" />
            </div>
          </div>
          {!!address && (
            <Text fontSize="sm" className="block w-full mt-4 text-slate-400 line-clamp-1">
              {address}
            </Text>
          )}
        </div>
        {(!!freeturn || !!waitingTimeInfo?.waiting_time_title) && !isDisable && isAvailable && (
          <>
            <Divider className="mb-4" />
            {freeturn && (
              <div className="flex justify-between w-full px-4 mb-2">
                <Text className="text-black/">{type === 'consult' ? 'زمان پاسخگویی' : 'اولین نوبت خالی'}:</Text>
                <Text className="block text-slate-500">{freeturn}</Text>
              </div>
            )}
            {!!waitingTimeInfo?.waiting_time_title && (
              <Text fontSize="sm" className="block w-full px-4 pb-4 text-slate-600">
                طبق نظر بیماران قبلی، میانگین زمان انتظار ویزیت: <strong>{waitingTimeInfo?.waiting_time_title}</strong>
              </Text>
            )}
          </>
        )}
        {!isAvailable && availableTime && (
          <>
            <Divider />
            <Notification
              centerId={center.id}
              serviceId={center.services[0].id}
              userCenterId={center.services[0].user_center_id}
              availalbeTime={availableTime}
            />
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
