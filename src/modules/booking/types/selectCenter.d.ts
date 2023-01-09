export type Center = {
  id: string;
  name: string;
  address?: string;
  freeturn?: string;
  isDisable: boolean;
  type: 'office' | 'hospital';
  phoneNumbers?: string[];
};
