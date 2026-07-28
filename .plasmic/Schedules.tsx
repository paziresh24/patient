import * as React from 'react';
import { DefaultSchedulesProps } from './plasmic/paziresh_24_booking/PlasmicSchedules';
import { HTMLElementRefOf, classNames } from '@plasmicapp/react-web';
import { BookingSchedulesView } from '@/modules/profile/components/bookingSchedules/BookingSchedulesView';
import localSty from '@/modules/profile/components/bookingSchedules/bookingSchedules.module.css';

export interface SchedulesProps extends DefaultSchedulesProps {}

function Schedules_(props: SchedulesProps, ref: HTMLElementRefOf<'div'>) {
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

const Schedules = React.forwardRef(Schedules_);
export default Schedules;
