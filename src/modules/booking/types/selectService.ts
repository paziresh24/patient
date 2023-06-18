export type Service = {
  name: string;
  id: string;
  isDisable: boolean;
  isAvailable?: boolean;
  availableTime?: string;
  userCenterId?: string;
};
