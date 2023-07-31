import PrinterIcon from '@/common/components/icons/printer';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import Button from '@/components/atom/button';
import DropDown from '@/components/atom/dropDown';
import Modal from '@/components/atom/modal';
import ReceiptIcon from '@/components/icons/receipt';
import ShareIcon from '@/components/icons/share';
import ThreeDotsIcon from '@/components/icons/threeDots';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import DoctorInfo from '../../doctorInfo';
import TagStatus from '../../tagStatus';

interface TurnHeaderProps {
  id: string;
  doctorInfo: {
    avatar: string;
    firstName: string;
    lastName: string;
    expertise?: string;
    slug: string;
  };
  centerId: string;
  nationalCode: string;
  trackingCode: string;
  status: BookStatus;
  paymentStatus: PaymentStatus;
  centerType: CenterType;
}

export const TurnHeader: React.FC<TurnHeaderProps> = props => {
  const { id, doctorInfo, centerId, centerType, trackingCode, nationalCode, status, paymentStatus } = props;
  const router = useRouter();
  const { handleOpen: handleOpenRemoveModal, handleClose: handleCloseRemoveModal, modalProps: removeModalProps } = useModal();

  const { removeBook } = useBookStore();
  const { shareTurn, removeBookApi } = useBookAction();

  const shouldShowTagStatus = centerType === CenterType.consult ? status !== BookStatus.expired : status !== BookStatus.notVisited;

  const removeBookAction = () => {
    removeBookApi.mutate(
      {
        center_id: centerId,
        reference_code: trackingCode,
        national_code: nationalCode,
      },
      {
        onSuccess: data => {
          if (data.data.status === ClinicStatus.SUCCESS) {
            removeBook({ bookId: id });
            handleCloseRemoveModal();
            return;
          }
          toast.error(data.data.message);
        },
      },
    );
  };

  const receiptTurn = () => {
    router.push(`/receipt/${centerId}/${id}`);
  };

  const factorTurn = () => {
    router.push(`/invoice/${centerId}/${id}`);
  };

  const shareTurnInfo = () => {
    shareTurn({
      bookId: id,
      text: `رسید نوبت ${doctorInfo.firstName} ${doctorInfo.lastName}`,
      title: 'رسیدنوبت',
      centerId,
    });
  };

  const menuItems = [
    {
      id: 0,
      name: 'قبض نوبت',
      icon: <ReceiptIcon />,
      action: receiptTurn,
      shouldShow: true,
    },
    {
      id: 1,
      name: 'چاپ فاکتور',
      icon: <PrinterIcon />,
      action: factorTurn,
      shouldShow: status !== BookStatus.deleted && status !== BookStatus.notVisited && paymentStatus === PaymentStatus.paid,
    },
    {
      id: 2,
      name: 'اشتراک گذاری',
      icon: <ShareIcon />,
      action: shareTurnInfo,
      shouldShow: true,
    },
  ];

  return (
    <div className="relative flex flex-col items-end">
      <Link href={`/dr/${doctorInfo.slug}`} className="self-start w-9/12">
        <DoctorInfo
          avatar={doctorInfo.avatar}
          firstName={doctorInfo.firstName}
          lastName={doctorInfo.lastName}
          expertise={doctorInfo.expertise}
        />
      </Link>
      {shouldShowTagStatus && <TagStatus status={status} className="mx-5" />}
      {paymentStatus !== PaymentStatus.paying && (
        <DropDown
          element={
            <div
              className="absolute flex items-center justify-center w-8 h-8 -mx-3 cursor-pointer top-1"
              data-testid="turn-drop-down-button"
            >
              <ThreeDotsIcon color="#000" />
            </div>
          }
          items={menuItems.filter(item => item.shouldShow).map(({ shouldShow, ...item }) => ({ ...item }))}
        />
      )}

      <Modal title="آیا از لغو نوبت مطمئن هستید؟" {...removeModalProps}>
        <div className="flex space-s-2">
          <Button theme="error" block onClick={removeBookAction} loading={removeBookApi.isLoading} data-testid="modal__remove-turn-button">
            لغو نوبت
          </Button>
          <Button
            theme="error"
            variant="secondary"
            block
            onClick={() => handleCloseRemoveModal()}
            data-testid="modal__cancel-remove-turn-button"
          >
            انصراف
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TurnHeader;
