import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import clsx from 'clsx';
import { useState } from 'react';

interface CenterProps {
  id: string;
  name: string;
  address?: string;
  freeturn?: string;
  disable: boolean;
  type: 'office' | 'hospital';
  centerNumber?: string[];
}

export const SelectCenter = (props: CenterProps) => {
  const { id, name, address, freeturn, disable, type, centerNumber } = props;
  const [centerPhoneNumberModal, setCenterPhoneNumberModal] = useState(false);

  return (
    <>
      <div className={clsx('w-full h-auto rounded-lg bg-white border-[#DAE4FF] cursor-pointer', { 'pointer-events-none': disable })}>
        <div className="p-4">
          <div className="w-full flex items-center">
            <div
              className={clsx('py-[0.5rem] px-[0.1  rem] rounded-md', {
                'bg-[#3861FB]/[0.1]': type === 'office' && !disable,
                'bg-[#27BDA0]/[0.1]': type === 'hospital' && !disable,
                'bg-[#0F1D40]/[0.1]': disable,
              })}
            >
              {type === 'office' ? (
                <OfficeIcon className={clsx('w-12 h-7', { 'text-[#8C93A3]': disable })} />
              ) : (
                <HospitalIcon className={clsx('w-12 h-7', { 'text-[#8C93A3]': disable })} />
              )}
            </div>
            <Text
              className={clsx('mr-2 text-black  w-full p-[0.65rem] rounded-md', {
                'bg-[#3861FB]/[0.1]': type === 'office' && !disable,
                'bg-[#27BDA0]/[0.1]': type === 'hospital' && !disable,
                'bg-[#0F1D40]/[0.1] text-[#0F1D40]/[0.6]': disable,
              })}
            >
              {name}
            </Text>
          </div>
          {!!address && (
            <Text fontSize="sm" className="block text-black/[0.4] mt-4 whitespace-nowrap overflow-hidden text-ellipsis w-full">
              {address}
            </Text>
          )}
        </div>
        {freeturn && !disable && (
          <>
            <Divider />
            <div className="w-full p-4 flex justify-between">
              <Text className="text-black/">اولین نوبت خالی:</Text>
              <Text className="block text-black/[0.4]">{freeturn}</Text>
            </div>
          </>
        )}
        {disable && (
          <>
            <Divider />
            <div className="w-full p-4">
              <Text fontSize="sm" align="center" fontWeight="medium" className="block text-[#B2B7C2]">
                {` نوبت دهی اینترنتی در این ${type === 'office' ? 'مطب' : 'مرکز'} غیر فعال است.`}
              </Text>
              {!!centerNumber?.length && (
                <Button
                  block
                  size="sm"
                  onClick={() => setCenterPhoneNumberModal(true)}
                  className="!bg-white !border-[#5c8afe] !text-[#3861FB] mt-4"
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
        isOpen={centerPhoneNumberModal}
        onClose={() => {
          setCenterPhoneNumberModal(false);
        }}
      >
        {centerNumber?.map((cell, index) => (
          <Button
            key={index}
            block
            size="sm"
            onClick={() => (location.href = `tel:${cell}`)}
            className="!bg-white !border-[#5c8afe] !text-[#3861FB] mt-2"
          >
            {cell}
          </Button>
        ))}
      </Modal>
    </>
  );
};

export default SelectCenter;
