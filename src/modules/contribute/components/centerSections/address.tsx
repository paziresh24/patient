import Modal from '@/common/components/atom/modal';
import TextField from '@/common/components/atom/textField';
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
  const [insertAddressModal, setInsertAddressModal] = useState(false);
  const [editAddressModal, setEditAddressModal] = useState(false);
  const [addressDataForEdit, setAddressDataForEdit] = useState<{
    index: number;
    data: CenterInfoData;
  }>({
    index: 0,
    data: {},
  });

  const handleAddAddress = (center: CenterInfoData) => {
    setAddresses(prev => [...prev, { ...center, status: 'add', default: false }]);
    setInsertAddressModal(false);
  };
  const handleEditAddress = (center: CenterInfoData, index: number) => {
    setEditAddressModal(true);
    setAddressDataForEdit({ index, data: center });
  };

  const handleSubmitEditAddress = (center: CenterInfoData) => {
    setEditAddressModal(false);
    const newAddresses = addresses.map((item, index) => (index === addressDataForEdit.index ? center : item));
    setAddresses(newAddresses);
  };
  const handlePhoneStatus = (address: any, type: 'like' | 'dislike') => {
    setAddresses(addresses.map(items => ({ ...items, ...(items.address === address.address && { status: type }) })));
  };

  const getStatus = (type: string) => {
    return addresses.some((items: Pick<CenterInfoData, 'status'>) => items.status === type);
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {addresses.some(item => item.address) &&
          addresses.map(
            (location, index) =>
              location.address && (
                <div key={location.address} className="flex items-end space-s-2 w-full">
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
                    <div className="flex flex-col justify-center grid gap-2 relative top-2">
                      <LikeButton
                        onClick={() => handlePhoneStatus(location, 'like')}
                        currentColor={getStatus('like') ? '#00c700' : '#22282F'}
                      />
                      <DislikeButton
                        onClick={() => {
                          handlePhoneStatus(location, 'dislike');
                          setInsertAddressModal(true);
                        }}
                        currentColor={getStatus('dislike') ? '#ff0000' : '#22282F'}
                      />
                    </div>
                  )}
                </div>
              ),
          )}
        {addresses.every(item => !item.address) && <AddButton text="افزودن آدرس جدید" onClick={() => setInsertAddressModal(true)} />}
      </div>
      <Modal title="آدرس پیشنهادی شما" isOpen={insertAddressModal} onClose={setInsertAddressModal}>
        <EditCenterInfo
          onSubmit={handleAddAddress}
          onCancel={() => setInsertAddressModal(false)}
          defaultValues={{
            city: defaultAddress.city,
            province: defaultAddress.province,
            lat: defaultAddress.lat,
            lng: defaultAddress.lng,
          }}
        />
      </Modal>
      <Modal title="آدرس پیشنهادی شما" isOpen={editAddressModal} onClose={setEditAddressModal}>
        <EditCenterInfo
          onSubmit={handleSubmitEditAddress}
          onCancel={() => setEditAddressModal(false)}
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
