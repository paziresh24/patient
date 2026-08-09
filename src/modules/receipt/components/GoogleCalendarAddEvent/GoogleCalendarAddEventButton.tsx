import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { GoogleCalendarAddEvent, GoogleCalendarAddEventProps } from './GoogleCalendarAddEvent';
import { GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY } from './constants';

export const GoogleCalendarAddEventButton = (props: GoogleCalendarAddEventProps) => {

  const isEnabled = useFeatureIsOn(GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY);


  const hasBookId = Boolean(String(props.bookId ?? '').trim());
  const hasCenterId = Boolean(String(props.centerId ?? '').trim());

 
  if (!isEnabled || !hasBookId || !hasCenterId) {
    return null;
  }

  return <GoogleCalendarAddEvent {...props} />;
};
