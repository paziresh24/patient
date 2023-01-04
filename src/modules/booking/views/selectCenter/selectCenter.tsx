import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import HospitalIcon from '@/common/components/icons/hospital';
import OfficeIcon from '@/common/components/icons/office';
import clsx from 'clsx';
import { useState } from 'react';
import { Center } from '../../types/selectCenter';

interface CenterProps {
  centers: Center[];
  onSelect: (center: Center) => void;
}

export const SelectCenter = (props: CenterProps) => {
  const { centers, onSelect } = props;
  const [phoneNumberModal, setPhoneNumberModal] = useState(false);

  const handleSelectCenter = (center: Center) => {
    onSelect(center);
  };

  return (
    <>
      {centers.map((center, index) => (
        <>
          <div
            key={center.id}
            onClick={() => handleSelectCenter(center)}
            className={clsx('w-full rounded-lg bg-white border-[#DAE4FF] cursor-pointer', {
              'pointer-events-none': center.isDisable,
              'mt-3': index != 0,
            })}
          >
            <div className="p-4">
              <div className="w-full flex items-center">
                <div
                  className={clsx('py-[0.5rem] px-[0.1  rem] rounded-md', {
                    'bg-[#3861FB]/[0.1]': center.type === 'office' && !center.isDisable,
                    'bg-[#27BDA0]/[0.1]': center.type === 'hospital' && !center.isDisable,
                    'bg-[#0F1D40]/[0.1]': center.isDisable,
                  })}
                >
                  {center.type === 'office' ? (
                    <OfficeIcon className={clsx('w-12 h-7', { 'text-[#8C93A3]': center.isDisable })} />
                  ) : (
                    <HospitalIcon className={clsx('w-12 h-7', { 'text-[#8C93A3]': center.isDisable })} />
                  )}
                </div>
                <Text
                  className={clsx('mr-2 text-black  w-full p-[0.65rem] rounded-md', {
                    'bg-[#3861FB]/[0.1]': center.type === 'office' && !center.isDisable,
                    'bg-[#27BDA0]/[0.1]': center.type === 'hospital' && !center.isDisable,
                    'bg-[#0F1D40]/[0.1] text-[#0F1D40]/[0.6]': center.isDisable,
                  })}
                >
                  {center.name}
                </Text>
              </div>
              {!!center.address && (
                <Text fontSize="sm" className="block text-black/[0.4] mt-4 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {center.address}
                </Text>
              )}
            </div>
            {center.freeturn && !center.isDisable && (
              <>
                <Divider />
                <div className="w-full p-4 flex justify-between">
                  <Text className="text-black/">اولین نوبت خالی:</Text>
                  <Text className="block text-black/[0.4]">{center.freeturn}</Text>
                </div>
              </>
            )}
            {center.isDisable && (
              <>
                <Divider />
                <div className="w-full p-4">
                  <Text fontSize="sm" align="center" fontWeight="medium" className="block text-[#B2B7C2]">
                    نوبت دهی اینترنتی در این {center.type === 'office' ? 'مطب' : 'مرکز'} غیر فعال است.
                  </Text>
                  {!!center.phoneNumbers?.length && (
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
            {center.phoneNumbers?.map((cell, index) => (
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
      ))}
    </>
  );
};

export default SelectCenter;
