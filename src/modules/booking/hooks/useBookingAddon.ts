import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getBeforeBookActionWidget, BookingWidget } from '@/common/apis/services/booking/getBookingWidgets';
import {
  callBookingAddonEndpoint,
  BookingAddonRequest,
  BookingAddonResponse,
} from '@/common/apis/services/booking/callBookingAddonEndpoint';
import useModal from '@/common/hooks/useModal';

interface UseBookingAddonParams {
  slug: string;
  center: any;
  profile: any;
  user: any;
  service?: any;
  onBook: (user: any) => Promise<any>;
  onAddonError?: () => void;
}

export const useBookingAddon = ({ slug, center, profile, user, service, onBook, onAddonError }: UseBookingAddonParams) => {
  const {
    handleOpen: handleOpenBookingAddonModal,
    handleClose: handleCloseBookingAddonModal,
    modalProps: bookingAddonModalProps,
  } = useModal();
  const [bookingAddonFormFields, setBookingAddonFormFields] = useState<any[]>([]);
  const [bookingAddonMetaData, setBookingAddonMetaData] = useState<Record<string, any>>({});
  const [bookingAddonLoading, setBookingAddonLoading] = useState(false);
  const [bookingAddonCheckLoading, setBookingAddonCheckLoading] = useState(false);
  const [bookingAddonEndpoint, setBookingAddonEndpoint] = useState<string>('');
  const [bookingAddonTitle, setBookingAddonTitle] = useState<string>('');
  const [bookingAddonFormKey, setBookingAddonFormKey] = useState<number>(0);
  const [bookingWidget, setBookingWidget] = useState<BookingWidget | null>(null);

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const widget = await getBeforeBookActionWidget(slug);
        setBookingWidget(widget);
      } catch (error) {
        console.error('Error fetching booking widget:', error);
        setBookingWidget(null);
      }
    };
    fetchWidget();
  }, [slug]);

  const buildBookingAddonRequest = (userData: any, formData?: Record<string, any>, metaData?: Record<string, any>): BookingAddonRequest => {
    const doctorInsurances =
      center?.insurances?.map((insurance: any) => ({
        name: insurance.name,
        id: insurance.id,
      })) || [];

    return {
      patient_data: {
        name: userData.name || '',
        family: userData.family || '',
        national_code: userData.national_code || '',
        cell: userData.cell || '',
      },
      doctor_data: {
        id: profile?.id || '',
        name: profile?.name || '',
        family: profile?.family || '',
        slug: slug || '',
        doctor_insurances: doctorInsurances,
      },
      ...(center && {
        center_data: {
          id: center.id || '',
          name: center.name || '',
          type: center.center_type || center.type || 0,
          type_name: center.center_type_name || '',
          address: center.address || '',
          server_id: center.server_id || '',
          user_center_id: center.user_center_id || '',
        },
      }),
      ...(service && {
        service_data: {
          id: service.id || '',
          name: service.alias_title || service.name || '',
        },
      }),
      ...(formData && { form_data: formData }),
      ...(metaData && { meta_data: metaData }),
    };
  };

  const handleBookingAddonResponse = async (
    response: BookingAddonResponse,
    userData: any,
    widgetEndpoint: string,
    formData?: Record<string, any>,
    previousMetaData?: Record<string, any>,
  ): Promise<boolean> => {
    try {
      if (response.action === 'BOOK') {
        const updatedUser = {
          ...userData,
          ...(response.meta_data && response.meta_data),
        };
        await onBook(updatedUser);
        return true;
      } else if (response.action === 'SHOW_FORM') {
        const formFields = response.form_fields || response.form_feilds || [];
        setBookingAddonFormFields(formFields);
        setBookingAddonMetaData(response.meta_data || {});
        setBookingAddonTitle(response.title || '');
        setBookingAddonFormKey(prev => prev + 1);
        const submitField = formFields.find((field: any) => field.type === 'submit');
        if (submitField?.endpoint_api) {
          setBookingAddonEndpoint(submitField.endpoint_api);
        }
        handleOpenBookingAddonModal();
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error in handleBookingAddonResponse:', error);
      handleCloseBookingAddonModal();
      onAddonError?.();
      return false;
    }
  };

  const executeBookingAddonWorkflow = async (
    userData: any,
    widgetEndpoint: string,
    formData?: Record<string, any>,
    metaData?: Record<string, any>,
  ): Promise<'completed' | 'show_form' | 'no_addon'> => {
    try {
      setBookingAddonLoading(true);
      const requestData = buildBookingAddonRequest(userData, formData, metaData);
      const response = await callBookingAddonEndpoint(widgetEndpoint, requestData);
      const completed = await handleBookingAddonResponse(response, userData, widgetEndpoint, formData, metaData);
      if (completed) {
        return 'completed';
      } else {
        return 'show_form';
      }
    } catch (error) {
      console.error('Error in booking addon workflow:', error);
      return 'no_addon';
    } finally {
      setBookingAddonLoading(false);
    }
  };

  const handleDynamicFormSubmit = async (formData: Record<string, any>) => {
    try {
      setBookingAddonLoading(true);
      const requestData = buildBookingAddonRequest(user, formData, bookingAddonMetaData);
      const response = await callBookingAddonEndpoint(bookingAddonEndpoint, requestData);

      if (response.action === 'SHOW_FORM') {
        if (response.meta_data) {
          setBookingAddonMetaData(response.meta_data);
        }
        setBookingAddonTitle(response.title || '');
        const formFields = response.form_fields || response.form_feilds || [];
        setBookingAddonFormFields(formFields);
        setBookingAddonFormKey(prev => prev + 1);
        const submitField = formFields.find((field: any) => field.type === 'submit');
        if (submitField?.endpoint_api) {
          setBookingAddonEndpoint(submitField.endpoint_api);
        }
        return;
      }

      const completed = await handleBookingAddonResponse(response, user, bookingAddonEndpoint, undefined, bookingAddonMetaData);

      if (completed) {
        handleCloseBookingAddonModal();
      }
    } catch (error) {
      console.error('Error submitting dynamic form:', error);
      handleCloseBookingAddonModal();
      onAddonError?.();
    } finally {
      setBookingAddonLoading(false);
    }
  };

  const checkAndExecuteAddon = async (userData: any): Promise<'completed' | 'show_form' | 'no_addon' | 'error'> => {
    try {
      setBookingAddonCheckLoading(true);
      if (bookingWidget && bookingWidget.data_endpoint) {
        const result = await executeBookingAddonWorkflow(userData, bookingWidget.data_endpoint);
        return result;
      }
      return 'no_addon';
    } catch (error) {
      console.error('Error checking booking addon:', error);
      return 'no_addon';
    } finally {
      setBookingAddonCheckLoading(false);
    }
  };

  return {
    checkAndExecuteAddon,
    handleDynamicFormSubmit,
    bookingAddonFormFields,
    bookingAddonLoading,
    bookingAddonCheckLoading,
    bookingAddonModalProps,
    bookingAddonTitle,
    bookingAddonFormKey,
    handleCloseBookingAddonModal,
  };
};
