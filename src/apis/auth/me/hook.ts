import { useQuery } from "react-query";
import { getUser } from "./api";

export const useGetUser = () => {
  return useQuery("getUser", getUser);
};
