import axios from 'axios';
import { drProfileClient } from '../../client';

export interface DoctorCentersResponse {
  id: string;
  name: string;
  display_number: string[];
  tell: string[];
  address: string;
  type_id: number;
  status: number;
  server_id: number;
  has_bookable_services: boolean;
  city: {
    id: number;
    name: string;
    slug: string;
    province: {
      id: number;
      name: string;
      slug: string;
    };
  };
  location: {
    lat: number;
    lon: number;
  };
}

export const getDoctorCenters = async (slug: string, university?: string): Promise<DoctorCentersResponse[]> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}/centers`;
  const params: Record<string, string> = {
    check_bookable_services: 'true'
  };
  if (university) {
    params.university = university;
  }
  try {
    const { data } = await drProfileClient.get<DoctorCentersResponse[]>(url, {
      timeout: 5000,
      params,
    });

    // Filter centers that have bookable services
    const filteredData = data.filter(center => center.has_bookable_services === true);


    return filteredData;
  } catch (error) {
    console.error('Error fetching doctor centers:', error);


    // Return fallback data in case of error
    return [];
  }
};
