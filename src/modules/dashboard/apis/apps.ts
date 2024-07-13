import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const apps = () => {
  return axios.get('https://hamdast.paziresh24.com/api/v1/installations/', { withCredentials: true });
};

export const useApps = (option?: Record<string, any>) => useQuery(['app'], apps, { ...option });
