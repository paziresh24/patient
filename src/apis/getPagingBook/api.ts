import { formData } from "@/common/utils/formData";
import { clinicClient } from "../client";

export const getPagingBook = (params: { book_id: string }) => {
  return clinicClient.post(
    "/api/addBookToQueue",
    formData({
      ...params,
    })
  );
};
