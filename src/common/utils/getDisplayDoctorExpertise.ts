interface GetDisplayDoctorExpertise {
  aliasTitle: string;
  degree: string;
  expertise: string;
}

export const getDisplayDoctorExpertise = ({ aliasTitle, degree, expertise }: GetDisplayDoctorExpertise) => {
  if (aliasTitle) {
    return aliasTitle;
  }

  return `${degree} ${expertise}`;
};

export default getDisplayDoctorExpertise;
