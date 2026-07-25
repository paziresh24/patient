import * as React from 'react';
import { DefaultBookingSchedulesProps } from './plasmic/paziresh_24_booking/PlasmicBookingSchedules';
import { HTMLElementRefOf, classNames } from '@plasmicapp/react-web';
import { BookingSchedulesView } from '@/modules/profile/components/bookingSchedules/BookingSchedulesView';
import localSty from '@/modules/profile/components/bookingSchedules/bookingSchedules.module.css';

export interface BookingSchedulesProps extends DefaultBookingSchedulesProps {}

function BookingSchedules_(props: BookingSchedulesProps, ref: HTMLElementRefOf<'div'>) {
  return (
    <div
      ref={ref}
      className={classNames(props.className, localSty.root)}
      style={{ width: '100%', alignSelf: 'stretch', display: 'block' }}
    >
      <BookingSchedulesView
        centerId={props.centerId}
        centerName={props.centerName}
        slug={props.slug}
      />
    </div>
  );
}

const BookingSchedules = React.forwardRef(BookingSchedules_);
export default BookingSchedules;
