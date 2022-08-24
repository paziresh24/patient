import { paziresh24AppClient } from "../../client";

export interface GetProfileData {
  slug: string;
}

export const getProfileData = ({ slug }: GetProfileData) => {
  return paziresh24AppClient.get(`/doctor/v1/full-profile/${slug}/`);
};
