type DoctorInfo = { doctor: any; center: any; service?: any };

export const reformattedDoctorInfoForEvent = ({ doctor, center, service }: DoctorInfo) => {
  const { id, display_name, group_expertises } = doctor;
  const { server_id, server_name, center_type, tell, city, address } = center;
  const { alias_title, id: service_id } = service ?? {};

  return {
    doctor_id: id,
    doctor_name: display_name,
    group_expertises: group_expertises?.map((gexp: any) => gexp.name),
    server_id,
    ...(server_name && { server_name }),
    center_type_name: center_type === 1 ? 'مطب' : 'مرکز درمانی',
    center_tell: tell,
    center_address: `${city ? `${city} - ` : ''}${address}`,
    city,
    service_alias_title: alias_title,
    service_id,
  };
};
