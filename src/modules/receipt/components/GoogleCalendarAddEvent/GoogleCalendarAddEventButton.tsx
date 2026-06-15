import dynamic from 'next/dynamic';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { ComponentProps } from 'react';
import { GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY } from './constants';

const GoogleCalendarAddEventLazy = dynamic(
  () => import('./GoogleCalendarAddEvent').then(module => module.GoogleCalendarAddEvent),
  { ssr: false },
);

type GoogleCalendarAddEventLazyProps = ComponentProps<typeof GoogleCalendarAddEventLazy>;

export const GoogleCalendarAddEventButton = (props: GoogleCalendarAddEventLazyProps) => {
  const isEnabled = useFeatureIsOn(GOOGLE_CALENDAR_ADD_EVENT_ENABLED_KEY);

  if (!isEnabled) {
    return null;
  }

  return <GoogleCalendarAddEventLazy {...props} />;
};
