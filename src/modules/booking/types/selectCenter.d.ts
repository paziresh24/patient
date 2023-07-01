import { Service } from './selectService';

export type Center = {
  id: string;
  name: string;
  address?: string;
  freeturn?: string;
  isDisable: boolean;
  isAvailable?: boolean;
  availableTime?: string;
  type: 'office' | 'hospital' | 'consult';
  phoneNumbers?: string[];
  services: Service[];
};
