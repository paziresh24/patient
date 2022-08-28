import { useMutation } from "react-query";
import { clinicClient } from "@/common/apis/client";
import { formData } from "@/common/utils/formData";

interface Params {
  center_id: string;
  reference_code: string;
  national_code: string;
}

export const removeBook = (params: Params) => {
  return clinicClient.post(
    "/api/deleteBook",
    formData({
      ...params,
    })
  );
};

export const useRemoveBook = () => {
  return useMutation(removeBook);
};
