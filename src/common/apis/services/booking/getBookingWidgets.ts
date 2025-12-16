import { hamdastClient } from '@/common/apis/client';

export interface BookingWidget {
  id: string;
  app: string;
  placement: string[];
  data_endpoint?: string;
  [key: string]: any;
}

export interface GetBookingWidgetsParams {
  slug: string;
}

export const getBookingWidgets = async ({ slug }: GetBookingWidgetsParams): Promise<BookingWidget[]> => {
  const { data } = await hamdastClient.get('/api/v1/widgets/', {
    params: { slug },
    timeout: 5000,
  });
  return data || [];
};

export const getBeforeBookActionWidget = async (slug: string): Promise<BookingWidget | null> => {
  try {
    const widgets = await getBookingWidgets({ slug });
    const widget = widgets.find(
      (w: BookingWidget) => w.placement?.includes('booking_flow::BEFOR_BOOK_ACTION') && w.data_endpoint,
    );
    return widget || null;
  } catch (error) {
    console.error('Error fetching booking widgets:', error);
    return null;
  }
};

