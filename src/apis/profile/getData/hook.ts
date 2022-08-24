import { useQuery } from "react-query";
import { GetProfileData, getProfileData } from "./api";

export const useGetProfileData = (params: GetProfileData) => {
  return useQuery(["getProfileData", params], () => getProfileData(params));
};
