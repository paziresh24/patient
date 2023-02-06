import Button from '@/common/components/atom/button/button';
import Modal from '@/common/components/atom/modal/modal';
import useModal from '@/common/hooks/useModal';

interface PhoneNumberListProps {
  phoneNumbers?: string[];
  type?: 'office' | 'hospital' | 'consult';
}

export const PhoneNumberList = (props: PhoneNumberListProps) => {
  const { phoneNumbers = [], type } = props;
  const { handleOpen, modalProps } = useModal();

  const phoneTitle = type ? `تماس تلفنی با ${type === 'hospital' ? 'مرکز درمانی' : 'مطب پزشک'}` : `تماس تلفنی با مرکز درمانی / مطب پزشک`;

  if (!phoneNumbers?.length) return null;
  return (
    <>
      <Button block size="sm" onClick={handleOpen} className="!bg-white !border-[#5c8afe] !text-[#3861FB] mt-4 pointer-events-auto">
        {phoneTitle}
      </Button>
      <Modal title={phoneTitle} {...modalProps}>
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

export default PhoneNumberList;
