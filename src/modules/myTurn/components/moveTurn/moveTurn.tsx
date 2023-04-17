import Button from '@/common/components/atom/button/button';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import useModal from '@/common/hooks/useModal';
import convertTimeStampToFormattedTime from '@/common/utils/convertTimeStampToFormattedTime';
import convertTimeStampToPersianDate from '@/common/utils/convertTimeStampToPersianDate';
import SelectTimeWrapper from '@/modules/booking/views/selectTime/wrapper';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MoveTurnProps {
  centerId: string;
  serviceId: string;
  userCenterId: string;
  currentDate: number;
  handleMove: ({ timeId, timeStamp }: { timeId: string; timeStamp: number }) => void;
  loading?: boolean;
  events: any;
}

export const MoveTurn = (props: MoveTurnProps) => {
  const { handleMove, currentDate, loading, events, ...turnInfo } = props;
  const [freeTurnInfo, setFreeTurnInfo] = useState<{ timeId?: string; timeStamp?: number; timeText?: string }>({});
  const { handleOpen: handleOpenConfirmModal, handleClose: handleCloseConfirmModal, modalProps: confirmModalProps } = useModal();

  const getTimeAndDate = (timestamp: number) => `${convertTimeStampToPersianDate(timestamp)} ${convertTimeStampToFormattedTime(timestamp)}`;

  return (
    <>
      <SelectTimeWrapper
        {...turnInfo}
        onSubmit={({ timeId, timeStamp, timeText }) => {
          setFreeTurnInfo({ timeId, timeStamp, timeText });
          handleOpenConfirmModal();
        }}
        events={events}
        onFirstFreeTimeError={errorText => toast.error(errorText)}
      />
      <Modal {...confirmModalProps} noHeader bodyClassName="space-y-3">
        <Text fontWeight="semiBold">
          آیا از جابجایی نوبت خود از {currentDate} به زمان {getTimeAndDate(freeTurnInfo?.timeStamp ?? 0)} اطمینان دارید؟
        </Text>
        <div className="flex items-center space-s-3">
          <Button
            block
            loading={loading}
            onClick={() => handleMove({ timeId: freeTurnInfo.timeId ?? '', timeStamp: freeTurnInfo.timeStamp ?? 0 })}
          >
            تایید
          </Button>
          <Button block variant="secondary" onClick={handleCloseConfirmModal}>
            انصراف
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MoveTurn;
