export const ONLINE_VISIT_BOOK_IN_PERSON_CANCEL_REASON = 'booked_online_by_mistake';
export const WRONG_DOCTOR_CANCEL_REASON = 'wrong_doctor';

export interface CancelReasonItem {
  id: number;
  text: string;
  value: string;
}

export const ONLINE_VISIT_CANCEL_REASONS_AFTER_TIME_PASSED_PREFIX = [
  {
    id: 1,
    text: 'منصرف شدم',
    value: 'changed_mind',
  },
  {
    id: 2,
    text: 'پزشک را اشتباه انتخاب کردم',
    value: 'wrong_doctor',
  },
] as const;

export const getExpiredOnlineVisitCancelReasons = (afterVisitReasons: CancelReasonItem[]) => [
  ...ONLINE_VISIT_CANCEL_REASONS_AFTER_TIME_PASSED_PREFIX,
  ...afterVisitReasons.map((reason, index) => ({
    ...reason,
    id: ONLINE_VISIT_CANCEL_REASONS_AFTER_TIME_PASSED_PREFIX.length + index + 1,
  })),
];

export const ONLINE_VISIT_CANCEL_REASONS_BEFORE_VISIT = [
  {
    id: 1,
    text: 'پزشک را اشتباه انتخاب کردم',
    value: 'wrong_doctor',
  },
  {
    id: 2,
    text: 'منصرف شدم',
    value: 'changed_mind',
  },
  {
    id: 3,
    text: 'مشکل در ثبت نوبت',
    value: 'booking_problem',
  },
  {
    id: 4,
    text: 'سایر',
    value: 'others',
  },
] as const;
