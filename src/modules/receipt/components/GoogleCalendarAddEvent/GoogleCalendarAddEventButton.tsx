import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { GoogleCalendarAddEvent, GoogleCalendarAddEventProps } from './GoogleCalendarAddEvent';
import { GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY } from './constants';

export const GoogleCalendarAddEventButton = (props: GoogleCalendarAddEventProps) => {
  const isEnabled = useFeatureIsOn(GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY);

  if (!isEnabled || !props.bookId?.trim() || !props.centerId?.trim()) {
    return null;
  }

  return <GoogleCalendarAddEvent {...props} />;
};
