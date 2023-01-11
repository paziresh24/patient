import Button from '@/common/components/atom/button/button';
import Divider from '@/common/components/atom/divider/divider';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import clsx from 'clsx';
import { useState } from 'react';
import { Center } from '../../types/selectCenter';

interface CenterCardProps extends Center {
  onClick: (center: Center) => void;
}

export const CenterCard = (props: CenterCardProps) => {
  const { onClick, ...center } = props;
  const { id, isDisable, name, type, address, freeturn, phoneNumbers, availableTime, isAvailable = true } = center;

  const [phoneNumberModal, setPhoneNumberModal] = useState(false);
  return (
    <>
      <div
        onClick={() => !isDisable && isAvailable && onClick(center)}
        className={clsx('w-full rounded-lg border border-slate-200 cursor-pointer shadow-sm', {
          'cursor-auto': isDisable || !isAvailable,
        })}
      >
        <div className="p-4">
          <div className="flex items-center w-full">
            <div
              className={clsx('py-[0.5rem] rounded-md', {
                'bg-[#3861FB]/[0.1]': type === 'office' && !isDisable && isAvailable,
                'bg-[#27BDA0]/[0.1]': type === 'hospital' && !isDisable && isAvailable,
                'bg-slate-200': isDisable || !isAvailable,
              })}
            >
              {type === 'office' ? (
                <OfficeIcon className={clsx('w-10 h-6', { 'text-slate-500': isDisable })} />
              ) : (
                <HospitalIcon className={clsx('w-10 h-6', { 'text-slate-500': isDisable })} />
              )}
            </div>
            <Text
              className={clsx('mr-2 text-black w-full p-[0.65rem] rounded-md line-clamp-1 text-sm font-medium', {
                'bg-[#3861FB]/[0.1]': type === 'office' && !isDisable && isAvailable,
                'bg-[#27BDA0]/[0.1]': type === 'hospital' && !isDisable && isAvailable,
                'bg-slate-200 !text-slate-500': isDisable || !isAvailable,
              })}
            >
              {name}
            </Text>
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
              <Text className="text-black/">اولین نوبت خالی:</Text>
              <Text className="block text-slate-500">{freeturn}</Text>
            </div>
          </>
        )}
        {!isAvailable && availableTime && (
          <>
            <Divider />
            <div className="w-full p-4">
              <Text fontSize="sm" align="center" fontWeight="medium" className="block text-slate-400">
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
              <Text fontSize="sm" align="center" fontWeight="medium" className="block text-slate-400">
                نوبت دهی اینترنتی در این {type === 'office' ? 'مطب' : 'مرکز'} غیر فعال است.
              </Text>
              {!!phoneNumbers?.length && (
                <Button
                  block
                  size="sm"
                  onClick={() => setPhoneNumberModal(true)}
                  className="!bg-white !border-[#5c8afe] !text-[#3861FB] mt-4 pointer-events-auto"
                >
                  تماس تلفنی با مرکز درمانی / مطب پزشک
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      <Modal
        title=" تماس تلفنی با مرکز درمانی / مطب پزشک"
        isOpen={phoneNumberModal}
        onClose={() => {
          setPhoneNumberModal(false);
        }}
      >
        <div className="flex flex-col space-y-2">
          {phoneNumbers?.map((cell, index) => (
            <Button
              key={index}
              block
              size="sm"
              onClick={() => (location.href = `tel:${cell}`)}
              className="!bg-white !border-[#5c8afe] !text-[#3861FB]"
            >
              {cell}
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default CenterCard;
