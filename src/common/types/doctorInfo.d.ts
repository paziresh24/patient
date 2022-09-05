interface DoctorInfo {
  id?: string;
  name: string;
  family: string;
  image?: string;
  expertises: Expertises;
}

type Expertises = Array<{
  alias_title?: string;
  degree?: {
    id?: string;
    name?: string;
  };
  expertise?: {
    id?: string;
    name?: string;
  };
}>;
