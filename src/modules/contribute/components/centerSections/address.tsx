import Modal from '@/common/components/atom/modal';
import TextField from '@/common/components/atom/textField';
import useModal from '@/common/hooks/useModal';
import { Dispatch, SetStateAction, useState } from 'react';
import AddButton from '../addButton';
import DislikeButton from '../dislikeButton';
import { CenterInfoData, EditCenterInfo } from '../editCenterInfo';
import LikeButton from '../likeButton';

interface AddressSectionProps {
  addresses: CenterInfoData[];
  setAddresses: Dispatch<SetStateAction<CenterInfoData[]>>;
  defaultAddress: CenterInfoData;
}

export const AddressSection = (props: AddressSectionProps) => {
  const { setAddresses, addresses, defaultAddress } = props;
  const {
    handleOpen: handleOpenInsertAddressModal,
    handleClose: handleCloseInsertAddressModal,
    modalProps: insertAddressModalProps,
  } = useModal();
  const {
    handleOpen: handleOpenEditAddressModal,
    handleClose: handleCloseEditAddressModal,
    modalProps: editAddressModalProps,
  } = useModal();
  const [addressDataForEdit, setAddressDataForEdit] = useState<{
    index: number;
    data: CenterInfoData;
  }>({
    index: 0,
    data: {},
  });

  const handleAddAddress = (center: CenterInfoData) => {
    setAddresses(prev => [...prev, { ...center, status: 'add', default: false }]);
    handleCloseInsertAddressModal();
  };
  const handleEditAddress = (center: CenterInfoData, index: number) => {
    handleOpenEditAddressModal();
    setAddressDataForEdit({ index, data: center });
  };

  const handleSubmitEditAddress = (center: CenterInfoData) => {
    handleCloseEditAddressModal();
    const newAddresses = addresses.map((item, index) => (index === addressDataForEdit.index ? center : item));
    setAddresses(newAddresses);
  };
  const handleAddressStatus = (address: any, type: 'like' | 'dislike') => {
    setAddresses(
      addresses.map(items => ({
        ...items,
        ...(items.address === address.address && { status: items?.status !== type ? type : undefined }),
      })),
    );
  };

  const getStatus = (location: CenterInfoData) => {
    return addresses.find(item => item.address === location.address)?.status;
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {addresses.some(item => item.address) &&
          addresses.map(
            (location, index) =>
              location.address && (
                <div key={location.address} className="flex items-end w-full space-s-2">
                  <TextField
                    label={index === 0 ? 'آدرس فعلی مرکز درمانی' : 'آدرس جدید مرکز درمانی'}
                    size="small"
                    defaultValue={location.address}
                    multiLine
                    onClick={() => index !== 0 && handleEditAddress(location, index)}
                    readOnly
                    className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]"
                  />
                  {location.default && (
                    <div className="relative flex grid flex-col justify-center gap-2 top-2">
                      <LikeButton onClick={() => handleAddressStatus(location, 'like')} fill={getStatus(location) === 'like'} />
                      <DislikeButton
                        onClick={() => {
                          handleAddressStatus(location, 'dislike');
                          (location.status === 'like' || !location.status) && handleOpenInsertAddressModal();
                        }}
                        fill={getStatus(location) === 'dislike'}
                      />
                    </div>
                  )}
                </div>
              ),
          )}
        {addresses.every(item => !item.address) && <AddButton text="افزودن آدرس جدید" onClick={() => handleOpenInsertAddressModal()} />}
      </div>
      <Modal title="آدرس پیشنهادی شما" {...insertAddressModalProps}>
        <EditCenterInfo
          onSubmit={handleAddAddress}
          onCancel={() => handleCloseInsertAddressModal()}
          defaultValues={{
            city: defaultAddress.city,
            province: defaultAddress.province,
            lat: defaultAddress.lat,
            lng: defaultAddress.lng,
          }}
        />
      </Modal>
      <Modal title="آدرس پیشنهادی شما" {...editAddressModalProps}>
        <EditCenterInfo
          onSubmit={handleSubmitEditAddress}
          onCancel={() => handleCloseEditAddressModal()}
          defaultValues={{
            address: addressDataForEdit.data.address,
            city: addressDataForEdit.data.city,
            province: addressDataForEdit.data.province,
            lat: addressDataForEdit.data.lat,
            lng: addressDataForEdit.data.lng,
          }}
        />
      </Modal>
    </>
  );
};
