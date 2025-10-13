import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { useGetPermissions } from '@/modules/hamdast/apis/permissions';
import React, { useEffect } from 'react';

export default function Permissions({ onClose }: { onClose?: () => void }) {
  const { handleOpen, handleClose, modalProps } = useModal({ onClose });
  const { isError, error } = useGetPermissions({});

  useEffect(() => {
    const status = (error as any)?.response?.status;
    if (isError && status === 403) {
      handleOpen();
    }
  }, [isError]);

  return (
    <Modal {...modalProps} title="دسترسی مناسب نیست">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">{(error as any)?.response?.data?.reason}</span>
        <Button
          className="w-full"
          onClick={() => {
            onClose?.();
            handleClose();
          }}
        >
          متوجه شدم
        </Button>
      </div>
    </Modal>
  );
}
