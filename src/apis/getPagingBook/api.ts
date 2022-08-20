import { formData } from "@/utils/formData";
import { clinicClient } from "../client";

export const getPagingBook = (params: { book_id: string }) => {
  return clinicClient.post(
    "/addBookToQueue",
    formData({
      ...params,
    })
  );
};
