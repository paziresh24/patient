import { splunkInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';
import { compact, some, uniq } from 'lodash';

export const pageViewEvent = ({ doctor, isWebView }: { doctor: any; isWebView: boolean }) => {
  splunkInstance().sendEvent({
    group: 'doctor profile',
    type: 'doctor profile page view',
    event: {
      data: {
        center_type_main_name: doctor?.centers.map((center: any) => center.name),
        non_bulk_centers_type: some(doctor.centers, ['center_type', 1])
          ? doctor.centers.filter((center: any) => center.center_status === 1)?.map((center: any) => center.center_type_name)
          : 'blank',
        centers_type_with_active_booking: some(doctor.centers, ['active_booking', true])
          ? doctor?.centers.filter((center: any) => center.active_booking === true).map((center: any) => center.center_type_name)
          : 'blank',
        terminal_id: getCookie('terminal_id'),
        expertises: doctor?.expertises?.map((expertise: any) => expertise?.expertise?.name),
        center_city: uniq(doctor?.centers.map((center: any) => center.city)),
        centers_types: doctor?.centers.map((center: any) => center.center_type),
        centers_name: doctor?.centers.map((center: any) => center.name),
        centers_address: doctor?.centers.map((center: any) => center.address),
        centers_phone: doctor?.centers.map((center: any) => center.tell),
        first_freeturn_availble_time: some(doctor.centers, 'freeturns_info.availalbe_time_text')
          ? compact(doctor.centers.map((center: any) => center?.freeturns_info && center?.freeturns_info?.availalbe_time_text))
          : 'blank',
        doctor_info_box_presence: doctor.biography || doctor.awards || doctor.scientific ? 1 : 0,
        book_button_presence_status: !doctor?.disable ? 1 : 0,
        isWebView: isWebView ? 1 : 0,
        viewable_center_selection_modal: doctor.centers.filter((center: any) => center.id !== '5532').length > 1 ? 1 : 0,
        viewable_service_selection_modal:
          doctor.centers.filter((center: any) => center.id !== '5532').length === 1 && doctor.centers[0].services.length > 1 ? 1 : 0,
        first_freeTurn: some(doctor.centers, 'freeturn_text')
          ? compact(doctor.centers.map((center: any) => center?.freeturn_text))
          : 'blank',
        rates_count: doctor.feedbacks?.details?.number_of_feedbacks,
        rate: doctor.feedbacks?.details?.satisfaction,
        disable_booking: doctor?.centers?.every((center: any) => !center.is_active),
        can_booking: doctor.centers?.some((center: any) => center.services.some((service: any) => service?.can_booking === 1)),
        hours_of_work: doctor.centers?.some((center: any) => center.services.some((service: any) => !!service?.hours_of_work)),
        centers_types_booking_presented: doctor.centers?.map((center: any) => center.center_type_name),
        top_expertise_and_alias: doctor.group_expertises[0].name,
        user_agent: navigator.userAgent,
        page_view: doctor.number_of_visits,
        doctor_name: doctor?.display_name,
        page_url: window.location.pathname,
        referrer: document.referrer,
        doctor_id: doctor.id,
        server_id: doctor.server_id,
        center_id: doctor.centers.map((center: any) => center.id),
        center_status_main_name: doctor.centers.map((center: any) => center.status).includes(1) ? 'غیربالک' : 'بالک',
      },
    },
  });
};
