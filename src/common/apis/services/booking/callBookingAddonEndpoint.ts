import { apiGatewayClient } from '@/common/apis/client';
import axios from 'axios';

export interface BookingAddonRequest {
  patient_data: {
    name: string;
    family: string;
    national_code: string;
    cell: string;
  };
  doctor_data: {
    id: string;
    name: string;
    family: string;
    slug: string;
    doctor_insurances: Array<{
      name: string;
      id: string;
    }>;
  };
  form_data?: Record<string, any>;
  meta_data?: Record<string, any>;
}

export interface BookingAddonResponse {
  action: 'BOOK' | 'SHOW_FORM';
  title?: string;
  meta_data?: {
    insurance_id?: string;
    session_id?: string;
    request_id?: string;
    [key: string]: any;
  };
  form_fields?: Array<{
    type: 'image' | 'text_input' | 'submit';
    src?: string;
    label?: string;
    key?: string;
    endpoint_api?: string;
    placeholder?: string;
    required?: boolean;
    image_size?: string;
    image_align?: 'left' | 'center' | 'right';
  }>;
  form_feilds?: Array<{
    type: 'image' | 'text_input' | 'submit';
    src?: string;
    label?: string;
    key?: string;
    endpoint_api?: string;
    placeholder?: string;
    required?: boolean;
    image_size?: string;
    image_align?: 'left' | 'center' | 'right';
  }>;
}

export const callBookingAddonEndpoint = async (endpoint: string, requestData: BookingAddonRequest): Promise<BookingAddonResponse> => {
  try {
    let response;
    if (endpoint.startsWith('https://')) {
      if (endpoint.includes('apigw.paziresh24.com')) {
        const url = endpoint.replace('https://apigw.paziresh24.com', '');
        response = await apiGatewayClient.post(url, requestData, {
          timeout: 10000,
        });
      } else {
        response = await axios.post(endpoint, requestData, {
          timeout: 10000,
          withCredentials: false,
        });
      }
    } else {
      response = await apiGatewayClient.post(endpoint, requestData, {
        timeout: 10000,
      });
    }

    if (response.status !== 200) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }

    let data = response.data;
    if (data?.data && typeof data.data === 'object') {
      data = data.data;
    }

    if (!data || (data.action !== 'BOOK' && data.action !== 'SHOW_FORM')) {
      throw new Error('Invalid response structure');
    }

    return data;
  } catch (error) {
    console.error('Error calling booking addon endpoint:', error);
    throw error;
  }
};
