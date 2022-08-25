import { clinicClient } from "../client";
import { formData } from "@/common/utils/formData";

export const removeBook = (params: {
  center_id: string;
  reference_code: string;
  national_code: string;
}) => {
  return clinicClient.post(
    "/api/deleteBook",
    formData({
      ...params,
    })
  );
};
