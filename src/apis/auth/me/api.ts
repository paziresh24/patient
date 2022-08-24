import { paziresh24AppClient } from "../../client";

export const getUser = async () => {
  return await paziresh24AppClient.get(`/V1/auth/me`);
};
