export type selectCenter = {
  id: string;
  name: string;
  address?: string;
  freeturn?: string;
  disable: boolean;
  type: 'office' | 'hospital';
  centerNumber?: string[];
};
