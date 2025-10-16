import moment from 'jalali-moment';

/**
 * Formats a time string to Persian calendar format
 * @param timeString - The time string to format
 * @returns Formatted time string or null if input is invalid
 */
export const formatTime = (timeString: string | null): string | null => {
  if (!timeString) return null;

  return moment(timeString).locale('fa').calendar(undefined, {
    sameDay: '[امروز] ساعت HH:mm',
    nextDay: '[فردا] ساعت HH:mm',
    sameElse: 'jD jMMMM ساعت HH:mm',
  });
};
