import { useState } from "react";
// import Modal from "@paziresh24/shared/ui/modal";
import DoctorInfo from "../../doctorInfo";
import TagStatus from "../../tagStatus";
import DropDown from "../../../atoms/dropDown";
import Button from "../../../atoms/button";
import { useBookStore } from "@/store";
import { useRemoveBook } from "@/apis/removeBook/hook";
import ShareIcon from "@/components/icons/share";
import TrashIcon from "@/components/icons/trash";
import ThreeDotsIcon from "@/components/icons/threeDots";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";
import { BookStatus } from "@/types/bookStatus";
import Modal from "@/components/atoms/modal";

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
}

export const TurnHeader: React.FC<TurnHeaderProps> = (props) => {
  const { id, doctorInfo, centerId, trackingCode, nationalCode, status } = props;

  const [removeModal, setRemoveModal] = useState(false);
  const { removeBook } = useBookStore();
  const removeBookApi = useRemoveBook();

  const shouldShowTurnMenu = status === BookStatus.notVisited;

  const removeBookAction = () => {
    removeBookApi.mutate(
      {
        center_id: centerId,
        reference_code: trackingCode,
        national_code: nationalCode,
      },
      {
        onSuccess: (data) => {
          if (data.data.status === 1) {
            setRemoveModal(false);
            return removeBook({ bookId: id });
          }
          toast.error(data.data.message);
        },
      }
    );
  };

  const shareTurn = () => {
    if (navigator.share)
      navigator.share({
        text: `رسید نوبت ${doctorInfo.firstName} ${doctorInfo.lastName}`,
        url: `${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/booking/${doctorInfo.slug}?id=${id}&center_id=${centerId}`,
      });
  };

  return (
    <>
      <DoctorInfo
        className="w-9/12"
        avatar={doctorInfo.avatar}
        firstName={doctorInfo.firstName}
        lastName={doctorInfo.lastName}
        expertise={doctorInfo.expertise}
      />

      {status !== BookStatus.notVisited && <TagStatus status={status} />}

      {shouldShowTurnMenu && (
        <DropDown
          element={
            <div
              className="flex items-center justify-center w-8 h-8 absolute left-2 top-3 cursor-pointer"
              data-testid="turn-drop-down-button"
            >
              <ThreeDotsIcon color="#000" />
            </div>
          }
          items={[
            {
              id: 0,
              name: "اشتراک گذاری",
              icon: <ShareIcon />,
              action: shareTurn,
            },
            {
              id: 1,
              name: "حذف نوبت",
              icon: <TrashIcon />,
              action: () => setRemoveModal(true),
              testId: "drop-down__remove-button",
            },
          ]}
        />
      )}

      <Modal title="آیا از حدف نوبت مطمئن هستید؟" onClose={setRemoveModal} isOpen={removeModal}>
        <div className="flex space-s-2">
          <Button
            theme="error"
            block
            onClick={removeBookAction}
            loading={removeBookApi.isLoading}
            data-testid="modal__remove-turn-button"
          >
            حذف
          </Button>
          <Button
            theme="error"
            variant="secondary"
            block
            onClick={() => setRemoveModal(false)}
            data-testid="modal__cancel-remove-turn-button"
          >
            انصراف
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TurnHeader;
