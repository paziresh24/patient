import moment from 'jalali-moment';

export const humanizeTime = (timeString: string | number) => {
  const duration = moment.duration(timeString);
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (hours === 0) {
    return duration.minutes() + ' دقیقه';
  } else {
    const hourString = hours + ' ساعت';
    const minuteString = minutes > 0 ? ' ' + minutes + ' دقیقه' : '';
    return hourString + (minuteString ? ` و ${minuteString}` : '');
  }
};

export default humanizeTime;
