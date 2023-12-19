import { setTerminal } from '@/common/apis/services/auth/setTerminal';
import { sendGaEvent } from '@/common/services/sendGaEvent';
import { splunkInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';
import compact from 'lodash/compact';
import some from 'lodash/some';
import uniq from 'lodash/uniq';

export const pageViewEvent = async ({
  information,
  centers,
  expertises,
  feedbacks,
  history,
  isWebView,
  isBulk,
}: {
  centers: any;
  information: any;
  feedbacks: any;
  expertises: any;
  history: any;
  isWebView: boolean;
  isBulk: boolean;
}) => {
  await setTerminal();
  if (centers.every((center: any) => !center.is_active)) {
    sendGaEvent({ action: 'activation-Doc', category: 'profile-notactive', label: 'activation' });
  }
  sendGaEvent({ action: 'P24DrsPage', category: 'DrsPageLoaded', label: 'DrsPageLoaded' });
  sendGaEvent({ action: 'P24DrsPage', category: 'expertise', label: expertises?.group_expertises[0]?.name });
  sendGaEvent({ action: 'P24DrsPage', category: 'city', label: centers?.[0]?.city });
  sendGaEvent({
    action: 'P24doctorspage',
    category: centers?.[0]?.city,
    label: expertises.expertises[0]?.expertise_groups?.[0]?.name,
  });
  sendGaEvent({ action: 'P24DrsPage', category: centers?.[0]?.city, label: expertises?.group_expertises?.[0]?.name });
  if (isBulk) {
    sendGaEvent({ action: 'bulkprofile', category: 'load', label: 'load' });
  }
  splunkInstance().sendEvent({
    group: 'doctor profile',
    type: 'doctor profile page view',
    event: {
      data: {
        center_type_main_name: centers.map((center: any) => center.name),
        non_bulk_centers_type: some(centers, ['center_type', 1])
          ? centers.filter((center: any) => center.status === 1)?.map((center: any) => center.center_type_name)
          : 'blank',
        centers_type_with_active_booking: some(centers, ['is_active', true])
          ? centers.filter((center: any) => center.is_active).map((center: any) => center.center_type_name)
          : 'blank',
        terminal_id: getCookie('terminal_id'),
        expertises: expertises?.expertises?.map((expertise: any) => expertise?.alias_title),
        center_city: uniq(centers.map((center: any) => center.city)),
        centers_types: centers.map((center: any) => center.center_type),
        centers_name: centers.map((center: any) => center.name),
        centers_address: centers.map((center: any) => center.address),
        centers_phone: centers.map((center: any) => center.tell),
        first_freeturn_availble_time: some(centers, 'freeturns_info.availalbe_time_text')
          ? compact(centers.map((center: any) => center?.freeturns_info && center?.freeturns_info?.availalbe_time_text))
          : 'blank',
        doctor_info_box_presence: information.biography ? 1 : 0,
        isWebView: isWebView ? 1 : 0,
        viewable_center_selection_modal: centers.filter((center: any) => center.id !== '5532').length > 1 ? 1 : 0,
        viewable_service_selection_modal:
          centers.filter((center: any) => center.id !== '5532').length === 1 && centers[0].services.length > 1 ? 1 : 0,
        first_freeTurn: some(centers, 'freeturn_text') ? compact(centers.map((center: any) => center?.freeturn_text)) : 'blank',
        rates_count: feedbacks?.details?.count_of_feedbacks,
        rate: feedbacks?.details?.satisfaction_percent,
        disable_booking: centers?.every((center: any) => !center.is_active),
        can_booking: centers?.some((center: any) => center.services.some((service: any) => service?.can_booking === 1)),
        hours_of_work: centers?.some((center: any) => center.services.some((service: any) => !!service?.hours_of_work)),
        centers_types_booking_presented: centers?.map((center: any) => center.center_type_name),
        top_expertise_and_alias: expertises.group_expertises[0].name,
        user_agent: navigator.userAgent,
        page_view: history.number_of_visits,
        doctor_name: information?.display_name,
        page_url: window.location.pathname,
        referrer: document.referrer,
        doctor_id: information.id,
        server_id: information.server_id,
        center_id: centers.map((center: any) => center.id),
        center_status_main_name: centers.map((center: any) => center.status).includes(1) ? 'غیربالک' : 'بالک',
      },
    },
  });
};
