import Modal from '@/common/components/atom/modal';
import TextField from '@/common/components/atom/textField';
import { Dispatch, SetStateAction, useState } from 'react';
import AddButton from '../addButton';
import { CenterInfoData, EditCenterInfo } from '../editCenterInfo';
import RemoveButton from '../removeButton';

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

  const handleRemoveField = (index: number) => {
    const addRemovePropperty =
      index !== 0 ? addresses.filter((_, i) => i !== index) : addresses.map((item, i) => (i !== index ? item : { ...item, removed: true }));

    setAddresses(addRemovePropperty);
  };

  const handleAddAddress = (center: CenterInfoData) => {
    setAddresses(prev => [...prev, center]);
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

  return (
    <>
      <div className="flex flex-col items-start space-y-3">
        {addresses.map(
          (location, index) =>
            !location.removed && (
              <div key={location.address} className="flex items-end space-s-2 w-full">
                <TextField
                  label={index === 0 ? 'آدرس فعلی' : 'آدرس جدید'}
                  size="small"
                  defaultValue={location.address}
                  multiLine
                  onClick={() => handleEditAddress(location, index)}
                  readOnly
                  className="shadow-[0px_1px_19px_-2px_#0000001A] border-[#D7DFFE]"
                />
                <RemoveButton onClick={() => handleRemoveField(index)} />
              </div>
            ),
        )}

        {addresses.length < 2 && <AddButton text="افزودن آدرس جدید" onClick={() => setInsertAddressModal(true)} />}
      </div>
      <Modal isOpen={insertAddressModal} onClose={setInsertAddressModal}>
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
      <Modal isOpen={editAddressModal} onClose={setEditAddressModal}>
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
