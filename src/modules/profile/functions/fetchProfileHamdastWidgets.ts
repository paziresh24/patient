import { apiGatewayClient, hamdastClient } from '@/common/apis/client';
import isEmpty from 'lodash/isEmpty';

const HAMDAST_WIDGETS = '/api/v1/widgets/';

export const PROFILE_HAMDAST_WIDGETS_QUERY_KEY = 'profileHamdastWidgets';

export async function fetchProfileHamdastWidgets(
  userId: string | number,
  doctorId: string | number | undefined,
): Promise<{ widgets: any[]; widgetsData: Record<string, any> }> {
  try {
    const cacheBust = `_=${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const { data: widgets } = await hamdastClient.get(HAMDAST_WIDGETS, {
      params: { user_id: userId, _: cacheBust },
      timeout: 3000,
    });

    if (!widgets || widgets.length === 0) return { widgets: [], widgetsData: {} };

    const dataEndpoints = widgets.filter((item: any) => item.data_endpoint);
    const responses = await Promise.allSettled(
      dataEndpoints.map((item: any) =>
        apiGatewayClient.get(item.data_endpoint, {
          params: { user_id: userId, doctor_id: doctorId, widget_id: item?.id },
          timeout: 1500,
        }),
      ),
    );

    const widgetsData = responses.reduce((acc: any, current) => {
      if (current.status === 'fulfilled') {
        const widgetId = current.value?.config?.params?.widget_id;
        if (widgetId) {
          acc[widgetId] = current.value.data;
        }
      }
      return acc;
    }, {});

    const activeWidgets = widgets.filter((item: any) => (item.data_endpoint ? !isEmpty(widgetsData[item.id]) : true));
    return { widgets: activeWidgets, widgetsData };
  } catch (error) {
    console.error('Error fetching profile hamdast widgets:', error);
    return { widgets: [], widgetsData: {} };
  }
}
