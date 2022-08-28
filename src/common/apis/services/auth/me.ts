import { useQuery } from "react-query";
import { paziresh24AppClient } from "@/common/apis/client";
import { ServerStateKeysEnum } from "@/common/apis/ServerStateKeysEnum";

export const getUser = async () => {
  return await paziresh24AppClient.get(`/V1/auth/me`);
};

export const useGetUser = () => {
  return useQuery(ServerStateKeysEnum.UserInfo, getUser);
};
