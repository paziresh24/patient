interface GetDisplayDoctorExpertise {
  aliasTitle: string;
  degree: string;
  expertise: string;
}

export const getDisplayDoctorExpertise = ({
  aliasTitle,
  degree,
  expertise,
}: GetDisplayDoctorExpertise) => {
  if (aliasTitle) {
    return aliasTitle;
  }

  if (degree && expertise) {
    return `${degree} ${expertise}`;
  }

  return;
};

export default getDisplayDoctorExpertise;
