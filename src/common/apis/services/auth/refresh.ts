import { paziresh24AppClient } from "@/common/apis/client";

export const refresh = async () => {
  return await paziresh24AppClient.post(`V1/auth/refresh`);
};
