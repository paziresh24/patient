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
        <div
          className={classNames('p-3', {
            "relative after:content-[''] opacity-65 after:absolute after:inset-0 after:pointer-events-none after:[background-image:repeating-linear-gradient(135deg,rgba(0,0,0,0.05)_0_2px,transparent_2px_7px)]":
              isDisable,
          })}
        >
          <div className="flex items-center w-full">
            <div className={classNames('flex justify-between items-center w-full text-sm')}>
              <Text className={classNames('line-clamp-1 font-semibold', { 'text-primary': !isDisable })}>{name}</Text>
              <ChevronIcon dir="left" className="min-w-2" />
            </div>
          </div>
          {!!address && (
            <Text fontSize="xs" className="w-full mt-1 text-slate-400 line-clamp-1">
              {address}
            </Text>
          )}
        </div>
        {(!!freeturn || !!waitingTimeInfo?.waiting_time_title) && !isDisable && isAvailable && (
          <div className="pb-3">
            <Divider className="mb-3" />
            {freeturn && (
              <div className="flex justify-between w-full px-3">
                <Text className="text-black/">{type === 'consult' ? 'زمان پاسخگویی' : 'اولین نوبت خالی'}:</Text>
                <Text className="block" fontWeight="semiBold">
                  {freeturn}
                </Text>
              </div>
            )}
            {!!waitingTimeInfo?.waiting_time_title && (
              <Text fontSize="xs" className="block w-full px-3 mt-1 text-slate-600">
                میانگین زمان انتظار ویزیت: <strong>{waitingTimeInfo?.waiting_time_title}</strong>
              </Text>
            )}
          </div>
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
            <div className="w-full p-3">
              <Text fontSize="sm" align="center" fontWeight="bold" className="block">
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
