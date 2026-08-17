export type AppointmentPatientIdentity = {
  bookId: string;
  patientNationalCode?: string;
};

const normalize = (value: unknown) => String(value ?? '').trim();

export const splitAppointmentsByOwner = <T extends AppointmentPatientIdentity>(
  appointments: T[],
  ownerNationalCode: unknown,
) => {
  const ownerCode = normalize(ownerNationalCode);
  const owned: T[] = [];
  const excludedBookIds = new Set<string>();

  for (const appointment of appointments) {
    const patientCode = normalize(appointment.patientNationalCode);
    if (ownerCode && patientCode && patientCode !== ownerCode) {
      excludedBookIds.add(appointment.bookId);
      continue;
    }
    owned.push(appointment);
  }

  return { owned, excludedBookIds };
};
