import dynamic from 'next/dynamic';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { GoogleCalendarAddEventProps } from './GoogleCalendarAddEvent';
import { GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY } from './constants';

const GoogleCalendarAddEventLazy = dynamic<GoogleCalendarAddEventProps>(
  () => import('./GoogleCalendarAddEvent').then(module => module.GoogleCalendarAddEvent),
  { ssr: false },
);

export const GoogleCalendarAddEventButton = (props: GoogleCalendarAddEventProps) => {
  const isEnabled = useFeatureIsOn(GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY);

  if (!isEnabled) {
    return null;
  }

  return <GoogleCalendarAddEventLazy {...props} />;
};
