import DropDown from '@/components/atom/dropDown';
import ReceiptIcon from '@/components/icons/receipt';
import ShareIcon from '@/components/icons/share';
import ThreeDotsIcon from '@/components/icons/threeDots';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  status: BookStatus;
}

export const TurnHeader: React.FC<TurnHeaderProps> = props => {
  const { id, doctorInfo, centerId, status } = props;
  const router = useRouter();
  const { shareTurn } = useBookAction();

  const receiptTurn = () => {
    router.push(`/receipt/${centerId}/${id}`);
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
      name: 'اشتراک گذاری',
      icon: <ShareIcon />,
      action: shareTurnInfo,
      shouldShow: true,
    },
  ];

  return (
    <div className="relative flex flex-col items-end">
      <Link href={`/dr/${doctorInfo.slug}`}>
        <a className="self-start w-9/12">
          <DoctorInfo
            avatar={doctorInfo.avatar}
            firstName={doctorInfo.firstName}
            lastName={doctorInfo.lastName}
            expertise={doctorInfo.expertise}
          />
        </a>
      </Link>

      {status !== BookStatus.notVisited && <TagStatus status={status} className="mx-5" />}

      <DropDown
        element={
          <div className="absolute flex items-center justify-center w-8 h-8 -mx-3 cursor-pointer top-1" data-testid="turn-drop-down-button">
            <ThreeDotsIcon color="#000" />
          </div>
        }
        items={menuItems.filter(item => item.shouldShow).map(({ shouldShow, ...item }) => ({ ...item }))}
      />
    </div>
  );
};

export default TurnHeader;
