import { splunkInstance } from '@/common/services/splunk';
import Text from '@/components/atom/text';
import { ChevronIcon } from '@/components/icons/chevron';

interface RateProps {
  /**
   * Rate link page
   */
  link: string;
  bookId: string;
  centerId: string;
  doctorSlug: string;
  isFromDashboard?: boolean;
}

export const Rate: React.FC<RateProps> = props => {
  const { link, bookId, centerId, doctorSlug, isFromDashboard } = props;

  const handleSubmitReviewClick = () => {
    splunkInstance('doctor-profile').sendEvent({
      group: 'appointments',
      type: 'click-submit-review',
      event: {
        book_id: bookId,
        center_id: centerId,
        doctor_slug: doctorSlug,
        from_dashboard: isFromDashboard ?? false,
      },
    });
  };

  return (
    <div className="flex items-center justify-between w-full bg-gray p-3 px-4 rounded-md">
      <Text fontSize="sm">هنوز به این پزشک امتیازی نداده اید.</Text>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex items-center text-secondary"
        onClick={handleSubmitReviewClick}
      >
        <Text fontWeight="bold" fontSize="sm" className="ml-2">
          ثبت نظر
        </Text>
        <ChevronIcon dir="left" width="10" height="12" />
      </a>
    </div>
  );
};

export default Rate;
