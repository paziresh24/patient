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
  hasReviewed?: boolean;
}

export const Rate: React.FC<RateProps> = props => {
  const { link, bookId, centerId, doctorSlug, isFromDashboard, hasReviewed } = props;
  const ctaLabel = hasReviewed ? 'ویرایش نظر' : 'ثبت نظر';
  const hint = hasReviewed ? 'نظر شما ثبت شده است.' : 'هنوز به این پزشک امتیازی نداده اید.';

  const handleSubmitReviewClick = () => {
    splunkInstance('doctor-profile').sendEvent({
      group: 'appointments',
      type: hasReviewed ? 'click-edit-review' : 'click-submit-review',
      event: {
        book_id: bookId,
        center_id: centerId,
        doctor_slug: doctorSlug,
        from_dashboard: isFromDashboard ?? false,
        has_reviewed: hasReviewed ?? false,
      },
    });
  };

  return (
    <div className="flex items-center justify-between w-full gap-3 bg-gray p-3 px-4 rounded-md">
      <Text fontSize="sm">{hint}</Text>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-11 min-w-[44px] items-center text-secondary"
        onClick={handleSubmitReviewClick}
        data-testid="appointment-review-cta"
      >
        <Text fontWeight="bold" fontSize="sm" className="ml-2">
          {ctaLabel}
        </Text>
        <ChevronIcon dir="left" width="10" height="12" />
      </a>
    </div>
  );
};

export default Rate;
