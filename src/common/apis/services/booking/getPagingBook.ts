import { useMutation } from "react-query";
import { formData } from "@/common/utils/formData";
import { clinicClient } from "@/common/apis/client";

interface Params {
  book_id: string;
}

export const getPagingBook = (params: Params) => {
  return clinicClient.post(
    "/api/addBookToQueue",
    formData({
      ...params,
    })
  );
};

export const useGetPagingBook = () => {
  return useMutation(getPagingBook);
};
