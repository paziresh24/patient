import { ImgHTMLAttributes } from 'react';

const GOOGLE_CALENDAR_ICON_URL = 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png';

export const GoogleCalendarIcon = ({ alt = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={GOOGLE_CALENDAR_ICON_URL} alt={alt} draggable={false} {...props} />;
};

export default GoogleCalendarIcon;
